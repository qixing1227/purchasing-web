import React from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Minus, Plus, ArrowRight } from 'lucide-react';

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();
    const navigate = useNavigate();

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">购物车为空</h2>
                <p className="text-gray-500 mb-8">您的购物车中没有商品。</p>
                <Link
                    to="/"
                    className="bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors"
                >
                    开始购物
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-10">购物车</h1>

                <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
                    {/* List */}
                    <section className="lg:col-span-7">
                        <ul className="border-t border-b border-gray-200 divide-y divide-gray-200">
                            {cartItems.map((item) => (
                                <li key={item._id} className="flex py-6 sm:py-10">
                                    <div className="flex-shrink-0">
                                        <img
                                            src={item.imageUrl}
                                            alt={item.name}
                                            className="w-24 h-24 rounded-md object-cover object-center sm:w-32 sm:h-32 bg-gray-100"
                                        />
                                    </div>

                                    <div className="ml-4 flex-1 flex flex-col justify-between sm:ml-6">
                                        <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                                            <div>
                                                <div className="flex justify-between">
                                                    <h3 className="text-sm">
                                                        <span className="font-medium text-gray-700 hover:text-gray-800">
                                                            {item.name}
                                                        </span>
                                                    </h3>
                                                </div>
                                                <p className="mt-1 text-sm font-medium text-gray-900">¥{item.price}</p>
                                            </div>

                                            <div className="mt-4 sm:mt-0 sm:pr-9">
                                                {/* Quantity */}
                                                <div className="flex items-center border border-gray-300 rounded-md w-max">
                                                    <button
                                                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                                        className="p-2 text-gray-600 hover:bg-gray-100"
                                                    >
                                                        <Minus className="w-3 h-3" />
                                                    </button>
                                                    <span className="px-3 text-sm font-medium text-gray-900">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                                        className="p-2 text-gray-600 hover:bg-gray-100"
                                                    >
                                                        <Plus className="w-3 h-3" />
                                                    </button>
                                                </div>

                                                <div className="absolute top-0 right-0">
                                                    <button
                                                        onClick={() => removeFromCart(item._id)}
                                                        className="-m-2 p-2 inline-flex text-gray-400 hover:text-gray-500"
                                                    >
                                                        <span className="sr-only">Remove</span>
                                                        <Trash2 className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-6">
                            <button onClick={clearCart} className="text-sm text-gray-500 underline hover:text-gray-900">清空购物车</button>
                        </div>
                    </section>

                    {/* Summary */}
                    <section className="lg:col-span-5 mt-16 lg:mt-0 bg-gray-50 rounded-lg px-4 py-6 sm:p-6 lg:p-8">
                        <h2 className="text-lg font-medium text-gray-900">订单摘要</h2>

                        <dl className="mt-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <dt className="text-sm text-gray-600">小计</dt>
                                <dd className="text-sm font-medium text-gray-900">¥{cartTotal.toFixed(2)}</dd>
                            </div>
                            <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                                <dt className="text-base font-medium text-gray-900">总计</dt>
                                <dd className="text-base font-medium text-gray-900">¥{cartTotal.toFixed(2)}</dd>
                            </div>
                        </dl>

                        <div className="mt-6">
                            <button
                                onClick={() => navigate('/placeorder')}
                                className="w-full bg-black border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 flex justify-center items-center"
                            >
                                去结账 <ArrowRight className="ml-2 w-4 h-4" />
                            </button>
                        </div>

                        <div className="mt-6 text-center">
                            <Link to="/" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                                或 继续购物 &rarr;
                            </Link>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Cart;
