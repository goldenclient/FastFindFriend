import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

const genders = [
  { value: 'NotSpecified', label: 'نامشخص' },
  { value: 'Male', label: 'مرد' },
  { value: 'Female', label: 'زن' },
  { value: 'Other', label: 'سایر' },
];

const maritalStatuses = [
  { value: 'Single', label: 'مجرد' },
  { value: 'Married', label: 'متاهل' },
  { value: 'Divorced', label: 'مطلقه' },
  { value: 'Widowed', label: 'بیوه' },
  { value: 'InRelationship', label: 'در رابطه' },
  { value: 'NotSpecified', label: 'نامشخص' },
];

const AdminCreateUserPage: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    mobile: '',
    name: '',
    age: 18,
    gender: 'NotSpecified',
    location: '',
    occupation: '',
    bio: '',
    maritalStatus: 'NotSpecified',
    height: 0,
    weight: 0,
    favoriteSport: '',
    partnerPreferences: '',
    isPremium: false,
    isGhostMode: false,
    photoUrl: '',
    storyUrl: ''
  });

  if (!currentUser?.isAdmin) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500 font-bold">دسترسی ادمین ندارید.</p>
      </div>
    );
  }

  const toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });

  const handleFile = async (file: File, key: 'photoUrl' | 'storyUrl') => {
    const base64 = await toBase64(file);
    setForm(prev => ({ ...prev, [key]: base64 }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/users/admin', {
        mobile: form.mobile,
        name: form.name,
        age: form.age,
        gender: form.gender,
        location: form.location,
        occupation: form.occupation,
        bio: form.bio,
        maritalStatus: form.maritalStatus,
        height: form.height,
        weight: form.weight,
        favoriteSport: form.favoriteSport,
        partnerPreferences: form.partnerPreferences,
        isPremium: form.isPremium,
        isGhostMode: form.isGhostMode,
        photoUrl: form.photoUrl,
        storyUrl: form.storyUrl,
      });
      alert('کاربر با موفقیت ایجاد شد');
      navigate('/admin');
    } catch (err: any) {
      alert(err?.message || 'خطا در ایجاد کاربر');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <Header title="ایجاد کاربر جدید" />
      <div className="p-4 overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            <input className="w-full rounded-lg border p-3 bg-gray-50 dark:bg-gray-800"
              placeholder="موبایل *" required
              value={form.mobile} onChange={e => setForm({ ...form, mobile: e.target.value })} />
            <input className="w-full rounded-lg border p-3 bg-gray-50 dark:bg-gray-800" placeholder="نام"
              value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            <div className="grid grid-cols-2 gap-3">
              <input className="w-full rounded-lg border p-3 bg-gray-50 dark:bg-gray-800" type="number" placeholder="سن"
                value={form.age} onChange={e => setForm({ ...form, age: Number(e.target.value) })} />
              <select className="w-full rounded-lg border p-3 bg-gray-50 dark:bg-gray-800" value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}>
                {genders.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input className="w-full rounded-lg border p-3 bg-gray-50 dark:bg-gray-800" placeholder="مکان"
                value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
              <input className="w-full rounded-lg border p-3 bg-gray-50 dark:bg-gray-800" placeholder="شغل"
                value={form.occupation} onChange={e => setForm({ ...form, occupation: e.target.value })} />
            </div>
            <select className="w-full rounded-lg border p-3 bg-gray-50 dark:bg-gray-800" value={form.maritalStatus} onChange={e => setForm({ ...form, maritalStatus: e.target.value })}>
              {maritalStatuses.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
            <div className="grid grid-cols-2 gap-3">
              <input className="w-full rounded-lg border p-3 bg-gray-50 dark:bg-gray-800" type="number" placeholder="قد (cm)"
                value={form.height} onChange={e => setForm({ ...form, height: Number(e.target.value) })} />
              <input className="w-full rounded-lg border p-3 bg-gray-50 dark:bg-gray-800" type="number" placeholder="وزن (kg)"
                value={form.weight} onChange={e => setForm({ ...form, weight: Number(e.target.value) })} />
            </div>
            <input className="w-full rounded-lg border p-3 bg-gray-50 dark:bg-gray-800" placeholder="ورزش مورد علاقه"
              value={form.favoriteSport} onChange={e => setForm({ ...form, favoriteSport: e.target.value })} />
            <input className="w-full rounded-lg border p-3 bg-gray-50 dark:bg-gray-800" placeholder="ترجیحات پارتنر"
              value={form.partnerPreferences} onChange={e => setForm({ ...form, partnerPreferences: e.target.value })} />
            <textarea className="w-full rounded-lg border p-3 bg-gray-50 dark:bg-gray-800" rows={3} placeholder="بیو"
              value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} />
            <div className="grid grid-cols-2 gap-3">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.isPremium}
                  onChange={e => setForm({ ...form, isPremium: e.target.checked })} />
                <span>پرمیوم</span>
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.isGhostMode}
                  onChange={e => setForm({ ...form, isGhostMode: e.target.checked })} />
                <span>حالت مخفی</span>
              </label>
            </div>
            <div className="grid grid-cols-1 gap-2">
              <label className="text-sm font-semibold">عکس پروفایل</label>
              <input type="file" accept="image/*" onChange={e => e.target.files && handleFile(e.target.files[0], 'photoUrl')} />
              {form.photoUrl && <img src={form.photoUrl} alt="preview" className="h-24 rounded-lg object-cover" />}
            </div>
            <div className="grid grid-cols-1 gap-2">
              <label className="text-sm font-semibold">استوری</label>
              <input type="file" accept="image/*" onChange={e => e.target.files && handleFile(e.target.files[0], 'storyUrl')} />
              {form.storyUrl && <img src={form.storyUrl} alt="preview" className="h-24 rounded-lg object-cover" />}
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pink-600 text-white rounded-xl py-3 font-bold shadow-md disabled:opacity-60"
          >
            {loading ? 'در حال ایجاد...' : 'ایجاد کاربر'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminCreateUserPage;

