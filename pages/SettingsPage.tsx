
import React, { useState } from 'react';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';
import { UserSettings } from '../types';
import { BellIcon, FingerPrintIcon, EyeSlashIcon, ChatBubbleOvalLeftEllipsisIcon, HeartIcon } from '../components/Icon';

const SettingsPage: React.FC = () => {
    const { currentUser, updateUser } = useAuth();
    
    // Initialize state with user's current settings or defaults
    const [settings, setSettings] = useState<UserSettings>(currentUser?.settings || {
        newLikeNotification: true,
        newMessageNotification: true,
        biometricLogin: false,
        profileViewNotification: true
    });

    const handleToggle = (key: keyof UserSettings) => {
        const newSettings = { ...settings, [key]: !settings[key] };
        setSettings(newSettings);
        
        // Update globally
        updateUser({ settings: newSettings });
    };

    if (!currentUser) return null;

    return (
        <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
            <Header title="تنظیمات" showBackButton />
            <div className="flex-grow p-4 overflow-y-auto">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700">
                    
                    <SettingItem 
                        icon={HeartIcon}
                        label="اعلان لایک جدید"
                        description="وقتی کسی شما را لایک می‌کند خبر بده"
                        isActive={settings.newLikeNotification}
                        onToggle={() => handleToggle('newLikeNotification')}
                    />

                    <SettingItem 
                        icon={ChatBubbleOvalLeftEllipsisIcon}
                        label="اعلان پیغام جدید"
                        description="وقتی پیام جدیدی دریافت می‌کنید خبر بده"
                        isActive={settings.newMessageNotification}
                        onToggle={() => handleToggle('newMessageNotification')}
                    />

                    <SettingItem 
                        icon={EyeSlashIcon}
                        label="اعلان مشاهده پروفایل"
                        description="وقتی کسی پروفایل شما را می‌بیند خبر بده"
                        isActive={settings.profileViewNotification}
                        onToggle={() => handleToggle('profileViewNotification')}
                    />

                    <SettingItem 
                        icon={FingerPrintIcon}
                        label="ورود با اثر انگشت"
                        description="استفاده از اثر انگشت برای ورود سریع"
                        isActive={settings.biometricLogin}
                        onToggle={() => handleToggle('biometricLogin')}
                    />

                </div>
            </div>
        </div>
    );
};

interface SettingItemProps {
    icon: React.ElementType;
    label: string;
    description: string;
    isActive: boolean;
    onToggle: () => void;
}

const SettingItem: React.FC<SettingItemProps> = ({ icon: Icon, label, description, isActive, onToggle }) => {
    return (
        <div className="flex items-center justify-between p-4">
            <div className="flex items-center flex-1">
                <div className={`p-2 rounded-lg ${isActive ? 'bg-pink-100 text-pink-600' : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-300'}`}>
                    <Icon className="h-6 w-6" />
                </div>
                <div className="mr-3">
                    <p className="font-semibold text-gray-900 dark:text-white">{label}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{description}</p>
                </div>
            </div>
            <button 
                onClick={onToggle}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isActive ? 'bg-pink-500' : 'bg-gray-200 dark:bg-gray-600'}`}
            >
                <span className="sr-only">Toggle</span>
                <span 
                    aria-hidden="true" 
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isActive ? '-translate-x-5' : 'translate-x-0'}`}
                />
            </button>
        </div>
    );
};

export default SettingsPage;
