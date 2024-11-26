// src/screens/MyProfile.js
import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../contexts/AuthContext';
import axiosInstance from '../utils/axiosInstance'; // axios 설정
import AsyncStorage from '@react-native-async-storage/async-storage';

const MyProfile = ({ navigation }) => {
  const { isLoggedIn, userId, logout } = useContext(AuthContext);
  const [profileImage, setProfileImage] = useState('');

  // 유저 정보 로드
  useEffect(() => {
    if (isLoggedIn) {
      axiosInstance.get(`/user/${userId}`)
        .then(response => {
          setProfileImage(response.data.profileImage); // 유저의 프로필 사진 경로 받아오기
        })
        .catch(error => console.error(error));
    }
  }, [isLoggedIn, userId]);

  // 회원 탈퇴
  const deleteAccount = async () => {
    Alert.alert(
      '정말 탈퇴하시겠습니까?',
      '회원 탈퇴는 되돌릴 수 없습니다.',
      [
        { text: '취소' },
        { 
          text: '확인', 
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('accessToken');
              if (token) {
                await axiosInstance.delete(`/users/${userId}/delete`, {
                  headers: { Authorization: `Bearer ${token}` },
                });
                await AsyncStorage.removeItem('accessToken');
                await AsyncStorage.removeItem('refreshToken');
                Alert.alert('회원탈퇴 완료', '회원 탈퇴가 완료되었습니다.');
                logout(); // 로그아웃 호출
                navigation.navigate('Login'); // 로그인 화면으로 이동
              }
            } catch (error) {
              console.error(error);
              Alert.alert('회원탈퇴 실패', '회원 탈퇴에 실패했습니다. 다시 시도해주세요.');
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Ionicons
        name="arrow-back"
        size={24}
        color="#333"
        onPress={() => navigation.goBack()}
        style={{ position: 'absolute', top: 20, left: 20 }}
      />
      {/* 프로필 이미지 */}
      <View style={{ marginBottom: 20 }}>
        <Image
          source={{ uri: profileImage }}
          style={{ width: 100, height: 100, borderRadius: 50 }}
        />
      </View>

      {/* 유저 정보 */}
      <Text>{userId}</Text>

      {/* 버튼들 */}
      <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
        <Text>개인정보 수정</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={deleteAccount}>
        <Text>회원 탈퇴</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={logout}>
        <Text>로그아웃</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MyProfile;
