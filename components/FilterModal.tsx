
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
  const [onlineNow, setOnlineNow] = useState(false);
  const [hasPhoto, setHasPhoto] = useState(false);
  const [distance, setDistance] = useState(50);

  const handleApply = () => {
    onApply({ ageRange, gender, location, occupation, onlineNow, hasPhoto, distance });
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6 relative animate-fade-in-up overflow-y-auto max-h-[90vh]">
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
            <label htmlFor="age" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">حداکثر سن: {ageRange.max}</label>
            <input type="range" min="18" max="99" value={ageRange.max} onChange={e => setAgeRange(prev => ({...prev, max: parseInt(e.target.value)}))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-pink-500" />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>18</span>
                <span>99</span>
            </div>
        </div>
        
        {/* Distance Range */}
        <div className="mb-4">
            <label htmlFor="distance" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">محدوده مکانی: {distance} کیلومتر</label>
            <input type="range" min="1" max="100" value={distance} onChange={e => setDistance(parseInt(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-pink-500" />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1km</span>
                <span>100km</span>
            </div>
        </div>

        {/* Online Now Toggle */}
        <div className="mb-4 flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">نمایش کاربران آنلاین</label>
            <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={onlineNow} onChange={e => setOnlineNow(e.target.checked)} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-pink-500"></div>
            </label>
        </div>

        {/* Has Photo Toggle */}
        <div className="mb-4 flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">فقط کاربران دارای عکس</label>
            <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={hasPhoto} onChange={e => setHasPhoto(e.target.checked)} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-pink-500"></div>
            </label>
        </div>

        {/* Location Input */}
        <div className="mb-4">
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">مکان</label>
          <input type="text" id="location" value={location} onChange={e => setLocation(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm" placeholder="مثلاً تهران" />
        </div>
        
        {/* Occupation Input */}
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
