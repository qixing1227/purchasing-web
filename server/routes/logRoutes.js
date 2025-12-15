const express = require('express');
const router = express.Router();
const { getAllLogs } = require('../controllers/logController');
const { protect } = require('../middleware/authMiddleware');

// @route   GET api/logs
// @desc    获取所有日志（管理员）
// @access  Private/Admin
router.get('/', protect, getAllLogs);

module.exports = router;
