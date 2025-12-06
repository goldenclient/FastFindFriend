
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User } from '../types';
import { MOCK_USERS } from '../data/users';
import Header from '../components/Header';
import { HeartIcon, BookmarkIcon, FlagIcon, ChatBubbleOvalLeftEllipsisIcon, LockClosedIcon } from '../components/Icon';
import { useAuth } from '../context/AuthContext';
import PremiumModal from '../components/PremiumModal';
import ImageLightbox from '../components/ImageLightbox';
import StoryViewer from '../components/StoryViewer';

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
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [viewingStory, setViewingStory] = useState(false);

  useEffect(() => {
    const foundUser = MOCK_USERS.find(u => u.id === userId);
    if (foundUser) {
      setUser(foundUser);
    } else {
      navigate('/');
    }
  }, [userId, navigate]);

  const handleScroll = () => {
      if (scrollRef.current) {
          const scrollTop = scrollRef.current.scrollTop;
          setIsScrolled(scrollTop > 250);
      }
  };

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

  const handleStoryClick = () => {
      if (user?.story) {
          setViewingStory(true);
      }
  };

  if (!user) {
    return <div>در حال بارگذاری...</div>;
  }

  // Header Props Logic
  const headerTitle = (
      <div className="flex items-center gap-3 transition-all duration-300">
          {isScrolled && (
              <div 
                onClick={handleStoryClick}
                className={`relative w-10 h-10 rounded-full overflow-hidden cursor-pointer ${user.story ? 'ring-2 ring-pink-500' : ''}`}
              >
                  <img src={user.photo} alt={user.name} className="w-full h-full object-cover" />
              </div>
          )}
          <span className="text-lg font-bold">{user.name}</span>
      </div>
  );

  // When scrolled, show Bookmark next to back button (Right Action)
  const headerRightAction = isScrolled ? (
      <button onClick={() => setIsBookmarked(!isBookmarked)} className={`ml-2 ${isBookmarked ? 'text-pink-500' : 'text-gray-500'}`}>
          <BookmarkIcon className="h-6 w-6" />
      </button>
  ) : null;

  // When scrolled, show Message and Like on the Left
  const headerLeftAction = isScrolled ? (
      <div className="flex items-center space-x-3 space-x-reverse animate-fade-in">
          <button onClick={handleSendMessage} className="text-gray-500 hover:text-pink-500">
              <ChatBubbleOvalLeftEllipsisIcon className="h-6 w-6" />
          </button>
          <button onClick={() => setIsLiked(!isLiked)} className={`${isLiked ? 'text-pink-500' : 'text-gray-500'}`}>
              <HeartIcon className="h-6 w-6" />
          </button>
      </div>
  ) : null;

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <Header 
        title={headerTitle} 
        showBackButton={true} 
        leftAction={headerLeftAction}
        rightAction={headerRightAction ? <div className="flex items-center gap-2">{headerRightAction}</div> : undefined}
      />

      <div 
        className="flex-grow overflow-y-auto relative" 
        ref={scrollRef} 
        onScroll={handleScroll}
      >
        <div className="relative">
          <img 
            src={user.photo} 
            alt={user.name} 
            className="w-full h-96 object-cover cursor-pointer" 
            onClick={() => handleGalleryClick(user.photo)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none"></div>
          
          {/* Left Overlay Icons (Stacked Vertically) */}
          <div className={`absolute top-4 left-4 flex flex-col gap-3 transition-opacity duration-300 ${isScrolled ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
               <button onClick={handleSendMessage} className="bg-black/30 backdrop-blur-md p-2 rounded-full text-white hover:bg-pink-500 transition-colors" title="پیام">
                  <ChatBubbleOvalLeftEllipsisIcon className="h-6 w-6" />
               </button>
               <button onClick={() => setIsLiked(!isLiked)} className={`bg-black/30 backdrop-blur-md p-2 rounded-full transition-colors ${isLiked ? 'text-pink-500 bg-white' : 'text-white hover:bg-pink-500'}`} title="لایک">
                  <HeartIcon className="h-6 w-6" />
               </button>
               <button onClick={() => setIsBookmarked(!isBookmarked)} className={`bg-black/30 backdrop-blur-md p-2 rounded-full transition-colors ${isBookmarked ? 'text-pink-500 bg-white' : 'text-white hover:text-pink-500'}`} title="نشان کردن">
                  <BookmarkIcon className="h-6 w-6" />
               </button>
               <button onClick={handleReport} className="bg-black/30 backdrop-blur-md p-2 rounded-full text-white hover:text-red-500 transition-colors" title="گزارش خطا">
                  <FlagIcon className="h-6 w-6" />
               </button>
          </div>

          {/* Right Overlay Story Avatar */}
          {user.story && (
              <div 
                className={`absolute top-4 right-4 transition-opacity duration-300 ${isScrolled ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                onClick={handleStoryClick}
              >
                  <div className="w-12 h-12 rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 to-pink-600 cursor-pointer shadow-lg">
                      <img src={user.photo} alt="Story" className="w-full h-full rounded-full object-cover border-2 border-white" />
                  </div>
              </div>
          )}

          <div className="absolute bottom-0 right-0 p-6 text-right w-full pointer-events-none">
            <h1 className="text-3xl font-bold text-white drop-shadow-md">{user.name}، {user.age}</h1>
            <p className="text-gray-200 drop-shadow-md">{user.occupation} • {user.location}</p>
          </div>
        </div>
        
        <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-[500px] rounded-t-3xl -mt-4 relative z-10">
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
      
      {showPremiumModal && (
          <PremiumModal onClose={() => setShowPremiumModal(false)} message={premiumMessage} />
      )}
      {lightboxImage && (
          <ImageLightbox imageUrl={lightboxImage} onClose={() => setLightboxImage(null)} />
      )}
      {viewingStory && (
          <StoryViewer user={user} onClose={() => setViewingStory(false)} />
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

export default UserProfilePage;
