
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { MOCK_USERS } from '../data/users';
import { User } from '../types';
import { useAuth } from '../context/AuthContext';
import PremiumModal from '../components/PremiumModal';

const VisitorsListPage: React.FC = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [showPremiumModal, setShowPremiumModal] = useState(false);

    // Mocking a list of profile visitors.
    const visitors: User[] = [MOCK_USERS[0], MOCK_USERS[1], MOCK_USERS[5]];

    useEffect(() => {
        if (currentUser && !currentUser.isPremium) {
            setShowPremiumModal(true);
        }
    }, [currentUser]);

    const handleModalClose = () => {
        setShowPremiumModal(false);
        navigate('/profile');
    };
    
    return (
        <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
            <Header title="بازدیدکنندگان پروفایل" showBackButton />
            <div className="flex-grow p-4 overflow-y-auto relative">
                
                {/* Blur Content if not premium */}
                <div className={!currentUser?.isPremium ? 'filter blur-md pointer-events-none select-none' : ''}>
                    {visitors.length > 0 ? (
                        <div className="space-y-3">
                            {visitors.map(user => (
                                <Link to={`/user/${user.id}`} key={user.id} className="flex items-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                    <img src={user.photo} alt={user.name} className="w-14 h-14 rounded-full object-cover" />
                                    <div className="mr-4">
                                        <p className="font-bold text-gray-800 dark:text-white">{user.name}، {user.age}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{user.occupation}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-gray-500">هنوز کسی از پروفایل شما بازدید نکرده است.</p>
                        </div>
                    )}
                </div>

                {showPremiumModal && (
                    <PremiumModal onClose={handleModalClose} message="برای مشاهده لیست کسانی که پروفایل شما را دیده‌اند، باید پنل خود را ارتقا دهید." />
                )}
            </div>
        </div>
    );
};

export default VisitorsListPage;
