/**
 * GDrive Downloader - Popup Script
 * Handles popup UI and communication with content scripts
 */

// Page type detection patterns
const PAGE_PATTERNS = {
    docs: /docs\.google\.com\/document/,
    sheets: /docs\.google\.com\/spreadsheets/,
    slides: /docs\.google\.com\/presentation/,
    pdf: /drive\.google\.com\/file\/d\/.*\/view|docs\.google\.com\/.*\/viewer/,
    video: /drive\.google\.com\/file\/d\/.*\/(view|preview)/
};

// DOM Elements
const statusIndicator = document.getElementById('statusIndicator');
const statusText = document.getElementById('statusText');
const typeBadge = document.getElementById('typeBadge');
const actionsSection = document.getElementById('actionsSection');
const optionsSection = document.getElementById('optionsSection');
const progressSection = document.getElementById('progressSection');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');

// State
let currentTab = null;
let pageType = null;

/**
 * Initialize popup
 */
async function init() {
    try {
        // Get current tab
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        currentTab = tab;

        // Detect page type
        pageType = detectPageType(tab.url);

        if (pageType) {
            updateStatus('ready', `Ready to download`);
            updateTypeBadge(pageType);
            renderActions(pageType);
            optionsSection.style.display = 'block';
        } else {
            updateStatus('error', 'Not a Google Drive page');
            renderNotSupported();
        }
    } catch (error) {
        console.error('Init error:', error);
        updateStatus('error', 'Error detecting page');
        renderError(error.message);
    }
}

/**
 * Detect page type from URL
 */
function detectPageType(url) {
    for (const [type, pattern] of Object.entries(PAGE_PATTERNS)) {
        if (pattern.test(url)) {
            // Additional check for video vs PDF
            if (type === 'video' || type === 'pdf') {
                // We'll let the content script determine if it's video or PDF
                return checkVideoOrPdf(url);
            }
            return type;
        }
    }
    return null;
}

/**
 * Check if Drive file is video or PDF
 */
function checkVideoOrPdf(url) {
    // For now, return 'pdf' as default for Drive files
    // The content script will detect if it's actually a video
    if (url.includes('/file/d/')) {
        return 'pdf'; // Default, will be updated by content script
    }
    return 'pdf';
}

/**
 * Update status indicator
 */
function updateStatus(state, message) {
    const dot = statusIndicator.querySelector('.status-dot');
    dot.className = `status-dot ${state}`;
    statusText.textContent = message;
}

/**
 * Update type badge
 */
function updateTypeBadge(type) {
    const labels = {
        docs: 'Google Docs',
        sheets: 'Google Sheets',
        slides: 'Google Slides',
        pdf: 'PDF File',
        video: 'Video File'
    };

    typeBadge.textContent = labels[type] || 'Unknown';
    typeBadge.className = `type-badge ${type}`;
}

/**
 * Render action buttons based on page type
 */
function renderActions(type) {
    let actionsHTML = '';

    switch (type) {
        case 'docs':
            actionsHTML = `
        <button class="action-btn primary" id="downloadPdfBtn">
          <span class="icon">📄</span>
          Download as PDF
        </button>
        <button class="action-btn secondary" id="extractImagesBtn">
          <span class="icon">🖼️</span>
          Extract as Images
        </button>
        <button class="action-btn secondary" id="openMobileBasicBtn">
          <span class="icon">📱</span>
          Open Mobile View (Copy Text)
        </button>
      `;
            break;

        case 'slides':
            actionsHTML = `
        <button class="action-btn primary" id="downloadPdfBtn">
          <span class="icon">📄</span>
          Download as PDF
        </button>
        <button class="action-btn secondary" id="extractImagesBtn">
          <span class="icon">🖼️</span>
          Extract as Images
        </button>
        <button class="action-btn secondary" id="openHtmlPresentBtn">
          <span class="icon">🎨</span>
          Open HTML Present
        </button>
      `;
            break;

        case 'sheets':
            actionsHTML = `
        <button class="action-btn primary" id="openHtmlViewBtn">
          <span class="icon">📊</span>
          Open HTML View (Copy Data)
        </button>
        <button class="action-btn secondary" id="downloadPdfBtn">
          <span class="icon">📄</span>
          Print to PDF (Ctrl+P)
        </button>
        <button class="action-btn secondary" id="exportCsvBtn">
          <span class="icon">📥</span>
          Try Export CSV
        </button>
      `;
            break;

        case 'pdf':
            actionsHTML = `
        <button class="action-btn primary" id="downloadPdfBtn">
          <span class="icon">📄</span>
          Download PDF
        </button>
        <button class="action-btn secondary" id="extractImagesBtn">
          <span class="icon">🖼️</span>
          Extract as Images
        </button>
      `;
            break;

        case 'video':
            actionsHTML = `
        <div class="video-url-section">
          <p style="font-size: 12px; color: var(--text-secondary); margin-bottom: 10px;">
            🎬 Play the video to detect URLs
          </p>
          <div class="url-group">
            <label style="font-size: 11px; color: var(--text-secondary);">Video URL:</label>
            <div class="url-input-group">
              <input type="text" class="url-input" id="videoUrlInput" placeholder="Detecting..." readonly>
              <button class="copy-btn" id="copyVideoBtn" title="Copy Video URL">📋</button>
            </div>
          </div>
          <div class="url-group" style="margin-top: 8px;">
            <label style="font-size: 11px; color: var(--text-secondary);">Audio URL:</label>
            <div class="url-input-group">
              <input type="text" class="url-input" id="audioUrlInput" placeholder="Detecting..." readonly>
              <button class="copy-btn" id="copyAudioBtn" title="Copy Audio URL">📋</button>
            </div>
          </div>
        </div>
        <button class="action-btn primary" id="openVideoBtn" disabled>
          <span class="icon">🎬</span>
          Open Video in New Tab
        </button>
        <button class="action-btn secondary" id="openAudioBtn" disabled>
          <span class="icon">🔊</span>
          Open Audio in New Tab
        </button>
        <div class="message warning" style="margin-top: 8px; font-size: 11px;">
          ⚠️ Video và Audio tách riêng. Tải cả 2 rồi dùng FFmpeg merge.
        </div>
      `;
            break;
    }

    actionsSection.innerHTML = actionsHTML;

    // Attach event listeners
    attachEventListeners(type);
}

/**
 * Attach event listeners to action buttons
 */
function attachEventListeners(type) {
    // Download PDF button
    const downloadPdfBtn = document.getElementById('downloadPdfBtn');
    if (downloadPdfBtn) {
        downloadPdfBtn.addEventListener('click', () => handleDownloadPdf(type));
    }

    // Extract Images button
    const extractImagesBtn = document.getElementById('extractImagesBtn');
    if (extractImagesBtn) {
        extractImagesBtn.addEventListener('click', handleExtractImages);
    }

    // Open HTML View button (Sheets)
    const openHtmlViewBtn = document.getElementById('openHtmlViewBtn');
    if (openHtmlViewBtn) {
        openHtmlViewBtn.addEventListener('click', handleOpenHtmlView);
    }

    // Open Mobile Basic button (Docs)
    const openMobileBasicBtn = document.getElementById('openMobileBasicBtn');
    if (openMobileBasicBtn) {
        openMobileBasicBtn.addEventListener('click', handleOpenMobileBasic);
    }

    // Open HTML Present button (Slides)
    const openHtmlPresentBtn = document.getElementById('openHtmlPresentBtn');
    if (openHtmlPresentBtn) {
        openHtmlPresentBtn.addEventListener('click', handleOpenHtmlPresent);
    }

    // Export CSV button (Sheets)
    const exportCsvBtn = document.getElementById('exportCsvBtn');
    if (exportCsvBtn) {
        exportCsvBtn.addEventListener('click', handleExportCsv);
    }

    // Video buttons
    const copyVideoBtn = document.getElementById('copyVideoBtn');
    if (copyVideoBtn) {
        copyVideoBtn.addEventListener('click', () => handleCopyUrl('videoUrlInput', 'Video'));
    }

    const copyAudioBtn = document.getElementById('copyAudioBtn');
    if (copyAudioBtn) {
        copyAudioBtn.addEventListener('click', () => handleCopyUrl('audioUrlInput', 'Audio'));
    }

    const openVideoBtn = document.getElementById('openVideoBtn');
    if (openVideoBtn) {
        openVideoBtn.addEventListener('click', () => handleOpenUrl('videoUrlInput'));
    }

    const openAudioBtn = document.getElementById('openAudioBtn');
    if (openAudioBtn) {
        openAudioBtn.addEventListener('click', () => handleOpenUrl('audioUrlInput'));
    }

    // If video/pdf on Drive, request video URL from content script
    if (type === 'video' || type === 'pdf') {
        requestVideoUrl();
    }
}

/**
 * Handle Download PDF action
 */
async function handleDownloadPdf(type) {
    const highRes = document.getElementById('highResOption')?.checked || false;
    const autoScroll = document.getElementById('autoScrollOption')?.checked || true;

    showProgress('Initializing...');

    try {
        // Send message to content script
        const response = await chrome.tabs.sendMessage(currentTab.id, {
            action: 'downloadPdf',
            options: { highRes, autoScroll, type }
        });

        if (response.success) {
            hideProgress();
            showMessage('success', '✅ PDF downloaded successfully!');
        } else {
            throw new Error(response.error || 'Unknown error');
        }
    } catch (error) {
        hideProgress();
        showMessage('error', `❌ ${error.message}`);
    }
}

/**
 * Handle Extract Images action
 */
async function handleExtractImages() {
    showProgress('Extracting images...');

    try {
        const response = await chrome.tabs.sendMessage(currentTab.id, {
            action: 'extractImages'
        });

        if (response.success) {
            hideProgress();
            showMessage('success', `✅ Extracted ${response.count} images!`);
        } else {
            throw new Error(response.error || 'Unknown error');
        }
    } catch (error) {
        hideProgress();
        showMessage('error', `❌ ${error.message}`);
    }
}

/**
 * Handle Open HTML View action (Sheets)
 */
async function handleOpenHtmlView() {
    try {
        const url = currentTab.url
            .replace('/edit', '/htmlview')
            .replace('/view', '/htmlview')
            .split('?')[0] + '?format=html';
        await chrome.tabs.create({ url });
        showMessage('success', '✅ HTML view opened! Select all & copy data.');
    } catch (error) {
        showMessage('error', `❌ ${error.message}`);
    }
}

/**
 * Handle Open Mobile Basic action (Docs)
 */
async function handleOpenMobileBasic() {
    try {
        // Replace /edit or /view with /mobilebasic
        let url = currentTab.url;
        if (url.includes('/edit')) {
            url = url.split('/edit')[0] + '/mobilebasic';
        } else if (url.includes('/view')) {
            url = url.split('/view')[0] + '/mobilebasic';
        } else {
            url = url.split('?')[0] + '/mobilebasic';
        }
        await chrome.tabs.create({ url });
        showMessage('success', '✅ Mobile view opened! Right-click → Save As HTML.');
    } catch (error) {
        showMessage('error', `❌ ${error.message}`);
    }
}

/**
 * Handle Open HTML Present action (Slides)
 */
async function handleOpenHtmlPresent() {
    try {
        // Replace /edit or /view with /htmlpresent
        let url = currentTab.url;
        if (url.includes('/edit')) {
            url = url.split('/edit')[0] + '/htmlpresent';
        } else if (url.includes('/view')) {
            url = url.split('/view')[0] + '/htmlpresent';
        } else {
            url = url.split('/preview')[0] + '/htmlpresent';
        }
        await chrome.tabs.create({ url });
        showMessage('success', '✅ HTML slides opened! Ctrl+P → Save as PDF.');
    } catch (error) {
        showMessage('error', `❌ ${error.message}`);
    }
}

/**
 * Handle Export CSV action (Sheets)
 */
async function handleExportCsv() {
    try {
        // Try to construct export URL
        // Format: /export?format=csv
        let url = currentTab.url;
        const match = url.match(/\/spreadsheets\/d\/([^\/]+)/);
        if (match) {
            const sheetId = match[1];
            url = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;
            await chrome.tabs.create({ url });
            showMessage('success', '✅ Trying CSV export... (may be blocked by owner)');
        } else {
            showMessage('warning', '⚠️ Could not extract sheet ID');
        }
    } catch (error) {
        showMessage('error', `❌ ${error.message}`);
    }
}

/**
 * Request video URL from content script
 */
async function requestVideoUrl() {
    try {
        const response = await chrome.tabs.sendMessage(currentTab.id, {
            action: 'getVideoUrl'
        });

        // Update video URL
        if (response.videoUrl) {
            const videoUrlInput = document.getElementById('videoUrlInput');
            const openVideoBtn = document.getElementById('openVideoBtn');

            if (videoUrlInput) videoUrlInput.value = response.videoUrl;
            if (openVideoBtn) openVideoBtn.disabled = false;

            updateTypeBadge('video');
        }

        // Update audio URL
        if (response.audioUrl) {
            const audioUrlInput = document.getElementById('audioUrlInput');
            const openAudioBtn = document.getElementById('openAudioBtn');

            if (audioUrlInput) audioUrlInput.value = response.audioUrl;
            if (openAudioBtn) openAudioBtn.disabled = false;
        }
    } catch (error) {
        console.log('Video URL not yet available');
    }
}

/**
 * Handle Copy URL action (generic)
 */
function handleCopyUrl(inputId, label) {
    const input = document.getElementById(inputId);
    if (input && input.value && input.value !== 'Detecting...') {
        navigator.clipboard.writeText(input.value);
        showMessage('success', `✅ ${label} URL copied!`);
    } else {
        showMessage('warning', `⚠️ ${label} URL not detected yet`);
    }
}

/**
 * Handle Open URL action (generic)
 */
async function handleOpenUrl(inputId) {
    const input = document.getElementById(inputId);
    if (input && input.value && input.value !== 'Detecting...') {
        await chrome.tabs.create({ url: input.value });
    }
}

/**
 * Show progress section
 */
function showProgress(message) {
    progressSection.style.display = 'block';
    progressText.textContent = message;
    progressFill.style.width = '0%';

    // Disable action buttons
    document.querySelectorAll('.action-btn').forEach(btn => btn.disabled = true);
}

/**
 * Update progress
 */
function updateProgress(percent, message) {
    progressFill.style.width = `${percent}%`;
    progressText.textContent = message;
}

/**
 * Hide progress section
 */
function hideProgress() {
    progressSection.style.display = 'none';

    // Re-enable action buttons
    document.querySelectorAll('.action-btn').forEach(btn => btn.disabled = false);
}

/**
 * Show message
 */
function showMessage(type, message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;

    actionsSection.insertBefore(messageDiv, actionsSection.firstChild);

    setTimeout(() => messageDiv.remove(), 3000);
}

/**
 * Render not supported message
 */
function renderNotSupported() {
    actionsSection.innerHTML = `
    <div class="message warning">
      <p>⚠️ This page is not supported.</p>
      <p style="font-size: 11px; margin-top: 8px;">
        Open a Google Docs, Sheets, Slides, or Drive file to use this extension.
      </p>
    </div>
  `;
    optionsSection.style.display = 'none';
}

/**
 * Render error message
 */
function renderError(message) {
    actionsSection.innerHTML = `
    <div class="message error">
      <p>❌ Error: ${message}</p>
    </div>
  `;
    optionsSection.style.display = 'none';
}

// Listen for progress updates from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'progress') {
        updateProgress(message.percent, message.message);
    } else if (message.type === 'videoUrl') {
        // Update video URL
        if (message.videoUrl) {
            const videoUrlInput = document.getElementById('videoUrlInput');
            const openVideoBtn = document.getElementById('openVideoBtn');

            if (videoUrlInput) videoUrlInput.value = message.videoUrl;
            if (openVideoBtn) openVideoBtn.disabled = false;
        }

        // Update audio URL
        if (message.audioUrl) {
            const audioUrlInput = document.getElementById('audioUrlInput');
            const openAudioBtn = document.getElementById('openAudioBtn');

            if (audioUrlInput) audioUrlInput.value = message.audioUrl;
            if (openAudioBtn) openAudioBtn.disabled = false;
        }
    }
});

// Initialize on load
document.addEventListener('DOMContentLoaded', init);
