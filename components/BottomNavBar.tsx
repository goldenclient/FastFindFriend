
import React from 'react';
import { NavLink } from 'react-router-dom';
import { HomeIcon, HeartIcon, ChatBubbleOvalLeftEllipsisIcon, UserCircleIcon } from './Icon';

const BottomNavBar: React.FC = () => {
  const navItems = [
    { path: '/', icon: HomeIcon, label: 'Home' },
    { path: '/likes', icon: HeartIcon, label: 'Likes' },
    { path: '/chats', icon: ChatBubbleOvalLeftEllipsisIcon, label: 'Chats' },
    { path: '/profile', icon: UserCircleIcon, label: 'Profile' },
  ];

  const activeLinkClass = "text-pink-500";
  const inactiveLinkClass = "text-gray-400 hover:text-pink-400";

  return (
    <nav className="sticky bottom-0 left-0 right-0 bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800 shadow-lg">
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