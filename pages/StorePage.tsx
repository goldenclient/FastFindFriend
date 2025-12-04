
import React from 'react';
import { Product } from '../types';
import { MOCK_PRODUCTS } from '../data/products';
import Header from '../components/Header';
import { Link } from 'react-router-dom';

const StorePage: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <Header title="Store" showBackButton />
      <div className="flex-grow p-4 space-y-4 overflow-y-auto">
        <div className="text-center p-6 bg-gradient-to-r from-pink-500 to-orange-400 text-white rounded-lg">
            <h2 className="text-2xl font-bold">Unlock Your Potential</h2>
            <p className="mt-2">Upgrade your experience and get noticed!</p>
        </div>
        {MOCK_PRODUCTS.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
    const Icon = product.icon;
    return (
        <div className="p-5 bg-white dark:bg-gray-800 rounded-lg shadow-md flex items-start space-x-4">
            <div className="flex-shrink-0 w-12 h-12 bg-pink-100 dark:bg-pink-900 rounded-lg flex items-center justify-center">
                <Icon className="h-7 w-7 text-pink-500" />
            </div>
            <div className="flex-grow">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">{product.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{product.description}</p>
                <div className="mt-3 flex justify-between items-center">
                    <p className="text-xl font-bold text-pink-500">${product.price.toFixed(2)}</p>
                    <Link to={`/product/${product.id}`} className="bg-pink-500 text-white font-semibold py-2 px-5 rounded-lg hover:bg-pink-600 transition-colors">
                        View
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default StorePage;
