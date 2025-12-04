
import React, { useState } from 'react';
import { Gender } from '../types';
import { XMarkIcon } from './Icon';

interface FilterModalProps {
  onClose: () => void;
  onApply: (filters: any) => void;
}

const FilterModal: React.FC<FilterModalProps> = ({ onClose, onApply }) => {
  const [ageRange, setAgeRange] = useState({ min: 18, max: 50 });
  const [gender, setGender] = useState<Gender | 'همه'>('همه');
  const [location, setLocation] = useState('');
  const [occupation, setOccupation] = useState('');

  const handleApply = () => {
    onApply({ ageRange, gender, location, occupation });
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6 relative animate-fade-in-up">
        <button onClick={onClose} className="absolute top-4 left-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
          <XMarkIcon className="h-6 w-6" />
        </button>
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">فیلترها</h2>
        
        {/* Gender */}
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">جنسیت</label>
            <div className="flex space-x-2 space-x-reverse">
                {(['همه', ...Object.values(Gender)]).map(g => (
                    <button key={g} onClick={() => setGender(g as Gender | 'همه')} className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${gender === g ? 'bg-pink-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'}`}>
                        {g}
                    </button>
                ))}
            </div>
        </div>

        {/* Age Range */}
        <div className="mb-4">
            <label htmlFor="age" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">محدوده سنی: {ageRange.min} - {ageRange.max}</label>
            <input type="range" min="18" max="99" value={ageRange.max} onChange={e => setAgeRange(prev => ({...prev, max: parseInt(e.target.value)}))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
        </div>

        {/* Location */}
        <div className="mb-4">
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">مکان</label>
          <input type="text" id="location" value={location} onChange={e => setLocation(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm" placeholder="مثلاً تهران" />
        </div>
        
        {/* Occupation */}
        <div className="mb-6">
          <label htmlFor="occupation" className="block text-sm font-medium text-gray-700 dark:text-gray-300">شغل</label>
          <input type="text" id="occupation" value={occupation} onChange={e => setOccupation(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm" placeholder="مثلاً مهندس" />
        </div>

        <button onClick={handleApply} className="w-full bg-pink-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-pink-600 transition-colors duration-300">
          اعمال فیلترها
        </button>
      </div>
    </div>
  );
};

export default FilterModal;
