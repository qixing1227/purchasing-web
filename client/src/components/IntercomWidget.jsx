import { useEffect } from 'react';
import Intercom from '@intercom/messenger-js-sdk';
import { useAuth } from '../context/AuthContext';

const IntercomWidget = () => {
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            Intercom({
                app_id: 'bijj59ln',
                user_id: user.id || user._id, 
                name: user.name, 
                email: user.email, 
                created_at: user.date ? Math.floor(new Date(user.date).getTime() / 1000) : undefined, 
            });
        } else {
            Intercom({
                app_id: 'bijj59ln',
            });
        }
    }, [user]);

    return null;
};

export default IntercomWidget;