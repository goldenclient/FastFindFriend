
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { Cog6ToothIcon, StarIcon, BookmarkIcon, HeartIcon, UserCircleIcon, ChevronRightIcon } from '../components/Icon';

const MyProfilePage: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  if (!currentUser) {
    return null; // Or a loading indicator
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { label: 'بازدیدکنندگان (Visitors)', to: '/visitors', icon: UserCircleIcon },
    { label: 'لایک‌ها (Likes)', to: '/likes', icon: HeartIcon },
    { label: 'نشان‌شده‌ها (Bookmarks)', to: '/bookmarks', icon: BookmarkIcon },
    { label: 'مسدود شده‌ها (Blocked)', to: '/blocked', icon: UserCircleIcon },
  ];

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <Header title="پروفایل من" />
      <div className="flex-grow overflow-y-auto">
          <div className="p-6 text-center">
            <img src={currentUser.photo} alt={currentUser.name} className="w-28 h-28 rounded-full object-cover mx-auto ring-4 ring-pink-500" />
            <h2 className="mt-4 text-2xl font-bold">{currentUser.name}، {currentUser.age}</h2>
            <p className="text-gray-500">{currentUser.occupation}</p>
            <div className="mt-4 flex justify-center space-x-4">
                <Link to="/edit-profile" className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold py-2 px-4 rounded-lg flex items-center justify-center">
                    <Cog6ToothIcon className="h-5 w-5 ml-2" /> ویرایش پروفایل
                </Link>
            </div>
          </div>
          
          <div className="px-4">
            <Link to="/store" className="block w-full text-right p-4 mb-4 rounded-lg bg-gradient-to-l from-pink-500 to-orange-400 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg">ارتقا پنل به اشتراک ویژه</h3>
                  <p className="text-sm">امکانات بیشتر با نسخه ویژه!</p>
                </div>
                <StarIcon className="h-8 w-8" />
              </div>
            </Link>
          </div>

          <div className="px-4 space-y-2">
            {menuItems.map(item => {
                const Icon = item.icon;
                return (
                    <Link key={item.to} to={item.to} className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <div className="flex items-center">
                            <Icon className="h-6 w-6 text-pink-500 ml-4" />
                            <span>{item.label}</span>
                        </div>
                        <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                    </Link>
                );
            })}
          </div>
          
          <div className="p-4 mt-4">
            <button onClick={handleLogout} className="w-full bg-red-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-600 transition-colors">
              خروج
            </button>
          </div>
      </div>
    </div>
  );
};

export default MyProfilePage;
