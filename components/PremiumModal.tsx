
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { XMarkIcon, StarIcon } from './Icon';

interface PremiumModalProps {
  onClose: () => void;
  message: string;
}

const PremiumModal: React.FC<PremiumModalProps> = ({ onClose, message }) => {
  const navigate = useNavigate();

  const handleUpgrade = () => {
    navigate('/store');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-sm p-6 relative animate-fade-in-up text-center border-2 border-pink-500">
        <button onClick={onClose} className="absolute top-4 left-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
          <XMarkIcon className="h-6 w-6" />
        </button>
        
        <div className="flex justify-center mb-4">
            <div className="bg-pink-100 dark:bg-pink-900 p-3 rounded-full">
                <StarIcon className="h-10 w-10 text-pink-500" />
            </div>
        </div>

        <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">ارتقا به نسخه ویژه</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">{message}</p>
        
        <button onClick={handleUpgrade} className="w-full bg-gradient-to-r from-pink-500 to-orange-400 text-white font-bold py-3 px-4 rounded-lg hover:from-pink-600 hover:to-orange-500 transition-all duration-300 shadow-lg transform hover:scale-105">
          ارتقا پنل کاربری
        </button>
      </div>
    </div>
  );
};

export default PremiumModal;
