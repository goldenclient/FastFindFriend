
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRightIcon } from './Icon';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  action?: React.ReactNode;
  isGhostMode?: boolean;
}

const Header: React.FC<HeaderProps> = ({ title, showBackButton = false, action, isGhostMode = false }) => {
  const navigate = useNavigate();

  return (
    <header className={`flex-none sticky top-0 z-10 p-4 flex items-center justify-between border-b transition-colors duration-300 ${
        isGhostMode 
        ? 'bg-gray-700 text-white border-gray-600' 
        : 'bg-white dark:bg-black bg-opacity-80 backdrop-blur-md border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white'
    }`}>
      <div className="flex items-center space-x-4 space-x-reverse">
        {showBackButton && (
          <button onClick={() => navigate(-1)} className={`${isGhostMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 dark:text-gray-300 hover:text-pink-500 dark:hover:text-pink-400'}`}>
            <ArrowRightIcon className="h-6 w-6" />
          </button>
        )}
        <h1 className="text-xl font-bold">{title}</h1>
      </div>
      <div>{action}</div>
    </header>
  );
};

export default Header;
