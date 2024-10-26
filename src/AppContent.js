// src/AppContent.js
import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, View, StyleSheet } from 'react-native';
import Header from './components/Header';
import MainContent from './screens/MainContent';
import RightDrawer from './components/RightDrawer/RightDrawer';
import { useDrawerStatus } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native'; // useNavigation 임포트

const AppContent = () => {
  const [isRightDrawerOpen, setIsRightDrawerOpen] = useState(false);
  const [showRestStops, setShowRestStops] = useState(false);
  const [showChargingStations, setShowChargingStations] = useState(false);
  const [showCampgrounds, setShowCampgrounds] = useState(true);
  const [showCountrysides, setShowCountrysides] = useState(true);
  const [showWifis, setShowWifis] = useState(false);
  const [showBeaches, setShowBeaches] = useState(true);
  const mainContentRef = useRef(null); // MainContent의 ref
  const navigation = useNavigation(); // navigation 객체 사용

  const toggleRightDrawer = () => {
    setIsRightDrawerOpen(prev => !prev);
  };

  const closeRightDrawer = () => {
    setIsRightDrawerOpen(false);
  };

  const toggleCampgroundsFunc = () => {
    setShowCampgrounds(prev => !prev);
    console.log("캠핑 마커 토글:", !showCampgrounds);
  };

  const toggleWifisFunc = () => {
    setShowWifis(prev => !prev);
    console.log("WIFI 마커 토글:", !showWifis);
  };

  const toggleBeachesFunc = () => {
    setShowBeaches(prev => !prev);
    console.log("해수욕장 마커 토글:", !showBeaches);
  };

  const toggleRestStopsFunc = () => {
    setShowRestStops(prev => !prev);
    console.log("휴게소 마커 토글:", !showRestStops);
  };

  const toggleChargingStationsFunc = () => {
    setShowChargingStations(prev => !prev);
    console.log("충전소 마커 토글:", !showChargingStations);
  };

  const toggleCountrysidesFunc = () => {
    setShowCountrysides(prev => !prev);
    console.log("농어촌 마커 토글:", !showCountrysides);
  }

  // 왼쪽 드로어의 상태를 감지
  const drawerStatus = useDrawerStatus();

  useEffect(() => {
    if (drawerStatus === 'open') {
      if (isRightDrawerOpen) {
        // console.log("왼쪽 드로어가 열릴 때 오른쪽 드로어를 닫습니다.");
        setIsRightDrawerOpen(false);
      }
    }
  }, [drawerStatus, isRightDrawerOpen]);

  // 메인 화면으로 돌아가는 함수
  const goToMainScreen = () => {
    console.log("CAMPERS 클릭됨: 메인 화면으로 돌아갑니다.");
    if (mainContentRef.current) {
      mainContentRef.current.resetMap(); // MainContent의 resetMap 호출
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      {/* 헤더 */}
      <Header
        toggleRightDrawer={toggleRightDrawer}
        onPressTitle={goToMainScreen} // "CAMPERS" 클릭 시 호출할 함수 전달
      />

      {/* 메인 콘텐츠 */}
      <View style={{ flex: 1 }}>
        <MainContent
          ref={mainContentRef}
          showRestStops={showRestStops}
          showChargingStations={showChargingStations}
          showCampgrounds={showCampgrounds}
          showCountrysides={showCountrysides}
          showBeaches={showBeaches}
          showWifis={showWifis}
          toggleRestStops={toggleRestStopsFunc}
          toggleChargingStations={toggleChargingStationsFunc}
          toggleCampgrounds={toggleCampgroundsFunc}
          toggleCountrysides={toggleCountrysidesFunc}
          toggleBeaches={toggleBeachesFunc}
          toggleWifis={toggleWifisFunc}
          navigation={navigation} // navigation 객체 전달
        />
      </View>

      {/* 오른쪽 드로어 */}
      <RightDrawer
        isOpen={isRightDrawerOpen}
        onClose={closeRightDrawer}
        toggleRestStops={toggleRestStopsFunc}
        toggleChargingStations={toggleChargingStationsFunc}
        toggleCampgrounds={toggleCampgroundsFunc}
        toggleCountrysides={toggleCountrysidesFunc}
        toggleBeaches={toggleBeachesFunc}
        toggleWifis={toggleWifisFunc}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default AppContent;
