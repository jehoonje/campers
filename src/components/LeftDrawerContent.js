// src/components/LeftDrawerContent.js
import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../AuthContext';

const LeftDrawerContent = () => {
  const navigation = useNavigation();
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    setIsLoggedIn(false);
  };

  return (
    <DrawerContentScrollView>
      <View style={styles.drawerContainer}>
        {/* 기존 메뉴 항목 */}
        <Text style={styles.drawerText}>왼쪽 드로어 내용</Text>

        {!isLoggedIn && (
          // 로그인되지 않은 경우에만 로그인 버튼 표시
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => navigation.navigate('LoginScreen')}
          >
            <Ionicons name="log-in-outline" size={24} color="#333" style={styles.icon} />
            <Text style={styles.loginText}>로그인</Text>
          </TouchableOpacity>
        )}

        {isLoggedIn && (
          // 로그인된 경우에만 로그아웃 버튼 표시
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={24} color="#333" style={styles.icon} />
            <Text style={styles.logoutText}>로그아웃</Text>
          </TouchableOpacity>
        )}

        {/* 추가적인 드로어 메뉴 항목 */}
      </View>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  drawerText: {
    fontSize: 16,
    marginVertical: 10,
    color: '#333',
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  loginText: {
    fontSize: 18,
    marginLeft: 10,
    color: '#333',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  logoutText: {
    fontSize: 18,
    marginLeft: 10,
    color: '#333',
  },
  icon: {
    marginRight: 10,
  },
});

export default LeftDrawerContent;
