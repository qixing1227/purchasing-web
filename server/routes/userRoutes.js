const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/users/profile
// @desc    获取当前用户个人信息
// @access  Private
router.get('/profile', protect, userController.getUserProfile);

// @route   PUT /api/users/profile
// @desc    更新个人信息
// @access  Private
router.put('/profile', protect, userController.updateUserProfile);

module.exports = router;
