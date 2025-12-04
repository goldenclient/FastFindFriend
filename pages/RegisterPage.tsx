
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MOCK_LOGGED_IN_USER } from '../data/users';
import { Gender, MaritalStatus, User } from '../types';
import { ArrowRightIcon } from '../components/Icon';


const RegisterPage: React.FC = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<Partial<User>>({
        name: '',
        gender: Gender.Female,
        location: '',
        occupation: '',
        bio: '',
        photo: 'https://picsum.photos/id/237/400/400',
        maritalStatus: MaritalStatus.Single,
        height: 170,
        weight: 60,
        favoriteSport: '',
        partnerPreferences: '',
        age: 25
    });

    const navigate = useNavigate();
    const { login } = useAuth();
    
    const nextStep = () => setStep(s => s + 1);
    const prevStep = () => setStep(s => s - 1);
    
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
        // In a real app, you would submit the data to a server.
        // For this mock, we'll create a new user object and log in.
        const newUser: User = {
            id: 'newUser',
            ...MOCK_LOGGED_IN_USER,
            ...formData,
        } as User;

        alert('ثبت نام با موفقیت انجام شد!');
        login(newUser);
        navigate('/');
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return <Step1 nextStep={nextStep} handleChange={handleChange} formData={formData} />;
            case 2:
                return <Step2 nextStep={nextStep} prevStep={prevStep} handleChange={handleChange} formData={formData} />;
            case 3:
                return <Step3 handleSubmit={handleSubmit} prevStep={prevStep} handleChange={handleChange} formData={formData} />;
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col h-full bg-gray-100 dark:bg-gray-900 p-6 overflow-y-auto">
            <div className="w-full max-w-sm mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-pink-500">ایجاد حساب کاربری</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">مرحله {step} از 3</p>
                </div>
                {renderStep()}
                <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                    قبلاً ثبت نام کرده‌اید؟{' '}
                    <Link to="/login" className="font-medium text-pink-500 hover:text-pink-400">
                        وارد شوید
                    </Link>
                </p>
            </div>
        </div>
    );
};

interface StepProps {
    nextStep?: () => void;
    prevStep?: () => void;
    handleSubmit?: (e: React.FormEvent) => void;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    formData: Partial<User>;
}

const Step1: React.FC<StepProps> = ({ nextStep, handleChange, formData }) => (
    <form onSubmit={nextStep} className="space-y-4">
        <InputField name="name" label="نام" value={formData.name!} onChange={handleChange} required />
        <SelectField name="gender" label="جنسیت" value={formData.gender!} onChange={handleChange} options={Object.values(Gender)} />
        <InputField name="location" label="مکان" value={formData.location!} onChange={handleChange} placeholder="مثلاً تهران، ایران" required />
        <InputField name="occupation" label="شغل" value={formData.occupation!} onChange={handleChange} placeholder="مثلاً مهندس نرم‌افزار" required />
        <button type="submit" className="w-full bg-pink-500 text-white font-bold py-3 rounded-lg hover:bg-pink-600">بعدی</button>
    </form>
);

const Step2: React.FC<StepProps> = ({ nextStep, prevStep, handleChange, formData }) => (
    <form onSubmit={nextStep} className="space-y-4">
        <SelectField name="maritalStatus" label="وضعیت تاهل" value={formData.maritalStatus!} onChange={handleChange} options={Object.values(MaritalStatus)} />
        <InputField name="height" label="قد (سانتی‌متر)" type="number" value={String(formData.height!)} onChange={handleChange} required />
        <InputField name="weight" label="وزن (کیلوگرم)" type="number" value={String(formData.weight!)} onChange={handleChange} required />
        <InputField name="favoriteSport" label="ورزش مورد علاقه" value={formData.favoriteSport!} onChange={handleChange} placeholder="مثلاً فوتبال" />
        <NavigationButtons onBack={prevStep!} />
    </form>
);

const Step3: React.FC<StepProps> = ({ handleSubmit, prevStep, handleChange, formData }) => (
    <form onSubmit={handleSubmit} className="space-y-4">
        <TextAreaField name="bio" label="درباره من" value={formData.bio!} onChange={handleChange} rows={3} placeholder="کمی درباره خودتان بگویید..." />
        <TextAreaField name="partnerPreferences" label="درباره شریک ایده‌آل من" value={formData.partnerPreferences!} onChange={handleChange} rows={3} placeholder="شخصی که دنبالش هستید را توصیف کنید..." />
        <NavigationButtons onBack={prevStep!} isSubmit />
    </form>
);


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

const NavigationButtons: React.FC<{onBack: () => void, isSubmit?: boolean}> = ({ onBack, isSubmit }) => (
    <div className="flex space-x-4 space-x-reverse">
        <button type="button" onClick={onBack} className="w-1/3 flex items-center justify-center bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-bold py-3 rounded-lg hover:bg-gray-400">
            <ArrowRightIcon className="h-5 w-5"/>
        </button>
        <button type={isSubmit ? 'submit' : 'submit'} className="w-2/3 bg-pink-500 text-white font-bold py-3 rounded-lg hover:bg-pink-600">
            {isSubmit ? 'پایان' : 'بعدی'}
        </button>
    </div>
);

export default RegisterPage;
