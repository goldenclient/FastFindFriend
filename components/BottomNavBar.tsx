
import React from 'react';
import { NavLink } from 'react-router-dom';
import { HomeIcon, ChatBubbleOvalLeftEllipsisIcon, UserCircleIcon } from './Icon';

const BottomNavBar: React.FC = () => {
  const navItems = [
    { path: '/', icon: HomeIcon, label: 'خانه' },
    // Likes item removed as requested, moved to Home Header
    { path: '/chats', icon: ChatBubbleOvalLeftEllipsisIcon, label: 'پیام‌ها' },
    { path: '/profile', icon: UserCircleIcon, label: 'پروفایل' },
  ];

  const activeLinkClass = "text-pink-500";
  const inactiveLinkClass = "text-gray-400 hover:text-pink-400";

  return (
    <nav className="flex-none sticky bottom-0 left-0 right-0 bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-30">
      <div className="max-w-md mx-auto flex justify-around p-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end
              className={({ isActive }) => 
                `flex flex-col items-center justify-center w-16 transition-colors duration-200 ${isActive ? activeLinkClass : inactiveLinkClass}`
              }
            >
              <Icon className="h-7 w-7" />
              <span className="text-xs mt-1">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavBar;
