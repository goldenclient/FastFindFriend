import React, { useState } from 'react';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

const AdminBroadcastPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [text, setText] = useState('');
  const [gender, setGender] = useState('');
  const [location, setLocation] = useState('');
  const [occupation, setOccupation] = useState('');
  const [loading, setLoading] = useState(false);

  if (!currentUser?.isAdmin) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500 font-bold">دسترسی ادمین ندارید.</p>
      </div>
    );
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) {
      alert('متن پیام را وارد کنید');
      return;
    }
    setLoading(true);
    try {
      await api.post('/users/admin/message', {
        toAll: true,
        text,
        genderFilter: gender || null,
        locationFilter: location || null,
        occupationFilter: occupation || null,
      });
      alert('پیام ارسال شد');
      setText('');
    } catch (err: any) {
      alert(err?.message || 'خطا در ارسال پیام');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <Header title="ارسال پیغام همگانی" />
      <div className="p-4 overflow-y-auto">
        <form onSubmit={handleSend} className="space-y-4">
          <textarea
            className="w-full rounded-lg border p-3 bg-gray-50 dark:bg-gray-800"
            rows={4}
            placeholder="متن پیام به همه کاربران..."
            value={text}
            onChange={e => setText(e.target.value)}
            required
          />
          <div className="grid grid-cols-1 gap-3">
            <select
              className="w-full rounded-lg border p-3 bg-gray-50 dark:bg-gray-800"
              value={gender}
              onChange={e => setGender(e.target.value)}
            >
              <option value="">جنسیت (همه)</option>
              <option value="Male">مرد</option>
              <option value="Female">زن</option>
              <option value="Other">سایر</option>
              <option value="NotSpecified">نامشخص</option>
            </select>
            <input
              className="w-full rounded-lg border p-3 bg-gray-50 dark:bg-gray-800"
              placeholder="مکان (اختیاری)"
              value={location}
              onChange={e => setLocation(e.target.value)}
            />
            <input
              className="w-full rounded-lg border p-3 bg-gray-50 dark:bg-gray-800"
              placeholder="شغل (اختیاری)"
              value={occupation}
              onChange={e => setOccupation(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white rounded-xl py-3 font-bold shadow-md disabled:opacity-60"
          >
            {loading ? 'در حال ارسال...' : 'ارسال پیام'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminBroadcastPage;

