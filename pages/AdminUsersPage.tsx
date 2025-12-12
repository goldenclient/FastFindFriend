import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

interface AdminUserItem {
  id: string;
  mobile: string;
  name: string;
  gender?: string;
  location?: string;
  occupation?: string;
  isPremium?: boolean;
  lastActive?: string;
  photoUrl?: string;
}

const AdminUsersPage: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterPremium, setFilterPremium] = useState<boolean | null>(null);
  const [filterGender, setFilterGender] = useState<string>('');

  const loadUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterPremium !== null) params.append('isPremium', filterPremium.toString());
      if (filterGender) params.append('gender', filterGender);
      const query = params.toString();
      const url = `/users/admin/list${query ? '?' + query : ''}`;
      const data = await api.get<AdminUserItem[]>(url);
      setUsers(data);
    } catch (err: any) {
      alert(err?.message || 'خطا در دریافت کاربران');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?.isAdmin) {
      loadUsers();
    }
  }, [currentUser, filterPremium, filterGender]);

  if (!currentUser?.isAdmin) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500 font-bold">دسترسی ادمین ندارید.</p>
      </div>
    );
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('حذف کاربر؟')) return;
    try {
      await api.delete(`/users/admin/${id}`);
      setUsers(prev => prev.filter(u => u.id !== id));
      alert('کاربر حذف شد');
    } catch (err: any) {
      alert(err?.message || 'خطا در حذف');
    }
  };

  const handleSendMessage = async (id: string) => {
    const text = window.prompt('متن پیام به این کاربر را وارد کنید');
    if (!text) return;
    try {
      await api.post('/users/admin/message', { toAll: false, targetUserId: id, text });
      alert('پیام ارسال شد');
    } catch (err: any) {
      alert(err?.message || 'خطا در ارسال پیام');
    }
  };

  const formatDate = (d?: string) => d ? new Date(d).toLocaleString('fa-IR') : '---';

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <Header title="لیست کاربران" />
      <div className="p-4 space-y-3">
        {/* فیلترها */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-3 shadow space-y-2">
          <div className="text-sm font-bold mb-2">فیلترها:</div>
          <div className="flex gap-2 flex-wrap">
            <select 
              className="flex-1 min-w-[120px] rounded-lg border p-2 bg-gray-50 dark:bg-gray-700 text-sm"
              value={filterPremium === null ? '' : filterPremium.toString()}
              onChange={e => setFilterPremium(e.target.value === '' ? null : e.target.value === 'true')}
            >
              <option value="">همه (پرمیوم)</option>
              <option value="true">پرمیوم</option>
              <option value="false">عادی</option>
            </select>
            <select 
              className="flex-1 min-w-[120px] rounded-lg border p-2 bg-gray-50 dark:bg-gray-700 text-sm"
              value={filterGender}
              onChange={e => setFilterGender(e.target.value)}
            >
              <option value="">همه (جنسیت)</option>
              <option value="Male">مرد</option>
              <option value="Female">زن</option>
              <option value="Other">سایر</option>
            </select>
          </div>
        </div>
      </div>
      <div className="px-4 pb-4 overflow-y-auto space-y-3">
        {loading && <p className="text-center">در حال بارگذاری...</p>}
        {!loading && users.map(u => (
          <div key={u.id} className="bg-white dark:bg-gray-800 rounded-xl p-3 shadow flex gap-3">
            <img src={u.photoUrl || '/avatar.png'} alt="avatar" className="w-14 h-14 rounded-lg object-cover" />
            <div className="flex-1 text-right">
              <div className="font-bold">{u.name || 'بدون نام'} {u.isPremium && <span className="text-pink-500 text-xs">(پرمیوم)</span>}</div>
              <div className="text-sm text-gray-500">موبایل: {u.mobile}</div>
              <div className="text-xs text-gray-400">آخرین فعالیت: {formatDate(u.lastActive)}</div>
              <div className="flex flex-wrap gap-2 mt-2 justify-end">
                <button onClick={() => navigate(`/user/${u.id}?admin=true`)} className="px-3 py-1 rounded-lg bg-blue-100 text-blue-700 text-sm">مشاهده</button>
                <button onClick={() => handleSendMessage(u.id)} className="px-3 py-1 rounded-lg bg-purple-100 text-purple-700 text-sm">ارسال پیام</button>
                <button onClick={() => handleDelete(u.id)} className="px-3 py-1 rounded-lg bg-red-500 text-white text-sm">حذف</button>
              </div>
            </div>
          </div>
        ))}
        {!loading && users.length === 0 && <p className="text-center text-gray-500">کاربری یافت نشد.</p>}
      </div>
    </div>
  );
};

export default AdminUsersPage;

