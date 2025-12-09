
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

// Helper to parse JWT
const parseJwt = (token: string) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = api.getToken();
      if (token) {
        try {
          const payload = parseJwt(token);
          // Look for common User ID claims
          // http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier is 'nameid' usually
          const userId = payload?.nameid || payload?.sub || payload?.UserId || payload?.id;

          if (userId) {
              // Fetch current user profile using the ID from token
              const user = await api.get<User>(`/users/${userId}`);
              
               // Map backend data to frontend
              if (user.galleryImages && (!user.gallery || user.gallery.length === 0)) {
                user.gallery = user.galleryImages.map(img => img.imageUrl);
              }
              if (user.photoUrl && !user.photo) {
                  user.photo = user.photoUrl;
              }
              if (user.storyUrl && !user.story) {
                  user.story = user.storyUrl;
              }
              
              setCurrentUser(user);
          } else {
              throw new Error("Invalid Token: No User ID");
          }
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
