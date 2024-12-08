// src/components/LeftDrawerContent.js
import React, {useContext, useState, useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Share,
  Linking,
  Image,
  Alert,
} from 'react-native';
import {DrawerContentScrollView} from '@react-navigation/drawer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {useDrawerStatus} from '@react-navigation/drawer';
import {AuthContext} from '../AuthContext';
import CustomText from './CustomText';
import axiosInstance from '../utils/axiosInstance';

const LeftDrawerContent = () => {
  const navigation = useNavigation();
  const {isLoggedIn, logout, userId} = useContext(AuthContext);
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const isDrawerOpen = useDrawerStatus() === 'open';

  useEffect(() => {
    if (isDrawerOpen && isLoggedIn) {
      axiosInstance
        .get(`/users/${userId}`)
        .then(response => {
          console.log(
            '서버에서 받은 프로필 이미지:',
            response.data.profileImageUrl,
          );
          if (response.data.profileImageUrl) {
            setProfileImageUrl(response.data.profileImageUrl);
          } else {
            setProfileImageUrl(null);
          }
        })
        .catch(error => {
          console.error('Error fetching profile image:', error);
          setProfileImageUrl(null);
        });
    }
  }, [isDrawerOpen, isLoggedIn, userId]);

  const handleLogout = () => {
    setProfileImageUrl(null);
    logout();
  };

  // "마이프로필" 버튼 핸들러
  const handleMyProfilePress = () => {
    if (isLoggedIn) {
      navigation.navigate('MyProfile');
    } else {
      Alert.alert(
        '',
        '로그인이 필요합니다.',
        [
          {
            text: '취소',
            style: 'cancel',
          },
          {
            text: '로그인',
            onPress: () => navigation.navigate('LoginScreen'),
          },
        ],
        {cancelable: true},
      );
    }
  };

  return (
    <DrawerContentScrollView contentContainerStyle={styles.drawerContainer}>
      <View style={styles.content}>
        {/* 프로필 이미지 */}
        <View style={styles.profileContainer}>
          <Image
            source={
              profileImageUrl && profileImageUrl !== ''
                ? {uri: profileImageUrl}
                : require('../assets/placeholder.png')
            }
            style={styles.profileImage}
          />
        </View>

        {/* 마이프로필 버튼 */}
        <TouchableOpacity
          style={styles.menuButton}
          onPress={handleMyProfilePress}>
          <Ionicons name="person" size={24} color="#333" style={styles.icon} />
          <CustomText style={styles.menuText}>내 정보</CustomText>
        </TouchableOpacity>

        {/* 기타 버튼들 */}
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => {
            Share.share({
              message: '준비중 입니다!',
              url: 'http://bluebellybird.bearblog.dev', // 실제 앱 링크로 교체
              title: 'CampRidge',
            });
          }}>
          <Ionicons
            name="share-social"
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
          <Ionicons name="mail" size={24} color="#333" style={styles.icon} />
          <CustomText style={styles.menuText}>이메일 보내기</CustomText>
        </TouchableOpacity>



        {/* 구분선 */}
        <View style={styles.divider} />

        <TouchableOpacity
          style={styles.usButton}
          onPress={() => navigation.navigate('AboutUs')}>
          <Ionicons name="alert-circle-outline" size={24} color="#333" style={styles.icon} />
          <CustomText style={styles.menuText}>About Us</CustomText>
        </TouchableOpacity>

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
            <CustomText style={styles.loginText}>Sign in</CustomText>
          </TouchableOpacity>
        )}

        {isLoggedIn && (
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
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
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 10,
  },
  usButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 28,
    marginBottom: 10,
  },
  menuText: {
    fontSize: 17,
    marginLeft: 10,
    color: '#333',
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
