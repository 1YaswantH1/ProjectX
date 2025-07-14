const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const classController = require('../controllers/classController');
const isAuthenticated = require('@/middlewares/auth');


router.post('/upload', isAuthenticated, upload.single('csv'), classController.uploadClassCSV);
router.get('/', isAuthenticated, classController.getAllClasses);
router.delete('/name/:className', isAuthenticated, classController.deleteClassByName);

module.exports = router;
