const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Untuk memperbarui nama, email, dan bio
exports.updateProfile = async (req, res) => {
    try {
        const { fullName, email, bio } = req.body;
        const user = await User.findByPk(req.user.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.fullName = fullName || user.fullName;
        user.email = email || user.email;
        // Hanya update bio jika diberikan
        // Ini untuk menghindari menghapus bio jika tidak ada input
        if (bio !== undefined) {
            user.bio = bio;
        }

        await user.save();
        
        const { password, ...userWithoutPassword } = user.toJSON();
        res.status(200).json({ message: "Profile updated successfully", user: userWithoutPassword });

    } catch (error) {
        res.status(500).json({ message: "Error updating profile", error: error.message });
    }
};

// Untuk mengubah password
exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: "All password fields are required." });
        }

        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect current password" });
        }

        // Hash password baru sebelum disimpan
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.status(200).json({ message: "Password changed successfully" });

    } catch (error) {
        res.status(500).json({ message: "Error changing password", error: error.message });
    }
};

// Untuk upload foto profil
exports.uploadProfilePhoto = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }
        
        // Path file yang diunggah oleh multer
        const imageUrl = `/uploads/${req.file.filename}`;
        
        user.profileImageUrl = imageUrl;
        await user.save();

        res.status(200).json({ message: "Profile photo updated", imageUrl });

    } catch (error) {
        res.status(500).json({ message: "Error uploading photo", error: error.message });
    }
};