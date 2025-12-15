import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Package, Truck, CheckCircle, XCircle } from 'lucide-react';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await api.get('/orders/myorders');
            setOrders(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            toast.error('获取订单失败');
            setLoading(false);
        }
    };

    const getStatusIcon = (isPaid, isDelivered) => {
        if (isDelivered) return <CheckCircle className="w-5 h-5 text-green-500" />;
        if (isPaid) return <Truck className="w-5 h-5 text-blue-500" />;
        return <Package className="w-5 h-5 text-gray-400" />;
    };

    const getStatusText = (isPaid, isDelivered) => {
        if (isDelivered) return '已送达';
        if (isPaid) return '配送中';
        return '待支付';
    };

    if (loading) {
        return <div className="text-center mt-10">加载订单中...</div>;
    }

    if (orders.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh]">
                <Package className="w-16 h-16 text-gray-300 mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">暂无订单</h2>
                <p className="text-gray-500 mb-6">您还没有下过订单</p>
                <button
                    onClick={() => navigate('/')}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                    去购物
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">我的订单</h1>

            <div className="space-y-6">
                {orders.map((order) => (
                    <div key={order._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                        {/* 订单头部 */}
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-4">
                                    {getStatusIcon(order.isPaid, order.isDelivered)}
                                    <div>
                                        <p className="text-sm text-gray-500">订单号: {order._id}</p>
                                        <p className="text-xs text-gray-400">
                                            下单时间: {new Date(order.createdAt).toLocaleString('zh-CN')}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${order.isDelivered
                                            ? 'bg-green-100 text-green-800'
                                            : order.isPaid
                                                ? 'bg-blue-100 text-blue-800'
                                                : 'bg-gray-100 text-gray-800'
                                        }`}>
                                        {getStatusText(order.isPaid, order.isDelivered)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* 订单商品列表 */}
                        <div className="p-6">
                            <div className="space-y-4">
                                {order.orderItems.map((item, index) => (
                                    <div key={index} className="flex items-center space-x-4">
                                        <img
                                            src={item.image || item.imageUrl}
                                            alt={item.name}
                                            className="w-16 h-16 object-cover rounded-md"
                                            onError={(e) => { e.target.src = 'https://via.placeholder.com/150' }}
                                        />
                                        <div className="flex-1">
                                            <h3 className="font-medium text-gray-900">{item.name}</h3>
                                            <p className="text-sm text-gray-500">数量: {item.quantity}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium text-gray-900">¥{item.price}</p>
                                            <p className="text-sm text-gray-500">小计: ¥{item.price * item.quantity}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* 订单总价 */}
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <div className="flex justify-between items-center">
                                    <div className="text-sm text-gray-600">
                                        <p>收货地址: {order.shippingAddress.address}, {order.shippingAddress.city}</p>
                                        <p>支付方式: {order.paymentMethod}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-600">订单总额</p>
                                        <p className="text-2xl font-bold text-indigo-600">¥{order.totalPrice}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyOrders;
