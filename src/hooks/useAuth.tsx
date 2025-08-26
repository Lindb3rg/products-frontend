import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, LoginCredentials, AuthResponse } from '../types';
import { authApi, api } from '../services/api';

interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const login = async (credentials: LoginCredentials) => {
    const formData = new FormData();
    formData.append('username', credentials.email);
    formData.append('password', credentials.password);
  
    const response = await authApi.post<AuthResponse>('/auth/jwt/login', formData);
    const token = response.data.access_token;
    
    localStorage.setItem('token', token);
    
    // Get user info from AUTH service, not main backend
    const userResponse = await authApi.get<User>('/users/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setUser(userResponse.data);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      authApi.get<User>('/users/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(response => setUser(response.data))
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};