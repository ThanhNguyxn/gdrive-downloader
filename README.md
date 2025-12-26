<p align="center">
  <img src="https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/Chrome.svg" width="80" alt="Chrome"/>
</p>

<h1 align="center">GDrive Downloader</h1>

<p align="center">
  <b>Download view-only files from Google Drive</b><br>
  <i>Docs, Sheets, Slides, PDFs, and Videos</i>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-1.0.0-blue?style=flat-square" alt="Version"/>
  <img src="https://img.shields.io/badge/chrome-extension-4285F4?style=flat-square&logo=googlechrome&logoColor=white" alt="Chrome"/>
  <img src="https://img.shields.io/badge/license-MIT-green?style=flat-square" alt="License"/>
  <img src="https://img.shields.io/github/stars/ThanhNguyxn/gdrive-downloader?style=flat-square" alt="Stars"/>
</p>

<p align="center">
  <a href="https://buymeacoffee.com/thanhnguyxn">
    <img src="https://img.shields.io/badge/Buy_Me_A_Coffee-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black" alt="Buy Me a Coffee"/>
  </a>
</p>

---

## :sparkles: Features

<table>
<tr>
<td width="50%">

### :page_facing_up: Google Docs
- :arrow_down: Download as PDF
- :framed_picture: Extract as Images
- :iphone: Open Mobile View

</td>
<td width="50%">

### :bar_chart: Google Sheets
- :globe_with_meridians: Open HTML View
- :inbox_tray: Try Export CSV
- :printer: Print to PDF

</td>
</tr>
<tr>
<td width="50%">

### :art: Google Slides
- :arrow_down: Download as PDF
- :framed_picture: Extract as Images
- :performing_arts: Open HTML Present

</td>
<td width="50%">

### :clapper: Protected Videos
- :movie_camera: Auto-detect Video URL
- :loud_sound: Auto-detect Audio URL
- :link: Direct download links

</td>
</tr>
</table>

---

## :inbox_tray: Installation

<details>
<summary><b>:one: Download the Extension</b></summary>

```bash
git clone https://github.com/ThanhNguyxn/gdrive-downloader.git
```

Or download ZIP from [Releases](https://github.com/ThanhNguyxn/gdrive-downloader/releases)

</details>

<details>
<summary><b>:two: Load in Chrome</b></summary>

1. Open `chrome://extensions/`
2. Enable **Developer mode** (top right)
3. Click **Load unpacked**
4. Select the `extension/` folder

</details>

<details>
<summary><b>:three: Start Using</b></summary>

Click the extension icon on any Google Drive file!

</details>

---

## :book: Usage Guide

### :page_facing_up: For Google Docs

| Step | Action |
|:----:|--------|
| 1 | Open any view-only Google Doc |
| 2 | Click the extension icon |
| 3 | Choose **Download as PDF** or other options |
| 4 | Wait for processing... Done! :tada: |

### :bar_chart: For Google Sheets

| Step | Action |
|:----:|--------|
| 1 | Open view-only Google Sheet |
| 2 | Click **Open HTML View** |
| 3 | Select All (`Ctrl+A`) and Copy (`Ctrl+C`) |
| 4 | Paste into Excel :tada: |

### :clapper: For Videos

| Step | Action |
|:----:|--------|
| 1 | Open video on Google Drive |
| 2 | **Play the video first!** :warning: |
| 3 | Click extension icon |
| 4 | Video and Audio URLs appear automatically |
| 5 | Click to download, merge with FFmpeg if needed |

---

## :gear: Options

| Option | Description |
|--------|-------------|
| :mag: **High Resolution** | Creates higher quality PDFs |
| :scroll: **Auto-scroll** | Automatically loads all pages |

---

## :file_folder: Project Structure

```
extension/
├── manifest.json    # Extension config
├── popup/           # UI components
├── content/         # Page scripts
├── background/      # Service worker
├── lib/             # jsPDF library
└── icons/           # Extension icons
```

---

## :warning: Disclaimer

> :lock: These tools are for **legitimate personal use only**!

| :white_check_mark: Allowed | :x: Not Allowed |
|----------------------------|-----------------|
| Personal backups | Copyrighted content |
| Offline access | Unauthorized sharing |
| Educational materials | Commercial use |

---

## :heart: Support

If you find this useful, please consider:

<p align="center">
  <a href="https://github.com/ThanhNguyxn/gdrive-downloader">:star: Star this repo</a>
  &nbsp;&nbsp;|&nbsp;&nbsp;
  <a href="https://buymeacoffee.com/thanhnguyxn">:coffee: Buy me a coffee</a>
</p>

---

## :scroll: License

MIT License - See [LICENSE](LICENSE) for details.

---

<p align="center">
  Made with :heart: by <a href="https://github.com/ThanhNguyxn"><b>Thanh Nguyen</b></a>
</p>
