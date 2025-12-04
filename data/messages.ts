
import { Message, Chat } from '../types';

export const MOCK_MESSAGES: { [key: string]: Message[] } = {
  '1': [
    { id: 'm1', senderId: '1', receiverId: 'currentUser', text: 'سلام! پروفایلت رو دیدم و خیلی مشترکات داریم، مخصوصاً کوهنوردی!', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24) },
    { id: 'm2', senderId: 'currentUser', receiverId: '1', text: 'سلام سارا! چه عالی. جای مورد علاقه‌ت برای کوهنوردی اطراف اینجا کجاست؟', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 23) },
    { id: 'm3', senderId: '1', receiverId: 'currentUser', text: 'قطعاً دربد! منظره‌اش فوق‌العاده‌ست. باید یه وقت بریم.', timestamp: new Date(Date.now() - 1000 * 60 * 5) },
  ],
  '2': [
    { id: 'm4', senderId: 'currentUser', receiverId: '2', text: 'سلام امیر، گیتارت خیلی باحاله! چه سبکی می‌زنی؟', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48) },
    { id: 'm5', senderId: '2', receiverId: 'currentUser', text: 'ممنون! بیشتر راک کلاسیک و کمی بلوز. تو هم ساز می‌زنی؟', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 47) },
  ],
  '3': [
      {id: 'm6', senderId: '3', receiverId: 'currentUser', text: 'عکس‌های سفرت رو خیلی دوست داشتم! اون عکس با کاشی‌های آبی زیبا کجا گرفته شده؟', timestamp: new Date(Date.now() - 1000 * 60 * 30)},
  ],
};

export const MOCK_CHATS: Chat[] = [
  {
    id: 'c1',
    userId: '1',
    userName: 'سارا',
    userPhoto: 'https://picsum.photos/id/1027/200/200',
    lastMessage: 'قطعاً دربد! منظره‌اش فوق‌العاده‌ست...',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    unreadCount: 1,
  },
  {
    id: 'c2',
    userId: '2',
    userName: 'امیر',
    userPhoto: 'https://picsum.photos/id/1005/200/200',
    lastMessage: 'ممنون! بیشتر راک کلاسیک و کمی بلوز...',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 47),
    unreadCount: 0,
  },
  {
    id: 'c3',
    userId: '3',
    userName: 'نازنین',
    userPhoto: 'https://picsum.photos/id/1011/200/200',
    lastMessage: 'عکس‌های سفرت رو خیلی دوست داشتم!',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    unreadCount: 2,
  },
  {
    id: 'c4',
    userId: '4',
    userName: 'کیان',
    userPhoto: 'https://picsum.photos/id/1012/200/200',
    lastMessage: 'شما با کیان مچ شدید.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    unreadCount: 0,
  }
];
