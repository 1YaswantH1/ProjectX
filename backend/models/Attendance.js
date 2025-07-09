const mongoose = require("mongoose");

const attendanceRecordSchema = new mongoose.Schema({
    rollNumber: { type: String, required: true },
    name: { type: String, required: true },
    status: { type: String, enum: ['present', 'absent'], required: true },
});

const attendanceSchema = new mongoose.Schema({
    className: { type: String, required: true },
    date: { type: Date, required: true },
    records: [attendanceRecordSchema],
});

module.exports = mongoose.model('Attendance', attendanceSchema);
