import React, { createContext, useState, useContext, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
    return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
    const { user } = useAuth();
    const [cartItems, setCartItems] = useState(() => {
        // 从 localStorage 初始化购物车
        const savedCart = localStorage.getItem('cartItems');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    // 监听 cartItems 变化，同步到 localStorage
    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    // 添加商品到购物车
    const addToCart = (product) => {
        if (!user) {
            toast.error('请先登录或注册账号');
            return;
        }

        let isNewItem = false;

        setCartItems((prevItems) => {
            const existingItem = prevItems.find((item) => item._id === product._id);
            if (existingItem) {
                isNewItem = false;
                return prevItems.map((item) =>
                    item._id === product._id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                isNewItem = true;
                return [...prevItems, { ...product, quantity: 1 }];
            }
        });

        // 移出 state updater 以避免副作用重复执行
        // 注意：这里是一个近似处理，因为无法直接在外面知道是更新还是新增（除非在这里重算一遍，或者根据返回值，但setCartItems不返回新值）
        // 既然已经在上面的逻辑里判断了，我们可以简单地总是提示 "已加入购物车"，或者稍微优化一下逻辑：

        // 更好的做法：先检查，再 update
        /* 
           由于 React state update 是异步的，我们不能依赖 cartItems 的当前值，
           但我们可以检查 localStorage 或者重新查找一遍？不，这太复杂。
           其实对于用户来说，"已加入购物车" 足矣。
        */
        toast.success(`${product.name} 已加入购物车`);
    };

    // 从购物车移除商品
    const removeFromCart = (productId) => {
        setCartItems((prevItems) => filterItems(prevItems, productId));
        toast.success('商品已移除');
    };

    // 辅助函数：过滤掉指定 ID 的商品
    const filterItems = (items, id) => items.filter((item) => item._id !== id);

    // 更新商品数量
    const updateQuantity = (productId, quantity) => {
        if (quantity < 1) {
            removeFromCart(productId);
            return;
        }
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item._id === productId ? { ...item, quantity } : item
            )
        );
    };

    // 清空购物车
    const clearCart = () => {
        setCartItems([]);
        localStorage.removeItem('cartItems');
        toast.success('购物车已清空');
    };

    // 计算总金额
    const cartTotal = cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    // 计算总数量
    const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

    const value = {
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
