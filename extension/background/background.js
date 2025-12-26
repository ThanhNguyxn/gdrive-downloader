/**
 * GDrive Downloader - Background Service Worker
 * Handles extension installation and video URL interception
 */

// Video URL storage (per tab)
const videoUrls = new Map();

/**
 * Handle extension installation
 */
chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
        console.log('GDrive Downloader installed');

        // Open welcome page or show notification
        chrome.tabs.create({
            url: 'https://github.com/ThanhNguyxn/google-drive-view-only-tools'
        });
    } else if (details.reason === 'update') {
        console.log('GDrive Downloader updated to version', chrome.runtime.getManifest().version);
    }
});

/**
 * Listen for messages from content scripts and popup
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.type) {
        case 'videoUrl':
            // Store video URL for this tab
            if (sender.tab) {
                videoUrls.set(sender.tab.id, message.url);
            }
            break;

        case 'getVideoUrl':
            // Return stored video URL for requested tab
            if (message.tabId) {
                sendResponse({ url: videoUrls.get(message.tabId) });
            }
            break;

        case 'progress':
            // Forward progress to popup
            // The popup will receive this via its own listener
            break;
    }
});

/**
 * Clean up when tab is closed
 */
chrome.tabs.onRemoved.addListener((tabId) => {
    videoUrls.delete(tabId);
});

/**
 * Handle popup connection to inject content script if needed
 */
chrome.action.onClicked.addListener(async (tab) => {
    // This is only called if there's no popup defined
    // Since we have a popup, this won't be called normally
    // But we keep it for potential future use
});

/**
 * Inject content script on demand if not already present
 */
async function ensureContentScriptInjected(tabId) {
    try {
        await chrome.tabs.sendMessage(tabId, { action: 'ping' });
    } catch (e) {
        // Content script not loaded, inject it
        await chrome.scripting.executeScript({
            target: { tabId },
            files: ['content/content.js']
        });
    }
}

console.log('GDrive Downloader background service worker started');
