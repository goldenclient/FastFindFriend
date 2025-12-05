
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRightIcon } from './Icon';

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
  leftAction?: React.ReactNode; // Renders on the Left side (End in RTL)
  rightAction?: React.ReactNode; // Renders on the Right side (Start in RTL)
  isGhostMode?: boolean;
  // Backward compatibility alias if needed, or mapping 'action' to 'leftAction'
  action?: React.ReactNode; 
}

const Header: React.FC<HeaderProps> = ({ title, showBackButton = false, leftAction, rightAction, action, isGhostMode = false }) => {
  const navigate = useNavigate();

  // Combine action and leftAction for backward compatibility
  const finalLeftAction = leftAction || action;

  return (
    <header className={`flex-none sticky top-0 z-20 px-4 py-2 flex items-center justify-between border-b transition-colors duration-300 min-h-[60px] ${
        isGhostMode 
        ? 'bg-gray-700 text-white border-gray-600' 
        : 'bg-white dark:bg-black bg-opacity-95 backdrop-blur-md border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white'
    }`}>
      
      {/* Right Side (Start in RTL) */}
      <div className="flex items-center justify-start flex-none min-w-[48px] z-10">
        {showBackButton ? (
          <button onClick={() => navigate(-1)} className={`p-1 -mr-2 ${isGhostMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 dark:text-gray-300 hover:text-pink-500 dark:hover:text-pink-400'}`}>
            <ArrowRightIcon className="h-6 w-6" />
          </button>
        ) : (
            rightAction
        )}
      </div>

      {/* Center Title */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <h1 className="text-lg font-bold truncate max-w-[60%] pointer-events-auto">{title}</h1>
      </div>

      {/* Left Side (End in RTL) */}
      <div className="flex items-center justify-end flex-none min-w-[48px] z-10">
        {finalLeftAction}
      </div>

    </header>
  );
};

export default Header;
