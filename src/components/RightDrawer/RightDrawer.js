// src/components/RightDrawer/RightDrawer.js
import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import DrawerButton from './DrawerButton';
import Icon from 'react-native-vector-icons/FontAwesome';
import Fontisto from 'react-native-vector-icons/Fontisto';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const { height } = Dimensions.get('window');

const RightDrawer = ({ isOpen, onClose, toggleRestStops, toggleChargingStations }) => {
  const slideAnim = useRef(new Animated.Value(-height)).current; // 초기 위치: 화면 위쪽

  useEffect(() => {
    if (isOpen) {
      Animated.timing(slideAnim, {
        toValue: 0, // 드로어 슬라이드 내려오기
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -height, // 드로어 슬라이드 올리기
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isOpen, slideAnim]);

  if (!isOpen && slideAnim.__getValue() === -height) return null; // 드로어가 닫혔을 때 렌더링하지 않음

  const buttonData = [
    { name: '즐겨찾기', icon: 'star', lib: 'FontAwesome' },
    { name: '모두 보기', icon: 'eye', lib: 'FontAwesome' },
    { name: '모든 캠핑장 보기', icon: 'map', lib: 'FontAwesome' },
    { name: '일반 캠핑', icon: 'tent', lib: 'Fontisto' },
    { name: '노지 캠핑', icon: 'tree', lib: 'FontAwesome' },
    { name: '글램핑', icon: 'home', lib: 'FontAwesome5' },
    { name: '캠핑카 주차장', icon: 'bus', lib: 'FontAwesome' },
    { name: '액티비티', icon: 'bicycle', lib: 'FontAwesome' },
    { name: '전기차 충전소', icon: 'bolt', lib: 'FontAwesome' },
    { name: '주유소', icon: 'gas-pump', lib: 'FontAwesome5' },
    { name: '현금 인출기', icon: 'money', lib: 'FontAwesome' },
    { name: '도로 공사중', icon: 'warning', lib: 'FontAwesome' },
    { name: '공중 화장실', icon: 'restroom', lib: 'FontAwesome5' },
    { name: '와이파이', icon: 'wifi', lib: 'FontAwesome' },
    { name: '휴지통', icon: 'trash', lib: 'FontAwesome' },
    { name: '휴게소', icon: 'coffee', lib: 'FontAwesome' },
    { name: '약수터', icon: 'tint', lib: 'FontAwesome' },
  ];

  return (
    <Animated.View
      style={[
        styles.drawerContainer,
        { transform: [{ translateY: slideAnim }] },
      ]}
    >
      {/* 오버레이 터치 시 드로어 닫기 */}
      <TouchableOpacity style={styles.overlayTouchable} onPress={onClose} />

      <View style={styles.content}>
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {buttonData.map((item, index) => (
            <DrawerButton
              key={index}
              name={item.name}
              icon={item.icon}
              lib={item.lib}
              onPress={() => {
                if (item.name === '휴게소') {
                  toggleRestStops(); // 휴게소 버튼 클릭 시 마커 토글
                } else if (item.name === '전기차 충전소') {
                  toggleChargingStations(); // 충전소 버튼 클릭 시 마커 토글
                }
                onClose(); // 버튼 클릭 시 드로어 닫기
              }}
            />
          ))}
        </ScrollView>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  drawerContainer: {
    position: 'absolute',
    width: '100%',
    top: 60, // 헤더 높이만큼 아래에서 시작
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0)', // 드로어 배경
    zIndex: 2, // 헤더 뒤로 보내기
  },
  overlayTouchable: {
    flex: 1,
  },
  content: {
    position: 'absolute',
    width: '60%',
    top: 0,
    right: 0,
    height: '90%',
    backgroundColor: '#f8f8f8',
    // paddingTop: 20,
  },
  scrollContainer: {
    // paddingHorizontal: 10,
  },
});

export default RightDrawer;
