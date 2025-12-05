
import React, { useState } from 'react';
import { Chat, User } from '../types';
import { MOCK_CHATS } from '../data/messages';
import { MOCK_USERS } from '../data/users';
import Header from '../components/Header';
import { Link } from 'react-router-dom';
import { EllipsisVerticalIcon } from '../components/Icon';
import StoryTray from '../components/StoryTray';
import StoryViewer from '../components/StoryViewer';

const ChatListPage: React.FC = () => {
  const [chats, setChats] = useState<Chat[]>(MOCK_CHATS);
  const [selectedStoryUser, setSelectedStoryUser] = useState<User | null>(null);

  // Get unique users from chats to show in the story tray, or just show all mock users
  const storyUsers = MOCK_USERS.slice(0, 8);

  const handleDelete = (chatId: string) => {
    if (window.confirm("آیا از حذف این گفتگو مطمئن هستید؟ این عملیات غیرقابل بازگشت است.")) {
        setChats(chats.filter(chat => chat.id !== chatId));
    }
  };

  const handleBlock = (userName: string) => {
    if (window.confirm(`آیا مطمئن هستید که می‌خواهید ${userName} را مسدود کنید؟ دیگر پروفایل او را نخواهید دید و پیامی دریافت نخواهید کرد.`)) {
        // In a real app, you would also remove the user from other lists
        alert(`${userName} مسدود شد.`);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <Header title="گفتگوها" />
      <div className="flex-grow overflow-y-auto">
        <div className="border-b border-gray-100 dark:border-gray-800">
             <StoryTray users={storyUsers} onViewStory={setSelectedStoryUser} />
        </div>
        
        <div className="pb-4">
            {chats.length > 0 ? (
            chats.map(chat => (
                <ChatListItem key={chat.id} chat={chat} onDelete={handleDelete} onBlock={handleBlock} />
            ))
            ) : (
            <div className="flex items-center justify-center h-40">
                <p className="text-gray-500">هنوز گفتگویی ندارید.</p>
            </div>
            )}
        </div>
      </div>
      
      {selectedStoryUser && (
          <StoryViewer user={selectedStoryUser} onClose={() => setSelectedStoryUser(null)} />
      )}
    </div>
  );
};

interface ChatListItemProps {
    chat: Chat;
    onDelete: (chatId: string) => void;
    onBlock: (userName: string) => void;
}

const ChatListItem: React.FC<ChatListItemProps> = ({ chat, onDelete, onBlock }) => {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className="relative">
            <Link to={`/chat/${chat.userId}`} className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <div className="relative">
                    <img src={chat.userPhoto} alt={chat.userName} className="w-14 h-14 rounded-full object-cover" />
                    {chat.unreadCount > 0 && (
                        <span className="absolute top-0 right-0 block h-5 w-5 rounded-full bg-pink-500 text-white text-xs font-bold flex items-center justify-center ring-2 ring-white dark:ring-gray-900">{chat.unreadCount}</span>
                    )}
                </div>
                <div className="mr-4 flex-grow min-w-0">
                    <div className="flex justify-between items-center mb-1">
                        <p className="font-bold text-gray-800 dark:text-white truncate">{chat.userName}</p>
                        <p className="text-xs text-gray-400 whitespace-nowrap">{chat.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate text-right block">{chat.lastMessage}</p>
                </div>
            </Link>
            <button onClick={() => setMenuOpen(!menuOpen)} className="absolute top-1/2 left-4 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 z-10">
                <EllipsisVerticalIcon className="h-6 w-6" />
            </button>
            {menuOpen && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)}></div>
                    <div className="absolute top-10 left-6 bg-white dark:bg-gray-700 rounded-lg shadow-xl z-20 w-40 text-sm py-1 border border-gray-100 dark:border-gray-600 animate-fade-in">
                        <button onClick={() => { onBlock(chat.userName); setMenuOpen(false); }} className="block w-full text-right px-4 py-2.5 text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">مسدود کردن کاربر</button>
                        <button onClick={() => { onDelete(chat.id); setMenuOpen(false); }} className="block w-full text-right px-4 py-2.5 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">حذف گفتگو</button>
                    </div>
                </>
            )}
        </div>
    );
};

export default ChatListPage;
