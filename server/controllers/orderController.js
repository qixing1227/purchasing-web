const Order = require('../models/Order');
const sendEmail = require('../utils/sendEmail');
const { createLog } = require('../utils/logger');

// @desc    创建新订单
// @route   POST /api/orders
// @access  Private
exports.addOrderItems = async (req, res) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        totalPrice,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
        return res.status(400).json({ msg: '购物车为空 (No order items)' });
    } else {
        try {
            const order = new Order({
                orderItems,
                user: req.user._id,
                shippingAddress,
                paymentMethod,
                totalPrice,
                isPaid: true, // 模拟支付成功
                paidAt: Date.now(),
            });

            const createdOrder = await order.save();

            // 记录下单日志
            await createLog({
                userId: req.user._id,
                action: 'PLACE_ORDER',
                targetId: createdOrder._id,
                details: {
                    totalPrice,
                    itemCount: orderItems.length,
                },
            });

            // 发送确认邮件
            const emailText = `
亲爱的 ${req.user.name},

感谢您在 E-Shop 购物！
您的订单号是: ${createdOrder._id}
订单总额: ¥${totalPrice}

我们将尽快为您发货。

祝您生活愉快！
E-Shop Team
`;

            console.log('准备发送邮件到:', req.user.email);
            try {
                await sendEmail({
                    email: req.user.email,
                    subject: '订单确认 - E-Shop',
                    text: emailText,
                });
                console.log('✅ 邮件发送成功到:', req.user.email);
            } catch (emailError) {
                console.error('❌ 邮件发送失败:', emailError.message);
                console.error('完整错误:', emailError);
            }

            res.status(201).json(createdOrder);
        } catch (error) {
            console.error(error);
            res.status(500).json({ msg: '创建订单失败 (Order creation failed)' });
        }
    }
};

// @desc    获取当前用户的所有订单
// @route   GET /api/orders/myorders
// @access  Private
exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: '获取订单失败 (Failed to fetch orders)' });
    }
};

// @desc    获取管理员统计数据
// @route   GET /api/orders/admin/stats
// @access  Private/Admin
exports.getAdminStats = async (req, res) => {
    try {
        // 计算订单总数
        const totalOrders = await Order.countDocuments();

        // 计算总销售额
        const salesData = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    totalSales: { $sum: '$totalPrice' },
                },
            },
        ]);

        const totalSales = salesData.length > 0 ? salesData[0].totalSales : 0;

        // 计算已支付订单数
        const paidOrders = await Order.countDocuments({ isPaid: true });

        res.json({
            totalOrders,
            totalSales,
            paidOrders,
            averageOrderValue: totalOrders > 0 ? (totalSales / totalOrders).toFixed(2) : 0,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: '获取统计数据失败 (Failed to fetch stats)' });
    }
};
