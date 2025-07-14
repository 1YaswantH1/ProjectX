const express = require('express');
const router = express.Router();
const attendanceController = require('@/controllers/attendanceController');
const isAuthenticated = require('@/middlewares/auth');


router.post('/', isAuthenticated, attendanceController.addAttendance);
router.get('/', isAuthenticated, attendanceController.getAttendanceByClassAndDate);
router.get('/export-pivot', isAuthenticated, attendanceController.exportAttendanceCSV);

module.exports = router;
