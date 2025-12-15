const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// 加载环境变量
dotenv.config();

const app = express();

// 中间件配置
app.use(cors()); // 允许跨域请求
app.use(express.json()); // 解析 JSON 请求体

// 数据库连接
const startServer = async () => {
    try {
        // 读取环境变量中的数据库连接字符串
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            throw new Error('未找到 MONGO_URI 环境变量，请检查 .env 文件');
        }

        await mongoose.connect(mongoUri);
        console.log('MongoDB 连接成功 (MongoDB Connected)');

        // 启动服务器
        const PORT = process.env.PORT || 5000;
        if (process.env.NODE_ENV !== 'production') {
            app.listen(PORT, () => {
                console.log(`服务器运行在端口 ${PORT} (Server running on port ${PORT})`);
            });
        }
    } catch (error) {
        console.error('数据库连接失败 (Database connection error):', error.message);
        process.exit(1);
    }
};

// 路由定义
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/logs', require('./routes/logRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// 测试路由
app.get('/', (req, res) => {
    res.send('API is running... (API 正在运行)');
});

// 启动应用
startServer();

module.exports = app;
