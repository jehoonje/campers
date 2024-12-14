// src/AppContent.js
import React, {useState, useEffect, useRef, useContext} from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import Header from './components/Header';
import MainContent from './screens/MainContent';
import RightDrawer from './components/RightDrawer/RightDrawer';
import {useDrawerStatus} from '@react-navigation/drawer';
import {useNavigation, CommonActions} from '@react-navigation/native';
import {useFocusEffect} from '@react-navigation/native';
import {AuthContext} from './AuthContext';
import SearchComponent from './components/SearchComponent';
import Footer from './components/Footer';

const HEADER_HEIGHT = 52;

const AppContent = () => {
  const [isRightDrawerOpen, setIsRightDrawerOpen] = useState(false);
  const [showRestStops, setShowRestStops] = useState(false);
  const [showFishings, setShowFishings] = useState(false);
  const [showChargingStations, setShowChargingStations] = useState(false);
  const [showCampgrounds, setShowCampgrounds] = useState(true);
  const [showCountrysides, setShowCountrysides] = useState(false);
  const [showCampsites, setShowCampsites] = useState(true);
  const [showAutoCamps, setShowAutoCamps] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showWifis, setShowWifis] = useState(false);
  const [showBeaches, setShowBeaches] = useState(false);
  const [showAllMarkers, setShowAllMarkers] = useState(false);

  const [showSearch, setShowSearch] = useState(false);
  const [renderSearch, setRenderSearch] = useState(false);
  
  const mainContentRef = useRef(null); // MainContent의 ref
  const navigation = useNavigation(); // navigation 객체 사용
  const {checkAuthStatus} = useContext(AuthContext);

  // 애니메이션을 위한 Animated.Value 초기화
  const searchAnim = useRef(new Animated.Value(0)).current; // 초기값: 0 (숨김)

  // showSearch 상태가 변경될 때 애니메이션 실행
  useEffect(() => {
    if (showSearch) {
      Animated.timing(searchAnim, {
        toValue: 1, // 나타날 때
        duration: 500, // 애니메이션 지속 시간 (밀리초)
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(searchAnim, {
        toValue: 0, // 사라질 때
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [showSearch, searchAnim]);

  useFocusEffect(
    React.useCallback(() => {
      checkAuthStatus();
    }, []),
  );

  const toggleRightDrawer = () => {
    setIsRightDrawerOpen(prev => !prev);
  };

  const closeRightDrawer = () => {
    setIsRightDrawerOpen(false);
  };

  // 모든 마커를 토글하는 함수
  const toggleAllMarkersFunc = () => {
    const allMarkers = [
      showRestStops,
      showChargingStations,
      showCampgrounds,
      showCountrysides,
      showFishings,
      showWifis,
      showBeaches,
      showCampsites,
      showAutoCamps,
    ];
    const areAllMarkersTrue = allMarkers.every(marker => marker);

    if (areAllMarkersTrue) {
      // 모든 마커가 true일 경우 모두 false로 설정
      setShowAllMarkers(false);
      setShowFavorites(false);
      setShowRestStops(false);
      setShowChargingStations(false);
      setShowCampgrounds(false);
      setShowFishings(false);
      setShowCountrysides(false);
      setShowWifis(false);
      setShowBeaches(false);
      setShowCampsites(false);
      setShowAutoCamps(false);
      console.log('모든 마커를 끔:', false);
    } else {
      // 하나 이상의 마커가 false일 경우 모두 true로 설정
      setShowAllMarkers(true);
      setShowRestStops(true);
      setShowChargingStations(true);
      setShowCampgrounds(true);
      setShowCountrysides(true);
      setShowFavorites(false);
      setShowWifis(true);
      setShowFishings(true);
      setShowBeaches(true);
      setShowCampsites(true);
      setShowAutoCamps(true);
      console.log('모든 마커를 켬:', true);
    }
  };

  // 개별 마커를 토글하는 함수들
  const toggleCampgroundsFunc = () => {
    setShowFavorites(false);
    setShowCampgrounds(prev => !prev);
    console.log('캠핑 마커 토글:', !showCampgrounds);
  };

  const toggleFavoritesFunc = () => {
    setShowAllMarkers(false);
    setShowRestStops(false);
    setShowChargingStations(false);
    setShowCampgrounds(false);
    setShowCountrysides(false);
    setShowWifis(false);
    setShowFishings(false);
    setShowBeaches(false);
    setShowCampsites(false);
    setShowAutoCamps(false);
    setShowFavorites(prev => !prev);
    console.log('즐겨찾기 마커 토글:', !showFavorites);
  };

  const toggleWifisFunc = () => {
    setShowFavorites(false);
    setShowWifis(prev => !prev);
    console.log('WIFI 마커 토글:', !showWifis);
  };

  const toggleBeachesFunc = () => {
    setShowFavorites(false);
    setShowBeaches(prev => !prev);
    console.log('해수욕장 마커 토글:', !showBeaches);
  };

  const toggleRestStopsFunc = () => {
    setShowFavorites(false);
    setShowRestStops(prev => !prev);
    console.log('휴게소 마커 토글:', !showRestStops);
  };

  const toggleFishingsFunc = () => {
    setShowFavorites(false);
    setShowFishings(prev => !prev);
    console.log('낚시터 마커 토글:', !showFishings);
  };

  const toggleChargingStationsFunc = () => {
    setShowFavorites(false);
    setShowChargingStations(prev => !prev);
    console.log('충전소 마커 토글:', !showChargingStations);
  };

  const toggleCountrysidesFunc = () => {
    setShowFavorites(false);
    setShowCountrysides(prev => !prev);
    console.log('농어촌 마커 토글:', !showCountrysides);
  };

  const toggleCampsitesFunc = () => {
    setShowFavorites(false);
    setShowCampsites(prev => !prev);
    console.log('야영장 마커 토글:', !showCampsites);
  };

  const toggleAutoCampsFunc = () => {
    setShowFavorites(false);
    setShowAutoCamps(prev => !prev);
    console.log('오토캠핑장 마커 토글:', !showAutoCamps);
  };

  // 모든 마커 상태가 변경될 때 `showAllMarkers` 상태를 업데이트
  useEffect(() => {
    const allMarkers = [
      showRestStops,
      showChargingStations,
      showCampgrounds,
      showCountrysides,
      showFishings,
      showWifis,
      showBeaches,
      showCampsites,
      showAutoCamps,
    ];
    const areAllMarkersTrue = allMarkers.every(marker => marker);

    if (areAllMarkersTrue) {
      setShowAllMarkers(true);
    } else {
      setShowAllMarkers(false);
    }
  }, [
    showRestStops,
    showChargingStations,
    showCampgrounds,
    showCountrysides,
    showWifis,
    showFishings,
    showBeaches,
    showCampsites,
    showAutoCamps,
  ]);

  // 왼쪽 드로어의 상태를 감지
  const drawerStatus = useDrawerStatus();

  useEffect(() => {
    if (drawerStatus === 'open' && isRightDrawerOpen) {
      setIsRightDrawerOpen(false);
    }
  }, [drawerStatus, isRightDrawerOpen]);

  // 메인 화면으로 돌아가는 함수
  const goToMainScreen = () => {
    console.log('로고 클릭됨: 메인 화면으로 돌아갑니다.');
  };

  // 검색창 토글 함수
  const toggleSearch = () => {
    if (!showSearch) {
      setRenderSearch(true); // SearchComponent 렌더링 시작
      setShowSearch(true);
    } else {
      setShowSearch(false);
    }
  };

  // 애니메이션 완료 후 SearchComponent 렌더링 해제
  useEffect(() => {
    if (!showSearch && renderSearch) {
      Animated.timing(searchAnim, {
        toValue: 0, // 사라질 때
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setRenderSearch(false); // 애니메이션 완료 후 렌더링 해제
      });
    } else if (showSearch && renderSearch) {
      Animated.timing(searchAnim, {
        toValue: 1, // 나타날 때
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [showSearch, renderSearch, searchAnim]);

  return (
    <SafeAreaView style={styles.safeContainer}>
      {/* 헤더 */}
      <Header
        toggleRightDrawer={toggleRightDrawer}
        onPressTitle={goToMainScreen}
        toggleSearch={toggleSearch}
      />

      {/* 메인 콘텐츠 */}
      <View style={{flex: 1}}>
        <MainContent
          ref={mainContentRef}
          showFavorites={showFavorites}
          showAllMarkers={showAllMarkers}
          showRestStops={showRestStops}
          showChargingStations={showChargingStations}
          showCampgrounds={showCampgrounds}
          showCountrysides={showCountrysides}
          showBeaches={showBeaches}
          showFishings={showFishings}
          showWifis={showWifis}
          showCampsites={showCampsites}
          showAutoCamps={showAutoCamps}
          toggleFavorites={toggleFavoritesFunc}
          toggleAllMarkers={toggleAllMarkersFunc}
          toggleRestStops={toggleRestStopsFunc}
          toggleFishings={toggleFishingsFunc}
          toggleChargingStations={toggleChargingStationsFunc}
          toggleCampgrounds={toggleCampgroundsFunc}
          toggleCountrysides={toggleCountrysidesFunc}
          toggleBeaches={toggleBeachesFunc}
          toggleWifis={toggleWifisFunc}
          toggleAutoCamps={toggleAutoCampsFunc}
          toggleCampsites={toggleCampsitesFunc}
          navigation={navigation} // navigation 객체 전달
        />
      </View>

      {/* Footer */}
      <Footer />

      {/* 오른쪽 드로어 */}
      <RightDrawer
        isOpen={isRightDrawerOpen}
        onClose={closeRightDrawer}
        toggleFavorites={toggleFavoritesFunc}
        toggleAllMarkers={toggleAllMarkersFunc}
        toggleRestStops={toggleRestStopsFunc}
        toggleFishings={toggleFishingsFunc}
        toggleChargingStations={toggleChargingStationsFunc}
        toggleCampgrounds={toggleCampgroundsFunc}
        toggleCountrysides={toggleCountrysidesFunc}
        toggleBeaches={toggleBeachesFunc}
        toggleWifis={toggleWifisFunc}
        toggleAutoCamps={toggleAutoCampsFunc}
        toggleCampsites={toggleCampsitesFunc}
      />

      {/* 검색 컴포넌트 애니메이션 처리 */}
      {renderSearch && (
        <Animated.View
          style={[
            styles.searchOverlay,
            {
              opacity: searchAnim,
              transform: [
                {
                  translateY: searchAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-20, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <SearchComponent navigation={navigation} />
        </Animated.View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#fff',
    position: 'relative',
  },
  searchOverlay: {
    position: 'absolute',
    top: HEADER_HEIGHT, // Position below the Header
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    zIndex: 1000, // Ensure it appears above other components
    // Optional: Add shadow or elevation for better visibility
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default AppContent;
