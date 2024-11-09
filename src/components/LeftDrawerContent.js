// src/components/LeftDrawerContent.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native'; // useNavigation 훅 임포트
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useContext } from 'react';
import { AuthContext } from '../AuthContext';



const LeftDrawerContent = () => {
  const navigation = useNavigation(); // navigation 객체 가져오기

  const { setIsLoggedIn } = useContext(AuthContext);
  
  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    setIsLoggedIn(false);
  };

  return (
    <DrawerContentScrollView>
      <View style={styles.drawerContainer}>
        {/* 기존 메뉴 항목 */}
        <Text style={styles.drawerText}>왼쪽 드로어 내용</Text>
        
        {/* 로그인 버튼 */}
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate('LoginScreen')}
        >
          <Ionicons name="log-in-outline" size={24} color="#333" style={styles.icon} />
          <Text style={styles.loginText}>로그인</Text>
        </TouchableOpacity>

        {/* 로그아웃 버튼 */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={24} color="#333" style={styles.icon} />
          <Text style={styles.logoutText}>로그아웃</Text>
        </TouchableOpacity>

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
  icon: {
    marginRight: 10,
  },
});

export default LeftDrawerContent;
