// src/AuthContext.js

import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(null);
  const [roles, setRoles] = useState([]);

  const login = async (accessToken, refreshToken) => {
    await AsyncStorage.setItem('accessToken', accessToken);
    await AsyncStorage.setItem('refreshToken', refreshToken);
    setIsLoggedIn(true);
    const id = parseIdFromToken(accessToken);
    const name = parseUserNameFromToken(accessToken);
    const userRoles = parseRolesFromToken(accessToken);
    setUserId(id);
    setUserName(name);
    setRoles(userRoles);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('accessToken');
    await AsyncStorage.removeItem('refreshToken');
    setIsLoggedIn(false);
    setUserId(null);
    setUserName(null);
    setRoles([]);
  };

  const checkAuthStatus = async () => {
    const token = await AsyncStorage.getItem('accessToken');
    if (token) {
      setIsLoggedIn(true);
      const id = parseIdFromToken(token);
      const name = parseUserNameFromToken(token);
      const userRoles = parseRolesFromToken(token);
      setUserId(id);
      setUserName(name);
      setRoles(userRoles);
    } else {
      setIsLoggedIn(false);
      setUserId(null);
      setUserName(null);
      setRoles([]);
    }
  };

  const parseIdFromToken = (token) => {
    try {
      const decoded = jwt_decode(token);
      return decoded.userId || decoded.id;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  const parseUserNameFromToken = (token) => {
    try {
      const decoded = jwt_decode(token);
      return decoded.userName || decoded.nickname;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  const parseRolesFromToken = (token) => {
    try {
      const decoded = jwt_decode(token);
      return decoded.roles || [];
    } catch (error) {
      console.error('Error decoding token roles:', error);
      return [];
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
        roles,
        checkAuthStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
