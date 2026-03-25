const express = require("express");
const multer = require("multer");
const { renderAllController, renderFormController, saveController, deleteByIdController } = require("./controller");

const app = express();

app.use(express.urlencoded({ extended: true }));
const upload = multer({ storage: multer.memoryStorage() });

app.set("view engine", "ejs");
app.set("views", "./views");

app.get("/", renderAllController);
app.get("/form", renderFormController);
app.get("/form/:id", renderFormController);
app.post("/items", upload.single("image"), saveController);
app.post("/items/:id", upload.single("image"), saveController);
app.post("/items/delete/:id", deleteByIdController);

app.listen(3000, () => console.log(`SERVER RUNNING ...`));
