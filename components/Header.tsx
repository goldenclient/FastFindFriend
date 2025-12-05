
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRightIcon } from './Icon';

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
  action?: React.ReactNode;
  isGhostMode?: boolean;
  customContent?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ title, showBackButton = false, action, isGhostMode = false, customContent }) => {
  const navigate = useNavigate();

  return (
    <header className={`flex-none sticky top-0 z-10 p-2 flex items-center justify-between border-b transition-colors duration-300 min-h-[60px] ${
        isGhostMode 
        ? 'bg-gray-700 text-white border-gray-600' 
        : 'bg-white dark:bg-black bg-opacity-80 backdrop-blur-md border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white'
    }`}>
      <div className="flex items-center flex-grow">
        {showBackButton && (
          <button onClick={() => navigate(-1)} className={`ml-3 ${isGhostMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 dark:text-gray-300 hover:text-pink-500 dark:hover:text-pink-400'}`}>
            <ArrowRightIcon className="h-6 w-6" />
          </button>
        )}
        
        {customContent ? (
            <div className="flex-grow overflow-x-auto no-scrollbar">
                {customContent}
            </div>
        ) : (
            <h1 className="text-xl font-bold px-2">{title}</h1>
        )}
      </div>
      <div className="flex-none px-2">{action}</div>
    </header>
  );
};

export default Header;
