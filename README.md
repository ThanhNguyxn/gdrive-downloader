# GDrive Downloader

> Download view-only files from Google Drive - Docs, Sheets, Slides, PDFs, and Videos

![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-4285F4?style=for-the-badge&logo=googlechrome&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
![Made with Love](https://img.shields.io/badge/Made%20with-Love-red?style=for-the-badge)

[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-Support-FFDD00?style=for-the-badge&logo=buymeacoffee&logoColor=black)](https://buymeacoffee.com/thanhnguyxn)

---

## Features

| File Type | Features |
|-----------|----------|
| **Google Docs** | Download PDF, Extract Images, Mobile View |
| **Google Sheets** | HTML View, CSV Export, Print to PDF |
| **Google Slides** | Download PDF, Extract Images, HTML Present |
| **Protected PDFs** | Canvas + Blob capture, High-res mode |
| **Protected Videos** | Auto-detect Video and Audio URLs |

---

## Installation

1. Download or Clone this repository
2. Open `chrome://extensions/`
3. Enable **Developer mode** (top right corner)
4. Click **Load unpacked**
5. Select the `extension/` folder
6. Done! Extension icon will appear in your toolbar

---

## Usage

### Google Docs

1. Open a view-only Google Doc
2. Click the extension icon
3. Choose:
   - **Download as PDF** - Save as PDF file
   - **Extract as Images** - Download each page as PNG
   - **Open Mobile View** - Simple view for copying text

### Google Sheets

1. Open a view-only Google Sheet
2. Click the extension icon
3. Choose:
   - **Open HTML View** - Select All, Copy, Paste to Excel
   - **Try Export CSV** - Attempt to download CSV (may be blocked)
   - **Print to PDF** - Press Ctrl+P, Save as PDF

### Google Slides

1. Open a view-only Google Slides
2. Click the extension icon
3. Choose:
   - **Download as PDF** - Save as PDF file
   - **Extract as Images** - Download each slide as image
   - **Open HTML Present** - Open HTML, Ctrl+P, Save as PDF

### Protected PDF

1. Open a PDF on Google Drive (view-only)
2. Click the extension icon
3. Choose:
   - **Download PDF** - Capture and download PDF
   - **Extract as Images** - Download each page as image

### Protected Video

1. Open a video on Google Drive (view-only)
2. **Play the video first** (important!)
3. Click the extension icon
4. Video URL and Audio URL will appear automatically
5. Click **Open Video** or **Open Audio** to download
6. Use FFmpeg to merge video + audio if needed

---

## Options

| Option | Description |
|--------|-------------|
| **High Resolution** | Creates higher quality PDFs (slower) |
| **Auto-scroll** | Automatically scrolls to load all pages |

---

## Project Structure

```
extension/
├── manifest.json    # Extension config
├── popup/           # UI files
├── content/         # Page scripts
├── background/      # Service worker
├── lib/             # jsPDF library
└── icons/           # Extension icons
```

---

## Legal Notice

> These tools are for legitimate personal use only!

**Allowed:**
- Personal backups of documents you have access to
- Offline access to educational materials

**Not Allowed:**
- Downloading copyrighted content without permission
- Unauthorized redistribution

---

## Support

If you find this useful, please support:

- [Star this repo](https://github.com/ThanhNguyxn/gdrive-downloader)
- [Buy me a coffee](https://buymeacoffee.com/thanhnguyxn)

---

## Suggested Repository Name

**`gdrive-downloader`** or **`google-drive-downloader`**

## Suggested Topics/Tags

```
google-drive, chrome-extension, pdf-downloader, google-docs, 
google-sheets, google-slides, view-only, download-protected,
javascript, jspdf
```

---

## License

MIT License

---

Made with love by [Thanh Nguyen](https://github.com/ThanhNguyxn)
