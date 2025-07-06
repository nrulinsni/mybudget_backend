const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware'); 

// Semua rute di bawah ini dilindungi oleh middleware 'protect'
router.use(protect);

// Rute untuk update profile (nama, email, bio)
router.put('/profile', userController.updateProfile);

// Rute untuk ganti password
router.post('/change-password', userController.changePassword);

// Rute untuk upload foto, menggunakan middleware 'upload.single('photo')'
router.post('/upload-photo', upload.single('photo'), userController.uploadProfilePhoto);

module.exports = router;