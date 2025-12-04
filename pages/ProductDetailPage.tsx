
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Product } from '../types';
import { MOCK_PRODUCTS } from '../data/products';
import Header from '../components/Header';

const ProductDetailPage: React.FC = () => {
    const { productId } = useParams<{ productId: string }>();
    const navigate = useNavigate();
    const [product, setProduct] = useState<Product | null>(null);

    useEffect(() => {
        const foundProduct = MOCK_PRODUCTS.find(p => p.id === productId);
        if (foundProduct) {
            setProduct(foundProduct);
        } else {
            navigate('/store');
        }
    }, [productId, navigate]);

    const handlePayment = () => {
        // Mock payment logic
        alert(`از خرید ${product?.name} متشکریم! حساب کاربری شما ارتقا یافت.`);
        navigate('/store');
    };

    if (!product) {
        return <div>در حال بارگذاری...</div>;
    }
    
    const Icon = product.icon;

    return (
        <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
            <Header title={product.name} showBackButton />
            <div className="flex-grow flex flex-col justify-between p-6 overflow-y-auto">
                <div className="text-center">
                    <div className="w-24 h-24 bg-pink-100 dark:bg-pink-900 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Icon className="h-12 w-12 text-pink-500" />
                    </div>
                    <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">{product.name}</h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300">{product.description}</p>
                </div>
                
                <div className="mt-8 flex-none">
                    <div className="text-center mb-6">
                        <p className="text-sm text-gray-500 dark:text-gray-400">قیمت کل</p>
                        <p className="text-5xl font-bold text-pink-500">{product.price.toFixed(2)}$</p>
                    </div>
                    <button 
                        onClick={handlePayment} 
                        className="w-full bg-pink-500 text-white font-bold py-4 px-4 rounded-xl hover:bg-pink-600 transition-colors text-lg"
                    >
                        پرداخت و فعال‌سازی
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;
