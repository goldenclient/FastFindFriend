
import React from 'react';
import { Link } from 'react-router-dom';
import { User } from '../types';
import { useAuth } from '../context/AuthContext';

interface StoryTrayProps {
  users: User[];
  onViewStory: (user: User) => void;
}

const StoryTray: React.FC<StoryTrayProps> = ({ users, onViewStory }) => {
  const { currentUser, updateUser } = useAuth();

  const handleMyStoryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          const imageUrl = URL.createObjectURL(file);
          updateUser({ story: imageUrl });
      }
  };

  return (
    <div className="flex items-center space-x-3 space-x-reverse px-1 py-1">
      {/* My Story Circle */}
      <div className="flex flex-col items-center space-y-1 min-w-[56px]">
        <label className="relative w-14 h-14 cursor-pointer">
            <div className={`w-full h-full rounded-full p-[2px] ${currentUser?.story ? 'bg-gradient-to-tr from-yellow-400 to-pink-600' : 'bg-transparent border-2 border-dashed border-gray-300'}`}>
                <img 
                    src={currentUser?.photo} 
                    alt="My Story" 
                    className="w-full h-full rounded-full object-cover border-2 border-white dark:border-black" 
                />
            </div>
            {!currentUser?.story && (
                <div className="absolute bottom-0 right-0 bg-pink-500 rounded-full w-5 h-5 flex items-center justify-center border-2 border-white dark:border-black text-white font-bold text-xs">
                    +
                </div>
            )}
            <input type="file" className="hidden" accept="image/*" onChange={handleMyStoryUpload} />
        </label>
        <span className="text-[10px] text-gray-500 truncate w-14 text-center">استوری شما</span>
      </div>

      {/* Other Users */}
      {users.map((user) => {
        const hasStory = !!user.story;
        
        return (
            <div key={user.id} className="flex flex-col items-center space-y-1 min-w-[56px] group cursor-pointer" onClick={() => hasStory ? onViewStory(user) : null}>
                <Link to={!hasStory ? `/user/${user.id}` : '#'} className="block">
                    <div className={`w-14 h-14 rounded-full p-[2px] transition-transform duration-200 group-hover:scale-105 ${hasStory ? 'bg-gradient-to-tr from-yellow-400 to-pink-600' : 'bg-gray-200 dark:bg-gray-600'}`}>
                        <img src={user.photo} alt={user.name} className="w-full h-full rounded-full object-cover border-2 border-white dark:border-black" />
                    </div>
                </Link>
                <span className="text-[10px] text-gray-700 dark:text-gray-300 truncate w-14 text-center group-hover:text-pink-500 font-medium">{user.name}</span>
            </div>
        );
      })}
    </div>
  );
};

export default StoryTray;
