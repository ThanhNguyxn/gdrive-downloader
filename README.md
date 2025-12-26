# 🚀 GDrive Downloader

> ⬇️ **Chrome Extension để download view-only files từ Google Drive**

<p align="center">
  <img src="https://img.shields.io/badge/Chrome-Extension-4285F4?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Chrome Extension"/>
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="MIT License"/>
</p>

<p align="center">
  <a href="https://buymeacoffee.com/thanhnguyxn">
    <img src="https://img.shields.io/badge/☕_Buy_Me_a_Coffee-FFDD00?style=for-the-badge" alt="Buy Me a Coffee"/>
  </a>
  <a href="https://github.com/sponsors/ThanhNguyxn">
    <img src="https://img.shields.io/badge/💖_Sponsor-EA4AAA?style=for-the-badge" alt="GitHub Sponsors"/>
  </a>
</p>

---

## � Cài Đặt

```
1. 📥 Download hoặc Clone repo này
2. 🌐 Mở chrome://extensions/
3. 🔧 Bật "Developer mode" (góc phải trên)
4. 📂 Click "Load unpacked"
5. 📁 Chọn thư mục extension/
6. ✅ Xong! Extension icon sẽ xuất hiện trên toolbar
```

---

## � Hướng Dẫn Sử Dụng

### � Google Docs

1. Mở file Google Docs (view-only)
2. Click icon extension trên toolbar
3. Chọn:
   - **📄 Download as PDF** - Tải xuống dạng PDF
   - **🖼️ Extract as Images** - Tải từng trang dạng ảnh PNG
   - **📱 Open Mobile View** - Mở view đơn giản, copy text được

### � Google Sheets

1. Mở file Google Sheets (view-only)
2. Click icon extension
3. Chọn:
   - **📊 Open HTML View** - Mở view HTML → Select All → Copy → Paste vào Excel
   - **📥 Try Export CSV** - Thử tải CSV (có thể bị chặn)
   - **📄 Print to PDF** - Nhấn Ctrl+P → Save as PDF

### 🎨 Google Slides

1. Mở file Google Slides (view-only)
2. Click icon extension
3. Chọn:
   - **📄 Download as PDF** - Tải xuống dạng PDF
   - **🖼️ Extract as Images** - Tải từng slide dạng ảnh
   - **🎨 Open HTML Present** - Mở HTML → Ctrl+P → Save as PDF

### 📑 Protected PDF

1. Mở PDF trên Google Drive (view-only)
2. Click icon extension
3. Chọn:
   - **📄 Download PDF** - Capture và tải PDF
   - **�️ Extract as Images** - Tải từng trang dạng ảnh

### 🎬 Protected Video

1. Mở video trên Google Drive (view-only)
2. **▶️ Play video trước** (quan trọng!)
3. Click icon extension
4. Video URL và Audio URL sẽ tự động hiện
5. Click **🎬 Open Video** hoặc **🔊 Open Audio** để tải
6. Dùng FFmpeg merge video + audio nếu cần

---

## ⚙️ Tùy Chọn

| Option | Mô tả |
|--------|-------|
| � **High Resolution** | Tạo PDF chất lượng cao hơn (chậm hơn) |
| � **Auto-scroll** | Tự động scroll để load hết trang |

---

## � Cấu Trúc

```
📦 extension/
├── 📄 manifest.json    # Config extension
├── 📂 popup/           # UI
├── 📂 content/         # Script xử lý trang
├── 📂 background/      # Service worker
├── 📂 lib/             # jsPDF library
└── � icons/           # Icons
```

---

## ⚠️ Lưu Ý

> Công cụ này chỉ dành cho mục đích cá nhân hợp pháp!

✅ **Được phép:**
- Backup tài liệu cá nhân bạn có quyền truy cập
- Truy cập offline tài liệu học tập

❌ **Không được phép:**
- Tải nội dung có bản quyền trái phép
- Phân phối lại tài liệu không được phép

---

## 💖 Ủng Hộ

Nếu thấy hữu ích, hãy ủng hộ mình nhé!

- ⭐ [Star repo này](https://github.com/ThanhNguyxn/How-to-download-restricted-file-in-google)
- ☕ [Buy me a coffee](https://buymeacoffee.com/thanhnguyxn)
- 💖 [GitHub Sponsors](https://github.com/sponsors/ThanhNguyxn)

---

## 📜 License

MIT License

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/ThanhNguyxn"><b>Thành Nguyễn</b></a>
</p>
