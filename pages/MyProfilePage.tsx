
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { Cog6ToothIcon, StarIcon, BookmarkIcon, HeartIcon, UserCircleIcon, ChevronRightIcon, PlusIcon, TrashIcon, CameraIcon, EyeSlashIcon, CogIcon } from '../components/Icon';
import PremiumModal from '../components/PremiumModal';
import ImageLightbox from '../components/ImageLightbox';

const MyProfilePage: React.FC = () => {
  const { currentUser, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [premiumMessage, setPremiumMessage] = useState('');
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  if (!currentUser) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleProfilePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          const imageUrl = URL.createObjectURL(file);
          updateUser({ photo: imageUrl });
      }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      const currentGallery = currentUser.gallery || [];
      updateUser({ gallery: [...currentGallery, imageUrl] });
    }
  };

  const handleDeletePhoto = (index: number) => {
    if (window.confirm('آیا از حذف این عکس مطمئن هستید؟')) {
        const currentGallery = currentUser.gallery || [];
        const newGallery = currentGallery.filter((_, i) => i !== index);
        updateUser({ gallery: newGallery });
    }
  };

  const handleGhostModeToggle = () => {
      if (!currentUser.isPremium) {
          setPremiumMessage('برای فعال‌سازی حالت روح، باید پنل خود را ارتقا دهید.');
          setShowPremiumModal(true);
      } else {
          updateUser({ isGhostMode: !currentUser.isGhostMode });
      }
  };

  const handleRestrictedLink = (e: React.MouseEvent, path: string, label: string) => {
      if (!currentUser.isPremium && path === '/visitors') {
          e.preventDefault();
          setPremiumMessage(`برای مشاهده بخش "${label}" باید پنل خود را ارتقا دهید.`);
          setShowPremiumModal(true);
      }
  };

  const menuItems = [
    { label: 'بازدیدکنندگان (Visitors)', to: '/visitors', icon: UserCircleIcon },
    { label: 'لایک‌ها (Likes)', to: '/likes', icon: HeartIcon },
    { label: 'نشان‌شده‌ها (Bookmarks)', to: '/bookmarks', icon: BookmarkIcon },
    { label: 'مسدود شده‌ها (Blocked)', to: '/blocked', icon: UserCircleIcon },
    { label: 'تنظیمات', to: '/settings', icon: CogIcon },
  ];

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <Header 
        title="پروفایل من" 
        isGhostMode={currentUser?.isGhostMode}
        action={
            <button 
                onClick={handleGhostModeToggle} 
                className={`p-2 rounded-full transition-colors ${currentUser.isGhostMode ? 'bg-white text-gray-800' : 'text-gray-600 dark:text-gray-300 hover:text-pink-500'}`}
                title="حالت روح"
            >
                <EyeSlashIcon className="h-6 w-6" />
            </button>
        }
      />
      <div className="flex-grow overflow-y-auto pb-4">
          <div className="p-6 text-center">
            <div className="relative inline-block">
                <img 
                    src={currentUser.photo} 
                    alt={currentUser.name} 
                    className="w-28 h-28 rounded-full object-cover mx-auto ring-4 ring-pink-500 cursor-pointer" 
                    onClick={() => setLightboxImage(currentUser.photo)}
                />
                <label className="absolute bottom-0 right-0 bg-pink-500 text-white p-2 rounded-full cursor-pointer hover:bg-pink-600 transition-colors shadow-lg">
                    <CameraIcon className="h-5 w-5" />
                    <input type="file" className="hidden" accept="image/*" onChange={handleProfilePhotoUpload} />
                </label>
            </div>
            
            <h2 className="mt-4 text-2xl font-bold">{currentUser.name}، {currentUser.age}</h2>
            {currentUser.isPremium && <span className="inline-block bg-yellow-400 text-yellow-900 text-xs px-2 py-0.5 rounded-full font-bold mb-1">کاربر ویژه</span>}
            <p className="text-gray-500">{currentUser.occupation}</p>
            <div className="mt-4 flex justify-center space-x-4">
                <Link to="/edit-profile" className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold py-2 px-4 rounded-lg flex items-center justify-center">
                    <Cog6ToothIcon className="h-5 w-5 ml-2" /> ویرایش پروفایل
                </Link>
            </div>
          </div>
          
          <div className="px-4 py-2 mb-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">گالری تصاویر من</h3>
            <div className="grid grid-cols-3 gap-2">
                {currentUser.gallery?.map((photo, index) => (
                    <div key={index} className="relative group aspect-square cursor-pointer" onClick={() => setLightboxImage(photo)}>
                        <img src={photo} alt={`User photo ${index}`} className="w-full h-full object-cover rounded-lg" />
                        <button 
                            onClick={(e) => { e.stopPropagation(); handleDeletePhoto(index); }}
                            className="absolute top-1 left-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                        >
                            <TrashIcon className="h-4 w-4" />
                        </button>
                    </div>
                ))}
                <label className="flex flex-col items-center justify-center w-full aspect-square border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <PlusIcon className="w-8 h-8 text-gray-400" />
                    <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                </label>
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
                    <Link 
                        key={item.to} 
                        to={item.to} 
                        onClick={(e) => handleRestrictedLink(e, item.to, item.label)}
                        className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
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

      {showPremiumModal && (
          <PremiumModal onClose={() => setShowPremiumModal(false)} message={premiumMessage} />
      )}
      {lightboxImage && (
          <ImageLightbox imageUrl={lightboxImage} onClose={() => setLightboxImage(null)} />
      )}
    </div>
  );
};

export default MyProfilePage;
