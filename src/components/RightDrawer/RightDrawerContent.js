// src/components/RightDrawerContent/RightDrawerContent.js
import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import DrawerButton from './DrawerButton'; // 개별 버튼 컴포넌트
import Ionicons from 'react-native-vector-icons/Ionicons'; // 필요한 아이콘 라이브러리
import { useNavigation, DrawerActions } from '@react-navigation/native';

const RightDrawerContent = ({ toggleRestStops, toggleChargingStations }) => {
  const navigation = useNavigation(); // 네비게이션 객체 사용

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
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {buttonData.map((item, index) => (
          <DrawerButton
            key={index}
            name={item.name}
            icon={item.icon}
            lib={item.lib}
            onPress={() => {
              console.log(`${item.name} 버튼 클릭됨`); // 디버그 로그 추가
              if (item.name === '휴게소') {
                toggleRestStops(); // 휴게소 버튼 클릭 시 마커 토글
              } else if (item.name === '전기차 충전소') {
                toggleChargingStations(); // 충전소 버튼 클릭 시 마커 토글
              }
              // 다른 버튼들에 대한 추가 로직을 여기에 추가할 수 있습니다.

              // 드로어 닫기
              navigation.dispatch(DrawerActions.closeDrawer());
            }}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    paddingTop: 20,
  },
  scrollContainer: {
    paddingHorizontal: 10,
  },
});

export default RightDrawerContent;
