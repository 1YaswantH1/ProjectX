const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    rollNumber: { type: String, required: true },
    name: { type: String, required: true },
});

const classSchema = new mongoose.Schema({
    name: { type: String, required: true },
    students: [studentSchema],
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Class', classSchema);
