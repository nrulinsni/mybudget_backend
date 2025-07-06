const User = require("../models/User");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
}

// Fungsi Registrasi Versi Simpel
exports.registerUser = async (req, res) => {
    const { fullName, email, password, profileImageUrl } = req.body;
    if (!fullName || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        const existingUser = await User.findOne({ where: { email: email } });
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use." });
        }
        const user = await User.create({ fullName, email, password, profileImageUrl });
        
        // Langsung berikan token setelah daftar
        res.status(201).json({
            id: user.id,
            user: { id: user.id, fullName: user.fullName, email: user.email, profileImageUrl: user.profileImageUrl },
            token: generateToken(user.id),
        });
    } catch (err) {
        res.status(500).json({ message: "Error registering user", error: err.message });
    }
};

// Fungsi Login Versi Simpel
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        const user = await User.findOne({ where: { email: email } });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: "Invalid credentials." });
        }
        // Tidak ada pengecekan status, langsung berikan token
        res.status(200).json({
            id: user.id,
            user: { id: user.id, fullName: user.fullName, email: user.email, profileImageUrl: user.profileImageUrl },
            token: generateToken(user.id),
        });
    } catch (err) {
        res.status(500).json({ message: "Error logging in user", error: err.message });
    }
};

// Get user information
exports.getUserInfo = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] }
        });

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: "Error fetching user info", error: err.message });
    }
};