
import React from 'react';
import { XMarkIcon } from './Icon';

interface ImageLightboxProps {
  imageUrl: string;
  onClose: () => void;
}

const ImageLightbox: React.FC<ImageLightboxProps> = ({ imageUrl, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black z-[100] flex items-center justify-center animate-fade-in">
        <button onClick={onClose} className="absolute top-4 left-4 text-white hover:text-pink-500 z-[101] bg-black/50 rounded-full p-2">
            <XMarkIcon className="h-8 w-8" />
        </button>
        <img src={imageUrl} alt="Full screen" className="max-w-full max-h-full object-contain" />
    </div>
  );
};

export default ImageLightbox;
