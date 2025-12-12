
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { User } from '../types';
import { api } from '../services/api';

const BlockedListPage: React.FC = () => {
    const [blockedUsers, setBlockedUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadBlockedUsers = async () => {
            try {
                const data = await api.get<User[]>('/interaction/blocks');
                setBlockedUsers(data);
            } catch (error) {
                console.error('Error loading blocked users', error);
            } finally {
                setLoading(false);
            }
        };
        loadBlockedUsers();
    }, []);

    const handleUnblock = async (userId: string) => {
        if (window.confirm("آیا مطمئن هستید که می‌خواهید این کاربر را رفع مسدودیت کنید؟")) {
            try {
                await api.post(`/interaction/unblock/${userId}`);
                setBlockedUsers(blockedUsers.filter(user => user.id !== userId));
            } catch (error) {
                console.error('Error unblocking user', error);
                alert('خطا در رفع مسدودیت');
            }
        }
    };
    
    return (
        <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
            <Header title="کاربران مسدود شده" showBackButton />
            <div className="flex-grow p-4 overflow-y-auto">
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500">در حال بارگذاری...</p>
                    </div>
                ) : blockedUsers.length > 0 ? (
                    <div className="space-y-3">
                        {blockedUsers.map(user => (
                            <div key={user.id} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg shadow">
                                <div className="flex items-center">
                                    <img src={user.photo} alt={user.name} className="w-12 h-12 rounded-full object-cover" />
                                    <div className="mr-4">
                                        <p className="font-bold text-gray-800 dark:text-white">{user.name}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{user.location}</p>
                                    </div>
                                </div>
                                <button onClick={() => handleUnblock(user.id)} className="bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold py-1 px-3 rounded-lg text-sm hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
                                    رفع مسدودیت
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500">شما کسی را مسدود نکرده‌اید.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BlockedListPage;
