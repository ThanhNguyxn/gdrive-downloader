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
        const canvasSelectors = [
            '.kix-canvas-tile-content canvas',  // Google Docs
            '.punch-viewer-content canvas',      // Google Slides
            '.ndfHFb-c4YZDc-Wrber canvas',       // PDF viewer
            '.drive-viewer-paginated-page canvas', // Drive PDF
            'canvas[data-page]',                  // Generic page canvas
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
})();
