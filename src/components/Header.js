// src/components/Header.js
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from '../styles/HeaderStyles';
import { DrawerActions, useNavigation } from '@react-navigation/native';

const Header = ({ toggleRightDrawer, onPressTitle }) => {
  const navigation = useNavigation();

  const openLeftDrawer = () => {
    console.log("왼쪽 드로어 열기 버튼 클릭");
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const handleToggleRightDrawer = () => {
    console.log("오른쪽 드로어 토글 버튼 클릭");
    toggleRightDrawer();
  };

  return (
    <View style={styles.header}>
      {/* 왼쪽 드로어 열기 버튼 */}
      <TouchableOpacity onPress={openLeftDrawer}>
        <Ionicons name="menu" size={24} style={styles.icon} />
      </TouchableOpacity>

      {/* 헤더 타이틀 (클릭 가능) */}
      <TouchableOpacity onPress={onPressTitle}>
        <Text style={styles.headerTitle}>CAMPERS</Text>
      </TouchableOpacity>

      {/* 오른쪽 드로어 토글 버튼 */}
      <TouchableOpacity onPress={handleToggleRightDrawer}>
        <Ionicons name="ellipsis-horizontal" size={24} style={styles.icon} />
      </TouchableOpacity>
    </View>
  );
};

export default Header;
