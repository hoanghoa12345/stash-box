import { AuthContextType, User } from '@/types';
import React, { createContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axiosClient from '@/services/axiosClient';
import { toast } from "sonner"

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = Cookies.get('access_token');
    const savedUser = Cookies.get('user_data');

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (token && user) {
      Cookies.set('access_token', token, { expires: 7 });
      Cookies.set('user_data', JSON.stringify(user), { expires: 7 });
    } else {
      Cookies.remove('access_token');
      Cookies.remove('user_data');
    }
  }, [token, user]);

  const login = async () => {
    try {
      setIsLoading(true);

      // Get authorization URL from backend
      const { data } = await axiosClient.get('/oauth');
      // Redirect to OAuth provider
      window.location.href = data.data.authUrl;
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      toast.error('Login failed. Please try again.');
    }
  };

  const logout = async () => {
    if (token) {
      try {
        await axiosClient.post('/sign-out')
      } catch (error) {
        console.error('Server sign out failed:', error);
      }
    }

    // Clear user and token
    setUser(null);
    setToken(null);
    Cookies.remove('access_token');
    Cookies.remove('user_data');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
