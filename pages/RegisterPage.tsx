
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Gender, MaritalStatus, User } from '../types';
import { ArrowRightIcon } from '../components/Icon';
import { api } from '../services/api';

const RegisterPage: React.FC = () => {
    const [step, setStep] = useState(0); 
    const [mobile, setMobile] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState<Partial<User>>({
        name: '',
        gender: Gender.Female,
        location: '',
        occupation: '',
        bio: '',
        photo: 'https://via.placeholder.com/400',
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

    const handleSendCode = async (e: React.FormEvent) => {
        e.preventDefault();
        if (mobile.length >= 10) {
            setLoading(true);
            try {
                await api.post('/auth/send-otp', { mobile });
                setOtpSent(true);
            } catch (e) {
                alert('خطا در ارسال کد.');
            } finally {
                setLoading(false);
            }
        } else {
            alert('لطفاً شماره موبایل معتبر وارد کنید.');
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (otp.length === 4) {
            setLoading(true);
            try {
                // Assuming verify-otp returns a token even if profile incomplete, or use a temp token
                // For simplified flow, we verify OTP, get a token, then next steps are Profile Updates.
                const response: any = await api.post('/auth/verify-otp', { mobile, otpCode: otp });
                api.setToken(response.token);
                setStep(1);
            } catch (e) {
                alert('کد تایید صحیح نیست.');
            } finally {
                setLoading(false);
            }
        } else {
            alert('کد تایید صحیح نیست.');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Update the profile with collected data
            await api.put('/users/profile', formData);
            
            // Fetch full user and login
            const fullUser = await api.get<User>('/users/profile');
            const token = api.getToken();
            if (token) {
                 login(token, fullUser);
                 alert('ثبت نام با موفقیت انجام شد!');
                 navigate('/');
            }
        } catch (e) {
            console.error(e);
            alert('خطا در تکمیل ثبت نام.');
        } finally {
            setLoading(false);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 0:
                return (
                    <div className="space-y-6">
                         {!otpSent ? (
                            <form onSubmit={handleSendCode} className="space-y-4">
                                <InputField name="mobile" label="شماره موبایل" value={mobile} onChange={(e: any) => setMobile(e.target.value)} placeholder="09123456789" type="tel" required />
                                <button type="submit" disabled={loading} className="w-full bg-pink-500 text-white font-bold py-3 rounded-lg hover:bg-pink-600 disabled:bg-gray-400">
                                    {loading ? '...' : 'ارسال کد تایید'}
                                </button>
                            </form>
                         ) : (
                            <form onSubmit={handleVerifyOtp} className="space-y-4">
                                <p className="text-sm text-center text-gray-500">کد ارسال شده به {mobile} را وارد کنید</p>
                                <InputField name="otp" label="کد تایید" value={otp} onChange={(e: any) => setOtp(e.target.value)} placeholder="----" required />
                                <button type="submit" disabled={loading} className="w-full bg-pink-500 text-white font-bold py-3 rounded-lg hover:bg-pink-600 disabled:bg-gray-400">
                                    {loading ? '...' : 'تایید و ادامه'}
                                </button>
                                <button type="button" onClick={() => setOtpSent(false)} className="w-full text-sm text-gray-500 mt-2">اصلاح شماره موبایل</button>
                            </form>
                         )}
                    </div>
                );
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
                    {step > 0 && <p className="text-gray-500 dark:text-gray-400 mt-1">مرحله {step} از 3</p>}
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
