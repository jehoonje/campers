// src/components/RightDrawer/RightDrawer.js
import React, {useEffect, useRef} from 'react';
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

const {height} = Dimensions.get('window');

const RightDrawer = ({
  isOpen,
  onClose,
  toggleFavorites,
  toggleAllMarkers,
  toggleCampsites,
  toggleAutoCamps,
  toggleFishings,
  toggleRestStops,
  toggleChargingStations,
  toggleWifis,
  toggleCampgrounds,
  toggleCountrysides,
  toggleBeaches,
}) => {
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
    {name: '즐겨찾기', icon: 'star', lib: 'FontAwesome'},
    {name: '모두 보기', icon: 'eye', lib: 'FontAwesome'},
    {name: '노지 캠핑', icon: 'tree', lib: 'FontAwesome'},
    {name: '야영 캠핑', icon: 'campground', lib: 'FontAwesome5'},
    {name: '오토 캠핑', icon: 'caravan', lib: 'FontAwesome5'},
    {name: '농어촌체험마을', icon: 'seedling', lib: 'FontAwesome5'},
    {name: '해수욕장', icon: 'umbrella-beach', lib: 'FontAwesome5'},
    {name: '전기차 충전소', icon: 'bolt', lib: 'FontAwesome'},
    {name: '낚시터', icon: 'fish', lib: 'FontAwesome5'},
    {name: '와이파이', icon: 'wifi', lib: 'FontAwesome'},
    {name: '휴게소', icon: 'coffee', lib: 'FontAwesome'},
  ];

  return (
    <Animated.View
      style={[styles.drawerContainer, {transform: [{translateY: slideAnim}]}]}>
      {/* 오버레이 터치 시 드로어 닫기 */}
      <TouchableOpacity style={styles.overlayTouchable} onPress={onClose} />

      <View style={styles.content}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}>
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
                } else if (item.name === '노지 캠핑') {
                  toggleCampgrounds(); // 캠핑 버튼 클릭시 마커 토글
                } else if (item.name === '야영 캠핑') {
                  toggleCampsites(); // 버튼 클릭시 야영 마커 토글
                } else if (item.name === '오토 캠핑') {
                  toggleAutoCamps(); // 버튼 클릭시 오토캠핑장 마커 토글
                } else if (item.name === '와이파이') {
                  toggleWifis(); // 와이파이 버튼 클릭시 마커 토글
                } else if (item.name === '모두 보기') {
                  toggleAllMarkers(); // 버튼 클릭시 모든 마커 토글
                } else if (item.name === '농어촌체험마을') {
                  toggleCountrysides(); // 농어촌 버튼 클릭시 마커 토글
                } else if (item.name === '해수욕장') {
                  toggleBeaches(); // 해수욕장 버튼 클릭시 마커 토글
                } else if (item.name === '낚시터') {
                  toggleFishings(); // 낚시터 버튼 클릭시 마커 토글
                } else if (item.name === '즐겨찾기') {
                  toggleFavorites(); // 즐겨찾기 버튼 클릭시 마커 토글
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
    height: '81%',
    backgroundColor: '#f8f8f8',
    // paddingTop: 20,
  },
  scrollContainer: {
    // paddingHorizontal: 10,
  },
});

export default RightDrawer;
