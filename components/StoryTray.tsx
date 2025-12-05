
import React from 'react';
import { Link } from 'react-router-dom';
import { User } from '../types';

interface StoryTrayProps {
  users: User[];
}

const StoryTray: React.FC<StoryTrayProps> = ({ users }) => {
  return (
    <div className="flex overflow-x-auto p-4 space-x-4 space-x-reverse scrollbar-hide bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 flex-none z-0">
      <div className="flex flex-col items-center space-y-1 min-w-[64px]">
        <div className="w-16 h-16 rounded-full bg-gray-50 dark:bg-gray-700 border-2 border-dashed border-gray-400 flex items-center justify-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
            <span className="text-2xl text-gray-400 font-light">+</span>
        </div>
        <span className="text-xs text-gray-500 truncate w-16 text-center">استوری شما</span>
      </div>

      {users.map((user) => (
        <Link key={user.id} to={`/user/${user.id}`} className="flex flex-col items-center space-y-1 min-w-[64px] group">
          <div className={`w-16 h-16 rounded-full p-[2px] transition-transform duration-200 group-hover:scale-105 ${user.isOnline ? 'bg-gradient-to-tr from-yellow-400 to-pink-600' : 'bg-gray-300 dark:bg-gray-600'}`}>
             <img src={user.photo} alt={user.name} className="w-full h-full rounded-full object-cover border-2 border-white dark:border-black" />
          </div>
          <span className="text-xs text-gray-700 dark:text-gray-300 truncate w-16 text-center group-hover:text-pink-500 font-medium">{user.name}</span>
        </Link>
      ))}
    </div>
  );
};

export default StoryTray;
