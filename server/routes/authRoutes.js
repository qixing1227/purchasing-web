const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// @route   POST api/auth/register
// @desc    注册用户
// @access  Public
router.post('/register', authController.register);

// @route   POST api/auth/login
// @desc    用户登录 & 获取 Token
// @access  Public
router.post('/login', authController.login);

// @route   POST api/auth/verify
// @desc    验证邮箱验证码
// @access  Public
router.post('/verify', authController.verifyEmail);

module.exports = router;
