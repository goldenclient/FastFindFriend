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
            setFormData(currentUser);
        }
    }, [currentUser]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const inputType = (e.target as HTMLInputElement).type;
        setFormData(prev => ({
            ...prev,
            [name]: inputType === 'number' ? (value === '' ? 0 : parseFloat(value)) : value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateUser(formData);
        alert('Profile updated successfully!');
        navigate('/profile');
    };
    
    if (!currentUser) return null;

    return (
        <div className="flex flex-col h-full">
            <Header title="Edit Profile" showBackButton />
            <div className="flex-grow p-6 overflow-y-auto bg-gray-50 dark:bg-gray-900">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <InputField name="name" label="Name" value={formData.name || ''} onChange={handleChange} required />
                    <SelectField name="gender" label="Gender" value={formData.gender || Gender.Female} onChange={handleChange} options={Object.values(Gender)} />
                    <InputField name="location" label="Location" value={formData.location || ''} onChange={handleChange} placeholder="e.g. Tehran, Iran" required />
                    <InputField name="occupation" label="Occupation" value={formData.occupation || ''} onChange={handleChange} placeholder="e.g. Software Engineer" required />
                    <SelectField name="maritalStatus" label="Marital Status" value={formData.maritalStatus || MaritalStatus.Single} onChange={handleChange} options={Object.values(MaritalStatus)} />
                    <InputField name="height" label="Height (cm)" type="number" value={String(formData.height || 0)} onChange={handleChange} required />
                    <InputField name="weight" label="Weight (kg)" type="number" value={String(formData.weight || 0)} onChange={handleChange} required />
                    <InputField name="favoriteSport" label="Favorite Sport" value={formData.favoriteSport || ''} onChange={handleChange} placeholder="e.g. Soccer" />
                    <TextAreaField name="bio" label="About Me" value={formData.bio || ''} onChange={handleChange} rows={3} placeholder="Tell us something about yourself..." />
                    <TextAreaField name="partnerPreferences" label="About My Ideal Partner" value={formData.partnerPreferences || ''} onChange={handleChange} rows={3} placeholder="Describe the person you are looking for..." />

                    <div className="pt-4">
                        <button type="submit" className="w-full bg-pink-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-pink-600 transition-colors duration-300">
                            Save Changes
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