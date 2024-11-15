// src/styles/HeaderStyles.js
import { StyleSheet, Platform } from 'react-native';

const styles = StyleSheet.create({
  header: {
    height: 60,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    // 안드로이드 그림자
    elevation: 2,
    // iOS 그림자
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    zIndex: 9999,
  },
  leftButton: {
    padding: 8,
  },
  rightButton: {
    padding: 8,
  },
  icon: {
    color: '#333',
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 120, // 로고의 너비 조정
    height: 40, // 로고의 높이 조정
  },
});

export default styles;
