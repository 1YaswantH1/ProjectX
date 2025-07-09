const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const classController = require('../controllers/classController');

router.post('/upload', upload.single('csv'), classController.uploadClassCSV);
router.get('/', classController.getAllClasses);
router.delete('/name/:className', classController.deleteClassByName);

module.exports = router;
