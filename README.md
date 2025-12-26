<h1 align="center">🚀 GDrive Downloader</h1>

<p align="center">
  <b>Download view-only files from Google Drive</b><br>
  <i>📄 Docs | 📊 Sheets | 🎨 Slides | 📑 PDFs | 🎬 Videos</i>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-2.0.1-blue?style=flat-square" alt="Version"/>
  <img src="https://img.shields.io/badge/license-MIT-green?style=flat-square" alt="License"/>
</p>

<p align="center">
  <a href="https://github.com/ThanhNguyxn/gdrive-downloader/raw/main/release/gdrive-downloader-v2.0.1.zip">
    <img src="https://img.shields.io/badge/⬇️_Download_v2.0.1-Click_Here-blue?style=for-the-badge&logo=google-drive&logoColor=white" alt="Download"/>
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Chrome-4285F4?style=flat-square&logo=googlechrome&logoColor=white" alt="Chrome"/>
  <img src="https://img.shields.io/badge/Edge-0078D7?style=flat-square&logo=microsoftedge&logoColor=white" alt="Edge"/>
  <img src="https://img.shields.io/badge/Brave-FB542B?style=flat-square&logo=brave&logoColor=white" alt="Brave"/>
  <img src="https://img.shields.io/badge/Opera-FF1B2D?style=flat-square&logo=opera&logoColor=white" alt="Opera"/>
  <img src="https://img.shields.io/badge/Vivaldi-EF3939?style=flat-square&logo=vivaldi&logoColor=white" alt="Vivaldi"/>
</p>

<p align="center">
  <a href="https://buymeacoffee.com/thanhnguyxn">
    <img src="https://img.shields.io/badge/Buy_Me_A_Coffee-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black" alt="Buy Me a Coffee"/>
  </a>
</p>

---

## ✨ Features (v2.0)

<table>
<tr>
<td width="50%">

### 📄 Google Docs
- ⬇️ **Download as PDF** (High Res)
- 📦 **Download as ZIP** (All pages)
- 🖼️ **Extract as Images**
- 🖨️ **Try Native Print** (Selectable Text)
- 📝 **Extract Text Only** (Raw Text)
- 📱 Open Mobile View

</td>
<td width="50%">

### 📊 Google Sheets
- 🌐 **Open HTML View** (Copy Data)
- 📥 **Try Export CSV** (Direct Export)
- 🖨️ Print to PDF

</td>
</tr>
<tr>
<td width="50%">

### 🎨 Google Slides
- ⬇️ **Download as PDF**
- ✒️ **Export Page as SVG** (Vector)
- 📦 **Download as ZIP**
- 🖼️ **Extract as Images**
- 📝 **Extract Text Only**
- 🎭 Open HTML Present

</td>
<td width="50%">

### 🎬 Protected Videos
- 📹 **Auto-detect Video & Audio**
- ⬇️ **Download Both Tracks**
- 🔗 Direct download links
- 🔧 **Merge Tool Integration**

</td>
</tr>
</table>

---

## 🌐 Supported Browsers

| Browser | Status | Installation |
|---------|--------|--------------|
| ![Chrome](https://img.shields.io/badge/-Chrome-4285F4?logo=googlechrome&logoColor=white) | ✅ Full Support | Developer Mode |
| ![Edge](https://img.shields.io/badge/-Edge-0078D7?logo=microsoftedge&logoColor=white) | ✅ Full Support | Developer Mode |
| ![Brave](https://img.shields.io/badge/-Brave-FB542B?logo=brave&logoColor=white) | ✅ Full Support | Developer Mode |
| ![Opera](https://img.shields.io/badge/-Opera-FF1B2D?logo=opera&logoColor=white) | ✅ Full Support | Developer Mode |
| ![Vivaldi](https://img.shields.io/badge/-Vivaldi-EF3939?logo=vivaldi&logoColor=white) | ✅ Full Support | Developer Mode |

---

## 📥 Installation

<details>
<summary><b>🔵 Chrome / Edge / Brave / Opera / Vivaldi</b></summary>

1. Download or Clone this repository
2. Open browser extensions page:
   - **Chrome**: `chrome://extensions/`
   - **Edge**: `edge://extensions/`
   - **Brave**: `brave://extensions/`
   - **Opera**: `opera://extensions/`
   - **Vivaldi**: `vivaldi://extensions/`
3. Enable **Developer mode**
4. Click **Load unpacked**
5. Select the `extension/` folder
6. Done! 🎉

</details>

---

## 📖 Usage Guide

### 📄 For Google Docs
| Feature | Action |
|:-------:|--------|
| **PDF** | Click **Download as PDF** for standard image-based PDF. |
| **Selectable** | Click **Try Native Print** to attempt a selectable text PDF. |
| **Text** | Click **Extract Text Only** to copy raw text to clipboard. |

### 📊 For Google Sheets
| Feature | Action |
|:-------:|--------|
| **Excel** | Click **Open HTML View** -> Select All -> Copy -> Paste to Excel. |
| **CSV** | Click **Try Export CSV** for direct download (if available). |

### 🎨 For Google Slides
| Feature | Action |
|:-------:|--------|
| **Vector** | Click **Export Page as SVG** for high-quality vector export. |
| **Images** | Click **Extract as Images** or **Download as ZIP** for all slides. |

### 🎬 For Videos
| Step | Action |
|:----:|--------|
| 1️⃣ | Open video on Google Drive & **Play it** ⚠️ |
| 2️⃣ | Click extension icon -> Wait for URLs to appear |
| 3️⃣ | Click **Download Video + Audio** (Downloads 2 files) |
| 4️⃣ | Use **Open Online Merge Tool** to combine them |

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|:--------:|--------|
| `Alt + P` | Download PDF |
| `Alt + Z` | Download ZIP |
| `Alt + S` | Export SVG (Slides only) |

---

## ⚙️ Options

| Option | Description |
|--------|-------------|
| 🔍 **High Resolution** | Creates higher quality PDFs (Slower) |
| 📜 **Auto-scroll** | Automatically loads all pages before downloading |
| 💾 **Persistence** | Settings are saved automatically |

---

## 🏗️ Technical Architecture

This extension leverages advanced browser capabilities to bypass view-only restrictions legally and safely.

### 🔧 Core Logic

#### 1. PDF Generation (Canvas & Native)
- **Standard Mode:** Iterates through the document's canvas elements, captures them as high-quality images, and compiles them into a PDF using `jsPDF`.
- **Native Print Mode:** Injects specific CSS (`@media print`) to override Google's "display: none" on text layers, forcing the browser's native print dialog to recognize and render the selectable text.

#### 2. Text & Data Extraction
- **Docs/Slides:** Uses DOM traversal to locate specific container classes (e.g., `.kix-lineview-content` for Docs, `g text` for Slides) and extracts raw text content, bypassing the clipboard restrictions.
- **Sheets:** Manipulates the spreadsheet URL to access the `/htmlview` endpoint, which renders a copy-paste friendly HTML version of the data.

#### 3. Media Detection
- **Video/Audio:** Uses `MutationObserver` to watch for media player initialization and intercepts network request patterns to identify the underlying `googlevideo.com` stream URLs for both video and audio tracks.

#### 4. Vector Export (SVG)
- **Slides:** Scrapes the SVG nodes directly from the Google Slides rendering layer (`.punch-viewer-content`) and serializes them into a standalone `.svg` file, preserving vector quality.

---

## 📂 Project Structure

```bash
gdrive-downloader/
├── 📂 .github/             # GitHub templates & workflows
├── 📂 extension/           # Source code
│   ├── 📂 background/      # Service worker (Event handling)
│   ├── 📂 content/         # Content scripts (Page manipulation)
│   │   └── content.js      # Main logic (PDF, Text, Media extraction)
│   ├── 📂 lib/             # Third-party libraries
│   │   ├── jspdf.umd.min.js # PDF generation
│   │   └── jszip.min.js     # ZIP creation
│   ├── 📂 popup/           # Extension UI
│   │   ├── popup.html      # Structure
│   │   ├── popup.css       # Styling (Glassmorphism)
│   │   └── popup.js        # UI Logic & Messaging
│   └── manifest.json       # Extension Configuration (V3)
├── 📂 release/             # Pre-built releases (.zip)
├── .gitignore              # Git ignore rules
├── LICENSE                 # MIT License
└── README.md               # Documentation
```

---

## ⚠️ Disclaimer

> 🔒 These tools are for **legitimate personal use only**!

| ✅ Allowed | ❌ Not Allowed |
|------------|----------------|
| Personal backups | Copyrighted content |
| Offline access | Unauthorized sharing |
| Educational materials | Commercial use |

---

## 💖 Support

If you find this useful, please consider:

<p align="center">
  <a href="https://github.com/ThanhNguyxn/gdrive-downloader">⭐ Star this repo</a>
  &nbsp;&nbsp;|&nbsp;&nbsp;
  <a href="https://buymeacoffee.com/thanhnguyxn">☕ Buy me a coffee</a>
</p>

---

## 📜 License

MIT License - See [LICENSE](LICENSE) for details.

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/ThanhNguyxn"><b>Thanh Nguyen</b></a>
</p>
