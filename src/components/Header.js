// src/components/Header.js
import React, {useState, useContext} from 'react';
import {View, TouchableOpacity, Image, Alert} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from '../styles/HeaderStyles';
import {DrawerActions, useNavigation} from '@react-navigation/native';
import {AuthContext} from '../AuthContext';

const Header = ({toggleRightDrawer, onPressTitle, toggleSearch}) => {
  const navigation = useNavigation();
  const {isLoggedIn} = useContext(AuthContext);

  // 로고 상태 관리 (기본값은 logo.png)
  const [isEnglishLogo, setIsEnglishLogo] = useState(false);

  // 로고 클릭 시 상태 토글 함수
  const toggleLogo = () => {
    setIsEnglishLogo(prevState => !prevState);
    if (onPressTitle) {
      onPressTitle();
    }
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
        <Ionicons name="menu" size={28} style={styles.icon} />
      </TouchableOpacity>

      {/* 헤더 로고 */}
      <TouchableOpacity onPress={toggleLogo} style={styles.logoContainer}>
        <Image
          source={
            isEnglishLogo
              ? require('../assets/logo_eng.png')
              : require('../assets/logo.png')
          }
          style={styles.logo}
          resizeMode="contain"
        />
      </TouchableOpacity>

      {/* 검색 버튼(돋보기) 추가 */}
      <TouchableOpacity
        onPress={toggleSearch}
        style={styles.rightButton}>
        <Ionicons name="search" size={28} style={styles.icon} />
      </TouchableOpacity>

      {/* 커뮤니티 토글 버튼 */}
      <TouchableOpacity
        onPress={handleMyProfilePress}
        style={styles.rightButton}>
        <Ionicons name="people-sharp" size={28} style={styles.icon} />
      </TouchableOpacity>

      {/* 오른쪽 드로어 토글 버튼 */}
      <TouchableOpacity
        onPress={handleToggleRightDrawer}
        style={styles.rightButton}>
        <Ionicons name="ellipsis-horizontal" size={28} style={styles.icon} />
      </TouchableOpacity>
    </View>
  );
};

export default Header;
