const express = require("express");
const multer = require("multer");
const { getAll } = require("./controller");

const app = express();

app.use(express.urlencoded({ extended: true }));
const upload = multer({ storage: multer.memoryStorage() });

app.set("view engine", "ejs");
app.set("views", "./views");

app.get("/", getAll);

app.listen(process.env.PORT || 3000, () => console.log(`SERVER RUNNING ...`));
