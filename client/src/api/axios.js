import axios from 'axios';

// 创建 Axios 实例
// 创建 Axios 实例
const api = axios.create({
    // 智能判断：如果是生产环境，直接使用当前访问的域名作为 API 前缀
    // 这样无论是访问 purchasingweb.top 还是 purchasing-client.vercel.app 都能正常工作
    baseURL: import.meta.env.PROD 
        ? '/api' 
        : (import.meta.env.VITE_API_URL || 'http://localhost:5000/api'),
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
