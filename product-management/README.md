## 📝 ĐỀ BÀI THI: XÂY DỰNG CRUD PRODUCT VỚI EXPRESSJS + EJS

### 🎯 Mục tiêu

Xây dựng một ứng dụng web sử dụng **NodeJS + ExpressJS + EJS** để quản lý sản phẩm (Product), có đầy đủ chức năng CRUD và lưu trữ dữ liệu.

---

## 📦 1. Mô tả dữ liệu

Đối tượng `Product` có cấu trúc:

```js
Product = {
    id: string,
    name: string,
    price: number,
    image: string,
    quantity: int,
    createdAt: string,
}
```

---

## ⚙️ 2. Yêu cầu chức năng

Ứng dụng phải có các chức năng sau:

### 🔹 2.1. Hiển thị danh sách sản phẩm

* Route: `/products`
* Hiển thị toàn bộ danh sách sản phẩm
* Có hình ảnh, tên, giá
* Có nút:

  * Xem chi tiết
  * Sửa
  * Xóa

---

### 🔹 2.2. Thêm sản phẩm mới

* Route: `/products/create`
* Form nhập:

  * name
  * price
  * image (URL)
* Validate:

  * Không để trống
  * price phải là số > 0
* Sau khi thêm → redirect về danh sách

---

### 🔹 2.3. Cập nhật sản phẩm

* Route: `/products/edit/:id`
* Hiển thị form với dữ liệu cũ
* Validate giống create
* Sau khi cập nhật → redirect về danh sách

---

### 🔹 2.4. Xóa sản phẩm

* Route: `/products/delete/:id`
* Có xác nhận trước khi xóa (confirm)
* Sau khi xóa → quay về danh sách

---

### 🔹 2.5. Xem chi tiết sản phẩm

* Route: `/products/:id`
* Hiển thị đầy đủ thông tin sản phẩm

---

## 💾 3. Lưu trữ dữ liệu

Chọn 1 trong các cách sau:

* JSON file (khuyến khích cho bài thi cơ bản)
* Hoặc MongoDB / SQLite (nếu muốn nâng cao)

---

## 🎨 4. Giao diện (EJS + CSS)

### Yêu cầu:

* Sử dụng **EJS template engine**
* Có layout chung (header, footer)
* Giao diện đẹp, rõ ràng

### CSS:

* Tự viết hoặc dùng:

  * Bootstrap / Tailwind (được phép)
* Có:

  * Card sản phẩm
  * Form đẹp
  * Button rõ ràng

---

## ✅ 5. Validation

Phải kiểm tra:

* name: không rỗng
* price: số hợp lệ > 0
* image: URL hợp lệ (cơ bản)
* quantity: số lượng > 0

Hiển thị lỗi trực tiếp trên form

---

## 📁 6. Cấu trúc thư mục (gợi ý)

```
project/
│── app.js
│── routes/
│   └── product.routes.js
│── views/
│   ├── products/
│   └── layouts/
│── public/
│   └── css/
│── models/
│── data/
│   └── products.json
```

---

## ⭐ 7. Điểm cộng (không bắt buộc)

* Tìm kiếm sản phẩm
* Phân trang
* Upload ảnh thay vì URL
* Flash message (thông báo thành công/lỗi)

---

## 📊 8. Thang điểm (gợi ý)

| Tiêu chí            | Điểm |
| ------------------- | ---- |
| CRUD đầy đủ         | 4    |
| Validation          | 2    |
| EJS + Routing chuẩn | 2    |
| Giao diện CSS       | 1    |
| Clean code          | 1    |

---

## 🚀 9. Yêu cầu nộp bài

* Source code
* Hướng dẫn chạy (README.md)
* Ảnh demo (optional)

---

Nếu bạn muốn, mình có thể:

* Viết luôn **code mẫu full CRUD**
* Hoặc tạo **template project hoàn chỉnh** để bạn dùng thi 👍
