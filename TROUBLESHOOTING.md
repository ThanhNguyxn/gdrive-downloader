# Troubleshooting Guide

## Common Issues

### 1. "Script doesn't do anything"
*   **Cause**: You might not be in the Console tab, or the document hasn't finished loading.
*   **Fix**:
    *   Make sure you clicked the **Console** tab in Developer Tools.
    *   Refresh the page and try again.
    *   Ensure you pressed **Enter** after pasting the code.

### 2. "PDF has blank pages" or "Images are blurry"
*   **Cause**: The document pages weren't fully loaded before the script ran.
*   **Fix**:
    *   **Scroll through the entire document** from the first page to the last page *slowly* before running the script. This forces Google Docs to render every page.
    *   Use the `high_res_script.js` for better quality.

### 3. "Security Error" or "Blocked by Client"
*   **Cause**: Some browser extensions or strict browser settings might block the script execution.
*   **Fix**:
    *   Try using **Incognito Mode** (Private Window).
    *   Disable ad-blockers temporarily for the Google Doc tab.

### 4. "Printing is disabled"
*   **Cause**: The document owner has explicitly disabled printing and downloading.
*   **Fix**:
    *   The **Print to PDF** method will not work.
    *   You **MUST** use the **Console Script** (`script.js`) or **Image Extractor** method. These bypass the print dialog by capturing what is displayed on your screen.

### 5. Text is not selectable in the PDF
*   **Cause**: The scripts work by taking "screenshots" of the pages to bypass security. Therefore, the output is an image-based PDF.
*   **Fix**:
    *   Use an OCR (Optical Character Recognition) tool on the resulting PDF to make text selectable again. Adobe Acrobat and many online tools offer this.
