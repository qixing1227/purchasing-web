const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mysecrettoken');

            req.user = await User.findById(decoded.user.id).select('-password');

            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ msg: '未授权，Token 失败 (Not authorized, token failed)' });
        }
    }

    if (!token) {
        res.status(401).json({ msg: '未授权，没有 Token (Not authorized, no token)' });
    }
};

module.exports = { protect };
