import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, PermissionsAndroid, ActivityIndicator } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { WebView } from 'react-native-webview';
import restStopsData from '../data/reststops.json';

const MapScreen = ({ showRestStops }) => {
  const [userLocation, setUserLocation] = useState(null);
  const webviewRef = useRef(null);

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

  useEffect(() => {
    // showRestStops 상태가 변경될 때 WebView에 메시지 전송
    if (webviewRef.current) {
      webviewRef.current.postMessage(
        JSON.stringify({ type: 'toggleRestStops', show: showRestStops })
      );
    }
  }, [showRestStops]);

  if (!userLocation) {
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loading} />;
  }

  // htmlContent는 첫 렌더링 시에만 사용되며, 이후 상태 변경 시 재렌더링되지 않음
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
      <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster/dist/MarkerCluster.css" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster/dist/MarkerCluster.Default.css" />
      <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
      <script src="https://unpkg.com/leaflet.markercluster/dist/leaflet.markercluster.js"></script>
    </head>
    <body>
      <div id="map"></div>
      <script>
        // 지도가 처음 렌더링될 때만 현재 위치로 이동
        var map = L.map('map', { zoomControl: false }).setView([${userLocation.latitude}, ${userLocation.longitude}], 13);

        // OSM 타일 추가 및 파스텔톤 효과 적용
        var tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom:19,
        }).addTo(map);

        // CSS 필터를 적용하여 파스텔톤 효과 적용
        tileLayer.getContainer().style.filter = 'saturate(0.7) brightness(1.0) hue-rotate(700deg)';

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

        // 마커 클러스터 그룹 생성
        var markers = L.markerClusterGroup();
        var restStopMarkers = [];

        // 휴게소 데이터
        var restStops = ${JSON.stringify(restStopsData)};

        // 휴게소 마커를 업데이트하는 함수
        function updateRestStopMarkers(show) {
          if (show) {
            restStops.forEach(function(stop) {
              var marker = L.marker([parseFloat(stop.위도), parseFloat(stop.경도)]).addTo(markers);
              marker.bindPopup(stop.휴게소명);
              restStopMarkers.push(marker);
            });
            map.addLayer(markers);
          } else {
            restStopMarkers.forEach(function(marker) {
              map.removeLayer(marker);
            });
            restStopMarkers = [];
          }
        }

        // 초기 상태에 따른 휴게소 마커 설정
        updateRestStopMarkers(${showRestStops});

        // React Native로부터 메시지 수신
        document.addEventListener('message', function(event) {
          var message = JSON.parse(event.data);
          if (message.type === 'toggleRestStops') {
            updateRestStopMarkers(message.show);
          }
        });
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
        javaScriptEnabled={true}
        ref={webviewRef} 
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
