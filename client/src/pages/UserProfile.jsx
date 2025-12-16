import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { User, MapPin, Plus, Trash2, CheckCircle } from 'lucide-react';

const UserProfile = () => {
    const [name, setName] = useState('');
    const [loadEmail, setLoadEmail] = useState(''); // 仅展示，不可修改
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [isUpdatingName, setIsUpdatingName] = useState(false);
    const [isAddingAddress, setIsAddingAddress] = useState(false);

    //临时新地址状态
    const [newAddress, setNewAddress] = useState({
        detail: '',
        city: '',
        country: ''
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await api.get('/users/profile');
            setName(res.data.name);
            setLoadEmail(res.data.email);
            setAddresses(res.data.addresses || []);
            setLoading(false);
        } catch (err) {
            console.error(err);
            toast.error('获取个人信息失败');
            setLoading(false);
        }
    };

    const { updateUser } = useAuth();

    // ...

    const handleUpdateName = async (e) => {
        e.preventDefault();
        if (isUpdatingName) return;
        setIsUpdatingName(true);
        try {
            const res = await api.put('/users/profile', { name });
            // 更新全局状态
            const currentUser = JSON.parse(localStorage.getItem('user'));
            updateUser({ ...currentUser, name: res.data.name });

            toast.success('昵称更新成功');
        } catch (err) {
            toast.error('更名失败');
        } finally {
            setIsUpdatingName(false);
        }
    };

    const handleAddAddress = async () => {
        if (!newAddress.detail || !newAddress.city || !newAddress.country) {
            toast.error('请填写完整地址信息');
            return;
        }
        if (isAddingAddress) return;

        setIsAddingAddress(true);
        const updatedAddresses = [...addresses, newAddress];
        try {
            const res = await api.put('/users/profile', { addresses: updatedAddresses });
            setAddresses(res.data.addresses);
            setShowAddressForm(false);
            setNewAddress({ detail: '', city: '', country: '' });
            toast.success('地址添加成功');
        } catch (err) {
            toast.error('添加地址失败');
        } finally {
            setIsAddingAddress(false);
        }
    };

    const handleDeleteAddress = async (idOfAddressToRemove) => {
        if (!window.confirm('确定删除该地址吗？')) return;
        // Mongo生成的子文档有 _id
        const updatedAddresses = addresses.filter(addr => addr._id !== idOfAddressToRemove);
        try {
            const res = await api.put('/users/profile', { addresses: updatedAddresses });
            setAddresses(res.data.addresses);
            toast.success('地址已删除');
        } catch (err) {
            toast.error('删除地址失败');
        }
    };

    if (loading) return <div className="p-10 text-center">加载中...</div>;

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* 1. 基本信息卡片 */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="bg-indigo-600 px-4 py-5 sm:px-6 flex items-center">
                        <div className="bg-white p-2 rounded-full">
                            <User className="w-6 h-6 text-indigo-600" />
                        </div>
                        <h3 className="ml-3 text-lg font-medium text-white">基本信息</h3>
                    </div>
                    <div className="px-4 py-5 sm:p-6">
                        <form onSubmit={handleUpdateName} className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
                            <div>
                                <label className="block text-sm font-medium text-gray-500">邮箱 (不可修改)</label>
                                <div className="mt-1 p-2 bg-gray-100 rounded-md text-gray-700">
                                    {loadEmail}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">用户昵称</label>
                                <div className="mt-1 flex rounded-md shadow-sm">
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                    <button
                                        type="submit"
                                        disabled={isUpdatingName}
                                        className={`inline-flex items-center px-4 py-2 border border-l-0 border-gray-300 rounded-r-md text-sm ${isUpdatingName ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                                    >
                                        {isUpdatingName ? '保存中...' : '保存'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                {/* 2. 地址管理卡片 */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="bg-green-600 px-4 py-5 sm:px-6 flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="bg-white p-2 rounded-full">
                                <MapPin className="w-6 h-6 text-green-600" />
                            </div>
                            <h3 className="ml-3 text-lg font-medium text-white">收货地址管理</h3>
                        </div>
                        <button
                            onClick={() => setShowAddressForm(!showAddressForm)}
                            className="bg-white text-green-600 px-3 py-1 rounded-full text-sm font-bold shadow hover:bg-gray-100 transition"
                        >
                            {showAddressForm ? '取消' : '新增地址'}
                        </button>
                    </div>

                    <div className="px-4 py-5 sm:p-6">
                        {/* 新增表单 */}
                        {showAddressForm && (
                            <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-green-200 animate-fade-in-down">
                                <h4 className="text-sm font-semibold text-gray-700 mb-3">添加新地址</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <input
                                        type="text"
                                        placeholder="详细地址 (如: 某某大学 5号楼)"
                                        className="col-span-1 md:col-span-2 p-2 border rounded"
                                        value={newAddress.detail}
                                        onChange={e => setNewAddress({ ...newAddress, detail: e.target.value })}
                                    />
                                    <input
                                        type="text"
                                        placeholder="城市"
                                        className="p-2 border rounded"
                                        value={newAddress.city}
                                        onChange={e => setNewAddress({ ...newAddress, city: e.target.value })}
                                    />
                                    <input
                                        type="text"
                                        placeholder="国家"
                                        className="p-2 border rounded"
                                        value={newAddress.country}
                                        onChange={e => setNewAddress({ ...newAddress, country: e.target.value })}
                                    />
                                </div>
                                <div className="mt-4 text-right">
                                    <button
                                        onClick={handleAddAddress}
                                        disabled={isAddingAddress}
                                        className={`px-4 py-2 rounded shadow text-white ${isAddingAddress ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                                    >
                                        {isAddingAddress ? '保存中...' : '保 存'}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* 地址列表 */}
                        {addresses.length === 0 ? (
                            <p className="text-gray-500 text-center py-4">暂无保存的地址，请点击右上角添加。</p>
                        ) : (
                            <ul className="divide-y divide-gray-200">
                                {addresses.map((addr) => (
                                    <li key={addr._id} className="py-4 flex items-center justify-between group">
                                        <div className="flex items-start">
                                            <MapPin className="w-5 h-5 text-gray-400 mt-1 mr-3" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{addr.detail}</p>
                                                <p className="text-sm text-gray-500">{addr.city}, {addr.country}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteAddress(addr._id)}
                                            className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity p-2"
                                            title="删除"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default UserProfile;
