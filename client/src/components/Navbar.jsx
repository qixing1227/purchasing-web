import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, LogOut, Package, User } from 'lucide-react';

const Navbar = () => {
    const { cartCount } = useCart();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        toast.success('已退出登录');
        window.location.href = '/login';
    };

    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <div className="bg-black text-white p-1.5 rounded-md">
                            <ShoppingCart className="h-5 w-5" />
                        </div>
                        <span className="text-xl font-bold text-gray-900 tracking-tight">
                            E-Shop
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link
                            to="/"
                            className="text-gray-600 hover:text-black text-sm font-medium transition-colors"
                        >
                            商店
                        </Link>

                        {user && (
                            <Link
                                to="/myorders"
                                className="text-gray-600 hover:text-black text-sm font-medium transition-colors"
                            >
                                订单
                            </Link>
                        )}

                        {user && user.role === 'admin' && (
                            <Link
                                to="/admin"
                                className="text-gray-600 hover:text-black text-sm font-medium transition-colors"
                            >
                                管理后台
                            </Link>
                        )}
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center space-x-6">
                        {/* Cart */}
                        <Link to="/cart" className="relative group p-2">
                            <ShoppingCart className="h-5 w-5 text-gray-700 group-hover:text-black transition-colors" />
                            {cartCount > 0 && (
                                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-black rounded-full">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {/* User */}
                        {user ? (
                            <div className="flex items-center space-x-4 pl-4 border-l border-gray-200">
                                <Link to="/profile" className="text-sm font-medium text-gray-900 hidden sm:block hover:text-indigo-600">
                                    {user.name}
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="text-gray-500 hover:text-red-500 transition-colors"
                                    title="退出"
                                >
                                    <LogOut className="h-5 w-5" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link
                                    to="/login"
                                    className="text-sm font-medium text-gray-700 hover:text-black"
                                >
                                    登录
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-black text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
                                >
                                    注册
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
