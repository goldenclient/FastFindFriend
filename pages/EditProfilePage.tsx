
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Gender, MaritalStatus } from '../types';
import Header from '../components/Header';
import { api } from '../services/api';
import { CameraIcon, TrashIcon } from '../components/Icon';

// Helper to convert file to Base64
const toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
});

const EditProfilePage: React.FC = () => {
    const { currentUser, updateUser } = useAuth();
    const navigate = useNavigate();
    const [targetUserId, setTargetUserId] = useState<string | null>(null);
    const [isAdminEdit, setIsAdminEdit] = useState(false);
    const [targetUser, setTargetUser] = useState<User | null>(null);
    const [formData, setFormData] = useState<Partial<User>>({});

    useEffect(() => {
        // بررسی query parameter برای ویرایش توسط ادمین
        const urlParams = new URLSearchParams(window.location.search);
        const userId = urlParams.get('userId');
        const admin = urlParams.get('admin') === 'true';
        
        if (userId && admin && currentUser?.isAdmin) {
            setIsAdminEdit(true);
            setTargetUserId(userId);
            // بارگذاری کاربر هدف
            const loadTargetUser = async () => {
                try {
                    const data = await api.get<User>(`/users/${userId}`);
                    // Map backend data to frontend
                    if (data.photoUrl && !data.photo) {
                        data.photo = data.photoUrl;
                    }
                    if (data.storyUrl && !data.story) {
                        data.story = data.storyUrl;
                    }
                    if (data.galleryImages && (!data.gallery || data.gallery.length === 0)) {
                        data.gallery = data.galleryImages.map(img => img.imageUrl);
                    }
                    setTargetUser(data);
                    const dateStr = data.birthDate ? data.birthDate.split('T')[0] : '';
                    setFormData({ ...data, birthDate: dateStr });
                } catch (error) {
                    console.error('Error loading target user', error);
                    navigate('/admin/users');
                }
            };
            loadTargetUser();
        } else if (currentUser) {
            // ویرایش پروفایل خود
            const dateStr = currentUser.birthDate ? currentUser.birthDate.split('T')[0] : '';
            setFormData({ ...currentUser, birthDate: dateStr });
        }
    }, [currentUser, navigate]);

    const calculateAge = (birthDate: string): number => {
        const today = new Date();
        const birthDateObj = new Date(birthDate);
        let age = today.getFullYear() - birthDateObj.getFullYear();
        const m = today.getMonth() - birthDateObj.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDateObj.getDate())) {
            age--;
        }
        return age;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const inputType = (e.target as HTMLInputElement).type;
        
        let newValue: any = inputType === 'number' ? (value === '' ? 0 : parseFloat(value)) : value;

        setFormData(prev => {
            const updated = { ...prev, [name]: newValue };
            if (name === 'birthDate') {
                updated.age = calculateAge(value);
            }
            return updated;
        });
    };

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            try {
                const file = e.target.files[0];
                const base64 = await toBase64(file);
                setFormData(prev => ({ ...prev, photo: base64, photoUrl: base64 }));
            } catch (error) {
                console.error("Error converting file", error);
            }
        }
    };

    const handleStoryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            try {
                const file = e.target.files[0];
                const base64 = await toBase64(file);
                setFormData(prev => ({ ...prev, story: base64, storyUrl: base64 }));
            } catch (error) {
                console.error("Error converting file", error);
            }
        }
    };

    const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0] && targetUserId) {
            try {
                const file = e.target.files[0];
                const base64 = await toBase64(file);
                const response = await api.post<{ id: string; imageUrl: string }>(`/users/gallery`, { imageUrl: base64 });
                
                // Update formData gallery
                const currentGallery = formData.gallery || [];
                setFormData(prev => ({ 
                    ...prev, 
                    gallery: [...currentGallery, response.imageUrl] 
                }));
            } catch (error) {
                console.error("Error uploading gallery image", error);
                alert('خطا در آپلود تصویر گالری');
            }
        }
    };

    const handleDeleteGalleryImage = async (index: number) => {
        if (!targetUser || !targetUser.galleryImages) return;
        
        if (window.confirm('آیا از حذف این عکس مطمئن هستید؟')) {
            try {
                const imageId = targetUser.galleryImages[index]?.id;
                if (imageId) {
                    await api.delete(`/users/gallery/${imageId}`);
                    const newGallery = (formData.gallery || []).filter((_, i) => i !== index);
                    setFormData(prev => ({ ...prev, gallery: newGallery }));
                }
            } catch (error) {
                console.error("Error deleting image", error);
                alert('خطا در حذف تصویر');
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (isAdminEdit && targetUserId) {
            // ویرایش توسط ادمین
            try {
                // Prepare payload for admin update
                const payload: any = { ...formData };
                if (payload.photo) {
                    payload.PhotoUrl = payload.photo;
                }
                if (payload.story) {
                    payload.StoryUrl = payload.story;
                }
                
                await api.put(`/users/admin/${targetUserId}`, payload);
                alert('پروفایل کاربر با موفقیت بروزرسانی شد!');
                navigate('/admin/users');
            } catch (error) {
                console.error('Error updating user', error);
                alert('خطا در بروزرسانی پروفایل');
            }
        } else {
            // ویرایش پروفایل خود
            updateUser(formData);
            alert('پروفایل با موفقیت بروزرسانی شد!');
            navigate('/profile');
        }
    };
    
    if (!currentUser && !isAdminEdit) return null;
    if (isAdminEdit && !targetUser) return <div className="flex justify-center items-center h-full">در حال بارگذاری...</div>;

    return (
        <div className="flex flex-col h-full">
            <Header title="ویرایش پروفایل" showBackButton />
            <div className="flex-grow p-6 overflow-y-auto bg-gray-50 dark:bg-gray-900">
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* آپلود عکس پروفایل */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">عکس پروفایل</label>
                        <div className="flex items-center gap-4">
                            <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-pink-500">
                                <img 
                                    src={formData.photo || formData.photoUrl || 'https://via.placeholder.com/400'} 
                                    alt="Profile" 
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <label className="flex items-center gap-2 bg-pink-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-pink-600">
                                <CameraIcon className="h-5 w-5" />
                                <span>تغییر عکس</span>
                                <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                            </label>
                        </div>
                    </div>

                    {/* آپلود استوری */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">عکس استوری</label>
                        <div className="flex items-center gap-4">
                            {formData.story || formData.storyUrl ? (
                                <div className="relative w-24 h-24 rounded-lg overflow-hidden border-2 border-pink-500">
                                    <img 
                                        src={formData.story || formData.storyUrl || ''} 
                                        alt="Story" 
                                        className="w-full h-full object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, story: '', storyUrl: '' }))}
                                        className="absolute top-1 left-1 bg-red-500 text-white p-1 rounded-full"
                                    >
                                        <TrashIcon className="h-4 w-4" />
                                    </button>
                                </div>
                            ) : null}
                            <label className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-600">
                                <CameraIcon className="h-5 w-5" />
                                <span>{formData.story || formData.storyUrl ? 'تغییر استوری' : 'افزودن استوری'}</span>
                                <input type="file" className="hidden" accept="image/*" onChange={handleStoryUpload} />
                            </label>
                        </div>
                    </div>

                    {/* مدیریت گالری (فقط برای ادمین) */}
                    {isAdminEdit && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">گالری تصاویر</label>
                            <div className="grid grid-cols-3 gap-2 mb-2">
                                {(formData.gallery || []).map((photo, index) => (
                                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-300">
                                        <img src={photo} alt={`Gallery ${index}`} className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteGalleryImage(index)}
                                            className="absolute top-1 left-1 bg-red-500 text-white p-1 rounded-full"
                                        >
                                            <TrashIcon className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <label className="flex items-center justify-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-green-600">
                                <CameraIcon className="h-5 w-5" />
                                <span>افزودن به گالری</span>
                                <input type="file" className="hidden" accept="image/*" onChange={handleGalleryUpload} />
                            </label>
                        </div>
                    )}

                    <InputField name="name" label="نام" value={formData.name || ''} onChange={handleChange} required />
                    <SelectField name="gender" label="جنسیت" value={formData.gender || Gender.Female} onChange={handleChange} options={Object.values(Gender)} />
                    
                    <InputField name="birthDate" label="تاریخ تولد" type="date" value={formData.birthDate || ''} onChange={handleChange} required />
                    <div className="text-sm text-gray-500 text-right">سن: {formData.age} سال</div>

                    <InputField name="location" label="مکان" value={formData.location || ''} onChange={handleChange} placeholder="مثلاً تهران، ایران" required />
                    <InputField name="occupation" label="شغل" value={formData.occupation || ''} onChange={handleChange} placeholder="مثلاً مهندس نرم‌افزار" required />
                    <SelectField name="maritalStatus" label="وضعیت تاهل" value={formData.maritalStatus || MaritalStatus.Single} onChange={handleChange} options={Object.values(MaritalStatus)} />
                    <InputField name="height" label="قد (سانتی‌متر)" type="number" value={String(formData.height || 0)} onChange={handleChange} required />
                    <InputField name="weight" label="وزن (کیلوگرم)" type="number" value={String(formData.weight || 0)} onChange={handleChange} required />
                    <InputField name="favoriteSport" label="ورزش مورد علاقه" value={formData.favoriteSport || ''} onChange={handleChange} placeholder="مثلاً فوتبال" />
                    <TextAreaField name="bio" label="درباره من" value={formData.bio || ''} onChange={handleChange} rows={3} placeholder="کمی درباره خودتان بگویید..." />
                    <TextAreaField name="partnerPreferences" label="درباره شریک ایده‌آل من" value={formData.partnerPreferences || ''} onChange={handleChange} rows={3} placeholder="شخصی که دنبالش هستید را توصیف کنید..." />

                    <div className="pt-4 pb-8">
                        <button type="submit" className="w-full bg-pink-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-pink-600 transition-colors duration-300">
                            ذخیره تغییرات
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
