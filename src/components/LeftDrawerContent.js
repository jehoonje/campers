// src/components/LeftDrawerContent.js
import React, { useContext } from 'react';
import { View, TouchableOpacity, StyleSheet, Share, Linking } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../AuthContext';
import CustomText from './CustomText';

const LeftDrawerContent = () => {
  const navigation = useNavigation();
  const { isLoggedIn, logout } = useContext(AuthContext);

  return (
    <DrawerContentScrollView contentContainerStyle={styles.drawerContainer}>
      <View style={styles.content}>
        {/* 새로운 버튼들 */}
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => {
            // 마이프로필 버튼 클릭 시 동작 (추후 구현 예정)
            navigation.navigate('ProfileScreen'); // ProfileScreen은 추후 생성
          }}
        >
          <Ionicons name="person-outline" size={24} color="#333" style={styles.icon} />
          <CustomText style={styles.menuText}>마이프로필</CustomText>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => {
            // 앱 공유하기 버튼 클릭 시 동작
            Share.share({
              message: '이 앱을 확인해보세요!',
              url: 'http://example.com', // 실제 앱 링크로 교체
              title: '앱 제목',
            });
          }}
        >
          <Ionicons name="share-social-outline" size={24} color="#333" style={styles.icon} />
          <CustomText style={styles.menuText}>앱 공유하기</CustomText>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => {
            // 이메일 피드백 버튼 클릭 시 동작
            Linking.openURL('mailto:limjhoon8@gmail.com');
          }}
        >
          <Ionicons name="mail-outline" size={24} color="#333" style={styles.icon} />
          <CustomText style={styles.menuText}>이메일 피드백</CustomText>
        </TouchableOpacity>

        {/* 구분선 */}
        <View style={styles.divider} />

        {/* 로그인/로그아웃 버튼 */}
        {!isLoggedIn && (
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => navigation.navigate('LoginScreen')}
          >
            <Ionicons name="log-in-outline" size={24} color="#333" style={styles.icon} />
            <CustomText style={styles.loginText}>Login</CustomText>
          </TouchableOpacity>
        )}

        {isLoggedIn && (
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={logout}
          >
            <Ionicons name="log-out-outline" size={24} color="#333" style={styles.icon} />
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
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
    marginBottom:10,
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
    marginBottom:2,
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
