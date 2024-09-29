import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  PermissionsAndroid,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import axios from 'axios';
import Geolocation from '@react-native-community/geolocation';

const MapScreen = () => {
  // 기존 상태
  const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [mapViewContainerLayout, setMapViewContainerLayout] = useState(null);
  const mapRef = useRef(null);

  // 유저의 현재 위치를 저장하는 상태 추가
  const [userLocation, setUserLocation] = useState(null);

  // 마커 데이터 가져오기
  useEffect(() => {
    const fetchMarkers = async () => {
      try {
        const response = await axios.get('http://10.0.2.2:8080/api/campsites');
        setMarkers(response.data);
      } catch (error) {
        console.error('마커를 가져오는 중 오류 발생:', error);
      }
    };
    fetchMarkers();
  }, []);

  // 위치 권한 요청 및 유저의 현재 위치 가져오기
  useEffect(() => {
    const requestLocationPermission = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: '위치 권한 요청',
            message: '앱에서 지도를 사용하기 위해 위치 권한이 필요합니다.',
            buttonNeutral: '나중에 묻기',
            buttonNegative: '취소',
            buttonPositive: '허용',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          Geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              setUserLocation({ latitude, longitude });
            },
            (error) => {
              console.error('현재 위치를 가져오는 중 오류 발생:', error);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
          );
        } else {
          console.log('위치 권한이 거부되었습니다.');
        }
      } catch (err) {
        console.warn(err);
      }
    };
    requestLocationPermission();
  }, []);

  // 지도의 뷰포트 조정
  useEffect(() => {
    if (
      isMapReady &&
      mapViewContainerLayout &&
      markers.length > 0 &&
      mapRef.current &&
      userLocation
    ) {
      const markerCoordinates = markers.map((marker) => ({
        latitude: marker.latitude,
        longitude: marker.longitude,
      }));
      const allCoordinates = [
        ...markerCoordinates,
        { latitude: userLocation.latitude, longitude: userLocation.longitude },
      ];
      mapRef.current.fitToCoordinates(allCoordinates, {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      });
    }
  }, [isMapReady, mapViewContainerLayout, markers, userLocation]);

  const handleMarkerPress = (marker) => {
    setSelectedMarker(marker);
  };

  const handleMapReady = () => {
    setIsMapReady(true);
  };

  const handleMapLayout = (event) => {
    const layout = event.nativeEvent.layout;
    setMapViewContainerLayout(layout);
  };

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer} onLayout={handleMapLayout}>
        {(!mapViewContainerLayout || !userLocation) && (
          <ActivityIndicator
            style={styles.loading}
            size="large"
            color="#0000ff"
          />
        )}
        {mapViewContainerLayout && userLocation && (
          <MapView
            ref={mapRef}
            style={{
              width: mapViewContainerLayout.width,
              height: mapViewContainerLayout.height,
            }}
            onMapReady={handleMapReady}
            initialRegion={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            {markers.map((marker) => (
              <Marker
                key={marker.id}
                coordinate={{
                  latitude: marker.latitude,
                  longitude: marker.longitude,
                }}
                title={marker.name}
                onPress={() => handleMarkerPress(marker)}
              />
            ))}
            {/* 유저의 현재 위치 마커 */}
            <Marker
              coordinate={{
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
              }}
              title="현재 위치"
              pinColor="blue" // 유저 위치 마커의 색상을 구분하기 위해 설정
            />
          </MapView>
        )}
      </View>

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

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    flex: 1,
  },
  mapContainer: {
    width: '100%',
    height: '100%',
  },
  markerInfo: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  markerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  markerImage: {
    width: '100%',
    height: 200,
    marginTop: 10,
  },
  loading: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -25,
    marginTop: -25,
  },
});

export default MapScreen;
