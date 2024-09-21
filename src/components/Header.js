import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import styles from '../styles/HeaderStyles';

const Header = () => {
  const navigation = useNavigation();

  // 왼쪽 드로어 열기
  const openLeftDrawer = () => {
    navigation.getParent()?.dispatch(DrawerActions.openDrawer());
  };

  // 오른쪽 드로어 열기
  const openRightDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={openLeftDrawer}>
        <Ionicons name="menu" size={24} style={styles.icon} />
      </TouchableOpacity>

      <Text style={styles.headerTitle}>CAMPERS</Text>

      <TouchableOpacity onPress={openRightDrawer}>
        <Ionicons name="ellipsis-horizontal" size={24} style={styles.icon} />
      </TouchableOpacity>
    </View>
  );
};

export default Header;
