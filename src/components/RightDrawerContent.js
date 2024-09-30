import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import FontAwesome icons
import Fontisto from 'react-native-vector-icons/Fontisto'; // Import Fontisto icons
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'; // Import Fontisto icons


const { height } = Dimensions.get('window');

const RightDrawerContent = ({ isOpen, onClose }) => {
  const drawerHeight = height - 60; // 헤더 아래부터 화면 하단까지
  const [slideAnim] = useState(new Animated.Value(-drawerHeight)); // 처음에는 화면 위에 숨겨져 있음
  const [visible, setVisible] = useState(false); // 드로어의 가시성 상태

  useEffect(() => {
    if (isOpen) {
      setVisible(true); // 드로어를 먼저 보이게 설정
      Animated.timing(slideAnim, {
        toValue: 0, // 드로어를 아래로 슬라이드하여 열림
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      // 닫기 애니메이션 실행 후에 드로어 가시성을 숨김
      Animated.timing(slideAnim, {
        toValue: -drawerHeight, // 드로어를 위로 슬라이드하여 닫음
        duration: 300,
        useNativeDriver: true,
      }).start(() => setVisible(false)); // 애니메이션이 끝나면 숨김
    }
  }, [isOpen]);

  if (!visible) return null; // 드로어가 숨겨져 있을 때는 렌더링하지 않음

  // 버튼 이름과 아이콘 이름 리스트
  const buttonData = [
    { name: '즐겨찾기', icon: 'star', lib: 'FontAwesome' },
    { name: '모두 보기', icon: 'eye', lib: 'FontAwesome' },
    { name: '모든 캠핑장 보기', icon: 'map', lib: 'FontAwesome' },
    { name: '일반 캠핑', icon: 'tent', lib: 'Fontisto' }, // Fontisto 아이콘 사용
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
    { name: '약수터', icon: 'tint', lib: 'FontAwesome' },
  ];

  return (
    <View style={styles.overlay}>
      {/* 드로어 외부를 누르면 닫히도록 하는 투명한 뷰 */}
      <TouchableOpacity style={styles.overlayTouchable} onPress={onClose} />

      <Animated.View
        style={[
          styles.drawerContainer,
          { transform: [{ translateY: slideAnim }] },
        ]}
      >
        {/* 드로어 내용 */}
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {buttonData.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.button,
                index === 0 && styles.firstButton, // 첫 번째 버튼에만 추가 스타일 적용
              ]}
              onPress={() => {
                // 버튼 눌렀을 때의 동작 처리
              }}
            >
              <View style={styles.iconContainer}>
              {item.lib === 'FontAwesome' ? (
                  <Icon name={item.icon} size={20} color="#333" />
                ) : item.lib === 'Fontisto' ? (
                  <Fontisto name={item.icon} size={20} color="#333" /> // Fontisto 아이콘 사용
                ) : (
                  <FontAwesome5 name={item.icon} size={20} color="#333" /> // FontAwesome5 아이콘 사용
                )}
              </View>
              <Text style={styles.buttonText}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '93%',
    zIndex: 1,
  },
  overlayTouchable: {
    flex: 1,
  },
  drawerContainer: {
    position: 'absolute',
    width: '70%',
    top: 60, // 헤더 아래에서 시작
    right: 0,
    bottom: 0, // 화면 하단까지
    backgroundColor: '#f8f8f8',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    zIndex: 2, // 다른 콘텐츠 위에 표시되도록
  },
  scrollContainer: {
    flexGrow: 1,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#ffffff',
    justifyContent: 'flex-start',
    // 그림자 효과 (선택 사항)
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  firstButton: {
    marginVertical: 10, // 첫 번째 버튼에만 위아래 마진 추가
  },
  iconContainer: {
    width: 30, // 아이콘 공간 고정
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10, // 아이콘과 텍스트 사이 간격
  },
});

export default RightDrawerContent;
