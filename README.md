# 🎓 Student Management AI

Hệ thống quản lý sinh viên tích hợp AI — được xây dựng bằng Java, Maven và Gemini AI.

## ✨ Tính năng

- ➕ Thêm, xóa, tìm kiếm sinh viên
- 📋 Xem danh sách toàn bộ sinh viên
- 🔍 Tìm kiếm theo MSSV hoặc tên
- 📊 Sắp xếp theo GPA (cao→thấp, thấp→cao, A→Z)
- 📈 Thống kê GPA trung bình, sinh viên xuất sắc
- 💾 Lưu dữ liệu vào file JSON (không mất khi tắt máy)
- 🤖 AI gợi ý cải thiện điểm số (Gemini 2.5 Flash)
- 🤖 AI phân tích tổng quan cả lớp

## 🛠️ Công nghệ sử dụng

| Công nghệ | Mục đích |
|-----------|----------|
| Java 21 | Ngôn ngữ chính |
| Maven | Quản lý dependency |
| Gson | Đọc/ghi JSON |
| OkHttp | Gọi Gemini REST API |
| Gemini 2.5 Flash | AI phân tích học lực |

## 📁 Cấu trúc project
## ⚙️ Cài đặt và chạy

### Yêu cầu
- Java 21+
- Maven 3.6+
- Gemini API Key (miễn phí tại [Google AI Studio](https://aistudio.google.com/app/apikey))

### Các bước chạy

**1. Clone project**
```bash
git clone https://github.com/YOUR_USERNAME/StudentMangementAI.git
cd StudentMangementAI
```

**2. Set Gemini API Key**
```bash
export GEMINI_API_KEY="your_api_key_here"
```

**3. Chạy ứng dụng**
```bash
mvn compile exec:java
```

## 🖥️ Hướng dẫn sử dụng

Sau khi chạy, chọn số tương ứng trong menu:
## 📌 Lưu ý

- Dữ liệu được lưu tự động vào `students.json` khi thoát
- GPA hợp lệ trong khoảng `0.0 - 4.0`
- Cần kết nối internet để dùng tính năng AI

## 👨‍💻 Tác giả

- **Nguyễn Trọng Phát** — K19, Công nghệ thông tin Việt - Nhật, UIT
- GitHub: [YOUR_USERNAME](https://github.com/YOUR_USERNAME)