import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('fittrack_token');
      const storedUser = await AsyncStorage.getItem('fittrack_user');
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      }
    } catch (e) {
      console.log('Auth load error:', e);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { token: newToken, ...userData } = response.data;
    setToken(newToken);
    setUser(userData);
    api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    await AsyncStorage.setItem('fittrack_token', newToken);
    await AsyncStorage.setItem('fittrack_user', JSON.stringify(userData));
    return userData;
  };

  const register = async (data) => {
    const response = await api.post('/auth/register', data);
    const { token: newToken, ...userData } = response.data;
    setToken(newToken);
    setUser(userData);
    api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    await AsyncStorage.setItem('fittrack_token', newToken);
    await AsyncStorage.setItem('fittrack_user', JSON.stringify(userData));
    return userData;
  };

  const logout = async () => {
    setToken(null);
    setUser(null);
    delete api.defaults.headers.common['Authorization'];
    await AsyncStorage.removeItem('fittrack_token');
    await AsyncStorage.removeItem('fittrack_user');
  };

  const updateUser = async (updatedData) => {
    const response = await api.put('/auth/profile', updatedData);
    setUser(response.data);
    await AsyncStorage.setItem('fittrack_user', JSON.stringify(response.data));
    return response.data;
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
