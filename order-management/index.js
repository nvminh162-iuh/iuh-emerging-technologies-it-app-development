const express = require("express");
const multer = require("multer");
const { controller } = require("./controller");

const app = express();

app.use(express.urlencoded({ extended: true }));
const upload = multer({ storage: multer.memoryStorage() });

app.set("view engine", "ejs");
app.set("views", "./views");

// app.get("/", (req, res) => res.render('index'));
// app.get("/form", (req, res) => res.render('form'));

app.get("/", controller.renderAll);
app.get("/form", controller.renderForm);
app.get("/form/:id", controller.renderForm);
app.post("/items", upload.single("imageUrl"), controller.save);
app.post("/items/:id", upload.single("imageUrl"), controller.save);
app.post("/items/delete/:id", controller.deleteById);

app.listen(3000, () => console.log(`SERVER RUNNING ...`));
