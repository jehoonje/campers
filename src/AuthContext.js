// src/AuthContext.js

import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(null);

  const login = async (accessToken, refreshToken) => {
    await AsyncStorage.setItem('accessToken', accessToken);
    await AsyncStorage.setItem('refreshToken', refreshToken);
    setIsLoggedIn(true);
    const id = parseIdFromToken(accessToken);
    const name = parseUserNameFromToken(accessToken);
    setUserId(id);
    setUserName(name);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('accessToken');
    await AsyncStorage.removeItem('refreshToken');
    setIsLoggedIn(false);
    setUserId(null);
    setUserName(null);
  };

  const checkAuthStatus = async () => {
    const token = await AsyncStorage.getItem('accessToken');
    if (token) {
      setIsLoggedIn(true);
      const id = parseIdFromToken(token);
      const name = parseUserNameFromToken(token);
      setUserId(id);
      setUserName(name);
    } else {
      setIsLoggedIn(false);
      setUserId(null);
      setUserName(null);
    }
  };

  const parseIdFromToken = (token) => {
    try {
      const decoded = jwt_decode(token);
      return decoded.userId;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  const parseUserNameFromToken = (token) => {
    try {
      const decoded = jwt_decode(token);
      return decoded.userName;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        login,
        logout,
        userId,
        userName,
        checkAuthStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
