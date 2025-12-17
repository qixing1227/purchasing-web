import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { ShoppingCart, ArrowLeft, Star, Truck, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const [totalReviews, setTotalReviews] = useState(0);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();

    // 评价表单
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchProduct();
        fetchReviews();
    }, [id]);

    const fetchProduct = async () => {
        try {
            const res = await api.get(`/products/${id}`);
            setProduct(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            toast.error('获取商品详情失败');
            setLoading(false);
        }
    };

    const fetchReviews = async () => {
        try {
            const res = await api.get(`/products/${id}/reviews`);
            setReviews(res.data.reviews);
            setAverageRating(res.data.averageRating);
            setTotalReviews(res.data.totalReviews);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!token) {
            toast.error('请先登录');
            navigate('/login');
            return;
        }

        setSubmitting(true);
        try {
            await api.post(`/products/${id}/reviews`, { rating, comment });
            toast.success('评价提交成功');
            setRating(5);
            setComment('');
            fetchReviews(); // 刷新评价列表
        } catch (err) {
            toast.error(err.response?.data?.msg || '评价提交失败');
        } finally {
            setSubmitting(false);
        }
    };

    const renderStars = (count) => {
        return Array(5).fill(0).map((_, i) => (
            <Star
                key={i}
                className={`w-4 h-4 ${i < count ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
            />
        ));
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex justify-center items-center">
                <div className="w-6 h-6 border-2 border-gray-200 border-t-black rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <h2 className="text-2xl font-bold mb-4">商品不存在</h2>
                <button onClick={() => navigate('/')} className="text-indigo-600 hover:text-indigo-500">
                    返回首页
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white pt-8 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center text-gray-500 hover:text-black mb-8 transition-colors group"
                >
                    <ArrowLeft className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" />
                    返回商店
                </button>

                <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 lg:items-start">
                    {/* Image Gallery */}
                    <div className="aspect-square rounded-lg bg-gray-100 overflow-hidden">
                        <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover object-center"
                            onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/600x600/f3f4f6/9ca3af?text=No+Image';
                            }}
                        />
                    </div>

                    {/* Product Info */}
                    <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">{product.name}</h1>

                        <div className="mt-3 flex items-center">
                            <div className="flex items-center">
                                {renderStars(Math.round(averageRating))}
                            </div>
                            <p className="ml-3 text-sm text-gray-500">
                                {averageRating > 0 ? averageRating : '暂无'} ({totalReviews} 条评价)
                            </p>
                        </div>

                        <div className="mt-6">
                            <h2 className="sr-only">产品描述</h2>
                            <div className="text-base text-gray-700 space-y-6">
                                <p>{product.description}</p>
                            </div>
                        </div>

                        <div className="mt-8 flex items-center">
                            <p className="text-3xl font-bold text-gray-900">¥{product.price}</p>
                            <span className="ml-4 bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">免运费</span>
                        </div>

                        <div className="mt-4 flex items-center text-sm text-green-600">
                            <Truck className="w-4 h-4 mr-2" />
                            <span>现货，预计 2 天内送达</span>
                        </div>

                        {product.stock < 10 && (
                            <p className="mt-4 text-sm text-red-600 font-medium">
                                仅剩 {product.stock} 件库存 - 欲购从速
                            </p>
                        )}

                        <div className="mt-10 flex w-full">
                            <button
                                onClick={() => addToCart(product)}
                                disabled={product.stock <= 0}
                                className={`flex-1 border border-transparent rounded-full py-4 px-8 flex items-center justify-center text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors ${product.stock <= 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gray-800'}`}
                            >
                                <ShoppingCart className="w-5 h-5 mr-2" />
                                {product.stock <= 0 ? '暂时缺货' : '加入购物车'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* 评价区域 */}
                <div className="mt-16 border-t pt-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                        <MessageCircle className="w-6 h-6 mr-2" />
                        用户评价 ({totalReviews})
                    </h2>

                    {/* 评价表单 */}
                    {token && (
                        <div className="mb-12 bg-gray-50 p-6 rounded-lg">
                            <h3 className="text-lg font-semibold mb-4">发表评价</h3>
                            <form onSubmit={handleSubmitReview}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">评分</label>
                                    <div className="flex items-center space-x-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setRating(star)}
                                                className="focus:outline-none"
                                            >
                                                <Star className={`w-8 h-8 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">评价内容</label>
                                    <textarea
                                        rows="4"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        placeholder="分享您的使用体验..."
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
                                >
                                    {submitting ? '提交中...' : '提交评价'}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* 评价列表 */}
                    {reviews.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">暂无评价，您可以成为第一个评价的用户！</p>
                    ) : (
                        <div className="space-y-6">
                            {reviews.map((review) => (
                                <div key={review._id} className="border-b pb-6">
                                    <div className="flex items-center mb-2">
                                        <div className="flex items-center">
                                            {renderStars(review.rating)}
                                        </div>
                                        <span className="ml-3 font-medium text-gray-900">{review.user.name}</span>
                                        <span className="ml-auto text-sm text-gray-500">
                                            {new Date(review.createdAt).toLocaleDateString('zh-CN')}
                                        </span>
                                    </div>
                                    <p className="text-gray-700">{review.comment}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
