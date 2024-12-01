// MyProfile.js

import React, { useContext, useState } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  Alert,
  StyleSheet,
  Text,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../../AuthContext';
import axiosInstance from '../../utils/axiosInstance';
import { useFocusEffect } from '@react-navigation/native';
import CustomText from '../CustomText';

const MyProfile = ({ navigation }) => {
  const { isLoggedIn, userId, logout } = useContext(AuthContext);
  const [userName, setUserName] = useState('');
  const [profileImageUrl, setProfileImageUrl] = useState('');

  // 유저 정보 로드
  useFocusEffect(
    React.useCallback(() => {
      if (isLoggedIn) {
        axiosInstance
          .get(`/users/${userId}`)
          .then(response => {
            console.log('서버에서 받은 프로필 이미지:', response.data.profileImageUrl);
            setProfileImageUrl(response.data.profileImageUrl);
            setUserName(response.data.userName);
          })
          .catch(error => console.error(error));
      }
    }, [isLoggedIn, userId])
  );

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
              await axiosInstance.delete(`/users/${userId}/delete`);
              Alert.alert('회원탈퇴 완료', '회원 탈퇴가 완료되었습니다.');
              logout(); // 로그아웃 호출
              navigation.navigate('LoginScreen'); // 로그인 화면으로 이동
            } catch (error) {
              console.error(error);
              Alert.alert(
                '회원탈퇴 실패',
                '회원 탈퇴에 실패했습니다. 다시 시도해주세요.',
              );
            }
          },
        },
      ],
      { cancelable: false },
    );
  };

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>내 프로필</Text>
        <View style={{ width: 24 }} /> 
      </View>

      {/* 프로필 이미지 */}
      <View style={styles.profileContainer}>
        <Image
          source={
            profileImageUrl && profileImageUrl !== ''
              ? { uri: profileImageUrl }
              : require('../../assets/placeholder.png')
          }
          style={styles.profileImage}
        />
      </View>

      {/* 유저 정보 */}
      <CustomText style={styles.userIdText}>{userName}</CustomText>

      {/* 버튼들 */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('EditProfile')}>
        <CustomText style={styles.buttonText}>개인정보 수정</CustomText>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={deleteAccount}>
        <CustomText style={styles.buttonText}>회원 탈퇴</CustomText>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={logout}>
        <CustomText style={styles.buttonText}>로그아웃</CustomText>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  header: {
    height: 60, 
    width: '100%',
    backgroundColor: '#fff', // 흰색 배경
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingHorizontal: 10,
  },
  backButton: {
    // 추가 스타일 필요 없음
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  profileContainer: {
    marginTop: 80,
    marginBottom: 20,
    alignItems: 'center',
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  userIdText: {
    fontSize: 18,
    color: '#333',
    marginBottom: 60,
    marginTop: 10,
  },
  button: {
    backgroundColor: '#2F2F2F',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 15,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default MyProfile;
