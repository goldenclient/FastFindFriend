
import React from 'react';

export enum Gender {
  Male = 'مرد',
  Female = 'زن',
  Other = 'سایر'
}

export enum MaritalStatus {
  Single = 'مجرد',
  Married = 'متاهل',
  Divorced = 'مطلقه',
  Widowed = 'بیوه',
  InRelationship = 'در رابطه'
}

export interface UserSettings {
  newLikeNotification: boolean;
  newMessageNotification: boolean;
  biometricLogin: boolean;
  profileViewNotification: boolean;
}

export interface UserGalleryImage {
    id: string;
    imageUrl: string;
}

export interface User {
  id: string;
  name: string;
  age: number;
  gender: Gender;
  location: string;
  occupation: string;
  bio: string;
  photo: string;
  maritalStatus: MaritalStatus;
  height: number; // in cm
  weight: number; // in kg
  favoriteSport: string;
  partnerPreferences: string;
  isOnline: boolean;
  distance: number; // in km
  gallery?: string[]; // List of photo URLs (Frontend friendly)
  galleryImages?: UserGalleryImage[]; // From Backend
  story?: string; // URL to story image
  isPremium?: boolean;
  isGhostMode?: boolean;
  settings?: UserSettings;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  imageUrl?: string;
  timestamp: Date;
}

export interface Chat {
  id: string;
  userId: string;
  userName: string;
  userPhoto: string;
  lastMessage: string;
  timestamp: Date;
  unreadCount: number;
}

export enum ProductType {
    Subscription = 'Subscription',
    Badge = 'Badge',
    Boost = 'Boost'
}

export interface Product {
    id: string;
    name: string;
    type: ProductType;
    description: string;
    price: number;
    // FIX: Replaced JSX.Element with React.ReactElement to resolve "Cannot find namespace 'JSX'" error in a .ts file.
    icon: (props: React.SVGProps<SVGSVGElement>) => React.ReactElement;
}