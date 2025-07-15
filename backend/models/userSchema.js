const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileImage: { type: String, default: 'uploads/default-user.png' },
    type: { type: String, enum: ['viewer', 'admin'], default: 'viewer' } // 👈 New field with default
});

module.exports = mongoose.model('User', userSchema);
