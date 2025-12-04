
import { User, Gender, MaritalStatus } from '../types';

export const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Sara',
    age: 28,
    gender: Gender.Female,
    location: 'Tehran, Iran',
    occupation: 'Graphic Designer',
    bio: 'Creative soul who loves painting, hiking, and exploring new coffee shops. Looking for someone with a good sense of humor.',
    photo: 'https://picsum.photos/id/1027/400/400',
    maritalStatus: MaritalStatus.Single,
    height: 165,
    weight: 58,
    favoriteSport: 'Yoga',
    partnerPreferences: 'Someone kind, ambitious, and loves animals. Must enjoy deep conversations and spontaneous adventures.'
  },
  {
    id: '2',
    name: 'Amir',
    age: 32,
    gender: Gender.Male,
    location: 'Shiraz, Iran',
    occupation: 'Software Engineer',
    bio: 'I build cool things with code. In my free time, I enjoy playing the guitar, photography, and trying out new recipes.',
    photo: 'https://picsum.photos/id/1005/400/400',
    maritalStatus: MaritalStatus.Single,
    height: 180,
    weight: 75,
    favoriteSport: 'Soccer',
    partnerPreferences: 'Looking for an intelligent and adventurous partner to share life\'s moments with. Bonus points if you can beat me at chess.'
  },
  {
    id: '3',
    name: 'Nazanin',
    age: 25,
    gender: Gender.Female,
    location: 'Isfahan, Iran',
    occupation: 'Architect',
    bio: 'Passionate about design, history, and travel. I believe the best stories are found between the pages of a passport.',
    photo: 'https://picsum.photos/id/1011/400/400',
    maritalStatus: MaritalStatus.Single,
    height: 170,
    weight: 62,
    favoriteSport: 'Swimming',
    partnerPreferences: 'Seeking a thoughtful and curious person who appreciates art and culture.'
  },
    {
    id: '4',
    name: 'Kian',
    age: 30,
    gender: Gender.Male,
    location: 'Mashhad, Iran',
    occupation: 'Doctor',
    bio: 'Dedicated to helping others. When I\'m not at the hospital, I\'m probably at the gym or exploring the mountains.',
    photo: 'https://picsum.photos/id/1012/400/400',
    maritalStatus: MaritalStatus.Single,
    height: 178,
    weight: 80,
    favoriteSport: 'Rock Climbing',
    partnerPreferences: 'Looking for a genuine connection with someone who is compassionate and active.'
  },
  {
    id: '5',
    name: 'Yasaman',
    age: 29,
    gender: Gender.Female,
    location: 'Tehran, Iran',
    occupation: 'Musician',
    bio: 'My life is a soundtrack. I play the violin and love live music. Also a big foodie and film enthusiast.',
    photo: 'https://picsum.photos/id/1025/400/400',
    maritalStatus: MaritalStatus.InRelationship,
    height: 168,
    weight: 55,
    favoriteSport: 'Dancing',
    partnerPreferences: 'I value honesty, creativity, and a great taste in music. Let\'s find a new favorite band together.'
  },
  {
    id: '6',
    name: 'Reza',
    age: 35,
    gender: Gender.Male,
    location: 'Tabriz, Iran',
    occupation: 'Chef',
    bio: 'I express my love through food. If you enjoy good meals and even better company, we\'ll get along just fine.',
    photo: 'https://picsum.photos/id/103/400/400',
    maritalStatus: MaritalStatus.Divorced,
    height: 185,
    weight: 88,
    favoriteSport: 'Basketball',
    partnerPreferences: 'A warm-hearted person who loves to laugh and isn\'t afraid to try new things (especially food!).'
  }
];

export const CURRENT_USER_ID = 'currentUser';

export const MOCK_LOGGED_IN_USER: User = {
    id: CURRENT_USER_ID,
    name: 'You',
    age: 29,
    gender: Gender.Male,
    location: 'Tehran, Iran',
    occupation: 'React Developer',
    bio: 'Building virtual worlds one component at a time. I love sci-fi movies, video games, and my dog. Looking for a co-op partner for life.',
    photo: 'https://picsum.photos/id/237/400/400',
    maritalStatus: MaritalStatus.Single,
    height: 175,
    weight: 70,
    favoriteSport: 'Cycling',
    partnerPreferences: 'Someone with a quirky sense of humor who is passionate about their hobbies and loves dogs.'
};
