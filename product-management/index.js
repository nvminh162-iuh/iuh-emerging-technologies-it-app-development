const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('./views'))
app.set('view engine', 'ejs').set('views', './views');

app.use('/', require('./routes/index'));

app.listen(3000, () => console.log("Server running port 3000"));
