const express = require('express');

const app = express(); // khởi tạo hệ thống bằng express

app.use(express.json({ extended: false })); // parse application/json
app.use(express.urlencoded({ extended: true })); // parse application/x-www-form-urlencode

// tạo server lắng nghe port 3000
app.listen(3000, () => {
    console.log(`Server is running at http://localhost:3000/`);
});
