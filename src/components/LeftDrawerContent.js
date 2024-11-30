// src/components/LeftDrawerContent.js
import React, {useContext, useState, useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Share,
  Linking,
  Image,
} from 'react-native';
import {DrawerContentScrollView} from '@react-navigation/drawer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import { useDrawerStatus } from '@react-navigation/drawer';
import {AuthContext} from '../AuthContext';
import CustomText from './CustomText';
import axiosInstance from '../utils/axiosInstance';

const LeftDrawerContent = () => {
  const navigation = useNavigation();
  const {isLoggedIn, logout, userId} = useContext(AuthContext);
  const [profileImage, setProfileImage] = useState('');
  const isDrawerOpen = useDrawerStatus() === 'open';

  useEffect(() => {
    if (isDrawerOpen && isLoggedIn) {
      axiosInstance
        .get(`/users/${userId}`)
        .then(response => {
          console.log('서버에서 받은 프로필 이미지:', response.data.profileImage);
          if (response.data.profileImage) {
            setProfileImage(response.data.profileImage);
          } else {
            setProfileImage(null);
          }
        })
        .catch(error => {
          console.error('Error fetching profile image:', error);
          setProfileImage(null);
        });
    }
  }, [isDrawerOpen, isLoggedIn, userId]);

  return (
    <DrawerContentScrollView contentContainerStyle={styles.drawerContainer}>
      <View style={styles.content}>
        {/* 프로필 이미지 */}
        <View style={styles.profileContainer}>
          <Image
            source={
              profileImage && profileImage !== ''
                ? {uri: profileImage}
                : require('../assets/placeholder.png')
            }
            style={styles.profileImage}
          />
        </View>

        {/* 마이프로필 버튼 */}
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => {
            navigation.navigate('MyProfile'); // MyProfile 페이지로 이동
          }}>
          <Ionicons
            name="person-outline"
            size={24}
            color="#333"
            style={styles.icon}
          />
          <CustomText style={styles.menuText}>마이프로필</CustomText>
        </TouchableOpacity>

        {/* 기타 버튼들 */}
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => {
            Share.share({
              message: '이 앱을 확인해보세요!',
              url: 'http://example.com', // 실제 앱 링크로 교체
              title: '앱 제목',
            });
          }}>
          <Ionicons
            name="share-social-outline"
            size={24}
            color="#333"
            style={styles.icon}
          />
          <CustomText style={styles.menuText}>앱 공유하기</CustomText>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => {
            Linking.openURL('mailto:limjhoon8@gmail.com');
          }}>
          <Ionicons
            name="mail-outline"
            size={24}
            color="#333"
            style={styles.icon}
          />
          <CustomText style={styles.menuText}>이메일 피드백</CustomText>
        </TouchableOpacity>

        {/* 구분선 */}
        <View style={styles.divider} />

        {/* 로그인/로그아웃 버튼 */}
        {!isLoggedIn && (
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => navigation.navigate('LoginScreen')}>
            <Ionicons
              name="log-in-outline"
              size={24}
              color="#333"
              style={styles.icon}
            />
            <CustomText style={styles.loginText}>Login</CustomText>
          </TouchableOpacity>
        )}

        {isLoggedIn && (
          <TouchableOpacity style={styles.logoutButton} onPress={logout}>
            <Ionicons
              name="log-out-outline"
              size={24}
              color="#333"
              style={styles.icon}
            />
            <CustomText style={styles.logoutText}>Logout</CustomText>
          </TouchableOpacity>
        )}
      </View>

      {/* 하단 텍스트 */}
      <View style={styles.footer}>
        <CustomText style={styles.footerText}>made by jehoon</CustomText>
        <CustomText style={styles.versionText}>Version 0.0.1</CustomText>
      </View>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  drawerContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
    backgroundColor: '#F5F7F8',
    paddingVertical: 10,
  },
  content: {
    paddingHorizontal: 20,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 10,
  },
  menuText: {
    fontSize: 18,
    marginLeft: 10,
    color: '#495E57',
  },
  divider: {
    marginVertical: 16,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  loginText: {
    fontSize: 18,
    marginLeft: 10,
    color: '#495E57',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  logoutText: {
    fontSize: 18,
    marginLeft: 10,
    color: '#495E57',
  },
  icon: {
    marginRight: 10,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 1,
  },
  footerText: {
    fontSize: 16,
    marginBottom: 2,
    alignSelf: 'flex-end',
    paddingRight: 10,
    color: '#F5F7F8',
  },
  versionText: {
    fontSize: 12,
    color: '#495E57',
    alignSelf: 'flex-end',
    paddingRight: 10,
  },
});

export default LeftDrawerContent;
