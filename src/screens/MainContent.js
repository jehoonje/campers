// src/screens/MainContent.js
import React, { forwardRef, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import MapViewComponent from '../components/MapView/MapView';

const MainContent = forwardRef(({
  showRestStops,
  showChargingStations,
  showCampgrounds,
  toggleRestStops,
  toggleChargingStations,
  toggleCampgrounds,
  navigation, // navigation 객체 수신
}, ref) => {
  const mapViewRef = useRef(null);

  // 부모 컴포넌트에서 호출할 수 있는 함수를 노출
  React.useImperativeHandle(ref, () => ({
    resetMap: () => {
      if (mapViewRef.current) {
        mapViewRef.current.resetMap();
      }
    },
  }));

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <MapViewComponent
          ref={mapViewRef}
          showRestStops={showRestStops}
          showChargingStations={showChargingStations}
          showCampgrounds={showCampgrounds}
          navigation={navigation} // navigation 객체 전달
        />
      </View>
      {/* 추가적인 콘텐츠를 여기에 배치할 수 있습니다. */}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    flex: 1, // 맵이 전체 공간을 차지하도록 설정
  },
});

export default MainContent;
