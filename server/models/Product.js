const mongoose = require('mongoose');

// 商品模型 Schema
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true, // 商品名称必填
    },
    description: {
        type: String,
        required: true, // 商品描述必填
    },
    price: {
        type: Number,
        required: true, // 价格必填
    },
    stock: {
        type: Number,
        required: true, // 库存必填
    },
    imageUrl: {
        type: String,
        required: true, // 图片链接必填
    },
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
