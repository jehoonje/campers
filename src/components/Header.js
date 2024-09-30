// src/components/Header.js
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import styles from '../styles/HeaderStyles';

const Header = ({ toggleRightDrawer, closeRightDrawer }) => {
  const navigation = useNavigation();

  // 왼쪽 드로어 열기 및 오른쪽 드로어 닫기
  const openLeftDrawer = () => {
    closeRightDrawer(); // 왼쪽 드로어 열기 전에 오른쪽 드로어 닫기
    navigation.getParent()?.dispatch(DrawerActions.openDrawer());
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={openLeftDrawer}>
        <Ionicons name="menu" size={24} style={styles.icon} />
      </TouchableOpacity>

      <Text style={styles.headerTitle}>CAMPERS</Text>

      <TouchableOpacity onPress={toggleRightDrawer}>
        <Ionicons name="ellipsis-horizontal" size={24} style={styles.icon} />
      </TouchableOpacity>
    </View>
  );
};

export default Header;
