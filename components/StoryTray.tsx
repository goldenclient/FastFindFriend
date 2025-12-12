
import React from 'react';
import { Link } from 'react-router-dom';
import { User } from '../types';
import { useAuth } from '../context/AuthContext';
import { PlusIcon } from './Icon';

interface StoryTrayProps {
  users: User[];
  onViewStory: (user: User) => void;
  large?: boolean;
}

const StoryTray: React.FC<StoryTrayProps> = ({ users, onViewStory, large = false }) => {
  const { currentUser, updateUser } = useAuth();

  const handleMyStoryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          const imageUrl = URL.createObjectURL(file);
          updateUser({ story: imageUrl });
      }
  };

  const containerSizeClass = large ? 'w-20 h-20' : 'w-16 h-16'; // Increased container size
  const imageSizeClass = large ? 'w-18 h-18' : 'w-14 h-14';     // Increased image size
  const textSizeClass = large ? 'text-xs' : 'text-[10px]';

  return (
    <div className="flex items-center space-x-3 space-x-reverse px-4 py-3 overflow-x-auto no-scrollbar touch-pan-x">
      {/* My Story Circle */}
      <div className={`flex flex-col items-center space-y-1 flex-shrink-0 ${large ? 'min-w-[70px]' : 'min-w-[64px]'}`}>
        <label className={`relative ${containerSizeClass} cursor-pointer`}>
            <div className={`w-full h-full rounded-full p-[2px] ${currentUser?.story ? 'bg-gradient-to-tr from-yellow-400 to-pink-600' : 'bg-transparent border-2 border-dashed border-gray-300'}`}>
                <img 
                    src={currentUser?.photo || currentUser?.photoUrl || 'https://via.placeholder.com/400'} 
                    alt="My Story" 
                    className="w-full h-full rounded-full object-cover border-2 border-white dark:border-black" 
                />
            </div>
            {!currentUser?.story && (
                <div className="absolute bottom-0 right-0 bg-pink-500 rounded-full w-6 h-6 flex items-center justify-center border-2 border-white dark:border-black text-white shadow-sm">
                    <PlusIcon className="w-4 h-4" />
                </div>
            )}
            <input type="file" className="hidden" accept="image/*" onChange={handleMyStoryUpload} />
        </label>
        <span className={`${textSizeClass} text-gray-500 truncate w-full text-center`}>استوری شما</span>
      </div>

      {/* Other Users */}
      {users.map((user) => {
        const hasStory = !!user.story;
        
        return (
            <div key={user.id} className={`flex flex-col items-center space-y-1 flex-shrink-0 group cursor-pointer ${large ? 'min-w-[70px]' : 'min-w-[64px]'}`} onClick={() => hasStory ? onViewStory(user) : null}>
                <Link to={!hasStory ? `/user/${user.id}` : '#'} className="block">
                    <div className={`${containerSizeClass} rounded-full p-[2px] transition-transform duration-200 group-hover:scale-105 ${hasStory ? 'bg-gradient-to-tr from-yellow-400 to-pink-600' : 'bg-gray-200 dark:bg-gray-600'}`}>
                        <img src={user.photo || user.photoUrl || 'https://via.placeholder.com/400'} alt={user.name} className="w-full h-full rounded-full object-cover border-2 border-white dark:border-black" />
                    </div>
                </Link>
                <span className={`${textSizeClass} text-gray-700 dark:text-gray-300 truncate w-full text-center group-hover:text-pink-500 font-medium`}>{user.name}</span>
            </div>
        );
      })}
    </div>
  );
};

export default StoryTray;
