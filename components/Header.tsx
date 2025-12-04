
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from './Icon';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  action?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ title, showBackButton = false, action }) => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-10 bg-white dark:bg-black bg-opacity-80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 p-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        {showBackButton && (
          <button onClick={() => navigate(-1)} className="text-gray-600 dark:text-gray-300 hover:text-pink-500 dark:hover:text-pink-400">
            <ArrowLeftIcon className="h-6 w-6" />
          </button>
        )}
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h1>
      </div>
      <div>{action}</div>
    </header>
  );
};

export default Header;
