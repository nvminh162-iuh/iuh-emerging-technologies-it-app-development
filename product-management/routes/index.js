const { Route } = require("express");
const router = Route();

router.get('/', (req, res) => res.render('index'));

module.exports = router;