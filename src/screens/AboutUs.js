import React, { useState, useRef, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomText from '../components/CustomText';
import { WebView } from 'react-native-webview';

const screenWidth = Dimensions.get('window').width;

const AboutUs = ({ navigation }) => {
  const [selectedTab, setSelectedTab] = useState('privacy');
  
  const privacySource = require('../../assets/privacy-policy.html');
  const termsSource = require('../../assets/terms-of-service.html');

  const scrollAnim = useRef(new Animated.Value(0)).current;
  const [textWidth, setTextWidth] = useState(0);

  const message = "공공데이터를 활용합니다. 잘못된 정보가 있거나 업데이트가 필요하다면 이메일을 보내주세요.☺️ ";
  const message2 = "We utilize public data. If there is any incorrect information or updates needed, please send us an email.☺️ ";

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
        toValue: -textWidth, // 한 번의 애니메이션에 절반 길이만큼 이동 (반복 2회 배치했기 때문에 절반 이동 후 연속됨)
        duration: 20000,
        useNativeDriver: true,
      })
    ).start();
  };

  return (
    <View style={styles.container}>
      {/* 헤더 영역 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <CustomText style={styles.headerTitle}>About Us</CustomText>
        <View style={{ width: 24 }} />
      </View>
      
      {/* 탭 영역 */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tabButton, selectedTab === 'privacy' && styles.activeTab]}
          onPress={() => setSelectedTab('privacy')}
        >
          <CustomText style={[styles.tabButtonText, selectedTab === 'privacy' && styles.activeTabText]}>이용약관</CustomText>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabButton, selectedTab === 'terms' && styles.activeTab]}
          onPress={() => setSelectedTab('terms')}
        >
          <CustomText style={[styles.tabButtonText, selectedTab === 'terms' && styles.activeTabText]}>서비스 약관</CustomText>
        </TouchableOpacity>
      </View>

      {/* WebView 컨텐츠 영역 */}
      <View style={styles.webviewContainer}>
        <WebView
          source={selectedTab === 'privacy' ? privacySource : termsSource}
          style={{ flex: 1 }}
        />
      </View>

      {/* 하단 무한 스크롤 배너 */}
      <View style={styles.footerContainer}>
        <View style={styles.footerMask}>
          <Animated.View
            style={[
              styles.footerTextWrapper,
              { transform: [{ translateX: scrollAnim }] }
            ]}
            onLayout={(e) => {
              setTextWidth(e.nativeEvent.layout.width);
            }}
          >
            {/* 동일한 메세지를 두 번 배치하여 끊김 없이 반복되는 느낌을 준다 */}
            <CustomText style={styles.footerText}>{message}</CustomText>
            <CustomText style={styles.footerText}>{message2}</CustomText>
          </Animated.View>
        </View>
      </View>
    </View>
  );
};

export default AboutUs;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    height: 60, 
    width: '100%',
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingHorizontal: 10,
  },
  backButton: {},
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabButtonText: {
    fontSize: 16,
    color: '#333',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#333',
  },
  activeTabText: {
    fontWeight: 'bold',
    color: '#000',
  },
  webviewContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  footerContainer: {
    height: 30,
    backgroundColor: '#eee',
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
    color: '#333',
    paddingHorizontal: 10,
  },
});
