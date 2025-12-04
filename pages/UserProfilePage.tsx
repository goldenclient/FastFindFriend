
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User } from '../types';
import { MOCK_USERS } from '../data/users';
import Header from '../components/Header';
import { HeartIcon, BookmarkIcon, FlagIcon, ChatBubbleOvalLeftEllipsisIcon } from '../components/Icon';

const UserProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

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

  if (!user) {
    return <div>در حال بارگذاری...</div>;
  }

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <Header title={user.name} showBackButton />
      <div className="flex-grow overflow-y-auto">
        <div className="relative">
          <img src={user.photo} alt={user.name} className="w-full h-80 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          <div className="absolute bottom-0 right-0 p-6 text-right w-full">
            <h1 className="text-3xl font-bold text-white">{user.name}، {user.age}</h1>
            <p className="text-gray-200">{user.occupation} • {user.location}</p>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          <ProfileSection title="درباره من">
            <p>{user.bio}</p>
          </ProfileSection>

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
