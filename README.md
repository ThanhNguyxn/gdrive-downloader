# 🚀 GDrive Downloader

> ⬇️ **Download view-only files from Google Drive** - Docs, Sheets, Slides, PDFs & Videos

<p align="center">
  <img src="https://img.shields.io/badge/Chrome-Extension-4285F4?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Chrome Extension"/>
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="MIT License"/>
  <img src="https://img.shields.io/badge/Made%20with-❤️-red?style=for-the-badge" alt="Made with Love"/>
</p>

<p align="center">
  <a href="https://buymeacoffee.com/thanhnguyxn">
    <img src="https://img.shields.io/badge/Buy%20Me%20a%20Coffee-☕-FFDD00?style=for-the-badge&logo=buymeacoffee&logoColor=black" alt="Buy Me a Coffee"/>
  </a>
  <a href="https://github.com/sponsors/ThanhNguyxn">
    <img src="https://img.shields.io/badge/Sponsor-💖-EA4AAA?style=for-the-badge&logo=githubsponsors&logoColor=white" alt="GitHub Sponsors"/>
  </a>
</p>

---

## ✨ Features

| 📂 File Type | 🛠️ Features |
|--------------|-------------|
| 📄 **Google Docs** | Download PDF, Extract Images, Mobile View |
| 📊 **Google Sheets** | HTML View, CSV Export, Print to PDF |
| 🎨 **Google Slides** | Download PDF, Extract Images, HTML Present |
| 📑 **Protected PDFs** | Canvas + Blob capture, High-res mode |
| 🎬 **Protected Videos** | Auto-detect Video & Audio URLs |

---

## 🔧 Installation

### 📦 Chrome Extension (Recommended)

```bash
1. 📥 Download/Clone this repo
2. 🌐 Open chrome://extensions/
3. 🔧 Enable "Developer mode" (top right)
4. 📂 Click "Load unpacked"
5. 📁 Select the extension/ folder
6. ✅ Done! Click extension icon on any Google Drive file
```

### 📜 Console Scripts (Quick Use)

For one-time use without installing, see [Quick Scripts](#-quick-scripts) below.

---

## 📖 Usage

| Step | Action |
|------|--------|
| 1️⃣ | Open any view-only Google Drive file |
| 2️⃣ | Click the extension icon in toolbar |
| 3️⃣ | Choose your download option |
| 4️⃣ | Wait for processing... Done! 🎉 |

### ⚙️ Options

| Option | Description |
|--------|-------------|
| 🔍 **High Resolution** | Creates higher quality PDFs (slower) |
| 📜 **Auto-scroll** | Automatically scrolls through all pages |

---

## 📝 Quick Scripts

### 📄 Google Docs/Slides → PDF

```javascript
// 1. 🌐 Open view-only Doc/Slide
// 2. 🔧 Press F12 → Console tab
// 3. 📋 Paste and run:

let jspdf = document.createElement("script");
jspdf.onload = function () {
  let pdf = new jsPDF();
  let elements = document.getElementsByTagName("img");
  for (let i in elements) {
    let img = elements[i];
    if (!/^blob:/.test(img.src)) continue;
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext("2d");
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0, img.width, img.height);
    let imgData = canvas.toDataURL("image/jpeg", 1.0);
    pdf.addImage(imgData, 'JPEG', 0, 0);
    pdf.addPage();
  }
  pdf.save("download.pdf");
};
jspdf.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/1.3.2/jspdf.min.js';
document.body.appendChild(jspdf);
```

### 📊 Google Sheets

```javascript
// 🔗 Method 1: Change URL
// Replace /edit with /htmlview
// Then: Select All → Copy → Paste to Excel

// 🖨️ Method 2: Print to PDF
// Press Ctrl+P → Save as PDF
```

### 🎬 Videos

```bash
1. 🎥 Open video in Google Drive
2. 🔧 Press F12 → Network tab
3. ▶️ Play the video
4. 🔍 Filter by "mime=video"
5. 📋 Copy URL of largest file
6. ✂️ Remove "&range=..." from URL
7. 🌐 Open in new tab → Download!
```

---

## 📁 Project Structure

```
📦 gdrive-downloader/
├── 📂 extension/           # 🔌 Chrome Extension
│   ├── 📄 manifest.json    # ⚙️ Extension config
│   ├── 📂 popup/           # 🎨 UI files
│   ├── 📂 content/         # 📜 Page scripts
│   ├── 📂 background/      # 🔧 Service worker
│   └── 📂 lib/             # 📚 Libraries
├── 📜 script.js            # 🔨 Console script
├── 📜 bookmarklet.js       # 🔖 Bookmarklet
└── 📜 high_res_script.js   # 🔍 High quality version
```

---

## ⚠️ Legal Notice

> **🔒 Important:** These tools are for legitimate personal use only!

### ✅ Appropriate Uses:
- 💾 Personal backups of your documents
- 📚 Offline access to educational materials
- 📁 Archiving your own shared files

### ❌ Not Appropriate:
- 🚫 Bypassing intended restrictions
- 🚫 Downloading copyrighted content
- 🚫 Unauthorized redistribution

---

## 💖 Support the Project

If you find this useful, consider supporting:

<p align="center">
  <a href="https://github.com/ThanhNguyxn/How-to-download-restricted-file-in-google">⭐ Star this repo</a> •
  <a href="https://buymeacoffee.com/thanhnguyxn">☕ Buy me a coffee</a> •
  <a href="https://github.com/sponsors/ThanhNguyxn">💖 GitHub Sponsors</a>
</p>

---

## 📜 License

MIT License - See [LICENSE](LICENSE) for details.

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/ThanhNguyxn"><b>Thành Nguyễn</b></a>
</p>
