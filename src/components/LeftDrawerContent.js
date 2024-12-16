// src/components/LeftDrawerContent.js
import React, {useContext, useState, useEffect, useRef} from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Share,
  Linking,
  Image,
  Alert,
  Animated,
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
  const [userName, setUserName] = useState('');

  // Animated values for fading in/out contents
  const contentOpacity = useRef(new Animated.Value(isLoggedIn ? 1 : 0)).current;
  const loginPromptOpacity = useRef(new Animated.Value(isLoggedIn ? 0 : 1)).current;

  // Fetch user data when drawer is open and user is logged in
  useEffect(() => {
    if (isDrawerOpen && isLoggedIn) {
      axiosInstance
        .get(`/users/${userId}`)
        .then(response => {
          console.log('서버에서 받은 프로필 이미지:', response.data.profileImageUrl);
          setProfileImageUrl(response.data.profileImageUrl || null);
          setUserName(response.data.userName || '');

          // Fade in profile content and fade out login prompt
          Animated.parallel([
            Animated.timing(contentOpacity, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: true,
            }),
            Animated.timing(loginPromptOpacity, {
              toValue: 0,
              duration: 1000,
              useNativeDriver: true,
            }),
          ]).start();
        })
        .catch(error => {
          console.error('Error fetching profile image:', error);
          setProfileImageUrl(null);
          setUserName('');

          // Fade out profile content and fade in login prompt
          Animated.parallel([
            Animated.timing(contentOpacity, {
              toValue: 0,
              duration: 1000,
              useNativeDriver: true,
            }),
            Animated.timing(loginPromptOpacity, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: true,
            }),
          ]).start();
        });
    }
  }, [isDrawerOpen, isLoggedIn, userId]);

  // Handle login state changes
  useEffect(() => {
    if (!isLoggedIn) {
      // Fade out profile content and fade in login prompt
      Animated.parallel([
        Animated.timing(contentOpacity, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(loginPromptOpacity, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setProfileImageUrl('');
        setUserName('');
      });
    } else {
      // Fade in profile content and fade out login prompt
      Animated.parallel([
        Animated.timing(contentOpacity, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(loginPromptOpacity, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isLoggedIn]);

  const handleLogout = () => {
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
        {/* 프로필 컨테이너는 항상 렌더링 */}
        <View style={styles.profileContainer}>
          {/* 로그인된 상태의 프로필 이미지와 유저네임 */}
          <Animated.View style={[styles.profileContent, { opacity: contentOpacity, position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }]}>
            <Image
              source={
                profileImageUrl && profileImageUrl !== ''
                  ? {uri: profileImageUrl}
                  : require('../assets/placeholder.png')
              }
              style={styles.profileImage}
            />
          </Animated.View>

          {/* 로그인되지 않은 상태의 메시지 */}
          <Animated.View style={[styles.loginPromptContainer, { opacity: loginPromptOpacity, position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }]}>
            <CustomText style={styles.loginPrompt}>campridge</CustomText>
          </Animated.View>
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
    backgroundColor: '#f5f5f5',
    paddingVertical: 20,
  },
  content: {
    paddingHorizontal: 5,
  },
  profileContainer: {
    alignItems: 'center', // 수직 중앙 정렬
    flexDirection: 'row',
    justifyContent: 'flex-start', // 왼쪽 정렬
    backgroundColor: '#eeeeee',
    borderRadius: 10,
    marginBottom: 10,
    position: 'relative', // 자식 요소의 절대 위치 지정 가능
    height: 100, // 컨테이너의 높이를 고정하여 레이아웃 일관성 유지
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'center',
    paddingHorizontal: 20,
    // position: 'absolute', // 부모에서 이미 절대 위치 지정
  },
  loginPromptContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginPrompt: {
    fontSize: 14,
    fontWeight: '300',
    color: '#d9d9d9',
  },
  profileImage: {
    width: 70,
    height: 70,
    opacity: 0.9,
    borderRadius: 35,
    marginRight: 15, // 이미지와 텍스트 사이 간격 확보
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
  },
  menuButton: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 10,
  },
  usButton: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    alignItems: 'center',
    marginTop: 28,
    marginBottom: 10,
  },
  menuText: {
    fontSize: 17,
    fontWeight: '500',
    marginLeft: 10,
    color: '#070324',
  },
  divider: {
    marginVertical: 16,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  loginButton: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    alignItems: 'center',
    marginTop: 16,
  },
  loginText: {
    fontSize: 18,
    fontWeight: '500',
    marginLeft: 10,
    color: '#070324',
  },
  logoutButton: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    alignItems: 'center',
    marginTop: 16,
  },
  logoutText: {
    fontSize: 18,
    fontWeight: '500',
    marginLeft: 10,
    color: '#070324',
  },
  icon: {
    marginRight: 10,
  },
  footer: {
    alignItems: 'flex-end',
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  footerText: {
    fontSize: 16,
    marginBottom: 2,
    color: '#F5F7F8',
  },
  versionText: {
    fontSize: 12,
    color: '#495E57',
  },
});

export default LeftDrawerContent;
