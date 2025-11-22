# 📥 Google Drive 只读文件下载器

> 下载或打印 Google Drive 中的只读文件 - **Docs, Sheets, 和 Slides**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](../../LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/ThanhNguyxn/How-to-Convert-a-View-Only-Google-Doc-to-a-PDF-On-Google-Drive?style=social)](https://github.com/ThanhNguyxn/How-to-Convert-a-View-Only-Google-Doc-to-a-PDF-On-Google-Drive)

---

> **⚠️ 重要提示：** 这些方法仅供合法的个人使用，例如创建您有权访问的文档的离线副本。请始终尊重版权和文档所有权。

## 🚀 快速开始

### 对于 Google Docs

**方法 1：控制台脚本** (最快)

```javascript
// 1. 打开您的只读 Google Doc
// 2. 按 F12 → 点击 "Console" (控制台) 标签
// 3. 复制 script.js 中的所有内容并粘贴
// 4. 按 Enter 并等待下载
```

**方法 2：书签工具** (最方便)

```javascript
// 1. 复制 bookmarklet.js 的内容
// 2. 创建新书签，将其作为 URL 粘贴
// 3. 在查看任何 Doc 时点击书签
```

👉 **[查看详细说明 →](../GOOGLE_DOCS.md)**

---

### 对于 Google Sheets

```javascript
// 快速方法：打印为 PDF
// 按 Ctrl+P → 选择 "另存为 PDF"

// 替代方法：HTML 视图
// 将 URL 从 /edit 更改为 /htmlview
// 复制所有数据 → 粘贴到 Excel
```

👉 **[查看详细说明 →](../GOOGLE_SHEETS.md)**

---

### 对于 Google Slides

```javascript
// 快速方法：打印为 PDF
// 按 Ctrl+P → 选择 "另存为 PDF"
// 选择：每页 1 张幻灯片 (最佳质量)
```

👉 **[查看详细说明 →](../GOOGLE_SLIDES.md)**

---

## 📚 文档

| 文档 | 描述 |
|----------|-------------|
| **[快速开始指南](../../QUICKSTART.md)** | 2 分钟入门 |
| **[Google Docs 方法](../GOOGLE_DOCS.md)** | Docs 完整指南 |
| **[Google Sheets 方法](../GOOGLE_SHEETS.md)** | Sheets 完整指南 |
| **[Google Slides 方法](../GOOGLE_SLIDES.md)** | Slides 完整指南 |
| **[故障排除](../TROUBLESHOOTING.md)** | 常见问题与解决方案 |
| **[贡献](../../CONTRIBUTING.md)** | 如何贡献 |

---

## 🌍 语言

完整文档提供于：

- 🇻🇳 **[Tiếng Việt](../vi/)**
- 🇫🇷 **[Français](../fr/)**
- 🇪🇸 **[Español](../es/)**
- 🇨🇳 **[中文](../zh-CN/)**

---

## ✨ 功能

- ✅ **无需安装** - 纯 JavaScript，复制粘贴
- ✅ **多种方法** - 找到最适合您的方法
- ✅ **高质量输出** - 标准和高分辨率选项
- ✅ **所有 Google 文件类型** - Docs, Sheets, Slides
- ✅ **多语言** - 支持 5 种语言
- ✅ **隐私友好** - 在您的浏览器中本地运行
- ✅ **开源** - MIT 许可证

---

## 📂 可用脚本

| 脚本 | 用途 | 质量 | 速度 |
|--------|---------|---------|-------|
| `script.js` | 标准 Google Doc 转换器 | ⭐⭐⭐ 好 | 🚀 快 |
| `high_res_script.js` | 高质量 Doc 转换器 | ⭐⭐⭐⭐⭐ 极好 | 🐌 慢 |
| `bookmarklet.js` | 一键书签 | ⭐⭐⭐ 好 | 🚀 快 |
| `image_extractor.js` | 提取页面为 PNG | ⭐⭐⭐⭐⭐ 最佳 | 🏃 中等 |

---

## 🛠️ 工作原理

这些脚本通过以下方式工作：
1. **访问已加载的内容** 在您的浏览器中
2. **捕获页面图像** 由 Google 渲染
3. **创建 PDF** 或保存图像
4. **下载** 到您的计算机

> **重要：** 这些方法仅适用于您已经可以查看的文档。它们**不**绕过任何安全或访问控制。

---

## ⚖️ 法律与道德使用

### ✅ 适当使用：
- 创建您有权访问的文档的个人备份
- 离线访问教育材料
- 归档您自己的共享文档
- 个人参考和学习

### ❌ 不当使用：
- 绕过预期的访问限制
- 未经许可下载受版权保护的内容
- 未经授权重新分发他人的作品
- 未经适当许可的商业使用

> **始终尊重版权和知识产权。**

---

## 🌟 浏览器兼容性

| 浏览器 | 控制台脚本 | 书签工具 | 打印为 PDF |
|---------|----------------|-------------|--------------|
| Chrome | ✅ 极好 | ✅ 极好 | ✅ 极好 |
| Firefox | ✅ 极好 | ✅ 极好 | ✅ 极好 |
| Edge | ✅ 好 | ✅ 极好 | ✅ 极好 |
| Safari | ⚠️ 有限 | ✅ 好 | ✅ 极好 |

---

## 🤝 贡献

我们欢迎贡献！请参阅 [CONTRIBUTING.md](../../CONTRIBUTING.md) 了解：
- 报告错误
- 建议功能
- 提交拉取请求
- 改进文档
- 添加翻译

---

## 📜 许可证

本项目根据 **MIT 许可证** 授权 - 详情请参阅 [LICENSE](../../LICENSE)。

---

## 👤 作者

由 **[Thành Nguyễn](https://github.com/ThanhNguyxn)** 用 ❤️ 制作

---

## ⭐ 显示您的支持

如果您发现此项目有帮助：
- ⭐ **给此仓库加星**
- 🐛 **报告您遇到的问题**
- 🔀 **提交改进的拉取请求**
- 📢 **与他人分享**
- ☕ **[请我喝杯咖啡](https://buymeacoffee.com/thanhnguyxn)** (可选)

---

## 📞 获取帮助

- 📖 **[阅读文档](../)** - 综合指南
- 🐛 **[报告问题](https://github.com/ThanhNguyxn/How-to-Convert-a-View-Only-Google-Doc-to-a-PDF-On-Google-Drive/issues)** - 错误报告
- 💬 **[讨论](https://github.com/ThanhNguyxn/How-to-Convert-a-View-Only-Google-Doc-to-a-PDF-On-Google-Drive/discussions)** - 提问
