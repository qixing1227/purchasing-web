const Review = require('../models/Review');
const Product = require('../models/Product');
const { createLog } = require('../utils/logger');

// 创建评价
exports.createReview = async (req, res) => {

    const { rating, comment } = req.body;
    const productId = req.params.id;

    try {
        // 检查商品是否存在
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ msg: '商品不存在' });
        }

        // 检查用户是否已评价过该商品
        const existingReview = await Review.findOne({
            user: req.user._id,
            product: productId,
        });

        if (existingReview) {
            return res.status(400).json({ msg: '您已评价过该商品' });
        }

        // 创建新评价
        const review = await Review.create({
            user: req.user._id,
            product: productId,
            rating,
            comment,
        });

        // 记录评价日志
        await createLog({
            userId: req.user._id,
            action: 'CREATE_REVIEW',
            targetId: review._id,
            details: {
                productName: product.name,
                rating,
            },
        });

        res.status(201).json(review);
    } catch (err) {

        console.error(err.message);
        res.status(500).send('服务器错误');
    }
};

// 获取某商品的所有评价
exports.getProductReviews = async (req, res) => {
    const productId = req.params.id;

    try {
        const reviews = await Review.find({ product: productId })
            .populate('user', 'name')
            .sort({ createdAt: -1 });

        // 计算平均评分
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : 0;

        res.json({
            reviews,
            averageRating: parseFloat(averageRating),
            totalReviews: reviews.length,
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('服务器错误');
    }
};
