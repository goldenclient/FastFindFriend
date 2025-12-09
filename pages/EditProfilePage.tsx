
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Gender, MaritalStatus } from '../types';
import Header from '../components/Header';

const EditProfilePage: React.FC = () => {
    const { currentUser, updateUser } = useAuth();
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState<Partial<User>>(currentUser || {});

    useEffect(() => {
        if (currentUser) {
            // Ensure birthDate is formatted correctly for date input if it exists
            const dateStr = currentUser.birthDate ? currentUser.birthDate.split('T')[0] : '';
            setFormData({ ...currentUser, birthDate: dateStr });
        }
    }, [currentUser]);

    const calculateAge = (birthDate: string): number => {
        const today = new Date();
        const birthDateObj = new Date(birthDate);
        let age = today.getFullYear() - birthDateObj.getFullYear();
        const m = today.getMonth() - birthDateObj.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDateObj.getDate())) {
            age--;
        }
        return age;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const inputType = (e.target as HTMLInputElement).type;
        
        let newValue: any = inputType === 'number' ? (value === '' ? 0 : parseFloat(value)) : value;

        setFormData(prev => {
            const updated = { ...prev, [name]: newValue };
            if (name === 'birthDate') {
                updated.age = calculateAge(value);
            }
            return updated;
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateUser(formData);
        alert('پروفایل با موفقیت بروزرسانی شد!');
        navigate('/profile');
    };
    
    if (!currentUser) return null;

    return (
        <div className="flex flex-col h-full">
            <Header title="ویرایش پروفایل" showBackButton />
            <div className="flex-grow p-6 overflow-y-auto bg-gray-50 dark:bg-gray-900">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <InputField name="name" label="نام" value={formData.name || ''} onChange={handleChange} required />
                    <SelectField name="gender" label="جنسیت" value={formData.gender || Gender.Female} onChange={handleChange} options={Object.values(Gender)} />
                    
                    <InputField name="birthDate" label="تاریخ تولد" type="date" value={formData.birthDate || ''} onChange={handleChange} required />
                    <div className="text-sm text-gray-500 text-right">سن: {formData.age} سال</div>

                    <InputField name="location" label="مکان" value={formData.location || ''} onChange={handleChange} placeholder="مثلاً تهران، ایران" required />
                    <InputField name="occupation" label="شغل" value={formData.occupation || ''} onChange={handleChange} placeholder="مثلاً مهندس نرم‌افزار" required />
                    <SelectField name="maritalStatus" label="وضعیت تاهل" value={formData.maritalStatus || MaritalStatus.Single} onChange={handleChange} options={Object.values(MaritalStatus)} />
                    <InputField name="height" label="قد (سانتی‌متر)" type="number" value={String(formData.height || 0)} onChange={handleChange} required />
                    <InputField name="weight" label="وزن (کیلوگرم)" type="number" value={String(formData.weight || 0)} onChange={handleChange} required />
                    <InputField name="favoriteSport" label="ورزش مورد علاقه" value={formData.favoriteSport || ''} onChange={handleChange} placeholder="مثلاً فوتبال" />
                    <TextAreaField name="bio" label="درباره من" value={formData.bio || ''} onChange={handleChange} rows={3} placeholder="کمی درباره خودتان بگویید..." />
                    <TextAreaField name="partnerPreferences" label="درباره شریک ایده‌آل من" value={formData.partnerPreferences || ''} onChange={handleChange} rows={3} placeholder="شخصی که دنبالش هستید را توصیف کنید..." />

                    <div className="pt-4 pb-8">
                        <button type="submit" className="w-full bg-pink-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-pink-600 transition-colors duration-300">
                            ذخیره تغییرات
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Reusable form components
const InputField: React.FC<{name: string, label: string, value: string, onChange: any, type?: string, placeholder?: string, required?: boolean}> = ({ label, ...rest }) => (
    <div>
        <label htmlFor={rest.name} className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
        <input id={rest.name} type={rest.type || 'text'} {...rest} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500" />
    </div>
);

const SelectField: React.FC<{name: string, label: string, value: string, onChange: any, options: string[]}> = ({name, label, value, onChange, options}) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
        <select id={name} name={name} value={value} onChange={onChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-pink-500 focus:border-pink-500 rounded-md">
            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
    </div>
);

const TextAreaField: React.FC<{name: string, label: string, value: string, onChange: any, rows: number, placeholder?: string}> = ({ label, ...rest }) => (
    <div>
        <label htmlFor={rest.name} className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
        <textarea id={rest.name} {...rest} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500" />
    </div>
);


export default EditProfilePage;
