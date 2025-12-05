
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MOCK_LOGGED_IN_USER } from '../data/users';

const LoginPage: React.FC = () => {
    const [step, setStep] = useState<1 | 2>(1);
    const [mobile, setMobile] = useState('');
    const [otp, setOtp] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSendCode = (e: React.FormEvent) => {
        e.preventDefault();
        if (mobile.length >= 10) {
            // Simulate sending code
            console.log('Sending OTP to', mobile);
            setStep(2);
        } else {
            alert('لطفاً شماره موبایل معتبر وارد کنید.');
        }
    };

    const handleVerifyAndLogin = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (otp.length === 4) {
            let userToLogin = { ...MOCK_LOGGED_IN_USER };
            
            // Check for special test user
            if (mobile === '09123456789') {
                userToLogin.isPremium = true;
                userToLogin.isGhostMode = false;
                alert('شما به عنوان کاربر ویژه وارد شدید!');
            } else {
                userToLogin.isPremium = false;
                userToLogin.isGhostMode = false;
            }

            login(userToLogin);
            navigate('/');
        } else {
            alert('کد تایید نادرست است. (کد تستی: هر 4 رقمی)');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 p-6 overflow-hidden">
            <div className="w-full max-w-sm bg-white/90 dark:bg-black/80 backdrop-blur-md rounded-2xl shadow-2xl p-8 animate-fade-in-up">
                
                <div className="flex justify-center mb-6">
                    <div className="p-3">
                        <img src="/logo.png" alt="3F Logo" className="h-24 w-auto drop-shadow-md" />
                    </div>
                </div>

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">تری اف</h1>
                    <p className="text-gray-500 dark:text-gray-300 mt-2 text-sm">
                        {step === 1 ? 'شماره موبایل خود را وارد کنید' : 'کد تایید ارسال شده را وارد کنید'}
                    </p>
                </div>

                {step === 1 ? (
                    <form onSubmit={handleSendCode} className="space-y-6">
                        <div>
                            <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 dark:text-gray-300">شماره موبایل</label>
                            <input
                                type="tel"
                                id="mobile"
                                value={mobile}
                                onChange={(e) => setMobile(e.target.value)}
                                className="mt-1 block w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 text-left dir-ltr text-lg tracking-widest"
                                placeholder="09123456789"
                                required
                                autoFocus
                            />
                        </div>
                        <button type="submit" className="w-full bg-pink-600 text-white font-bold py-3.5 px-4 rounded-xl hover:bg-pink-700 transition-colors duration-300 shadow-md">
                            ارسال کد تایید
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyAndLogin} className="space-y-6">
                        <div>
                             <label htmlFor="otp" className="block text-sm font-medium text-gray-700 dark:text-gray-300">کد تایید (۴ رقم)</label>
                             <input
                                type="text"
                                inputMode="numeric"
                                id="otp"
                                maxLength={4}
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="mt-1 block w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 text-center text-2xl tracking-[0.5em] font-bold"
                                placeholder="----"
                                required
                                autoFocus
                            />
                        </div>
                        <button type="submit" className="w-full bg-pink-600 text-white font-bold py-3.5 px-4 rounded-xl hover:bg-pink-700 transition-colors duration-300 shadow-md">
                            ورود
                        </button>
                        <button 
                            type="button" 
                            onClick={() => setStep(1)} 
                            className="w-full text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                            تغییر شماره موبایل
                        </button>
                    </form>
                )}

                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        حساب کاربری ندارید؟{' '}
                        <Link to="/register" className="font-bold text-pink-600 hover:text-pink-500">
                            ثبت نام کنید
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;