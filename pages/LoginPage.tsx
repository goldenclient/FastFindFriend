
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MOCK_LOGGED_IN_USER } from '../data/users';

const LoginPage: React.FC = () => {
    const [mobile, setMobile] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock login logic
        if (mobile && password) {
            alert('ورود با موفقیت انجام شد!');
            login(MOCK_LOGGED_IN_USER);
            navigate('/');
        } else {
            alert('لطفاً شماره موبایل و رمز عبور را وارد کنید.');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-full bg-gray-100 dark:bg-gray-900 p-6 overflow-y-auto">
            <div className="w-full max-w-sm">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-pink-500">خوش آمدید</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">برای ادامه وارد شوید.</p>
                </div>
                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 dark:text-gray-300">شماره موبایل</label>
                        <input
                            type="tel"
                            id="mobile"
                            value={mobile}
                            onChange={(e) => setMobile(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 text-left dir-ltr"
                            placeholder="09123456789"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password"  className="block text-sm font-medium text-gray-700 dark:text-gray-300">رمز عبور</label>
                         <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 text-left dir-ltr"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <button type="submit" className="w-full bg-pink-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-pink-600 transition-colors duration-300">
                        ورود
                    </button>
                </form>
                <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
                    حساب کاربری ندارید؟{' '}
                    <Link to="/register" className="font-medium text-pink-500 hover:text-pink-400">
                        ثبت نام کنید
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
