// src/components/AnimatedTitle.js
import React, { useRef, useEffect } from 'react';
import { Animated, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

const AnimatedTitle = ({ text }) => {
  const slideAnim = useRef(new Animated.Value(20)).current; // 시작 위치: 20 (아래에서 위로 이동)
  const fadeAnim = useRef(new Animated.Value(0)).current;   // 시작 투명도: 0 (완전히 투명)

  useEffect(() => {
    // 애니메이션 초기화
    slideAnim.setValue(20);
    fadeAnim.setValue(0);

    // 애니메이션 실행
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0, // 최종 위치: 현재 위치
        duration: 800, // 애니메이션 지속 시간
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1, // 최종 투명도: 1 (완전히 불투명)
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, [text, slideAnim, fadeAnim]);

  return (
    <Animated.Text
      style={[
        styles.title,
        {
          transform: [{ translateY: slideAnim }],
          opacity: fadeAnim,
        },
      ]}>
      {text}
    </Animated.Text>
  );
};

AnimatedTitle.propTypes = {
  text: PropTypes.string.isRequired,
};

const styles = StyleSheet.create({
  title: {
    width: '100%',
    fontSize: 28,
    marginTop: 150,
    marginRight: 10,
    marginBottom: 100,
    fontWeight: 'bold',
    color: '#555',
    textAlign: 'left',
    lineHeight: 34, // 줄 간격 추가
  },
});

export default AnimatedTitle;
