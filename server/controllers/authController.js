const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');

// 注册用户 (第一步：发送验证码)
exports.register = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // 检查用户是否已存在
        let user = await User.findOne({ email });

        if (user && user.isVerified) {
            return res.status(400).json({ msg: '该邮箱已被注册 (User already exists)' });
        }

        // 生成 6 位随机验证码
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        // 有效期 10 分钟
        const verificationCodeExpires = Date.now() + 10 * 60 * 1000;

        // 如果用户存在但未验证，则更新信息（覆盖旧注册尝试）
        if (user && !user.isVerified) {
            user.name = name;
            user.password = password; // 下面会重新加密
            user.verificationCode = verificationCode;
            user.verificationCodeExpires = verificationCodeExpires;
        } else {
            // 创建新用户实例
            user = new User({
                name,
                email,
                password,
                verificationCode,
                verificationCodeExpires,
            });
        }

        // 加密密码
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // 保存到数据库
        await user.save();

        // 发送验证邮件
        try {
            const message = `您的注册验证码是: ${verificationCode}\n有效期 10 分钟。`;
            await sendEmail({
                email: user.email,
                subject: '账号注册验证码',
                message,
            });

            res.json({ msg: '验证码已发送，请检查邮箱 (Verification code sent)' });
        } catch (emailErr) {
            console.error('邮件发送失败', emailErr);
            // 如果邮件发不出去，可能需要回滚用户创建，或者保留让用户重试
            // 这里简单处理：让用户重试
            return res.status(500).json({ msg: '验证码发送失败，请检查邮箱地址是否正确' });
        }

    } catch (err) {
        console.error(err.message);
        res.status(500).send('服务器错误 (Server Error)');
    }
};

// 验证邮箱 (第二步：提交验证码)
exports.verifyEmail = async (req, res) => {
    const { email, code } = req.body;

    try {
        const user = await User.findOne({
            email,
            verificationCode: code,
            verificationCodeExpires: { $gt: Date.now() } // 检查是否过期
        });

        if (!user) {
            return res.status(400).json({ msg: '验证码无效或已过期 (Invalid or expired code)' });
        }

        // 验证成功
        user.isVerified = true;
        user.verificationCode = undefined;
        user.verificationCodeExpires = undefined;
        await user.save();

        // 自动登录：生成 Token
        const payload = {
            user: {
                id: user.id,
            },
        };

        const jwtSecret = process.env.JWT_SECRET || 'mysecrettoken';

        jwt.sign(
            payload,
            jwtSecret,
            { expiresIn: '5d' },
            (err, token) => {
                if (err) throw err;
                res.json({
                    token,
                    user: { id: user.id, name: user.name, email: user.email, role: user.role },
                    msg: '注册成功！'
                });
            }
        );

    } catch (err) {
        console.error(err.message);
        res.status(500).send('服务器错误');
    }
};

// 用户登录
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 检查用户是否存在
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: '用户不存在 (Invalid Credentials)' });
        }

        // 检查是否已验证
        if (!user.isVerified) {
            return res.status(400).json({ msg: '请先验证您的邮箱 (Please verify your email first)' });
        }

        // 验证密码
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: '密码错误 (Invalid Credentials)' });
        }

        // 生成 JWT Token
        const payload = {
            user: {
                id: user.id,
            },
        };

        const jwtSecret = process.env.JWT_SECRET || 'mysecrettoken';

        jwt.sign(
            payload,
            jwtSecret,
            { expiresIn: '5d' },
            (err, token) => {
                if (err) throw err;
                res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('服务器错误 (Server Error)');
    }
};
