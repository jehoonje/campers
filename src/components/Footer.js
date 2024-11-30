// src/components/Footer.js
import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AuthContext } from '../AuthContext'; 

const Footer = () => {
  const { isLoggedIn, userId, userName } = useContext(AuthContext);

  return (
    <View style={styles.footer}>
      <Text style={styles.footerText}>
        {isLoggedIn && userName ? `Welcome ${userName}!` : 'Welcome!'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    height: 30,
    backgroundColor: '#757574',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute', // 절대 위치 지정
    bottom: 0,            // 화면 하단에 고정
    left: 0,              // 왼쪽 끝에 고정
    right: 0,             // 오른쪽 끝에 고정
    zIndex: 9999,         // 다른 컴포넌트보다 위에 표시
    elevation: 9999,      // Android에서 zIndex와 유사한 역할
  },
  footerText: {
    color: '#ffffff',
    fontSize: 16,
  },
});

export default Footer;
