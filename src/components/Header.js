// src/components/Header.js
import React from 'react';
import { View, TouchableOpacity, Image, Platform } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from '../styles/HeaderStyles';
import { DrawerActions, useNavigation } from '@react-navigation/native';

const Header = ({ toggleRightDrawer, onPressLogo }) => {
  const navigation = useNavigation();

  const openLeftDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const handleToggleRightDrawer = () => {
    toggleRightDrawer();
  };

  return (
    <View style={styles.header}>
      {/* 왼쪽 드로어 열기 버튼 */}
      <TouchableOpacity onPress={openLeftDrawer} style={styles.leftButton}>
        <Ionicons name="menu" size={24} style={styles.icon} />
      </TouchableOpacity>

      {/* 헤더 로고 */}
      <TouchableOpacity onPress={() => navigation.navigate('AppContent')} style={styles.logoContainer}>
        <Image
          source={require('../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </TouchableOpacity>

      {/* 오른쪽 드로어 토글 버튼 */}
      <TouchableOpacity onPress={handleToggleRightDrawer} style={styles.rightButton}>
        <Ionicons name="ellipsis-horizontal" size={24} style={styles.icon} />
      </TouchableOpacity>
    </View>
  );
};

export default Header;
