import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const TawkToWidget = () => {
    const { user } = useAuth();

    useEffect(() => {
        // Tawk.to Script Initialization
        var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();
        
        // 这一步是将我们的用户信息传给客服后台，方便我们知道是谁在咨询
        if(user){
             Tawk_API.visitor = {
                name  : user.name,
                email : user.email
            };
        }

        (function () {
            var s1 = document.createElement("script"), s0 = document.getElementsByTagName("script")[0];
            s1.async = true;
            // TODO: 请将下面这一行的 href 替换成你自己在 Tawk.to 后台获取的专属链接地址
            s1.src = 'https://embed.tawk.to/6a02c4a5bd8ea31c31137b66/1jodd0a0d'; 
            s1.charset = 'UTF-8';
            s1.setAttribute('crossorigin', '*');
            s0.parentNode.insertBefore(s1, s0);
        })();

        // 组件卸载时清理逻辑（避免多次注入）
        return () => {
             const tawkScript = document.querySelector('script[src*="tawk.to"]');
             if(tawkScript){
                 tawkScript.remove();
             }
             // Tawk 会在 body 结尾注入一大堆 iframe/div，简单清理掉避免重复展示
             document.querySelectorAll('iframe[title="chat widget"]').forEach(el => el.remove());
        }

    }, [user]);

    return null;
};

export default TawkToWidget;