import axios from 'axios';

// 创建 Axios 实例
// 创建 Axios 实例
const api = axios.create({
    // 优先使用环境变量 (Vercel)，否则使用本地地址
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// 请求拦截器
api.interceptors.request.use(
    (config) => {
        // 从 localStorage 获取 token
        const token = localStorage.getItem('token');
        if (token) {
            // 如果有 token，添加到请求头 Authorization 中
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
