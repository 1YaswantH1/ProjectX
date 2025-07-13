const bcrypt = require('bcryptjs');
const User = require('../models/userSchema'); // ✅ FIXED

exports.signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        console.log("Signup request:", req.body);

        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const profileImage = req.file
            ? `/uploads/${req.file.filename}`
            : 'uploads/default-user.png';

        const user = new User({
            username,
            email,
            password: hashedPassword,
            profileImage,
        });

        await user.save();

        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        console.error("Signup error:", err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        res.status(200).json({ message: 'Login successful' });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
