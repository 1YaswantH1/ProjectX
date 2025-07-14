const bcrypt = require('bcryptjs');
const User = require('../models/userSchema');

exports.signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const profileImage = req.file
            ? `/uploads/${req.file.filename}`
            : '/uploads/default-user.png';

        const user = new User({
            username,
            email,
            password: hashedPassword,
            profileImage,
        });

        await user.save();

        res.status(201).json({
            message: 'User created successfully',
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage,
            }
        });
    } catch (err) {
        console.error("Signup error:", err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        req.session.user = {
            username: user.username,
            profileImage: user.profileImage,
            email: user.email
        };

        res.status(200).json({
            message: 'Login successful',
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage,
            }
        });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.logout = (req, res) => {
    res.clearCookie("token"); // optional
    req.session?.destroy();
    res.status(200).json({ message: "Logout successful" });
};
