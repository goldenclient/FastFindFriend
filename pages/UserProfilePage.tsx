
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User } from '../types';
import { MOCK_USERS } from '../data/users';
import Header from '../components/Header';
import { HeartIcon, BookmarkIcon, FlagIcon, ChatBubbleOvalLeftEllipsisIcon, LockClosedIcon } from '../components/Icon';
import { useAuth } from '../context/AuthContext';
import PremiumModal from '../components/PremiumModal';
import ImageLightbox from '../components/ImageLightbox';

const UserProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [premiumMessage, setPremiumMessage] = useState('');
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  useEffect(() => {
    const foundUser = MOCK_USERS.find(u => u.id === userId);
    if (foundUser) {
      setUser(foundUser);
    } else {
      navigate('/');
    }
  }, [userId, navigate]);

  const handleReport = () => {
    if (window.confirm(`آیا مطمئن هستید که می‌خواهید ${user?.name} را گزارش کنید؟`)) {
      alert(`${user?.name} گزارش شد.`);
    }
  };
  
  const handleSendMessage = () => {
      navigate(`/chat/${userId}`);
  };

  const handleGalleryClick = (photoUrl: string) => {
      if (currentUser && currentUser.isPremium) {
          setLightboxImage(photoUrl);
      } else {
          setPremiumMessage('برای مشاهده گالری تصاویر، باید پنل خود را ارتقا دهید.');
          setShowPremiumModal(true);
      }
  };

  if (!user) {
    return <div>در حال بارگذاری...</div>;
  }

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <Header title={user.name} showBackButton />
      <div className="flex-grow overflow-y-auto">
        <div className="relative">
          <img 
            src={user.photo} 
            alt={user.name} 
            className="w-full h-80 object-cover cursor-pointer" 
            onClick={() => handleGalleryClick(user.photo)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent pointer-events-none"></div>
          <div className="absolute bottom-0 right-0 p-6 text-right w-full pointer-events-none">
            <h1 className="text-3xl font-bold text-white">{user.name}، {user.age}</h1>
            <p className="text-gray-200">{user.occupation} • {user.location}</p>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          <ProfileSection title="درباره من">
            <p>{user.bio}</p>
          </ProfileSection>

          {user.gallery && user.gallery.length > 0 && (
            <div>
                <h3 className="text-lg font-semibold text-pink-500 border-b-2 border-pink-200 dark:border-pink-800 pb-2 mb-3">گالری تصاویر</h3>
                <div className="grid grid-cols-3 gap-2 relative">
                    {user.gallery.map((photo, index) => (
                        <div key={index} className="aspect-square relative cursor-pointer overflow-hidden rounded-lg" onClick={() => handleGalleryClick(photo)}>
                            <img 
                                src={photo} 
                                alt={`Gallery ${index}`} 
                                className={`w-full h-full object-cover shadow-sm transition-all ${!currentUser?.isPremium ? 'filter blur-sm scale-110' : ''}`} 
                            />
                            {!currentUser?.isPremium && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                    <LockClosedIcon className="h-6 w-6 text-white" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
          )}

          <ProfileSection title="جزئیات">
            <div className="grid grid-cols-2 gap-4">
              <DetailItem label="وضعیت تاهل" value={user.maritalStatus} />
              <DetailItem label="قد" value={`${user.height} سانتی‌متر`} />
              <DetailItem label="وزن" value={`${user.weight} کیلوگرم`} />
              <DetailItem label="ورزش مورد علاقه" value={user.favoriteSport} />
            </div>
          </ProfileSection>

          <ProfileSection title="دنبال چی می‌گردم...">
            <p>{user.partnerPreferences}</p>
          </ProfileSection>
        </div>
      </div>
      
      <div className="flex-none sticky bottom-0 left-0 right-0 bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800 p-4 flex justify-around items-center">
        <ActionButton icon={FlagIcon} onClick={handleReport} label="گزارش" />
        <ActionButton icon={BookmarkIcon} onClick={() => setIsBookmarked(!isBookmarked)} active={isBookmarked} label="نشان کردن" />
        <button onClick={handleSendMessage} className="p-4 rounded-full bg-white dark:bg-gray-700 text-pink-500 shadow-lg transform hover:scale-110 transition-transform">
          <ChatBubbleOvalLeftEllipsisIcon className="h-8 w-8" />
        </button>
        <ActionButton icon={HeartIcon} onClick={() => setIsLiked(!isLiked)} active={isLiked} label="لایک" />
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

const ProfileSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div>
    <h3 className="text-lg font-semibold text-pink-500 border-b-2 border-pink-200 dark:border-pink-800 pb-2 mb-3">{title}</h3>
    <div className="text-gray-700 dark:text-gray-300">{children}</div>
  </div>
);

const DetailItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div>
    <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
    <p className="font-semibold">{value}</p>
  </div>
);

const ActionButton: React.FC<{ icon: React.ElementType, onClick: () => void, active?: boolean, label: string }> = ({ icon, onClick, active, label }) => {
    const Icon = icon;
    return (
        <button onClick={onClick} className={`flex flex-col items-center space-y-1 transition-colors ${active ? 'text-pink-500' : 'text-gray-400 hover:text-pink-400'}`}>
            <Icon className="h-7 w-7" />
            <span className="text-xs">{label}</span>
        </button>
    );
};


export default UserProfilePage;
