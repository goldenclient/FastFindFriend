
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User } from '../types';
import { MOCK_USERS } from '../data/users';
import FilterModal from '../components/FilterModal';
import { FunnelIcon, EyeSlashIcon } from '../components/Icon';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';
import PremiumModal from '../components/PremiumModal';

const HomePage: React.FC = () => {
  const { currentUser, updateUser } = useAuth();
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [premiumMessage, setPremiumMessage] = useState('');
  
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

  const handleGhostModeToggle = () => {
      if (currentUser && !currentUser.isPremium) {
          setPremiumMessage('برای فعال‌سازی حالت روح، باید پنل خود را ارتقا دهید.');
          setShowPremiumModal(true);
      } else if (currentUser) {
          updateUser({ isGhostMode: !currentUser.isGhostMode });
      }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      <Header 
        title="کاوش" 
        action={
            <div className="flex space-x-2 space-x-reverse">
                <button 
                    onClick={handleGhostModeToggle} 
                    className={`p-1 rounded-full transition-colors ${currentUser?.isGhostMode ? 'bg-gray-800 text-white' : 'text-gray-600 dark:text-gray-300 hover:text-pink-500'}`}
                    title="حالت روح"
                >
                    <EyeSlashIcon className="h-6 w-6" />
                </button>
                <button onClick={() => setIsFilterOpen(true)} className="text-gray-600 dark:text-gray-300 hover:text-pink-500 dark:hover:text-pink-400">
                    <FunnelIcon className="h-6 w-6" />
                </button>
            </div>
        }
      />
      <div className="flex-grow p-2 grid grid-cols-2 sm:grid-cols-3 gap-2 overflow-y-auto">
        {users.length > 0 ? (
            users.map(user => (
              <UserCard key={user.id} user={user} />
            ))
        ) : (
            <div className="col-span-2 sm:col-span-3 flex items-center justify-center h-40">
                <p className="text-gray-500">کاربری با این مشخصات یافت نشد.</p>
            </div>
        )}
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
    </div>
  );
};

const UserCard: React.FC<{ user: User }> = ({ user }) => {
    return (
        <Link to={`/user/${user.id}`} className="relative group overflow-hidden rounded-lg shadow-lg aspect-w-1 aspect-h-1 block">
            <img src={user.photo} alt={user.name} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
            <div className="absolute top-2 right-2 flex flex-col space-y-1">
                {user.isOnline && (
                    <span className="bg-green-500 border-2 border-white dark:border-gray-800 w-3 h-3 rounded-full" title="آنلاین"></span>
                )}
            </div>
            <div className="absolute bottom-0 right-0 p-3 text-right w-full">
                <h3 className="text-white font-bold text-lg">{user.name}، {user.age}</h3>
                <div className="flex justify-between items-end">
                     <p className="text-gray-200 text-xs">{user.location}</p>
                     <p className="text-pink-400 text-xs font-bold">{user.distance} km</p>
                </div>
            </div>
        </Link>
    );
};


export default HomePage;