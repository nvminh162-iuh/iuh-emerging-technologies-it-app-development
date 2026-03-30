const express = require("express");
const multer = require("multer");
const { controller } = require("./controller");

const app = express();

app.use(express.urlencoded({ extended: true }));
const upload = multer({ storage: multer.memoryStorage() });

app.set("view engine", "ejs");
app.set("views", "./views");

// Danh sách + bộ lọc
app.get("/", controller.renderAll);

// Form thêm mới
app.get("/form", controller.renderForm);

// Form chỉnh sửa
app.get("/form/:orderId/:orderDate", controller.renderForm);

// Xem chi tiết
app.get("/detail/:orderId/:orderDate", controller.renderDetail);

// Thêm mới
app.post("/items", upload.single("image"), controller.save);

// Xóa – đặt TRƯỚC route update để tránh Express khớp "delete" như orderId
app.post("/items/delete/:orderId/:orderDate", controller.deleteById);

// Cập nhật
app.post("/items/:orderId/:orderDate", upload.single("image"), controller.save);

app.listen(3001, () => console.log("SERVER RUNNING at http://localhost:3001"));
