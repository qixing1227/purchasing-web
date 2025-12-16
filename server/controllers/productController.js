const Product = require('../models/Product');
const { createLog } = require('../utils/logger');

// 获取所有商品 (支持搜索和分页)
exports.getProducts = async (req, res) => {
    try {
        const { keyword, pageNumber, pageSize } = req.query;

        // 搜索条件
        const query = {};
        if (keyword) {
            query.name = { $regex: keyword, $options: 'i' }; // 模糊搜索，不区分大小写
        }

        // 分页参数
        const page = Number(pageNumber) || 1;
        const limit = Number(pageSize) || 8; // 默认每页 8 个
        const skip = (page - 1) * limit;

        const count = await Product.countDocuments(query);
        const products = await Product.find(query)
            .limit(limit)
            .skip(skip);

        res.json({
            products,
            page,
            pages: Math.ceil(count / limit),
            total: count
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('服务器错误 (Server Error)');
    }
};

// 获取单个商品详情（带日志记录）
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ msg: '商品未找到 (Product not found)' });
        }

        // 记录商品查看日志
        // 如果用户已登录，记录用户ID；否则记录为匿名访问
        const userId = req.user ? req.user._id : null;
        await createLog({
            userId,
            action: 'VIEW_PRODUCT',
            targetId: product._id,
            details: {
                productName: product.name,
                anonymous: !userId,
            },
        });

        res.json(product);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: '商品未找到 (Product not found)' });
        }
        res.status(500).send('服务器错误 (Server Error)');
    }
};

// 创建商品 (用于测试或后台管理)
exports.createProduct = async (req, res) => {
    const { name, description, price, stock, imageUrl } = req.body;

    try {
        const newProduct = new Product({
            name,
            description,
            price,
            stock,
            imageUrl,
        });

        const product = await newProduct.save();
        res.json(product);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('服务器错误 (Server Error)');
    }
};

// 删除商品
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ msg: '商品未找到 (Product not found)' });
        }

        await Product.findByIdAndDelete(req.params.id);

        res.json({ msg: '商品已删除 (Product removed)' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: '商品未找到 (Product not found)' });
        }
        res.status(500).send('服务器错误 (Server Error)');
    }
};

// 更新商品
exports.updateProduct = async (req, res) => {
    const { name, description, price, stock, imageUrl } = req.body;

    try {
        let product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ msg: '商品未找到 (Product not found)' });
        }

        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price || product.price;
        product.stock = stock || product.stock;
        product.imageUrl = imageUrl || product.imageUrl;

        await product.save();

        res.json(product);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: '商品未找到 (Product not found)' });
        }
        res.status(500).send('服务器错误 (Server Error)');
    }
};

