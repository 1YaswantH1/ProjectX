const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const authController = require('@/controllers/authController');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
const upload = multer({ storage });

router.post('/signup', upload.single('profileImage'), authController.signup);
router.post('/logout', authController.logout);

router.post('/login', authController.login);

module.exports = router;