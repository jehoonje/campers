// src/styles/HeaderStyles.js
import { StyleSheet, Platform } from 'react-native';

const styles = StyleSheet.create({
  header: {
    height: 52,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
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
    padding: 6,
    paddingHorizontal: 2,
  },
  rightButton: {
    padding: 6,
  },
  icon: {
    color: '#070324',
  },
  logoContainer: {
    marginLeft: 8,
    flex: 1,
    alignItems: 'right',
    justifyContent: 'center',
    
  },
  logo: {
    width: 140, // 로고의 너비 조정
    height: 50, // 로고의 높이 조정
    
    
    
  },
});

export default styles;
