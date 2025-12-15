const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/products/:id/reviews
// @desc    创建商品评价
// @access  Private
router.post('/:id/reviews', protect, reviewController.createReview);

// @route   GET /api/products/:id/reviews
// @desc    获取商品所有评价
// @access  Public
router.get('/:id/reviews', reviewController.getProductReviews);

module.exports = router;
