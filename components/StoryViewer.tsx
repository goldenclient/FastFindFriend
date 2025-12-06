
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';
import { XMarkIcon } from './Icon';

interface StoryViewerProps {
  user: User;
  onClose: () => void;
}

const StoryViewer: React.FC<StoryViewerProps> = ({ user, onClose }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Auto close after 5 seconds (simulation of story duration)
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const handleProfileClick = () => {
      onClose();
      navigate(`/user/${user.id}`);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col animate-fade-in">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gray-700">
            <div className="h-full bg-white animate-progress-bar origin-right"></div>
        </div>

        <div 
            className="absolute top-4 right-4 z-20 flex items-center space-x-2 space-x-reverse cursor-pointer hover:opacity-80 transition-opacity"
            onClick={handleProfileClick}
        >
            <img src={user.photo} alt={user.name} className="w-10 h-10 rounded-full border border-white" />
            <span className="text-white font-bold text-shadow">{user.name}</span>
        </div>

        <button onClick={onClose} className="absolute top-4 left-4 text-white z-20 p-2">
            <XMarkIcon className="h-8 w-8 drop-shadow-lg" />
        </button>

        <div className="flex-grow flex items-center justify-center relative">
            {user.story ? (
                <img src={user.story} alt="Story" className="max-w-full max-h-full object-contain" />
            ) : (
                <div className="text-white">استوری یافت نشد</div>
            )}
        </div>
    </div>
  );
};

export default StoryViewer;
