const express = require('express');
const router = express.Router();
const { addOrderItems, getMyOrders, getAdminStats } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

// @route   POST api/orders
// @desc    创建订单
// @access  Private
router.post('/', protect, addOrderItems);

// @route   GET api/orders/myorders
// @desc    获取当前用户的所有订单
// @access  Private
router.get('/myorders', protect, getMyOrders);

// @route   GET api/orders/admin/stats
// @desc    获取管理员统计数据（总销售额、订单数等）
// @access  Private/Admin (建议添加 admin 权限验证)
router.get('/admin/stats', protect, getAdminStats);

module.exports = router;
