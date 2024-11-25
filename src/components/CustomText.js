// src/components/CustomText.js
import React from 'react';
import { Text, StyleSheet } from 'react-native';

const CustomText = ({ children, style, ...props }) => {
  return (
    <Text style={[styles.text, style]} {...props}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: 'Pretendard-Regular', // 기본 글꼴 설정
  },
});

export default CustomText;
