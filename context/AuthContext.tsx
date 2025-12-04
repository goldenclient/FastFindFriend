
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { User } from '../types';
import { MOCK_LOGGED_IN_USER } from '../data/users';

interface AuthContextType {
  currentUser: User | null;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (updatedUser: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const login = (user: User) => {
    // In a real app, this would involve a token
    setCurrentUser(user);
  };

  const logout = () => {
    setCurrentUser(null);
  };
  
  const updateUser = (updatedData: Partial<User>) => {
    if (currentUser) {
        setCurrentUser(prevUser => ({...prevUser!, ...updatedData}));
    }
  };

  // This would be replaced by checking a token in local storage
  // For now, we just log in the mock user for demonstration
  // useEffect(() => {
  //   login(MOCK_LOGGED_IN_USER);
  // }, []);

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
