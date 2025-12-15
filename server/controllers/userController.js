const User = require('../models/User');
const bcrypt = require('bcryptjs');

// 获取个人信息
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (!user) {
            return res.status(404).json({ msg: '用户不存在' });
        }
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('服务器错误');
    }
};

// 更新个人信息 (仅限修改昵称和管理地址)
exports.updateUserProfile = async (req, res) => {
    const { name, addresses } = req.body;

    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ msg: '用户不存在' });
        }

        if (name) user.name = name;

        // 如果前端传了地址列表，则直接更新整个地址列表
        if (addresses) {
            user.addresses = addresses;
        }

        await user.save();

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            addresses: user.addresses,
            msg: '更新成功'
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('服务器错误');
    }
};
