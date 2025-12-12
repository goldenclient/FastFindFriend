import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';

const AdminPage: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  if (!currentUser?.isAdmin) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500 font-bold">دسترسی ادمین ندارید.</p>
      </div>
    );
  }

  const items = [
    { title: 'ایجاد کاربر جدید', desc: 'ثبت کاربر با تمام جزئیات و عکس پروفایل', to: '/admin/create-user', color: 'bg-pink-500' },
    { title: 'حذف و ویرایش کاربران', desc: 'لیست کاربران، مشاهده پروفایل، حذف و ویرایش', to: '/admin/users', color: 'bg-purple-500' },
    { title: 'ارسال پیغام', desc: 'ارسال پیام همگانی بر اساس جنسیت/مکان/شغل', to: '/admin/broadcast', color: 'bg-blue-500' },
    { title: 'مدیریت محصولات', desc: 'افزودن، ویرایش و حذف محصولات فروشگاه', to: '/admin/products', color: 'bg-green-500' },
  ];

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <Header title="پنل ادمین" />
      <div className="p-5 grid gap-4">
        {items.map(item => (
          <button
            key={item.to}
            onClick={() => navigate(item.to)}
            className={`w-full text-right rounded-2xl p-4 shadow-lg text-white ${item.color} transition transform hover:scale-[1.01]`}
          >
            <div className="text-lg font-extrabold mb-1">{item.title}</div>
            <div className="text-sm opacity-90">{item.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default AdminPage;
