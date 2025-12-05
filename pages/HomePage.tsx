
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User } from '../types';
import { MOCK_USERS } from '../data/users';
import FilterModal from '../components/FilterModal';
import { FunnelIcon, HeartIcon } from '../components/Icon';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';
import PremiumModal from '../components/PremiumModal';
import StoryTray from '../components/StoryTray';
import StoryViewer from '../components/StoryViewer';

const HomePage: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [premiumMessage, setPremiumMessage] = useState('');
  const [selectedStoryUser, setSelectedStoryUser] = useState<User | null>(null);
  
  const handleApplyFilters = (filters: any) => {
    const { ageRange, gender, location, occupation, onlineNow, hasPhoto, distance } = filters;
    
    const filteredUsers = MOCK_USERS.filter(user => {
        // Age Filter
        if (user.age < ageRange.min || user.age > ageRange.max) return false;
        
        // Gender Filter
        if (gender !== 'همه' && user.gender !== gender) return false;
        
        // Location Filter (Text match)
        if (location && !user.location.includes(location)) return false;
        
        // Occupation Filter
        if (occupation && !user.occupation.includes(occupation)) return false;

        // Online Now Filter
        if (onlineNow && !user.isOnline) return false;

        // Has Photo Filter
        if (hasPhoto && (!user.photo || user.photo.length === 0)) return false;

        // Distance Filter
        if (distance && user.distance > distance) return false;

        return true;
    });

    setUsers(filteredUsers);
    setIsFilterOpen(false);
  };

  const handleViewStory = (user: User) => {
      setSelectedStoryUser(user);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      <Header 
        title="دوست‌یاب"
        rightAction={
             <Link to="/likes" className={`${currentUser?.isGhostMode ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} hover:text-pink-500 p-2 -mr-2`}>
                <HeartIcon className="h-7 w-7" />
             </Link>
        }
        leftAction={
            <button onClick={() => setIsFilterOpen(true)} className={`${currentUser?.isGhostMode ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'} hover:text-pink-500 p-2 -ml-2`}>
                <FunnelIcon className="h-6 w-6" />
            </button>
        }
        isGhostMode={currentUser?.isGhostMode}
      />
      
      <div className="flex-grow overflow-y-auto">
        {/* Story Tray Section */}
        <div className="bg-white dark:bg-black border-b border-gray-100 dark:border-gray-800">
             <StoryTray users={users} onViewStory={handleViewStory} large={true} />
        </div>

        <div className="p-2 pb-20 columns-2 gap-2 space-y-2 mt-2">
            {users.length > 0 ? (
                users.map((user, index) => (
                  <UserCard key={user.id} user={user} index={index} />
                ))
            ) : (
                <div className="flex items-center justify-center h-40 w-full col-span-full">
                    <p className="text-gray-500">کاربری با این مشخصات یافت نشد.</p>
                </div>
            )}
        </div>
      </div>

      {isFilterOpen && (
        <FilterModal 
          onClose={() => setIsFilterOpen(false)} 
          onApply={handleApplyFilters} 
        />
      )}
      {showPremiumModal && (
          <PremiumModal onClose={() => setShowPremiumModal(false)} message={premiumMessage} />
      )}
      {selectedStoryUser && (
          <StoryViewer user={selectedStoryUser} onClose={() => setSelectedStoryUser(null)} />
      )}
    </div>
  );
};

const UserCard: React.FC<{ user: User, index: number }> = ({ user, index }) => {
    // Determine aspect ratio based on index to create a staggered/masonry look
    // 0: square, 1: portrait (tall), 2: square, 3: landscape (short)
    const aspectClass = [
        'aspect-[1/1]', 
        'aspect-[3/4]', 
        'aspect-[1/1]',
        'aspect-[4/3]'
    ][index % 4];

    return (
        <Link to={`/user/${user.id}`} className={`relative group overflow-hidden rounded-2xl shadow-md mb-2 break-inside-avoid block transform transition-all duration-300 hover:-translate-y-1 ${aspectClass} bg-gray-200 dark:bg-gray-800`}>
            <img 
                src={user.photo} 
                alt={user.name} 
                className="w-full h-full object-cover absolute inset-0" 
                loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90"></div>
            
            <div className="absolute top-2 right-2 flex flex-col space-y-1">
                {user.isOnline && (
                    <span className="bg-green-500 border-2 border-white dark:border-gray-800 w-3 h-3 rounded-full shadow-sm" title="آنلاین"></span>
                )}
            </div>
            
            <div className="absolute bottom-0 right-0 p-3 text-right w-full">
                <h3 className="text-white font-bold text-lg drop-shadow-md">{user.name}</h3>
                <div className="flex justify-between items-end">
                     <p className="text-gray-200 text-xs drop-shadow-sm truncate pl-1">{user.location.split('،')[0]}</p>
                     <p className="text-pink-400 text-xs font-bold bg-white/20 backdrop-blur-sm px-1.5 py-0.5 rounded-md">{user.age} سال</p>
                </div>
            </div>
        </Link>
    );
};

export default HomePage;
