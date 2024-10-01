import React, { useEffect, useState } from 'react';
import { View, StyleSheet, PermissionsAndroid, ActivityIndicator } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { WebView } from 'react-native-webview';

const MapScreen = () => {
  const [userLocation, setUserLocation] = useState(null);

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

  // 사용자의 위치를 가져오기 전까지 로딩 화면을 보여줌
  if (!userLocation) {
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loading} />;
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
      <style>
        html, body { margin: 0; padding: 0; height: 100%; }
        #map { height: 100%; width: 100%; }
        .leaflet-bar { background-color: white; border-radius: 5px; box-shadow: 0 1px 5px rgba(0,0,0,0.65); padding: 5px; }
        .leaflet-bar a { background-color: #fff; border-bottom: 1px solid #ccc; text-align: center; width: 30px; height: 30px; line-height: 30px; display: block; color: #000; font-size: 20px; }
        .leaflet-bar a:hover { background-color: #f4f4f4; }
        .leaflet-bar svg { width: 80%; height: 80%; padding: 10%; }
      </style>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
    </head>
    <body>
      <div id="map"></div>
      <script>
        // 지도 초기화: zoomControl 비활성화, 유저의 현재 위치로 초기 설정
        var map = L.map('map', { zoomControl: false }).setView([${userLocation.latitude}, ${userLocation.longitude}], 13);
        
        // CARTO 'Voyager' 스타일 타일 추가
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
          maxZoom: 19,
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        }).addTo(map);

        // 현재 위치 마커
        var userMarker = L.marker([${userLocation.latitude}, ${userLocation.longitude}]).addTo(map);
        userMarker.bindPopup('현재 위치').openPopup();

        // 하단에만 확대 축소 버튼 추가
        L.control.zoom({
          position: 'bottomright'
        }).addTo(map);

        // 현재 위치로 이동하는 커스텀 버튼 추가
        var locateButton = L.control({position: 'bottomleft'});
        locateButton.onAdd = function(map) {
          var div = L.DomUtil.create('div', 'leaflet-bar');
          div.innerHTML = '<a href="#" title="현재 위치로 이동"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-crosshair"><circle cx="12" cy="12" r="10"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/></svg></a>';
          div.onclick = function() {
            map.setView([${userLocation.latitude}, ${userLocation.longitude}], 13);
          };
          return div;
        };
        locateButton.addTo(map);
      </script>
    </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={['*']}
        source={{ html: htmlContent }}
        style={{ flex: 1 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loading: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -25,
    marginLeft: -25,
  },
});

export default MapScreen;
