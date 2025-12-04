
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Message as MessageType, User } from '../types';
import { MOCK_MESSAGES } from '../data/messages';
import { MOCK_USERS, CURRENT_USER_ID } from '../data/users';
import Header from '../components/Header';
import { PaperAirplaneIcon, PhotoIcon } from '../components/Icon';

const ChatPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const foundUser = MOCK_USERS.find(u => u.id === userId);
    if (foundUser) {
      setUser(foundUser);
      setMessages(MOCK_MESSAGES[userId] || []);
    } else {
      // Handle user not found, maybe redirect
      navigate('/chats');
    }
  }, [userId, navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    const message: MessageType = {
      id: `m${Date.now()}`,
      senderId: CURRENT_USER_ID,
      receiverId: userId!,
      text: newMessage,
      timestamp: new Date(),
    };

    setMessages([...messages, message]);
    setNewMessage('');
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        const imageUrl = URL.createObjectURL(e.target.files[0]);
        const message: MessageType = {
            id: `m${Date.now()}`,
            senderId: CURRENT_USER_ID,
            receiverId: userId!,
            text: '',
            imageUrl: imageUrl,
            timestamp: new Date(),
        };
        setMessages([...messages, message]);
    }
  };

  if (!user) {
    return <div>Loading...</div>; // Or a proper loading spinner
  }

  return (
    <div className="flex flex-col h-full bg-gray-100 dark:bg-gray-900">
      <Header title={user.name} showBackButton={true} />
      <div className="flex-grow p-4 overflow-y-auto space-y-4">
        {messages.map(msg => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          <label htmlFor="image-upload" className="cursor-pointer text-gray-500 hover:text-pink-500">
            <PhotoIcon className="h-6 w-6" />
          </label>
          <input id="image-upload" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-grow px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          <button type="submit" className="p-2 rounded-full bg-pink-500 text-white hover:bg-pink-600 disabled:bg-gray-400">
            <PaperAirplaneIcon className="h-6 w-6" />
          </button>
        </form>
      </div>
    </div>
  );
};

const MessageBubble: React.FC<{ message: MessageType }> = ({ message }) => {
  const isSentByCurrentUser = message.senderId === CURRENT_USER_ID;
  return (
    <div className={`flex ${isSentByCurrentUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-xs lg:max-w-md p-1 rounded-lg ${isSentByCurrentUser ? 'bg-pink-500 text-white' : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}>
        {message.imageUrl ? (
            <img src={message.imageUrl} alt="uploaded content" className="rounded-md max-h-60" />
        ) : (
            <p className="px-2 py-1">{message.text}</p>
        )}
        <span className={`text-xs block text-right px-2 py-1 ${isSentByCurrentUser ? 'text-pink-100' : 'text-gray-400'}`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
};


export default ChatPage;
