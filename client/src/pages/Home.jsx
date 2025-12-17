import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { Plus, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState(''); // 输入框的值
    const [keyword, setKeyword] = useState(''); // 实际搜索的关键词
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const { addToCart } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
    }, [page, keyword]);

    const fetchProducts = async () => {
        try {
            // 使用 params 对象，axios 会自动处理 URL 编码
            const res = await api.get('/products', {
                params: {
                    keyword: keyword,
                    pageNumber: page,
                    pageSize: 8
                }
            });
            setProducts(res.data.products);
            setPages(res.data.pages);
            setPage(res.data.page);
            setLoading(false);
        } catch (err) {
            console.error(err);
            toast.error('获取商品失败');
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        setKeyword(searchTerm); // 提交时才更新 keyword 触发搜索
    };

    const handleAddToCart = (e, product) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex justify-center items-center">
                <div className="w-6 h-6 border-2 border-gray-200 border-t-black rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white pb-20">
            {/* Header & Search */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
                <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-4">
                    精选好物
                </h1>

                {/* Search Bar */}
                <div className="max-w-xl mx-auto mt-8 relative">
                    <form onSubmit={handleSearch}>
                        <div className="relative flex items-center">
                            <input
                                type="text"
                                placeholder="搜索商品..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                            />
                            <Search className="absolute left-4 w-5 h-5 text-gray-400" />
                            <button hidden type="submit">Search</button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {products.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-gray-500 text-lg">未找到相关商品</p>
                        <button
                            onClick={() => { setSearchTerm(''); setKeyword(''); setPage(1); }}
                            className="mt-4 text-indigo-600 hover:underline"
                        >
                            清除搜索
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
                        {products.map((product) => (
                            <div
                                key={product._id}
                                className="group cursor-pointer"
                                onClick={() => navigate(`/product/${product._id}`)}
                            >
                                {/* Image Container */}
                                <div className="aspect-square w-full overflow-hidden bg-gray-100 rounded-lg relative mb-4">
                                    <img
                                        src={product.imageUrl}
                                        alt={product.name}
                                        className="h-full w-full object-cover object-center group-hover:opacity-90 transition-opacity duration-300"
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/400x400/f3f4f6/9ca3af?text=No+Image';
                                        }}
                                    />
                                    <button
                                        onClick={(e) => handleAddToCart(e, product)}
                                        disabled={product.stock <= 0}
                                        className={`absolute bottom-4 right-4 p-3 rounded-full shadow-lg 
                                                   opacity-100 lg:opacity-0 lg:group-hover:opacity-100 
                                                   transform lg:translate-y-2 lg:group-hover:translate-y-0 
                                                   transition-all duration-300 
                                                   ${product.stock <= 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-black hover:bg-black hover:text-white'}`}
                                        title={product.stock <= 0 ? "暂时缺货" : "加入购物车"}
                                    >
                                        <Plus className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Info */}
                                <div>
                                    <h3 className="text-base font-medium text-gray-900 leading-snug group-hover:underline">
                                        {product.name}
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-500 line-clamp-1">
                                        {product.description}
                                    </p>
                                    <p className="mt-2 text-base font-semibold text-gray-900">
                                        ¥{product.price}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {pages > 1 && (
                    <div className="mt-16 flex justify-center items-center space-x-4">
                        <button
                            onClick={() => setPage(page - 1)}
                            disabled={page === 1}
                            className={`p-2 rounded-full border ${page === 1 ? 'text-gray-300 border-gray-200 cursor-not-allowed' : 'text-gray-600 border-gray-300 hover:border-black hover:text-black'}`}
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <span className="text-gray-600 font-medium">
                            第 {page} / {pages} 页
                        </span>
                        <button
                            onClick={() => setPage(page + 1)}
                            disabled={page === pages}
                            className={`p-2 rounded-full border ${page === pages ? 'text-gray-300 border-gray-200 cursor-not-allowed' : 'text-gray-600 border-gray-300 hover:border-black hover:text-black'}`}
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
