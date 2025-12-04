
import { Message, Chat } from '../types';

export const MOCK_MESSAGES: { [key: string]: Message[] } = {
  '1': [
    { id: 'm1', senderId: '1', receiverId: 'currentUser', text: 'Hey! I saw your profile and we have a lot in common, especially hiking!', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24) },
    { id: 'm2', senderId: 'currentUser', receiverId: '1', text: 'Hi Sara! That\'s awesome. Where\'s your favorite place to hike around here?', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 23) },
    { id: 'm3', senderId: '1', receiverId: 'currentUser', text: 'Definitely Darband! The views are amazing. We should go sometime.', timestamp: new Date(Date.now() - 1000 * 60 * 5) },
  ],
  '2': [
    { id: 'm4', senderId: 'currentUser', receiverId: '2', text: 'Hey Amir, cool guitar! What kind of music do you play?', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48) },
    { id: 'm5', senderId: '2', receiverId: 'currentUser', text: 'Thanks! Mostly classic rock and some blues. You play?', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 47) },
  ],
  '3': [
      {id: 'm6', senderId: '3', receiverId: 'currentUser', text: 'I loved your travel photos! Where was that picture with the beautiful blue tiles taken?', timestamp: new Date(Date.now() - 1000 * 60 * 30)},
  ],
};

export const MOCK_CHATS: Chat[] = [
  {
    id: 'c1',
    userId: '1',
    userName: 'Sara',
    userPhoto: 'https://picsum.photos/id/1027/200/200',
    lastMessage: 'Definitely Darband! The views are amazing. We should go sometime.',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    unreadCount: 1,
  },
  {
    id: 'c2',
    userId: '2',
    userName: 'Amir',
    userPhoto: 'https://picsum.photos/id/1005/200/200',
    lastMessage: 'Thanks! Mostly classic rock and some blues. You play?',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 47),
    unreadCount: 0,
  },
  {
    id: 'c3',
    userId: '3',
    userName: 'Nazanin',
    userPhoto: 'https://picsum.photos/id/1011/200/200',
    lastMessage: 'I loved your travel photos!',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    unreadCount: 2,
  },
  {
    id: 'c4',
    userId: '4',
    userName: 'Kian',
    userPhoto: 'https://picsum.photos/id/1012/200/200',
    lastMessage: 'You matched with Kian.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    unreadCount: 0,
  }
];
