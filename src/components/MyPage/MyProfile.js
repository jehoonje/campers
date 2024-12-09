// MyProfile.js

import React, { useContext, useState, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  Alert,
  StyleSheet,
  Text,
  Animated,
  Linking, // Linking 모듈 추가
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

  // 각 버튼에 대한 애니메이션 값 초기화
  const buttonAnimations = useRef([
    { opacity: new Animated.Value(0), translateY: new Animated.Value(30) }, // 프로필 상세
    { opacity: new Animated.Value(0), translateY: new Animated.Value(30) }, // 피드백 이메일
    { opacity: new Animated.Value(0), translateY: new Animated.Value(30) }, // 회원 탈퇴
  ]).current;

  // 화면 포커스될 때 유저 정보 로드 및 애니메이션 시작
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

      // 버튼 애니메이션 시작
      Animated.stagger(
        200, // 각 버튼 애니메이션 시작 간격
        buttonAnimations.map(anim =>
          Animated.parallel([
            Animated.timing(anim.opacity, {
              toValue: 1,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.timing(anim.translateY, {
              toValue: 0,
              duration: 500,
              useNativeDriver: true,
            }),
          ])
        )
      ).start();
    }, [isLoggedIn, userId, buttonAnimations])
  );

  // 회원 탈퇴 함수
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

  // 로그아웃 후 AppContent으로 이동하는 핸들러
  const handleLogout = async () => {
    try {
      await logout(); // 로그아웃 수행
      navigation.navigate('AppContent'); // AppContent 화면으로 이동
    } catch (error) {
      console.error('로그아웃 오류:', error);
      Alert.alert('오류', '로그아웃 중 오류가 발생했습니다.');
    }
  };

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
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

      {/* 유저 이름 */}
      <CustomText style={styles.userIdText}>{userName}</CustomText>

      {/* 버튼들 - 애니메이션 적용 */}
      {buttonAnimations.map((anim, index) => (
        <Animated.View
          key={index}
          style={{
            opacity: anim.opacity,
            transform: [{ translateY: anim.translateY }],
            width: '80%',
            marginBottom: 15,
          }}
        >
          {index === 0 && (
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('EditProfile')}>
              <CustomText style={styles.buttonText}>프로필 수정</CustomText>
            </TouchableOpacity>
          )}
          {index === 1 && (
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                Linking.openURL('mailto:limjhoon8@gmail.com');
              }}>
              <CustomText style={styles.buttonText}>앱 피드백 이메일</CustomText>
            </TouchableOpacity>
          )}
          {index === 2 && (
            <TouchableOpacity style={styles.button} onPress={deleteAccount}>
              <CustomText style={styles.buttonText}>회원 탈퇴</CustomText>
            </TouchableOpacity>
          )}
        </Animated.View>
      ))}
      
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
    marginBottom: 60,
    alignItems: 'center',
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth:1,
    borderColor: '#ccc',
  },
  userIdText: {
    fontSize: 18,
    color: '#333',
    marginBottom: 60,
    marginTop: 10,
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: '#333',
    alignItems: 'center',
  },
  buttonText: {
    color: '#333',
    fontSize: 16,
  },
});

export default MyProfile;
