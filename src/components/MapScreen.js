import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  LayoutChangeEvent,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import axios from 'axios';

const MapScreen = () => {
  // 마커 데이터를 저장하는 상태
  const [markers, setMarkers] = useState([]);
  // 선택된 마커를 저장하는 상태
  const [selectedMarker, setSelectedMarker] = useState(null);
  // 지도가 준비되었는지 여부를 추적하는 상태
  const [isMapReady, setIsMapReady] = useState(false);
  // MapView의 부모 컨테이너 레이아웃 정보를 저장하는 상태
  const [mapViewContainerLayout, setMapViewContainerLayout] = useState(null);
  // MapView 참조
  const mapRef = useRef(null);

  // 컴포넌트가 마운트될 때 마커 데이터를 가져오는 useEffect
  useEffect(() => {
    const fetchMarkers = async () => {
      try {
        // API에서 캠프장 데이터를 가져옴
        const response = await axios.get('http://10.0.2.2:8080/api/campsites');
        setMarkers(response.data);
      } catch (error) {
        console.error('마커를 가져오는 중 오류 발생:', error);
      }
    };

    fetchMarkers();
  }, []);

  // 지도가 준비되고, 레이아웃이 완료되었으며, 마커 데이터가 로드되었을 때 fitToCoordinates 호출
  useEffect(() => {
    if (
      isMapReady &&
      mapViewContainerLayout &&
      markers.length > 0 &&
      mapRef.current
    ) {
      // 모든 마커의 좌표를 배열로 생성
      const coordinates = markers.map((marker) => ({
        latitude: marker.latitude,
        longitude: marker.longitude,
      }));

      // 지도의 뷰포트를 모든 마커가 보이도록 조정
      mapRef.current.fitToCoordinates(coordinates, {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 }, // 패딩 설정
        animated: true, // 애니메이션 효과 적용
      });
    }
  }, [isMapReady, mapViewContainerLayout, markers]);

  // 마커를 선택했을 때 호출되는 함수
  const handleMarkerPress = (marker) => {
    setSelectedMarker(marker);
  };

  // 지도가 준비되었을 때 호출되는 함수
  const handleMapReady = () => {
    setIsMapReady(true);
  };

  // MapView의 부모 컨테이너 레이아웃이 변경될 때 호출되는 함수
  const handleMapLayout = (event) => {
    const layout = event.nativeEvent.layout;
    setMapViewContainerLayout(layout);
  };

  return (
    <View style={styles.container}>
      {/* MapView의 부모 컨테이너 */}
      <View style={styles.mapContainer} onLayout={handleMapLayout}>
        {/* 레이아웃이 완료되기 전에는 로딩 인디케이터를 표시 */}
        {!mapViewContainerLayout && (
          <ActivityIndicator
            style={styles.loading}
            size="large"
            color="#0000ff"
          />
        )}
        {/* 레이아웃이 완료된 후에 MapView를 렌더링 */}
        {mapViewContainerLayout && (
          <MapView
            ref={mapRef} // MapView 참조 설정
            style={{
              width: mapViewContainerLayout.width, // 부모 컨테이너의 너비
              height: mapViewContainerLayout.height, // 부모 컨테이너의 높이
            }}
            onMapReady={handleMapReady} // 지도 준비 완료 시 호출
            initialRegion={{
              latitude: 37.78825, // 초기 위도
              longitude: -122.4324, // 초기 경도
              latitudeDelta: 0.0922, // 위도 델타
              longitudeDelta: 0.0421, // 경도 델타
            }}
          >
            {/* 마커 렌더링 */}
            {markers.map((marker) => (
              <Marker
                key={marker.id}
                coordinate={{
                  latitude: marker.latitude,
                  longitude: marker.longitude,
                }}
                title={marker.name}
                onPress={() => handleMarkerPress(marker)} // 마커 선택 시 호출
              />
            ))}
          </MapView>
        )}
      </View>

      {/* 선택된 마커의 정보 표시 */}
      {selectedMarker && (
        <View style={styles.markerInfo}>
          <Text style={styles.markerTitle}>{selectedMarker.name}</Text>
          <Text>{selectedMarker.description}</Text>
          <TouchableOpacity onPress={() => alert('상세 페이지로 이동')}>
            <Image
              source={{ uri: selectedMarker.imageUrl }}
              style={styles.markerImage}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

// 스타일 시트 정의
const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    flex: 1, // 전체 화면을 차지
  },
  mapContainer: {
    width: '100%',
    height: '100%',
  },
  markerInfo: {
    position: 'absolute', // 절대 위치 지정
    bottom: 50, // 화면 하단에서 50px 위
    left: 20, // 왼쪽에서 20px
    right: 20, // 오른쪽에서 20px
    backgroundColor: 'white', // 배경색 흰색
    padding: 15, // 내부 여백 15px
    borderRadius: 10, // 테두리 둥글게
    shadowColor: '#000', // 그림자 색상
    shadowOpacity: 0.3, // 그림자 불투명도
    shadowRadius: 5, // 그림자 반경
    elevation: 5, // 안드로이드 그림자 깊이
  },
  markerTitle: {
    fontSize: 16, // 폰트 크기 16
    fontWeight: 'bold', // 굵은 글씨
  },
  markerImage: {
    width: '100%', // 너비 100%
    height: 200, // 높이 200px
    marginTop: 10, // 위쪽 여백 10px
  },
  loading: {
    position: 'absolute', // 절대 위치 지정
    top: '50%', // 화면 상단에서 50%
    left: '50%', // 화면 왼쪽에서 50%
    marginLeft: -25, // 인디케이터 너비의 절반만큼 왼쪽으로 이동
    marginTop: -25, // 인디케이터 높이의 절반만큼 위로 이동
  },
});

export default MapScreen;
