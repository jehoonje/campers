// src/screens/MainContent.js
import React, { forwardRef, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapViewComponent from '../components/MapView/MapView';

const MainContent = forwardRef(({ showRestStops, showChargingStations, showSpringWater, toggleRestStops, toggleChargingStations, toggleSpringWater }, ref) => {
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
          showSpringWater={showSpringWater}
        />
      </View>
      <View style={styles.textContainer}>
        <Text>Main content goes here.</Text>
        {/* 추가적인 콘텐츠를 여기에 배치할 수 있습니다. */}
      </View>
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
  textContainer: {
    padding: 10,
    backgroundColor: '#fff',
  },
});

export default MainContent;
