const Log = require('../models/Log');

// @desc    获取所有日志（管理员）
// @route   GET /api/logs
// @access  Private/Admin
exports.getAllLogs = async (req, res) => {
    try {
        const logs = await Log.find({})
            .populate('user', 'name email')
            .sort({ createdAt: -1 })
            .limit(100); // 限制返回最近100条

        res.json(logs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: '获取日志失败 (Failed to fetch logs)' });
    }
};
