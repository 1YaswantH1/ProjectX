const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');

router.post('/', attendanceController.addAttendance);
router.get('/', attendanceController.getAttendanceByClassAndDate);
router.get('/export-pivot', attendanceController.exportAttendanceCSV);

module.exports = router;
