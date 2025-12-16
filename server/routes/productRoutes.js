const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const reviewController = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

// 商品相关路由
router.get('/', productController.getProducts);
router.post('/', productController.createProduct);
router.get('/:id', productController.getProductById);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);


// 评价相关路由
router.post('/:id/reviews', protect, reviewController.createReview);
router.get('/:id/reviews', reviewController.getProductReviews);

module.exports = router;
