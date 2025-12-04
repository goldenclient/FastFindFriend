
import { Product, ProductType } from '../types';
import { StarIcon, BadgeCheckIcon, ArrowUpIcon } from '../components/Icon';

export const MOCK_PRODUCTS: Product[] = [
    {
        id: 'prod_premium',
        name: 'اشتراک ویژه',
        type: ProductType.Subscription,
        description: 'با اشتراک ویژه، از امکانات نامحدود لذت ببرید: مشاهده کسانی که شما را لایک کرده‌اند، ارسال پیام بدون محدودیت، و تجربه بدون تبلیغات.',
        price: 9.99,
        icon: StarIcon,
    },
    {
        id: 'prod_badge',
        name: 'نشان تایید',
        type: ProductType.Badge,
        description: 'با نشان تایید، پروفایل خود را از دیگران متمایز کنید. این نشان در کنار نام شما نمایش داده می‌شود و اعتماد بیشتری جلب می‌کند.',
        price: 4.99,
        icon: BadgeCheckIcon,
    },
    {
        id: 'prod_ladder',
        name: 'نردبان',
        type: ProductType.Boost,
        description: 'با استفاده از نردبان، پروفایل شما به مدت ۳۰ دقیقه در صدر لیست‌های جستجو قرار می‌گیرد و بازدید پروفایلتان به شدت افزایش می‌یابد.',
        price: 2.99,
        icon: ArrowUpIcon,
    }
];
