import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

interface Product {
  id: string;
  name: string;
  type: string;
  description: string;
  price: number; // قیمت به تومان
}

const AdminProductsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({});

  useEffect(() => {
    if (currentUser?.isAdmin) {
      loadProducts();
    }
  }, [currentUser]);

  if (!currentUser?.isAdmin) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500 font-bold">دسترسی ادمین ندارید.</p>
      </div>
    );
  }

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await api.get<Product[]>('/products');
      setProducts(data);
    } catch (err: any) {
      alert(err?.message || 'خطا در دریافت محصولات');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setFormData({ id: 'prod_new', name: '', type: 'Subscription', description: '', price: 0 });
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({ ...product });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('حذف محصول؟')) return;
    try {
      await api.delete(`/products/admin/${id}`);
      setProducts(prev => prev.filter(p => p.id !== id));
      alert('محصول حذف شد');
    } catch (err: any) {
      alert(err?.message || 'خطا در حذف');
    }
  };

  const handleSave = async () => {
    if (!formData.id || !formData.name || formData.price === undefined) {
      alert('شناسه، نام و قیمت الزامی است');
      return;
    }

    try {
      if (editingProduct) {
        await api.put(`/products/admin/${editingProduct.id}`, formData);
      } else {
        await api.post('/products/admin', formData);
      }
      setEditingProduct(null);
      setFormData({});
      loadProducts();
      alert('ذخیره شد');
    } catch (err: any) {
      alert(err?.message || 'خطا در ذخیره');
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <Header title="مدیریت محصولات" />
      <div className="p-4 space-y-3">
        <button
          onClick={handleAdd}
          className="w-full bg-green-600 text-white rounded-lg py-2 font-bold"
        >
          افزودن محصول جدید
        </button>

        {loading && <p className="text-center">در حال بارگذاری...</p>}
        {!loading && products.map(p => (
          <div key={p.id} className="bg-white dark:bg-gray-800 rounded-xl p-3 shadow">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="font-bold">{p.name}</div>
                <div className="text-sm text-gray-500">{p.type}</div>
                <div className="text-sm mt-1">{p.description}</div>
                <div className="text-lg font-bold text-pink-500 mt-2">{p.price.toLocaleString('fa-IR')} تومان</div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(p)}
                  className="px-3 py-1 rounded-lg bg-blue-100 text-blue-700 text-sm"
                >
                  ویرایش
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="px-3 py-1 rounded-lg bg-red-500 text-white text-sm"
                >
                  حذف
                </button>
              </div>
            </div>
          </div>
        ))}
        {!loading && products.length === 0 && <p className="text-center text-gray-500">محصولی یافت نشد.</p>}
      </div>

      {(formData.id || editingProduct) && formData.id !== '' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 w-full max-w-md space-y-3 max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-lg mb-2">{editingProduct ? 'ویرایش محصول' : 'افزودن محصول'}</h3>
            <input
              className="w-full rounded-lg border p-3 bg-gray-50 dark:bg-gray-700"
              placeholder="شناسه (مثل prod_premium)"
              value={formData.id || ''}
              onChange={e => setFormData({ ...formData, id: e.target.value })}
              disabled={!!editingProduct}
            />
            <input
              className="w-full rounded-lg border p-3 bg-gray-50 dark:bg-gray-700"
              placeholder="نام محصول"
              value={formData.name || ''}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
            <select
              className="w-full rounded-lg border p-3 bg-gray-50 dark:bg-gray-700"
              value={formData.type || 'Subscription'}
              onChange={e => setFormData({ ...formData, type: e.target.value })}
            >
              <option value="Subscription">Subscription</option>
              <option value="Badge">Badge</option>
              <option value="Boost">Boost</option>
            </select>
            <textarea
              className="w-full rounded-lg border p-3 bg-gray-50 dark:bg-gray-700"
              placeholder="توضیحات"
              rows={3}
              value={formData.description || ''}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
            />
            <input
              type="number"
              className="w-full rounded-lg border p-3 bg-gray-50 dark:bg-gray-700"
              placeholder="قیمت (تومان)"
              value={formData.price || ''}
              onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
            />
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => { setEditingProduct(null); setFormData({}); }}
                className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-lg py-2"
              >
                انصراف
              </button>
              <button
                onClick={handleSave}
                className="flex-1 bg-green-600 text-white rounded-lg py-2"
              >
                ذخیره
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductsPage;

