# Google Docs Conversion Methods

This guide details all available methods to convert a view-only Google Doc to PDF.

## Method 1: Console Script (Recommended)

This method uses a JavaScript code to capture each page of the document as an image and combine them into a PDF.

### Steps:
1.  Open the view-only Google Doc in your browser (Chrome or Firefox recommended).
2.  Scroll through the **entire document** from top to bottom. This is critical to ensure all pages are loaded.
3.  Press `F12` to open Developer Tools.
4.  Click on the **Console** tab.
5.  Copy the code from `script.js` in the root of this repository.
6.  Paste the code into the Console and press **Enter**.
7.  Wait for the PDF to be generated and downloaded.

### Pros:
*   Fast.
*   Good quality for text.
*   No installation required.

### Cons:
*   Requires using Developer Tools.

---

## Method 2: Bookmarklet (Easiest)

This method allows you to save the script as a bookmark for one-click access.

### Setup:
1.  Create a new bookmark in your browser.
2.  Name it "Save to PDF".
3.  In the URL field, paste the code from `bookmarklet.js`.

### Usage:
1.  Open a Google Doc.
2.  Scroll to load all pages.
3.  Click the bookmark.

---

## Method 3: High Resolution Script

Use this for documents with detailed images or small text.

### Steps:
1.  Open the document.
2.  **Zoom in** using `Ctrl + +` (Windows) or `Cmd + +` (Mac) to about 200%.
3.  Scroll to load all pages.
4.  Open Console (`F12`).
5.  Paste the code from `high_res_script.js`.
6.  Press **Enter**.

### Note:
This method takes longer because it processes larger images, but the output quality is significantly better.

---

## Method 4: Image Extractor

If you prefer to have each page as a separate image file (PNG).

### Steps:
1.  Open the document and load all pages.
2.  Open Console (`F12`).
3.  Paste the code from `image_extractor.js`.
4.  Press **Enter**.
5.  Each page will be downloaded as a separate file.
