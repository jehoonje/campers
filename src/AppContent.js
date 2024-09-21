// AppContent.js
import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {DrawerActions, useNavigation} from '@react-navigation/native';

const AppContent = () => {
  const navigation = useNavigation();

  // 왼쪽 드로어 열기 (부모 네비게이션)
  const openLeftDrawer = () => {
    navigation.getParent()?.dispatch(DrawerActions.openDrawer());
  };

  // 오른쪽 드로어 열기 (현재 네비게이션)
  const openRightDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.header}>
        {/* 왼쪽 드로어 아이콘 */}
        <TouchableOpacity onPress={openLeftDrawer}>
          <Ionicons name="menu" size={24} style={styles.icon} />
        </TouchableOpacity>

        {/* 중앙 타이틀 */}
        <Text style={styles.headerTitle}>CAMPERS</Text>

        {/* 오른쪽 드로어 아이콘 */}
        <TouchableOpacity onPress={openRightDrawer}>
          <Ionicons name="ellipsis-horizontal" size={24} style={styles.icon} />
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        {/* 메인 콘텐츠 */}
        <Text>Main content goes here.</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    height: 60, // 헤더 높이 고정
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    zIndex: 1, // 헤더가 드로어보다 위에 있도록 설정
  },
  icon: {
    color: '#000',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AppContent;
