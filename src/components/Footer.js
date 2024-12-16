// src/components/Footer.js
import React, {useState, useContext, useRef, useEffect} from 'react';
import {View, Text, StyleSheet, Animated, Dimensions} from 'react-native';
import {AuthContext} from '../AuthContext';
import axiosInstance from '../utils/axiosInstance';
import {useFocusEffect} from '@react-navigation/native';
import CustomText from './CustomText';

const Footer = () => {
  // 애니메이션을 위한 설정
  const scrollAnim = useRef(new Animated.Value(0)).current;
  const [textWidth, setTextWidth] = useState(0);

  const message =
    '공공데이터를 활용합니다. 잘못된 정보가 있거나 업데이트가 필요하다면 이메일을 보내주세요.☺️ ';
  const message2 =
    'We utilize public data. If there is any incorrect information or updates needed, please send us an email.☺️ ';

  useEffect(() => {
    if (textWidth > 0) {
      runAnimation();
    }
  }, [textWidth]);

  const runAnimation = () => {
    // 텍스트 길이만큼 이동 후 다시 초기 위치로 돌려 무한 반복
    // 화면 너비보다 길다면 긴 길이만큼 애니메이션.
    // 여기서는 텍스트를 2번 반복했기 때문에 textWidth가 실제 텍스트 전체 길이가 됨.
    scrollAnim.setValue(0);
    Animated.loop(
      Animated.timing(scrollAnim, {
        toValue: -textWidth - 50, // 한 번의 애니메이션에 절반 길이만큼 이동 (반복 2회 배치했기 때문에 절반 이동 후 연속됨)
        duration: 18000,
        useNativeDriver: true,
      }),
    ).start();
  };

  return (
    <View style={styles.footer}>
      <View style={styles.footerContainer}>
        <View style={styles.footerMask}>
          <Animated.View
            style={[
              styles.footerTextWrapper,
              {transform: [{translateX: scrollAnim}]},
            ]}
            onLayout={e => {
              setTextWidth(e.nativeEvent.layout.width);
            }}>
            {/* 동일한 메세지를 두 번 배치하여 끊김 없이 반복되는 느낌을 준다 */}
            <CustomText style={styles.footerText}>{message}</CustomText>
            <CustomText style={styles.footerText}>{message2}</CustomText>
          </Animated.View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    height: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    elevation: 9999,
    overflow: 'hidden',
  },
  footerContainer: {
    height: 25,
    overflow: 'hidden',
    width: '222%',
  },
  footerMask: {
    flex: 1,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  footerTextWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#fff',
    paddingHorizontal: 10,
  },
});

export default Footer;
