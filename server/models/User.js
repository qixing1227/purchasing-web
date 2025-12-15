const mongoose = require('mongoose');

// 用户模型 Schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true, // 必填
    },
    email: {
        type: String,
        required: true,
        unique: true, // 邮箱唯一
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['customer', 'admin'], // 角色只能是顾客或管理员
        default: 'customer', // 默认为顾客
    },
    date: {
        type: Date,
        default: Date.now, // 创建时间，默认为当前时间
    },
    addresses: [{
        detail: String,
        city: String,
        country: String,
        isDefault: { type: Boolean, default: false }
    }],
    isVerified: {
        type: Boolean,
        default: false,
    },
    verificationCode: String,
    verificationCodeExpires: Date,
});

const User = mongoose.model('User', userSchema);

module.exports = User;
