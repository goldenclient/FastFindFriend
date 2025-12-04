
import React, { useState } from 'react';
import { Chat } from '../types';
import { MOCK_CHATS } from '../data/messages';
import Header from '../components/Header';
import { Link } from 'react-router-dom';
import { EllipsisVerticalIcon } from '../components/Icon';

const ChatListPage: React.FC = () => {
  const [chats, setChats] = useState<Chat[]>(MOCK_CHATS);

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
        {chats.length > 0 ? (
          chats.map(chat => (
            <ChatListItem key={chat.id} chat={chat} onDelete={handleDelete} onBlock={handleBlock} />
          ))
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">هنوز گفتگویی ندارید.</p>
          </div>
        )}
      </div>
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
            <Link to={`/chat/${chat.userId}`} className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800">
                <div className="relative">
                    <img src={chat.userPhoto} alt={chat.userName} className="w-14 h-14 rounded-full object-cover" />
                    {chat.unreadCount > 0 && (
                        <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-pink-500 text-white text-xs flex items-center justify-center ring-2 ring-white dark:ring-gray-900">{chat.unreadCount}</span>
                    )}
                </div>
                <div className="mr-4 flex-grow">
                    <div className="flex justify-between items-center">
                        <p className="font-bold text-gray-800 dark:text-white">{chat.userName}</p>
                        <p className="text-xs text-gray-400">{chat.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate text-right">{chat.lastMessage}</p>
                </div>
            </Link>
            <button onClick={() => setMenuOpen(!menuOpen)} className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <EllipsisVerticalIcon className="h-6 w-6" />
            </button>
            {menuOpen && (
                <div className="absolute top-12 left-6 bg-white dark:bg-gray-700 rounded-md shadow-lg z-10 w-40 text-sm">
                    <button onClick={() => { onBlock(chat.userName); setMenuOpen(false); }} className="block w-full text-right px-4 py-2 text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600">مسدود کردن کاربر</button>
                    <button onClick={() => { onDelete(chat.id); }} className="block w-full text-right px-4 py-2 text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600">حذف گفتگو</button>
                </div>
            )}
        </div>
    );
};

export default ChatListPage;
