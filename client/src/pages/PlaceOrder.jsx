import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { MapPin } from 'lucide-react';

const PlaceOrder = () => {
    const { cartItems, cartTotal, clearCart } = useCart();
    const navigate = useNavigate();

    // 两个状态：一个是保存的地址列表，一个是当前选中的/填写的地址
    const [savedAddresses, setSavedAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState('new'); // 'new' or addressId

    // 手填的地址 state
    const [manualAddress, setManualAddress] = useState({
        address: '',
        city: '',
        country: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false); // Prevent double submit

    useEffect(() => {
        if (cartItems.length === 0) {
            navigate('/');
        } else {
            fetchSavedAddresses();
        }
    }, [cartItems, navigate]);

    const fetchSavedAddresses = async () => {
        try {
            const res = await api.get('/users/profile');
            if (res.data.addresses && res.data.addresses.length > 0) {
                setSavedAddresses(res.data.addresses);
                // 默认选中第一个
                setSelectedAddressId(res.data.addresses[0]._id);
            }
        } catch (err) {
            console.log('无法加载保存的地址，使用手动输入');
        }
    };

    const handleInputChange = (e) => {
        setManualAddress({ ...manualAddress, [e.target.name]: e.target.value });
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();

        if (isSubmitting) return;

        // 确定最终使用的地址
        let finalAddress = {};

        if (selectedAddressId === 'new') {
            // 使用手动填写的
            if (!manualAddress.address || !manualAddress.city || !manualAddress.country) {
                toast.error('请填写完整的收货地址');
                return;
            }
            finalAddress = manualAddress;
        } else {
            // 使用已保存的
            const addr = savedAddresses.find(a => a._id === selectedAddressId);
            if (!addr) return;
            // 转换格式适配后端 Order schema (后端 Order schema 需要 address, city, country)
            // 我们的 User schema 存的是 detail, city, country
            finalAddress = {
                address: addr.detail,
                city: addr.city,
                country: addr.country
            };
        }

        setIsSubmitting(true);

        try {
            const orderData = {
                orderItems: cartItems.map(item => ({
                    product: item._id,
                    name: item.name,
                    quantity: item.quantity,
                    image: item.imageUrl || '',
                    price: item.price
                })),
                shippingAddress: finalAddress, // 不再包含 postalCode
                paymentMethod: 'Alipay',
                totalPrice: cartTotal,
            };

            await api.post('/orders', orderData);

            toast.success('支付成功，邮件已发送！', { duration: 4000 });
            clearCart();
            navigate('/');
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.msg || '下单失败');
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">确认订单</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* 左侧：地址选择 */}
                <div>
                    <h2 className="text-xl font-semibold mb-6 flex items-center">
                        <MapPin className="w-5 h-5 mr-2" />
                        收货地址
                    </h2>

                    {savedAddresses.length > 0 && (
                        <div className="space-y-4 mb-6">
                            <p className="text-sm text-gray-500 mb-2">选择常用地址：</p>
                            {savedAddresses.map(addr => (
                                <div
                                    key={addr._id}
                                    onClick={() => setSelectedAddressId(addr._id)}
                                    className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedAddressId === addr._id ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600' : 'border-gray-200 hover:border-gray-300'}`}
                                >
                                    <div className="flex items-center">
                                        <div className={`w-4 h-4 rounded-full border mr-3 flex items-center justify-center ${selectedAddressId === addr._id ? 'border-indigo-600 bg-indigo-600' : 'border-gray-400'}`}>
                                            {selectedAddressId === addr._id && <div className="w-2 h-2 bg-white rounded-full"></div>}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{addr.detail}</p>
                                            <p className="text-sm text-gray-500">{addr.city}, {addr.country}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* 使用新地址选项 */}
                            <div
                                onClick={() => setSelectedAddressId('new')}
                                className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedAddressId === 'new' ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600' : 'border-gray-200 hover:border-gray-300'}`}
                            >
                                <div className="flex items-center">
                                    <div className={`w-4 h-4 rounded-full border mr-3 flex items-center justify-center ${selectedAddressId === 'new' ? 'border-indigo-600 bg-indigo-600' : 'border-gray-400'}`}>
                                        {selectedAddressId === 'new' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                                    </div>
                                    <p className="font-medium text-gray-900">使用新地址</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 手填表单 (仅当选中 'new' 或没有保存地址时显示) */}
                    {(selectedAddressId === 'new' || savedAddresses.length === 0) && (
                        <form id="order-form" onSubmit={handlePlaceOrder} className="space-y-4 bg-gray-50 p-4 rounded-lg animate-fade-in-down">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">详细地址</label>
                                <input
                                    type="text"
                                    name="address"
                                    placeholder="街道/学校/小区"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    value={manualAddress.address}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">城市</label>
                                    <input
                                        type="text"
                                        name="city"
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        value={manualAddress.city}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">国家</label>
                                    <input
                                        type="text"
                                        name="country"
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        value={manualAddress.country}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                        </form>
                    )}

                    <button
                        onClick={handlePlaceOrder}
                        disabled={isSubmitting}
                        className={`w-full mt-8 border border-transparent rounded-full shadow-sm py-4 px-4 text-lg font-bold text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gray-800'}`}
                    >
                        {isSubmitting ? '正在处理...' : `确认支付 ¥${cartTotal}`}
                    </button>

                </div>

                {/* 右侧：订单摘要 */}
                <div className="bg-gray-50 p-8 rounded-2xl h-fit">
                    <h2 className="text-xl font-semibold mb-6">订单摘要</h2>
                    <ul className="divide-y divide-gray-200">
                        {cartItems.map((item) => (
                            <li key={item._id} className="py-4 flex space-x-4">
                                <img
                                    src={item.imageUrl}
                                    alt={item.name}
                                    className="h-20 w-20 object-cover rounded-md border border-gray-200 bg-white"
                                />
                                <div className="flex-1">
                                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                                    <p className="text-sm text-gray-500 mt-1">x {item.quantity}</p>
                                </div>
                                <p className="font-medium text-gray-900">¥{item.price * item.quantity}</p>
                            </li>
                        ))}
                    </ul>
                    <div className="border-t border-gray-200 mt-6 pt-6">
                        <div className="flex justify-between text-lg font-bold text-gray-900">
                            <p>总计</p>
                            <p>¥{cartTotal}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlaceOrder;
