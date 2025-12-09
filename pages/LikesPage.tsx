
import React, { useState, useEffect } from 'react';
import { User } from '../types';
import Header from '../components/Header';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

const LikesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');
  const [likesReceived, setLikesReceived] = useState<User[]>([]);
  const [likesSent, setLikesSent] = useState<User[]>([]); // Note: Backend needs to support this
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLikes = async () => {
        setLoading(true);
        try {
            // Fetch users who liked me
            const received = await api.get<User[]>('/interaction/likes');
            setLikesReceived(received || []);
            
            // NOTE: Current backend InteractionController only has /likes (received).
            // You might need to add /interaction/likes/sent endpoint to support this.
            // setLikesSent(sent || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    fetchLikes();
  }, []);

  const renderUserList = (users: User[]) => (
    <div className="p-4 space-y-3">
      {users.length > 0 ? (
          users.map(user => (
            <Link to={`/user/${user.id}`} key={user.id} className="flex items-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <img src={user.photo || 'https://via.placeholder.com/150'} alt={user.name} className="w-14 h-14 rounded-full object-cover" />
              <div className="mr-4">
                <p className="font-bold text-gray-800 dark:text-white">{user.name}، {user.age}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{user.occupation}</p>
              </div>
            </Link>
          ))
      ) : (
          <div className="text-center py-10 text-gray-500">لیست خالی است.</div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <Header title="علاقه‌مندی‌ها" showBackButton={true} />
      <div className="border-b border-gray-200 dark:border-gray-700 flex-none">
        <div className="flex justify-around">
          <button 
            onClick={() => setActiveTab('received')}
            className={`w-full py-4 text-center font-semibold transition-colors ${activeTab === 'received' ? 'border-b-2 border-pink-500 text-pink-500' : 'text-gray-500'}`}
          >
            لایک‌های دریافتی ({likesReceived.length})
          </button>
          <button 
            onClick={() => setActiveTab('sent')}
            className={`w-full py-4 text-center font-semibold transition-colors ${activeTab === 'sent' ? 'border-b-2 border-pink-500 text-pink-500' : 'text-gray-500'}`}
          >
            لایک‌های ارسالی ({likesSent.length})
          </button>
        </div>
      </div>
      <div className="flex-grow overflow-y-auto">
        {loading ? (
            <div className="text-center py-10">در حال دریافت...</div>
        ) : (
            activeTab === 'received' ? renderUserList(likesReceived) : renderUserList(likesSent)
        )}
      </div>
    </div>
  );
};

export default LikesPage;
