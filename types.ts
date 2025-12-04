import React from 'react';

export enum Gender {
  Male = 'Male',
  Female = 'Female',
  Other = 'Other'
}

export enum MaritalStatus {
  Single = 'Single',
  Married = 'Married',
  Divorced = 'Divorced',
  Widowed = 'Widowed',
  InRelationship = 'In a relationship'
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