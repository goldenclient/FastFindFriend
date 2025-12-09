
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Message as MessageType, User } from '../types';
import Header from '../components/Header';
import { PaperAirplaneIcon, PhotoIcon } from '../components/Icon';
import { useAuth } from '../context/AuthContext';
import PremiumModal from '../components/PremiumModal';
import { api } from '../services/api';

const toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
});

const ChatPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  useEffect(() => {
    const initChat = async () => {
        try {
            // Fetch User Details
            const userData = await api.get<User>(`/users/${userId}`);
            setUser(userData);

            // Fetch Messages
            // Assuming GET /messages/{userId} returns Message[]
            const msgs = await api.get<any[]>(`/messages/${userId}`);
            
            setMessages(msgs.map(m => ({
                id: m.id,
                senderId: m.senderId,
                receiverId: m.receiverId,
                text: m.text,
                imageUrl: m.imageUrl,
                timestamp: new Date(m.timestamp)
            })));
        } catch (error) {
            console.error(error);
            // navigate('/chats');
        }
    };
    if (userId) initChat();
  }, [userId, navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const checkPremium = () => {
      if (currentUser && !currentUser.isPremium) {
          setShowPremiumModal(true);
          return false;
      }
      return true;
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkPremium()) return;
    if (newMessage.trim() === '') return;

    try {
        const payload = {
            receiverId: userId,
            text: newMessage,
            // imageUrl: null
        };
        
        const response = await api.post<any>('/messages', payload);
        
        const message: MessageType = {
            id: response.id || `temp-${Date.now()}`,
            senderId: currentUser!.id,
            receiverId: userId!,
            text: newMessage,
            timestamp: new Date(),
        };

        setMessages([...messages, message]);
        setNewMessage('');
    } catch (error) {
        console.error("Failed to send message", error);
    }
  };
  
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!checkPremium()) return;

    if (e.target.files && e.target.files[0]) {
        try {
            const file = e.target.files[0];
            const base64 = await toBase64(file);
            
            const payload = {
                receiverId: userId,
                text: '',
                imageUrl: base64
            };
            
            const response = await api.post<any>('/messages', payload);
            
            const message: MessageType = {
                id: response.id || `temp-${Date.now()}`,
                senderId: currentUser!.id,
                receiverId: userId!,
                text: '',
                imageUrl: base64, // Display local/base64 version
                timestamp: new Date(),
            };
            setMessages([...messages, message]);
            
        } catch (error) {
             console.error("Failed to send image", error);
        }
    }
  };

  if (!user) {
    return <div className="text-center mt-10">در حال بارگذاری...</div>;
  }

  return (
    <div className="flex flex-col h-full bg-gray-100 dark:bg-gray-900">
      <Header title={user.name} showBackButton={true} />
      <div className="flex-grow p-4 overflow-y-auto space-y-4">
        {messages.map(msg => (
          <MessageBubble key={msg.id} message={msg} currentUserId={currentUser!.id} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex-none p-4 bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2 space-x-reverse">
          <label htmlFor="image-upload" className="cursor-pointer text-gray-500 hover:text-pink-500">
            <PhotoIcon className="h-6 w-6" />
          </label>
          <input id="image-upload" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="پیامی بنویسید..."
            className="flex-grow px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          <button type="submit" className="p-2 rounded-full bg-pink-500 text-white hover:bg-pink-600 disabled:bg-gray-400 rotate-180">
            <PaperAirplaneIcon className="h-6 w-6 transform rotate-180" />
          </button>
        </form>
      </div>
      {showPremiumModal && (
          <PremiumModal onClose={() => setShowPremiumModal(false)} message="برای ارسال پیام، باید پنل خود را ارتقا دهید." />
      )}
    </div>
  );
};

const MessageBubble: React.FC<{ message: MessageType, currentUserId: string }> = ({ message, currentUserId }) => {
  const isSentByCurrentUser = message.senderId === currentUserId;
  return (
    <div className={`flex ${isSentByCurrentUser ? 'justify-start' : 'justify-end'}`}>
      <div className={`max-w-xs lg:max-w-md p-1 rounded-lg ${isSentByCurrentUser ? 'bg-pink-500 text-white' : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}>
        {message.imageUrl ? (
            <img src={message.imageUrl} alt="uploaded content" className="rounded-md max-h-60" />
        ) : (
            <p className="px-2 py-1">{message.text}</p>
        )}
        <span className={`text-xs block text-left px-2 py-1 ${isSentByCurrentUser ? 'text-pink-100' : 'text-gray-400'}`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
};

export default ChatPage;
