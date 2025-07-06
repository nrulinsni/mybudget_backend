
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Kita gunakan nama 'protect' sesuai kodemu, tapi dengan logika Sequelize
exports.protect = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }

    try {
        const token = authHeader.split(' ')[1];
        // Verifikasi token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Cukup lampirkan id-nya ke object request
        req.user = { id: decoded.id }; 
        
        next(); // Lanjutkan ke controller
    } catch (error) {
        res.status(401).json({ message: 'Not authorized, token failed' });
    }
};