import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { Mail, User, Lock, ArrowRight, CheckCircle } from 'lucide-react';

const Register = () => {
    const [step, setStep] = useState(1); // 1: 填写信息, 2: 验证码
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        code: '',
    });
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const { name, email, password, code } = formData;

    const onChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    // 第一步：提交注册信息，发送验证码
    const onRegisterSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/auth/register', { name, email, password });
            toast.success('验证码已发送至您的邮箱！');
            setStep(2);
        } catch (err) {
            console.error(err.response?.data);
            const errorMsg = err.response?.data?.msg || '发送验证码失败';
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };


    // 第二步：提交验证码
    const onVerifySubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/auth/verify', { email, code });

            // 使用 Context 更新全局状态
            login(res.data.user, res.data.token);

            toast.success('注册成功！');
            navigate('/'); // 跳转首页
        } catch (err) {
            console.error(err.response?.data);
            const errorMsg = err.response?.data?.msg || '验证失败';
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg transition-all duration-300">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        {step === 1 ? '创建新账户' : '验证邮箱'}
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        {step === 1 ? (
                            <>
                                或者{' '}
                                <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                                    登录现有账户
                                </Link>
                            </>
                        ) : (
                            <span>请输入大家发送到 <strong>{email}</strong> 的验证码</span>
                        )}
                    </p>
                </div>

                {step === 1 ? (
                    <form className="mt-8 space-y-6" onSubmit={onRegisterSubmit}>
                        <div className="rounded-md shadow-sm -space-y-px">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    name="name"
                                    type="text"
                                    required
                                    className="appearance-none rounded-none relative block w-full pl-10 px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="用户名"
                                    value={name}
                                    onChange={onChange}
                                />
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    className="appearance-none rounded-none relative block w-full pl-10 px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="邮箱地址"
                                    value={email}
                                    onChange={onChange}
                                />
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    className="appearance-none rounded-none relative block w-full pl-10 px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="密码"
                                    value={password}
                                    onChange={onChange}
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out disabled:opacity-70"
                            >
                                {loading ? '发送中...' : '下一步'}
                                {!loading && <ArrowRight className="ml-2 w-4 h-4" />}
                            </button>
                        </div>
                    </form>
                ) : (
                    <form className="mt-8 space-y-6" onSubmit={onVerifySubmit}>
                        <div className="rounded-md shadow-sm">
                            <div>
                                <label htmlFor="code" className="sr-only">验证码</label>
                                <input
                                    id="code"
                                    name="code"
                                    type="text"
                                    required
                                    maxLength="6"
                                    className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 text-center text-xl tracking-widest"
                                    placeholder="6位验证码"
                                    value={code}
                                    onChange={onChange}
                                />
                            </div>
                        </div>

                        <div className="flex space-x-4">
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="w-1/3 py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                返回
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-2/3 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-70"
                            >
                                {loading ? '验证中...' : '完成注册'}
                                {!loading && <CheckCircle className="ml-2 w-4 h-4" />}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Register;
