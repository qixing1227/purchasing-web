import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Trash2, Plus, X, BarChart3, Activity, ShoppingBag, DollarSign, Edit } from 'lucide-react';

const Admin = () => {
    const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'products', 'logs'
    const [products, setProducts] = useState([]);
    const [stats, setStats] = useState(null);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        imageUrl: '',
    });
    const [editingProduct, setEditingProduct] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();


    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || user.role !== 'admin') {
            toast.error('您没有权限访问此页面 (Access Denied)');
            navigate('/');
            return;
        }

        fetchInitialData();
    }, [navigate]);

    const fetchInitialData = async () => {
        await Promise.all([fetchProducts(), fetchStats(), fetchLogs()]);
        setLoading(false);
    };

    const fetchProducts = async () => {
        try {
            // 后端 getProducts 现在返回 { products: [...], page, pages, total }
            // Admin 页面为了简单，暂时不加搜索分页，或者我们可以把 limit 设大一点
            // 这里为了兼容，我们需要取 res.data.products
            const res = await api.get('/products?pageSize=100'); // 获取前100个用于管理
            setProducts(res.data.products || []);
        } catch (err) {
            console.error(err);
            toast.error('获取商品列表失败');
        }
    };

    const fetchStats = async () => {
        try {
            const res = await api.get('/orders/admin/stats');
            setStats(res.data);
        } catch (err) {
            console.error(err);
            toast.error('获取统计数据失败');
        }
    };

    const fetchLogs = async () => {
        try {
            const res = await api.get('/logs');
            setLogs(res.data);
        } catch (err) {
            console.error(err);
            toast.error('获取日志失败');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('确定要删除这个商品吗？')) return;
        try {
            await api.delete(`/products/${id}`);
            toast.success('商品已删除');
            setProducts(products.filter((product) => product._id !== id));
        } catch (err) {
            console.error(err);
            toast.error('删除失败');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock,
            imageUrl: product.imageUrl,
        });
        setShowAddForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);
        try {
            if (editingProduct) {
                await api.put(`/products/${editingProduct._id}`, formData);
                toast.success('商品更新成功');
            } else {
                await api.post('/products', formData);
                toast.success('商品添加成功');
            }
            setShowAddForm(false);
            setEditingProduct(null);
            setFormData({ name: '', description: '', price: '', stock: '', imageUrl: '' });
            fetchProducts();
        } catch (err) {
            console.error(err);
            toast.error(editingProduct ? '更新失败' : '添加失败');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return <div className="text-center mt-10">加载中...</div>;
    }

    return (
        <div className="flex h-screen bg-gray-100">
            {/* 侧边栏 */}
            <div className="w-64 bg-white shadow-md">
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-800">管理后台</h2>
                </div>
                <nav className="mt-6">
                    <button
                        onClick={() => setActiveTab('dashboard')}
                        className={`w-full flex items-center px-6 py-3 ${activeTab === 'dashboard'
                            ? 'bg-indigo-50 text-indigo-700 border-r-4 border-indigo-500'
                            : 'text-gray-600 hover:bg-gray-50'
                            } transition-colors`}
                    >
                        <BarChart3 className="w-5 h-5 mr-3" />
                        仪表盘
                    </button>
                    <button
                        onClick={() => setActiveTab('products')}
                        className={`w-full flex items-center px-6 py-3 ${activeTab === 'products'
                            ? 'bg-indigo-50 text-indigo-700 border-r-4 border-indigo-500'
                            : 'text-gray-600 hover:bg-gray-50'
                            } transition-colors`}
                    >
                        <ShoppingBag className="w-5 h-5 mr-3" />
                        商品管理
                    </button>
                    <button
                        onClick={() => setActiveTab('logs')}
                        className={`w-full flex items-center px-6 py-3 ${activeTab === 'logs'
                            ? 'bg-indigo-50 text-indigo-700 border-r-4 border-indigo-500'
                            : 'text-gray-600 hover:bg-gray-50'
                            } transition-colors`}
                    >
                        <Activity className="w-5 h-5 mr-3" />
                        系统日志
                    </button>
                </nav>
            </div>

            {/* 主要内容区域 */}
            <div className="flex-1 overflow-y-auto">
                <div className="container mx-auto px-6 py-8">
                    {/* 仪表盘 */}
                    {activeTab === 'dashboard' && stats && (
                        <div>
                            <h3 className="text-3xl font-bold text-gray-700 mb-8">数据概览</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="bg-white rounded-lg shadow p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-gray-500 text-sm">订单总数</p>
                                            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalOrders}</p>
                                        </div>
                                        <div className="bg-blue-100 p-3 rounded-full">
                                            <ShoppingBag className="w-8 h-8 text-blue-600" />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-lg shadow p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-gray-500 text-sm">总销售额</p>
                                            <p className="text-3xl font-bold text-gray-900 mt-2">¥{stats.totalSales}</p>
                                        </div>
                                        <div className="bg-green-100 p-3 rounded-full">
                                            <DollarSign className="w-8 h-8 text-green-600" />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-lg shadow p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-gray-500 text-sm">已支付订单</p>
                                            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.paidOrders}</p>
                                        </div>
                                        <div className="bg-purple-100 p-3 rounded-full">
                                            <BarChart3 className="w-8 h-8 text-purple-600" />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-lg shadow p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-gray-500 text-sm">平均订单额</p>
                                            <p className="text-3xl font-bold text-gray-900 mt-2">¥{stats.averageOrderValue}</p>
                                        </div>
                                        <div className="bg-yellow-100 p-3 rounded-full">
                                            <Activity className="w-8 h-8 text-yellow-600" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 商品管理 */}
                    {activeTab === 'products' && (
                        <div>
                            <div className="flex justify-between items-center pb-6 border-b border-gray-200">
                                <h3 className="text-3xl font-medium text-gray-700">商品列表</h3>
                                <button
                                    onClick={() => setShowAddForm(true)}
                                    className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                                >
                                    <Plus className="w-5 h-5 mr-2" />
                                    添加新商品
                                </button>
                            </div>

                            {showAddForm && (
                                <div className="mt-6 p-6 bg-white rounded-lg shadow-md relative">
                                    <button onClick={() => { setShowAddForm(false); setEditingProduct(null); setFormData({ name: '', description: '', price: '', stock: '', imageUrl: '' }); }} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                                        <X className="w-6 h-6" />
                                    </button>
                                    <h4 className="text-lg font-semibold mb-4">{editingProduct ? '编辑商品' : '添加新商品'}</h4>
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <input type="text" name="name" placeholder="商品名称" value={formData.name} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
                                            <input type="number" name="price" placeholder="价格" value={formData.price} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
                                            <input type="number" name="stock" placeholder="库存" value={formData.stock} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
                                            <input type="text" name="imageUrl" placeholder="图片链接" value={formData.imageUrl} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
                                        </div>
                                        <textarea name="description" placeholder="商品描述" value={formData.description} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 h-24" required />
                                        <div className="flex justify-end space-x-3">
                                            <button type="button" onClick={() => { setShowAddForm(false); setEditingProduct(null); setFormData({ name: '', description: '', price: '', stock: '', imageUrl: '' }); }} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">取消</button>
                                            <button type="submit" disabled={isSubmitting} className={`px-4 py-2 rounded-md text-white ${isSubmitting ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}>{isSubmitting ? '提交中...' : '提交'}</button>
                                        </div>
                                    </form>
                                </div>
                            )}


                            <div className="mt-8 bg-white shadow rounded-lg overflow-hidden">
                                <table className="min-w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">商品</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">价格</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">库存</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">描述</th>
                                            <th className="px-6 py-3"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {products.map((product) => (
                                            <tr key={product._id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <img className="h-10 w-10 rounded-full object-cover" src={product.imageUrl} alt="" onError={(e) => { e.target.src = 'https://via.placeholder.com/150' }} />
                                                        <div className="ml-4 text-sm font-medium text-gray-900">{product.name}</div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">¥{product.price}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{product.stock}</span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500 truncate max-w-xs">{product.description}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button onClick={() => handleEdit(product)} className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 p-2 rounded-full hover:bg-indigo-100 mr-2">
                                                        <Edit className="w-5 h-5" />
                                                    </button>
                                                    <button onClick={() => handleDelete(product._id)} className="text-red-600 hover:text-red-900 bg-red-50 p-2 rounded-full hover:bg-red-100">
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </td>

                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* 系统日志 */}
                    {activeTab === 'logs' && (
                        <div>
                            <h3 className="text-3xl font-bold text-gray-700 mb-8">系统操作日志</h3>
                            <div className="bg-white shadow rounded-lg overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">时间</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">用户</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">详情</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {logs.map((log) => (
                                            <tr key={log._id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(log.createdAt).toLocaleString('zh-CN')}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {log.user ? log.user.name : '匿名用户'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${log.action === 'PLACE_ORDER' ? 'bg-green-100 text-green-800' :
                                                        log.action === 'VIEW_PRODUCT' ? 'bg-blue-100 text-blue-800' :
                                                            'bg-gray-100 text-gray-800'
                                                        }`}>
                                                        {log.action}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">
                                                    {log.details && typeof log.details === 'object' ? JSON.stringify(log.details) : '-'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Admin;
