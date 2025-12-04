
import React, { useState } from 'react';
import { User } from '../types';
import { MOCK_USERS } from '../data/users';
import Header from '../components/Header';
import { Link } from 'react-router-dom';

const LikesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');

  // Mock data - in a real app, this would come from an API
  const likesReceived = MOCK_USERS.slice(0, 3);
  const likesSent = MOCK_USERS.slice(3, 5);

  const renderUserList = (users: User[]) => (
    <div className="p-4 space-y-3">
      {users.map(user => (
        <Link to={`/user/${user.id}`} key={user.id} className="flex items-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <img src={user.photo} alt={user.name} className="w-14 h-14 rounded-full object-cover" />
          <div className="mr-4">
            <p className="font-bold text-gray-800 dark:text-white">{user.name}، {user.age}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{user.occupation}</p>
          </div>
        </Link>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <Header title="علاقه‌مندی‌ها" />
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
        {activeTab === 'received' ? renderUserList(likesReceived) : renderUserList(likesSent)}
      </div>
    </div>
  );
};

export default LikesPage;
