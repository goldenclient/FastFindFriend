
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { User } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  currentUser: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (updatedUser: Partial<User>) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = api.getToken();
      if (token) {
        try {
          // Fetch current user profile using the token
          const user = await api.get<User>('/users/profile');
          setCurrentUser(user);
        } catch (error) {
          console.error('Failed to fetch user profile', error);
          api.removeToken();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = (token: string, user: User) => {
    api.setToken(token);
    setCurrentUser(user);
  };

  const logout = () => {
    api.removeToken();
    setCurrentUser(null);
  };
  
  const updateUser = async (updatedData: Partial<User>) => {
    if (currentUser) {
        try {
            // Optimistic update
            setCurrentUser(prevUser => ({...prevUser!, ...updatedData}));
            
            // API call
            await api.put('/users/profile', updatedData);
        } catch (error) {
            console.error('Failed to update profile', error);
            // Revert on failure could be implemented here
        }
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, updateUser, loading }}>
      {!loading && children}
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
