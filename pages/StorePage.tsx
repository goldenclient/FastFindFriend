
import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import Header from '../components/Header';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { StarIcon, BadgeCheckIcon, ArrowUpIcon } from '../components/Icon';

interface ProductFromDB {
  id: string;
  name: string;
  type: string;
  description: string;
  price: number; // قیمت به تومان
}

const iconMap: Record<string, any> = {
  'Subscription': StarIcon,
  'Badge': BadgeCheckIcon,
  'Boost': ArrowUpIcon,
};

const StorePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await api.get<ProductFromDB[]>('/products');
        // تبدیل به فرمت Product با icon
        const mappedProducts: Product[] = data.map(p => ({
          id: p.id,
          name: p.name,
          type: p.type as any,
          description: p.description,
          price: p.price, // قیمت به تومان
          icon: iconMap[p.type] || StarIcon,
        }));
        setProducts(mappedProducts);
      } catch (error) {
        console.error('Error loading products', error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <Header title="فروشگاه" showBackButton />
      <div className="flex-grow p-4 space-y-4 overflow-y-auto">
        <div className="text-center p-6 bg-gradient-to-l from-pink-500 to-orange-400 text-white rounded-lg">
            <h2 className="text-2xl font-bold">پتانسیل خود را آزاد کنید</h2>
            <p className="mt-2">تجربه خود را ارتقا دهید و بیشتر دیده شوید!</p>
        </div>
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">در حال بارگذاری...</p>
          </div>
        ) : (
          products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </div>
    </div>
  );
};

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
    const Icon = product.icon;
    return (
        <div className="p-5 bg-white dark:bg-gray-800 rounded-lg shadow-md flex items-start space-x-4 space-x-reverse">
            <div className="flex-shrink-0 w-12 h-12 bg-pink-100 dark:bg-pink-900 rounded-lg flex items-center justify-center">
                <Icon className="h-7 w-7 text-pink-500" />
            </div>
            <div className="flex-grow">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">{product.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{product.description}</p>
                <div className="mt-3 flex justify-between items-center">
                    <p className="text-xl font-bold text-pink-500">{product.price.toLocaleString('fa-IR')} تومان</p>
                    <Link to={`/product/${product.id}`} className="bg-pink-500 text-white font-semibold py-2 px-5 rounded-lg hover:bg-pink-600 transition-colors">
                        مشاهده
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default StorePage;
