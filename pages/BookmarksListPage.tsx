
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { User } from '../types';
import { XMarkIcon } from '../components/Icon';
import { api } from '../services/api';

const BookmarksListPage: React.FC = () => {
    const [bookmarkedUsers, setBookmarkedUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadBookmarks = async () => {
            try {
                const data = await api.get<User[]>('/interaction/bookmarks');
                setBookmarkedUsers(data);
            } catch (error) {
                console.error('Error loading bookmarks', error);
            } finally {
                setLoading(false);
            }
        };
        loadBookmarks();
    }, []);

    const handleRemoveBookmark = async (e: React.MouseEvent, userId: string) => {
        e.preventDefault(); // Prevent navigation
        try {
            await api.post(`/interaction/bookmark/${userId}`);
            setBookmarkedUsers(bookmarkedUsers.filter(user => user.id !== userId));
        } catch (error) {
            console.error('Error removing bookmark', error);
        }
    };

    return (
        <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
            <Header title="پروفایل‌های نشان شده" showBackButton />
            <div className="flex-grow p-4 overflow-y-auto">
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500">در حال بارگذاری...</p>
                    </div>
                ) : bookmarkedUsers.length > 0 ? (
                     <div className="space-y-3">
                        {bookmarkedUsers.map(user => (
                            <Link to={`/user/${user.id}`} key={user.id} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg shadow hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                <div className="flex items-center">
                                    <img src={user.photo} alt={user.name} className="w-14 h-14 rounded-full object-cover" />
                                    <div className="mr-4">
                                        <p className="font-bold text-gray-800 dark:text-white">{user.name}، {user.age}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{user.occupation}</p>
                                    </div>
                                </div>
                                <button onClick={(e) => handleRemoveBookmark(e, user.id)} className="text-gray-400 hover:text-red-500 p-2 rounded-full">
                                    <XMarkIcon className="h-5 w-5"/>
                                </button>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500">شما هیچ پروفایلی را نشان نکرده‌اید.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookmarksListPage;
