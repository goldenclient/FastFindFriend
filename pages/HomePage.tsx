
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User } from '../types';
import { MOCK_USERS } from '../data/users';
import FilterModal from '../components/FilterModal';
import { FunnelIcon } from '../components/Icon';
import Header from '../components/Header';

const HomePage: React.FC = () => {
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // TODO: Implement filter logic
  const handleApplyFilters = (filters: any) => {
    console.log("Applying filters:", filters);
    // Filter logic would be here, for now we just close the modal
    setIsFilterOpen(false);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      <Header 
        title="کاوش" 
        action={
            <button onClick={() => setIsFilterOpen(true)} className="text-gray-600 dark:text-gray-300 hover:text-pink-500 dark:hover:text-pink-400">
                <FunnelIcon className="h-6 w-6" />
            </button>
        }
      />
      <div className="flex-grow p-2 grid grid-cols-2 sm:grid-cols-3 gap-2 overflow-y-auto">
        {users.map(user => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
      {isFilterOpen && (
        <FilterModal 
          onClose={() => setIsFilterOpen(false)} 
          onApply={handleApplyFilters} 
        />
      )}
    </div>
  );
};

const UserCard: React.FC<{ user: User }> = ({ user }) => {
    return (
        <Link to={`/user/${user.id}`} className="relative group overflow-hidden rounded-lg shadow-lg aspect-w-1 aspect-h-1 block">
            <img src={user.photo} alt={user.name} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
            <div className="absolute bottom-0 right-0 p-3 text-right w-full">
                <h3 className="text-white font-bold text-lg">{user.name}، {user.age}</h3>
                <p className="text-gray-200 text-sm">{user.location}</p>
            </div>
        </Link>
    );
};


export default HomePage;
