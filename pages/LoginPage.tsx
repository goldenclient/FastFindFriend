
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { User } from '../types';

const LoginPage: React.FC = () => {
    const [step, setStep] = useState<1 | 2>(1);
    const [mobile, setMobile] = useState('');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSendCode = async (e: React.FormEvent) => {
        e.preventDefault();
        if (mobile.length >= 10) {
            setLoading(true);
            try {
                // Call API to send OTP
                await api.post('/auth/send-otp', { mobile });
                setStep(2);
            } catch (error) {
                alert('خطا در ارسال کد تایید. لطفاً دوباره تلاش کنید.');
                console.error(error);
            } finally {
                setLoading(false);
            }
        } else {
            alert('لطفاً شماره موبایل معتبر وارد کنید.');
        }
    };

    const handleVerifyAndLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (otp.length === 4) {
            setLoading(true);
            let verifiedToken = '';
            let verifiedUserId = '';

            // Step 1: Verify OTP
            try {
                interface VerifyResponse {
                    Token?: string;
                    token?: string;
                    UserId?: string;
                    userId?: string;
                }
                
                const response = await api.post<VerifyResponse>('/auth/verify-otp', { mobile, otpCode: otp });
                
                // Handle both PascalCase and camelCase
                const token = response.Token || response.token;
                const userId = response.UserId || response.userId;

                if (!token || !userId) {
                    throw new Error('پاسخ نامعتبر از سرور دریافت شد.');
                }

                verifiedToken = token;
                verifiedUserId = userId;
                api.setToken(token);

            } catch (error) {
                console.error("OTP Verification Error:", error);
                alert('کد تایید نادرست است یا خطایی در سرور رخ داده است.');
                setLoading(false);
                return;
            }

            // Step 2: Fetch Profile
            try {
                // We need the full user object to populate the AuthContext
                const userProfileData = await api.get<User>(`/users/${verifiedUserId}`);
                
                // MAP BACKEND DATA TO FRONTEND MODEL
                // Backend returns galleryImages (objects), Frontend uses gallery (strings)
                if (userProfileData.galleryImages && !userProfileData.gallery) {
                    userProfileData.gallery = userProfileData.galleryImages.map(img => img.imageUrl);
                }

                // 3. Login and update context
                login(verifiedToken, userProfileData);
                navigate('/');
            } catch (error) {
                console.error("Profile Fetch Error:", error);
                alert('ورود موفقیت‌آمیز بود اما دریافت پروفایل با خطا مواجه شد. لطفاً اتصال بک‌اند را بررسی کنید.');
                // We don't remove token immediately here to allow debugging if needed, 
                // but strictly speaking we should:
                api.removeToken();
            } finally {
                setLoading(false);
            }
        } else {
            alert('کد تایید باید ۴ رقم باشد.');
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
                                disabled={loading}
                            />
                        </div>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-pink-600 text-white font-bold py-3.5 px-4 rounded-xl hover:bg-pink-700 transition-colors duration-300 shadow-md disabled:bg-gray-400"
                        >
                            {loading ? 'در حال ارسال...' : 'ارسال کد تایید'}
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
                                disabled={loading}
                            />
                        </div>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-pink-600 text-white font-bold py-3.5 px-4 rounded-xl hover:bg-pink-700 transition-colors duration-300 shadow-md disabled:bg-gray-400"
                        >
                            {loading ? 'در حال بررسی...' : 'ورود'}
                        </button>
                        <button 
                            type="button" 
                            onClick={() => setStep(1)} 
                            className="w-full text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            disabled={loading}
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
