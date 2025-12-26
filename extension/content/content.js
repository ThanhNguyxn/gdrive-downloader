/**
 * GDrive Downloader - Content Script (Improved)
 * Handles document processing and PDF generation
 *
 * Improvements:
 * - Canvas-based rendering support (Google's new method)
 * - Better video URL detection with audio+video
 * - Improved auto-scroll for all document types
 * - Progress tracking
 */

(function () {
    'use strict';

    // Check if already injected
    if (window.__gdriveDownloaderInjected) return;
    window.__gdriveDownloaderInjected = true;

    // Video/Audio URL storage
    let detectedVideoUrl = null;
    let detectedAudioUrl = null;
    const interceptedUrls = new Map();

    /**
     * Load jsPDF library
     */
    async function loadJsPDF() {
        if (typeof window.jsPDF !== 'undefined') {
            return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
            const script = document.createElement('script');

            // Handle Trusted Types if required
            let scriptUrl = chrome.runtime.getURL('lib/jspdf.umd.min.js');

            if (window.trustedTypes && window.trustedTypes.createPolicy) {
                try {
                    const policy = window.trustedTypes.createPolicy('gdrive-downloader-policy', {
                        createScriptURL: (url) => url
                    });
                    scriptUrl = policy.createScriptURL(scriptUrl);
                } catch (e) {
                    // Policy might already exist
                }
            }

            script.src = scriptUrl;
            script.onload = () => {
                window.jsPDF = window.jspdf.jsPDF;
                resolve();
            };
            script.onerror = () => {
                // Fallback to CDN
                const cdnScript = document.createElement('script');
                cdnScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
                cdnScript.onload = () => {
                    window.jsPDF = window.jspdf.jsPDF;
                    resolve();
                };
                cdnScript.onerror = reject;
                document.head.appendChild(cdnScript);
            };
            document.head.appendChild(script);
        });
    }

    /**
     * Load JSZip library
     */
    async function loadJSZip() {
        if (typeof window.JSZip !== 'undefined') {
            return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
            const script = document.createElement('script');

            // Handle Trusted Types if required
            let scriptUrl = chrome.runtime.getURL('lib/jszip.min.js');

            if (window.trustedTypes && window.trustedTypes.createPolicy) {
                try {
                    const policy = window.trustedTypes.createPolicy('gdrive-jszip-policy', {
                        createScriptURL: (url) => url
                    });
                    scriptUrl = policy.createScriptURL(scriptUrl);
                } catch (e) {
                    // Policy might already exist
                }
            }

            script.src = scriptUrl;
            script.onload = () => resolve();
            script.onerror = () => {
                // Fallback to CDN
                const cdnScript = document.createElement('script');
                cdnScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
                cdnScript.onload = () => resolve();
                cdnScript.onerror = reject;
                document.head.appendChild(cdnScript);
            };
            document.head.appendChild(script);
        });
    }

    /**
     * Send progress update to popup
     */
    function sendProgress(percent, message) {
        chrome.runtime.sendMessage({
            type: 'progress',
            percent,
            message
        }).catch(() => { });
    }

    /**
     * Get all valid page elements (both img and canvas)
     * Google is transitioning from img to canvas-based rendering
     */
    function getPageElements() {
        const elements = [];

        // Method 1: Blob images (traditional)
        const images = Array.from(document.getElementsByTagName('img'))
            .filter(img => /^blob:/.test(img.src) && img.width > 100 && img.height > 100);
        elements.push(...images.map(img => ({ type: 'img', element: img })));

        // Method 2: Canvas elements (Google's new method)
        // Look for canvas in document viewer containers
        // Enhanced canvas selectors for better detection
        const canvasSelectors = [
            // Google Docs
            '.kix-canvas-tile-content canvas',
            '.kix-page-paginated canvas',
            '.kix-page canvas',
            // Google Slides
            '.punch-viewer-content canvas',
            '.slide-content canvas',
            '.punch-present-iframe canvas',
            // PDF viewer
            '.ndfHFb-c4YZDc-Wrber canvas',
            '.drive-viewer-paginated-page canvas',
            '.drive-viewer-page-content canvas',
            // Generic / new layouts
            'canvas[data-page]',
            'canvas[data-page-number]',
            '[data-page-number] canvas',
            '.pdf-viewer canvas',
            // Document preview
            '.drive-viewer-content canvas',
            '.preview-pane canvas',
        ];

        canvasSelectors.forEach(selector => {
            const canvases = document.querySelectorAll(selector);
            canvases.forEach(canvas => {
                if (canvas.width > 100 && canvas.height > 100) {
                    elements.push({ type: 'canvas', element: canvas });
                }
            });
        });

        // Method 3: SVG rendered pages
        const svgPages = document.querySelectorAll('svg.kix-page');
        svgPages.forEach(svg => {
            if (svg.clientWidth > 100) {
                elements.push({ type: 'svg', element: svg });
            }
        });

        // Deduplicate by position
        const uniqueElements = [];
        const seenPositions = new Set();

        elements.forEach(item => {
            const rect = item.element.getBoundingClientRect();
            const posKey = `${Math.round(rect.top)}-${Math.round(rect.left)}`;
            if (!seenPositions.has(posKey)) {
                seenPositions.add(posKey);
                uniqueElements.push(item);
            }
        });

        // Sort by vertical position (top to bottom)
        uniqueElements.sort((a, b) => {
            const rectA = a.element.getBoundingClientRect();
            const rectB = b.element.getBoundingClientRect();
            return rectA.top - rectB.top;
        });

        return uniqueElements;
    }

    /**
     * Convert element to canvas for PDF
     */
    function elementToCanvas(item, scaleFactor = 1) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (item.type === 'img') {
            const img = item.element;
            canvas.width = img.naturalWidth * scaleFactor || img.width * scaleFactor;
            canvas.height = img.naturalHeight * scaleFactor || img.height * scaleFactor;
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        }
        else if (item.type === 'canvas') {
            const srcCanvas = item.element;
            canvas.width = srcCanvas.width * scaleFactor;
            canvas.height = srcCanvas.height * scaleFactor;
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(srcCanvas, 0, 0, canvas.width, canvas.height);
        }
        else if (item.type === 'svg') {
            const svg = item.element;
            const svgData = new XMLSerializer().serializeToString(svg);
            const img = new Image();
            canvas.width = svg.clientWidth * scaleFactor;
            canvas.height = svg.clientHeight * scaleFactor;

            return new Promise((resolve) => {
                img.onload = () => {
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    resolve(canvas);
                };
                img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
            });
        }

        return Promise.resolve(canvas);
    }

    /**
     * Detect scroll container for different Google apps
     */
    function getScrollContainer() {
        const selectors = [
            '.kix-appview-editor',           // Google Docs
            '.punch-viewer-container',        // Google Slides
            '.drive-viewer-paginated-scrollable', // Drive PDF
            '.ndfHFb-c4YZDc-i5oIFb',          // PDF viewer
            '[role="main"]',                   // Generic
            'html'                             // Fallback
        ];

        for (const selector of selectors) {
            const container = document.querySelector(selector);
            if (container && container.scrollHeight > container.clientHeight) {
                return container;
            }
        }

        return document.documentElement;
    }

    /**
     * Improved auto-scroll to load all pages
     */
    async function autoScrollDocument() {
        return new Promise((resolve) => {
            const container = getScrollContainer();
            const startTime = Date.now();
            const maxDuration = 60000; // Max 60 seconds

            let lastScrollTop = -1;
            let stableCount = 0;
            const stableThreshold = 5; // Need 5 stable reads

            sendProgress(10, 'Scrolling to load all pages...');

            const scrollInterval = setInterval(() => {
                // Timeout check
                if (Date.now() - startTime > maxDuration) {
                    clearInterval(scrollInterval);
                    container.scrollTop = 0;
                    setTimeout(resolve, 500);
                    return;
                }

                // Scroll down
                container.scrollTop += window.innerHeight * 0.8;

                // Check if we've reached the end
                const currentScroll = container.scrollTop;
                const maxScroll = container.scrollHeight - container.clientHeight;

                if (Math.abs(currentScroll - lastScrollTop) < 10 || currentScroll >= maxScroll - 10) {
                    stableCount++;
                    if (stableCount >= stableThreshold) {
                        clearInterval(scrollInterval);
                        // Scroll back to top
                        container.scrollTop = 0;
                        setTimeout(resolve, 500);
                        return;
                    }
                } else {
                    stableCount = 0;
                }

                lastScrollTop = currentScroll;

                // Update progress
                const progress = Math.min(95, 10 + (currentScroll / maxScroll) * 10);
                sendProgress(progress, `Scrolling... ${Math.round((currentScroll / maxScroll) * 100)}%`);

            }, 150);
        });
    }

    /**
     * Convert document to PDF
     */
    async function convertToPdf(options = {}) {
        const { highRes = false, autoScroll = true } = options;
        const scaleFactor = highRes ? 2 : 1;

        try {
            sendProgress(5, 'Loading PDF library...');
            await loadJsPDF();

            if (autoScroll) {
                await autoScrollDocument();
            }

            sendProgress(20, 'Finding document pages...');
            const pageElements = getPageElements();

            if (pageElements.length === 0) {
                throw new Error('No document pages found. Please scroll through the document first, or try refreshing the page.');
            }

            sendProgress(25, `Found ${pageElements.length} pages. Creating PDF...`);

            // Create PDF
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4',
                compress: true
            });

            const totalPages = pageElements.length;

            for (let i = 0; i < pageElements.length; i++) {
                const item = pageElements[i];
                const progress = 25 + Math.floor((i / totalPages) * 65);
                sendProgress(progress, `Processing page ${i + 1} of ${totalPages}...`);

                // Convert element to canvas
                const canvas = await elementToCanvas(item, scaleFactor);
                const imgData = canvas.toDataURL('image/jpeg', highRes ? 1.0 : 0.92);

                if (i > 0) {
                    pdf.addPage();
                }

                // Calculate dimensions
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = pdf.internal.pageSize.getHeight();
                const imgRatio = canvas.height / canvas.width;

                let imgWidth = pdfWidth;
                let imgHeight = imgWidth * imgRatio;

                if (imgHeight > pdfHeight) {
                    imgHeight = pdfHeight;
                    imgWidth = imgHeight / imgRatio;
                }

                const x = (pdfWidth - imgWidth) / 2;
                const y = 0;

                pdf.addImage(imgData, 'JPEG', x, y, imgWidth, imgHeight, null, highRes ? 'FAST' : 'MEDIUM');

                // Allow UI to update
                await new Promise(r => setTimeout(r, 10));
            }

            sendProgress(95, 'Preparing download...');

            // Get filename from page title
            let fileName = 'document.pdf';
            try {
                const title = document.title
                    .replace(' - Google Docs', '')
                    .replace(' - Google Slides', '')
                    .replace(' - Google Drive', '')
                    .replace(/[^a-z0-9\u00C0-\u024F\u1E00-\u1EFF]/gi, '_')
                    .toLowerCase()
                    .slice(0, 50);
                if (title) {
                    fileName = `${title}${highRes ? '_hires' : ''}.pdf`;
                }
            } catch (e) { }

            pdf.save(fileName);
            sendProgress(100, 'Download complete!');

            return { success: true };
        } catch (error) {
            console.error('PDF conversion error:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Extract images from document
     */
    async function extractImages() {
        try {
            sendProgress(10, 'Finding document pages...');
            const pageElements = getPageElements();

            if (pageElements.length === 0) {
                throw new Error('No document pages found. Please scroll through the document first.');
            }

            sendProgress(20, `Found ${pageElements.length} pages. Extracting...`);

            for (let i = 0; i < pageElements.length; i++) {
                const item = pageElements[i];
                const progress = 20 + Math.floor((i / pageElements.length) * 75);
                sendProgress(progress, `Extracting image ${i + 1} of ${pageElements.length}...`);

                const canvas = await elementToCanvas(item, 1);
                const imgData = canvas.toDataURL('image/png');

                const link = document.createElement('a');
                link.href = imgData;
                link.download = `page-${String(i + 1).padStart(3, '0')}.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                // Delay between downloads
                await new Promise(r => setTimeout(r, 300));
            }

            sendProgress(100, 'Extraction complete!');
            return { success: true, count: pageElements.length };
        } catch (error) {
            console.error('Image extraction error:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Download all pages as ZIP file
     */
    async function downloadAsZip(options = {}) {
        const { autoScroll = true } = options;

        try {
            sendProgress(5, 'Loading libraries...');
            await loadJSZip();

            if (autoScroll) {
                await autoScrollDocument();
            }

            sendProgress(20, 'Finding document pages...');
            const pageElements = getPageElements();

            if (pageElements.length === 0) {
                throw new Error('No document pages found. Please scroll through the document first.');
            }

            sendProgress(25, `Found ${pageElements.length} pages. Creating ZIP...`);

            const zip = new JSZip();
            const totalPages = pageElements.length;

            for (let i = 0; i < pageElements.length; i++) {
                const item = pageElements[i];
                const progress = 25 + Math.floor((i / totalPages) * 65);
                sendProgress(progress, `Processing page ${i + 1} of ${totalPages}...`);

                const canvas = await elementToCanvas(item, 1);

                // Convert canvas to blob
                const blob = await new Promise(resolve => {
                    canvas.toBlob(resolve, 'image/png');
                });

                // Add to zip
                const fileName = `page-${String(i + 1).padStart(3, '0')}.png`;
                zip.file(fileName, blob);

                // Allow UI to update
                await new Promise(r => setTimeout(r, 10));
            }

            sendProgress(95, 'Generating ZIP file...');

            // Generate and download ZIP
            const zipBlob = await zip.generateAsync({
                type: 'blob',
                compression: 'DEFLATE',
                compressionOptions: { level: 6 }
            });

            // Get filename from page title
            let fileName = 'document.zip';
            try {
                const title = document.title
                    .replace(' - Google Docs', '')
                    .replace(' - Google Slides', '')
                    .replace(' - Google Drive', '')
                    .replace(/[^a-z0-9\u00C0-\u024F\u1E00-\u1EFF]/gi, '_')
                    .toLowerCase()
                    .slice(0, 50);
                if (title) {
                    fileName = `${title}_images.zip`;
                }
            } catch (e) { }

            // Download ZIP
            const downloadUrl = URL.createObjectURL(zipBlob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(downloadUrl);

            sendProgress(100, 'ZIP download complete!');
            return { success: true, count: pageElements.length };
        } catch (error) {
            console.error('ZIP creation error:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Export Google Sheets as CSV using URL manipulation
     * Tries multiple methods: direct export, htmlview parsing
     */
    async function exportSheetsCsv() {
        try {
            sendProgress(10, 'Attempting to export CSV...');

            const url = window.location.href;

            // Extract spreadsheet ID and gid
            const idMatch = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
            const gidMatch = url.match(/gid=(\d+)/);

            if (!idMatch) {
                throw new Error('Could not extract spreadsheet ID from URL');
            }

            const spreadsheetId = idMatch[1];
            const gid = gidMatch ? gidMatch[1] : '0';

            // Method 1: Try direct CSV export URL
            sendProgress(30, 'Trying direct export...');
            const exportUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&gid=${gid}`;

            try {
                const response = await fetch(exportUrl, {
                    credentials: 'include',
                    redirect: 'follow'
                });

                if (response.ok) {
                    const blob = await response.blob();
                    if (blob.size > 0 && blob.type.includes('csv') || blob.type.includes('text')) {
                        const downloadUrl = URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = downloadUrl;
                        link.download = `sheet_${gid}.csv`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        URL.revokeObjectURL(downloadUrl);

                        sendProgress(100, 'CSV exported successfully!');
                        return { success: true, method: 'direct_export' };
                    }
                }
            } catch (e) {
                console.log('Direct export failed, trying htmlview...');
            }

            // Method 2: Try htmlview and parse table
            sendProgress(50, 'Trying HTML view method...');
            const htmlViewUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/htmlview`;

            try {
                const response = await fetch(htmlViewUrl, { credentials: 'include' });
                if (response.ok) {
                    const html = await response.text();
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, 'text/html');
                    const table = doc.querySelector('table');

                    if (table) {
                        // Convert table to CSV
                        const rows = Array.from(table.querySelectorAll('tr'));
                        const csvContent = rows.map(row => {
                            const cells = Array.from(row.querySelectorAll('td, th'));
                            return cells.map(cell => {
                                let text = cell.textContent || '';
                                // Escape quotes and wrap in quotes if contains comma
                                text = text.replace(/"/g, '""');
                                if (text.includes(',') || text.includes('\n') || text.includes('"')) {
                                    text = `"${text}"`;
                                }
                                return text;
                            }).join(',');
                        }).join('\n');

                        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                        const downloadUrl = URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = downloadUrl;
                        link.download = `sheet_${gid}.csv`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        URL.revokeObjectURL(downloadUrl);

                        sendProgress(100, 'CSV exported via HTML parsing!');
                        return { success: true, method: 'htmlview' };
                    }
                }
            } catch (e) {
                console.log('HTML view method failed:', e);
            }

            // Method 3: Copy visible data from current page
            sendProgress(70, 'Trying to extract visible data...');
            const visibleCells = document.querySelectorAll('.cell-input, .softmerge-inner');
            if (visibleCells.length > 0) {
                throw new Error('Visible data found but extraction not implemented. Try using HTML View button instead.');
            }

            throw new Error('All export methods failed. The sheet might have strict view-only restrictions.');
        } catch (error) {
            console.error('CSV export error:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Try Native Print (Selectable PDF Attempt)
     * Injects CSS to unhide print controls and triggers window.print()
     */
    async function tryNativePrint() {
        try {
            sendProgress(20, 'Injecting print styles...');

            // Create style to force show content during print
            const style = document.createElement('style');
            style.textContent = `
                @media print {
                    body * {
                        visibility: visible !important;
                        display: block !important;
                    }
                    .kix-appview-editor {
                        overflow: visible !important;
                        height: auto !important;
                    }
                    /* Hide UI elements */
                    .docs-gm-header, .docs-explore-widget, .docs-companion-app-switcher-container {
                        display: none !important;
                    }
                }
            `;
            document.head.appendChild(style);

            sendProgress(50, 'Opening print dialog...');

            // Small delay to let styles apply
            await new Promise(r => setTimeout(r, 500));

            window.print();

            sendProgress(100, 'Print dialog opened!');
            return { success: true };
        } catch (error) {
            console.error('Native print error:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Extract Text Only
     * Parses DOM to find text content
     */
    async function extractText() {
        try {
            sendProgress(10, 'Scanning document for text...');

            let textContent = '';

            // Strategy 1: Google Docs (.kix-lineview-content)
            const textNodes = document.querySelectorAll('.kix-lineview-content');
            if (textNodes.length > 0) {
                sendProgress(40, `Found ${textNodes.length} text lines...`);
                textNodes.forEach(node => {
                    textContent += node.innerText + '\n';
                });
            }
            // Strategy 2: Google Slides (SVG text)
            else {
                const svgText = document.querySelectorAll('g text');
                if (svgText.length > 0) {
                    sendProgress(40, `Found ${svgText.length} text elements...`);
                    svgText.forEach(node => {
                        textContent += node.textContent + '\n';
                    });
                }
                // Strategy 3: Generic fallback
                else {
                    textContent = document.body.innerText;
                }
            }

            if (!textContent || textContent.trim().length === 0) {
                throw new Error('No text content found to extract.');
            }

            sendProgress(80, 'Copying to clipboard...');

            // Copy to clipboard
            await navigator.clipboard.writeText(textContent);

            sendProgress(100, 'Text copied to clipboard!');
            return { success: true, length: textContent.length };
        } catch (error) {
            console.error('Text extraction error:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Export Page as SVG (Slides)
     * Tries to find and serialize SVG elements
     */
    async function exportSvg() {
        try {
            sendProgress(10, 'Scanning for SVG content...');

            // Target Google Slides SVG container
            const svgElements = document.querySelectorAll('.punch-viewer-content svg, .slide-content svg');

            if (svgElements.length === 0) {
                throw new Error('No SVG content found. This slide might be rendered as Canvas/Image.');
            }

            sendProgress(40, `Found ${svgElements.length} SVG layers...`);

            // Combine SVGs if multiple (naive approach)
            let combinedSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">';

            svgElements.forEach(svg => {
                combinedSvg += svg.innerHTML;
            });

            combinedSvg += '</svg>';

            // Create Blob
            const blob = new Blob([combinedSvg], { type: 'image/svg+xml;charset=utf-8' });
            const downloadUrl = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = `slide_export_${Date.now()}.svg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(downloadUrl);

            sendProgress(100, 'SVG exported successfully!');
            return { success: true, count: svgElements.length };
        } catch (error) {
            console.error('SVG export error:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Clean video URL for direct download
     */
    function cleanVideoUrl(url) {
        if (!url) return null;

        let cleanUrl = url;

        // Remove range parameter
        const rangeIndex = cleanUrl.indexOf('&range=');
        if (rangeIndex > -1) {
            cleanUrl = cleanUrl.substring(0, rangeIndex);
        }

        // Remove sRFVP parameter
        cleanUrl = cleanUrl.replace(/&sRFVP=\d+/g, '');
        cleanUrl = cleanUrl.replace(/&srfvp=\d+/g, '');

        return cleanUrl;
    }

    /**
     * Get video/audio URLs
     */
    function getVideoUrl() {
        return {
            videoUrl: cleanVideoUrl(detectedVideoUrl),
            audioUrl: cleanVideoUrl(detectedAudioUrl),
            hasAudio: !!detectedAudioUrl,
            raw: {
                video: detectedVideoUrl,
                audio: detectedAudioUrl
            }
        };
    }

    /**
     * Setup network observer for video/audio URLs
     */
    function setupVideoObserver() {
        // Override XMLHttpRequest to intercept video URLs
        const originalOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function (method, url) {
            if (typeof url === 'string' && url.includes('videoplayback')) {
                if (url.includes('mime=video') || url.includes('mime%3Dvideo')) {
                    detectedVideoUrl = url;
                    notifyVideoDetected();
                } else if (url.includes('mime=audio') || url.includes('mime%3Daudio')) {
                    detectedAudioUrl = url;
                    notifyVideoDetected();
                }
            }
            return originalOpen.apply(this, arguments);
        };

        // Also check video elements
        const checkVideoElements = () => {
            const videos = document.querySelectorAll('video');
            videos.forEach(video => {
                if (video.src && video.src.includes('videoplayback')) {
                    detectedVideoUrl = video.src;
                    notifyVideoDetected();
                }

                // Check source elements
                video.querySelectorAll('source').forEach(source => {
                    if (source.src && source.src.includes('videoplayback')) {
                        if (source.type && source.type.includes('audio')) {
                            detectedAudioUrl = source.src;
                        } else {
                            detectedVideoUrl = source.src;
                        }
                        notifyVideoDetected();
                    }
                });
            });
        };

        // Initial check
        checkVideoElements();

        // Observe DOM changes for dynamically loaded videos
        const observer = new MutationObserver(checkVideoElements);
        observer.observe(document.body, { childList: true, subtree: true });

        // Periodic check
        setInterval(checkVideoElements, 2000);
    }

    /**
     * Notify popup about detected video
     */
    function notifyVideoDetected() {
        const data = getVideoUrl();
        chrome.runtime.sendMessage({
            type: 'videoUrl',
            ...data
        }).catch(() => { });
    }

    /**
     * Listen for messages from popup
     */
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        switch (message.action) {
            case 'downloadPdf':
                convertToPdf(message.options).then(sendResponse);
                return true;

            case 'extractImages':
                extractImages().then(sendResponse);
                return true;

            case 'downloadZip':
                downloadAsZip(message.options).then(sendResponse);
                return true;

            case 'exportCsv':
                exportSheetsCsv().then(sendResponse);
                return true;

            case 'nativePrint':
                tryNativePrint().then(sendResponse);
                return true;

            case 'extractText':
                extractText().then(sendResponse);
                return true;

            case 'exportSvg':
                exportSvg().then(sendResponse);
                return true;
                convertToPdf(message.options).then(sendResponse);
                return true;

            case 'extractImages':
                extractImages().then(sendResponse);
                return true;

            case 'downloadZip':
                downloadAsZip(message.options).then(sendResponse);
                return true;

            case 'exportCsv':
                exportSheetsCsv().then(sendResponse);
                return true;

            case 'getVideoUrl':
                sendResponse(getVideoUrl());
                return false;

            case 'ping':
                sendResponse({ status: 'ok' });
                return false;

            default:
                sendResponse({ error: 'Unknown action' });
                return false;
        }
    });

    // Initialize video observer if on Drive file page
    if (window.location.href.includes('drive.google.com/file/') ||
        window.location.href.includes('/preview')) {
        setupVideoObserver();
    }

    console.log('GDrive Downloader content script loaded (improved version)');
    // Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
        // Alt + P: Download PDF
        if (e.altKey && e.code === 'KeyP') {
            e.preventDefault();
            sendProgress(0, 'Shortcut: Starting PDF download...');
            convertToPdf({ autoScroll: true });
        }

        // Alt + Z: Download ZIP
        if (e.altKey && e.code === 'KeyZ') {
            e.preventDefault();
            sendProgress(0, 'Shortcut: Starting ZIP download...');
            downloadAsZip({ autoScroll: true });
        }

        // Alt + S: Export SVG (Slides only)
        if (e.altKey && e.code === 'KeyS') {
            if (window.location.href.includes('presentation')) {
                e.preventDefault();
                sendProgress(0, 'Shortcut: Exporting SVG...');
                exportSvg();
            }
        }
    });

})();
