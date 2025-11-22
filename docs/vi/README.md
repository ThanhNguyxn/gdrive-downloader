# 📥 Trình Tải Xuống Tệp Chỉ Xem Google Drive

> Tải xuống hoặc in các tệp chỉ xem từ Google Drive - **Docs, Sheets, và Slides**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](../../LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/ThanhNguyxn/How-to-Convert-a-View-Only-Google-Doc-to-a-PDF-On-Google-Drive?style=social)](https://github.com/ThanhNguyxn/How-to-Convert-a-View-Only-Google-Doc-to-a-PDF-On-Google-Drive)

---

> **⚠️ Lưu ý Quan trọng:** Các phương pháp này chỉ dành cho mục đích sử dụng cá nhân hợp pháp, chẳng hạn như tạo bản sao ngoại tuyến của tài liệu mà bạn có quyền truy cập. Luôn tôn trọng bản quyền và quyền sở hữu tài liệu.

## 🚀 Bắt Đầu Nhanh

### Đối với Google Docs

**Phương pháp 1: Script Console** (Nhanh nhất)

```javascript
// 1. Mở Google Doc chỉ xem của bạn
// 2. Nhấn F12 → Nhấp vào tab "Console"
// 3. Sao chép tất cả nội dung từ script.js và dán vào
// 4. Nhấn Enter và đợi tải xuống
```

**Phương pháp 2: Bookmarklet** (Tiện lợi nhất)

```javascript
// 1. Sao chép nội dung từ bookmarklet.js
// 2. Tạo bookmark mới, dán vào phần URL
// 3. Nhấp vào bookmark khi xem bất kỳ Doc nào
```

👉 **[Xem hướng dẫn chi tiết →](../GOOGLE_DOCS.md)**

---

### Đối với Google Sheets

```javascript
// Phương pháp nhanh: In ra PDF
// Nhấn Ctrl+P → Chọn "Lưu dưới dạng PDF" (Save as PDF)

// Thay thế: Chế độ xem HTML
// Thay đổi URL từ /edit thành /htmlview
// Sao chép tất cả dữ liệu → Dán vào Excel
```

👉 **[Xem hướng dẫn chi tiết →](../GOOGLE_SHEETS.md)**

---

### Đối với Google Slides

```javascript
// Phương pháp nhanh: In ra PDF
// Nhấn Ctrl+P → Chọn "Lưu dưới dạng PDF"
// Chọn: 1 slide mỗi trang (chất lượng tốt nhất)
```

👉 **[Xem hướng dẫn chi tiết →](../GOOGLE_SLIDES.md)**

---

## 📚 Tài Liệu

| Tài liệu | Mô tả |
|----------|-------------|
| **[Hướng Dẫn Nhanh](../../QUICKSTART.md)** | Bắt đầu trong 2 phút |
| **[Phương pháp Google Docs](../GOOGLE_DOCS.md)** | Hướng dẫn đầy đủ cho Docs |
| **[Phương pháp Google Sheets](../GOOGLE_SHEETS.md)** | Hướng dẫn đầy đủ cho Sheets |
| **[Phương pháp Google Slides](../GOOGLE_SLIDES.md)** | Hướng dẫn đầy đủ cho Slides |
| **[Khắc phục sự cố](../TROUBLESHOOTING.md)** | Các vấn đề thường gặp & giải pháp |
| **[Đóng góp](../../CONTRIBUTING.md)** | Cách đóng góp cho dự án |

---

## 🌍 Ngôn Ngữ

Tài liệu đầy đủ có sẵn bằng:

- 🇻🇳 **[Tiếng Việt](../vi/)**
- 🇫🇷 **[Français](../fr/)**
- 🇪🇸 **[Español](../es/)**
- 🇨🇳 **[中文](../zh-CN/)**

---

## ✨ Tính Năng

- ✅ **Không cần cài đặt** - Chỉ cần JavaScript, sao chép & dán
- ✅ **Nhiều phương pháp** - Tìm cách phù hợp nhất với bạn
- ✅ **Đầu ra chất lượng cao** - Tùy chọn tiêu chuẩn và độ phân giải cao
- ✅ **Tất cả các loại tệp Google** - Docs, Sheets, Slides
- ✅ **Đa ngôn ngữ** - Hỗ trợ 5 ngôn ngữ
- ✅ **Thân thiện với quyền riêng tư** - Chạy cục bộ trên trình duyệt của bạn
- ✅ **Mã nguồn mở** - Giấy phép MIT

---

## 📂 Các Script Có Sẵn

| Script | Mục đích | Chất lượng | Tốc độ |
|--------|---------|---------|-------|
| `script.js` | Chuyển đổi Google Doc tiêu chuẩn | ⭐⭐⭐ Tốt | 🚀 Nhanh |
| `high_res_script.js` | Chuyển đổi Doc chất lượng cao | ⭐⭐⭐⭐⭐ Xuất sắc | 🐌 Chậm |
| `bookmarklet.js` | Bookmark một cú nhấp chuột | ⭐⭐⭐ Tốt | 🚀 Nhanh |
| `image_extractor.js` | Trích xuất trang thành ảnh PNG | ⭐⭐⭐⭐⭐ Tốt nhất | 🏃 Trung bình |

---

## 🛠️ Cách Hoạt Động

Các script này hoạt động bằng cách:
1. **Truy cập nội dung đã tải** trong trình duyệt của bạn
2. **Chụp ảnh trang** được hiển thị bởi Google
3. **Tạo tệp PDF** hoặc lưu hình ảnh
4. **Tải xuống** máy tính của bạn

> **Quan trọng:** Các phương pháp này chỉ hoạt động trên các tài liệu bạn đã có thể xem. Chúng KHÔNG bỏ qua bất kỳ kiểm soát bảo mật hoặc truy cập nào.

---

## ⚖️ Sử Dụng Hợp Pháp & Đạo Đức

### ✅ Sử dụng phù hợp:
- Tạo bản sao lưu cá nhân của các tài liệu bạn có quyền truy cập
- Truy cập ngoại tuyến vào tài liệu giáo dục
- Lưu trữ các tài liệu được chia sẻ của riêng bạn
- Tham khảo và nghiên cứu cá nhân

### ❌ Sử dụng không phù hợp:
- Bỏ qua các hạn chế truy cập đã định
- Tải xuống nội dung có bản quyền mà không được phép
- Phân phối lại trái phép tác phẩm của người khác
- Sử dụng thương mại mà không có giấy phép thích hợp

> **Luôn tôn trọng bản quyền và quyền sở hữu trí tuệ.**

---

## 🌟 Tương Thích Trình Duyệt

| Trình duyệt | Script Console | Bookmarklet | In ra PDF |
|---------|----------------|-------------|--------------|
| Chrome | ✅ Xuất sắc | ✅ Xuất sắc | ✅ Xuất sắc |
| Firefox | ✅ Xuất sắc | ✅ Xuất sắc | ✅ Xuất sắc |
| Edge | ✅ Tốt | ✅ Xuất sắc | ✅ Xuất sắc |
| Safari | ⚠️ Hạn chế | ✅ Tốt | ✅ Xuất sắc |

---

## 🤝 Đóng Góp

Chúng tôi hoan nghênh mọi đóng góp! Vui lòng xem [CONTRIBUTING.md](../../CONTRIBUTING.md) để biết về:
- Báo cáo lỗi
- Đề xuất tính năng
- Gửi pull request
- Cải thiện tài liệu
- Thêm bản dịch

---

## 📜 Giấy Phép

Dự án này được cấp phép theo **Giấy phép MIT** - xem [LICENSE](../../LICENSE) để biết chi tiết.

---

## 👤 Tác Giả

Được tạo với ❤️ bởi **[Thành Nguyễn](https://github.com/ThanhNguyxn)**

---

## ⭐ Ủng Hộ

Nếu bạn thấy dự án này hữu ích:
- ⭐ **Gắn sao (Star) cho repository này**
- 🐛 **Báo cáo các vấn đề** bạn gặp phải
- 🔀 **Gửi pull request** với các cải tiến
- 📢 **Chia sẻ với những người khác**
- ☕ **[Mời tôi một ly cà phê](https://buymeacoffee.com/thanhnguyxn)** (tùy chọn)

---

## 📞 Trợ Giúp

- 📖 **[Đọc tài liệu](../)** - Hướng dẫn toàn diện
- 🐛 **[Báo cáo sự cố](https://github.com/ThanhNguyxn/How-to-Convert-a-View-Only-Google-Doc-to-a-PDF-On-Google-Drive/issues)** - Báo cáo lỗi
- 💬 **[Thảo luận](https://github.com/ThanhNguyxn/How-to-Convert-a-View-Only-Google-Doc-to-a-PDF-On-Google-Drive/discussions)** - Đặt câu hỏi
