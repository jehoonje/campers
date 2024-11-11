// src/utils/axiosInstance.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert} from 'react-native';
import {AuthContext} from '../AuthContext';
import React from 'react';

const axiosInstance = axios.create({
  baseURL: 'http://10.0.2.2:8080/api', // 백엔드 API 베이스 URL
});

// 요청 인터셉터
axiosInstance.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

// 응답 인터셉터
axiosInstance.interceptors.response.use(
  response => {
    return response;
  },
  async error => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const response = await axios.post(
            'http://10.0.2.2:8080/api/refresh',
            {
              refreshToken: refreshToken,
            },
          );

          const newAccessToken = response.data.accessToken;
          const newRefreshToken = response.data.refreshToken;

          await AsyncStorage.setItem('accessToken', newAccessToken);
          await AsyncStorage.setItem('refreshToken', newRefreshToken);
          setAuthTokens({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
          });

          axiosInstance.defaults.headers.common[
            'Authorization'
          ] = `Bearer ${newAccessToken}`;
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

          return axiosInstance(originalRequest);
        } catch (err) {
          console.error('Refresh Token expired or invalid:', err);
          Alert.alert(
            '인증 오류',
            '세션이 만료되었습니다. 다시 로그인해주세요.',
            [
              {
                text: '확인',
                onPress: () => {
                  navigation.navigate('Login');
                },
              },
            ],
            {cancelable: false},
          );
          return Promise.reject(err);
        }
      } else {
        Alert.alert(
          '인증 오류',
          '세션이 만료되었습니다. 다시 로그인해주세요.',
          [
            {
              text: '확인',
              onPress: () => {
                navigation.navigate('Login');
              },
            },
          ],
          {cancelable: false},
        );
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
