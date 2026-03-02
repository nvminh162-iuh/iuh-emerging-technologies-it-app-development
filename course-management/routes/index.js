const Router = require('express').Router;
const router = Router();
const controller = require('../controllers');
const upload = require('../middleware/upload');

router.get('/', (req, res) => {
    res.render('index');
});
router.get('/subjects', controller.getSubjects);
router.get('/subjects/:id', controller.getSubject);
router.post('/subjects', upload, controller.createSubject);
router.put('/subjects/:id', upload, controller.updateSubject);
router.delete('/subjects/:id', controller.deleteSubject);

module.exports = router;
