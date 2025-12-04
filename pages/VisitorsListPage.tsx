
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { MOCK_USERS } from '../data/users';
import { User } from '../types';

const VisitorsListPage: React.FC = () => {
    // Mocking a list of profile visitors.
    const visitors: User[] = [MOCK_USERS[0], MOCK_USERS[1], MOCK_USERS[5]];
    
    return (
        <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
            <Header title="Profile Visitors" showBackButton />
            <div className="flex-grow p-4 overflow-y-auto">
                {visitors.length > 0 ? (
                     <div className="space-y-3">
                        {visitors.map(user => (
                            <Link to={`/user/${user.id}`} key={user.id} className="flex items-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                <img src={user.photo} alt={user.name} className="w-14 h-14 rounded-full object-cover" />
                                <div className="ml-4">
                                    <p className="font-bold text-gray-800 dark:text-white">{user.name}, {user.age}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{user.occupation}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500">No one has visited your profile yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VisitorsListPage;
