// src/components/MapView/MapView.js
import React, { useEffect, useState, useRef, useCallback, forwardRef, useImperativeHandle } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import restStopsData from '../../data/reststops.json';
import chargingStationsData from '../../data/chargingStations.json';
import useLocation from '../../hooks/useLocation';

const MapView = forwardRef(({ showRestStops, showChargingStations }, ref) => {
  const { userLocation, error } = useLocation();
  const [htmlContent, setHtmlContent] = useState(null);
  const [mapReady, setMapReady] = useState(false);
  const webviewRef = useRef(null);
  
  // 초기 토글 메시지 전송을 한 번만 수행하도록 플래그 설정
  const initialToggleSent = useRef(false);

  // 부모 컴포넌트에서 resetMap 함수를 호출할 수 있도록 노출
  useImperativeHandle(ref, () => ({
    resetMap: () => {
      if (webviewRef.current) {
        webviewRef.current.postMessage(JSON.stringify({ type: 'resetMap' }));
      }
    },
  }));

  // 사용자 위치가 설정되면 HTML 콘텐츠 초기화
  useEffect(() => {
    if (userLocation && !htmlContent) {
      const initialHtml = `
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
            (function() {
              var map;
              var restStopMarkers = L.markerClusterGroup();
              var chargingStationMarkers = L.markerClusterGroup();
              var restStops = ${JSON.stringify(restStopsData)};
              var chargingStations = ${JSON.stringify(chargingStationsData)};
              var userLocation = [${userLocation.latitude}, ${userLocation.longitude}];
              
              // 마커 중복 추가 방지를 위한 플래그
              var restStopsAdded = false;
              var chargingStationsAdded = false;

              function initializeMap() {
                map = L.map('map', { zoomControl: false }).setView(userLocation, 13);

                var tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                  maxZoom:19,
                }).addTo(map);

                // 파스텔톤 효과 적용
                tileLayer.getContainer().style.filter = 'saturate(0.7) brightness(1.0) hue-rotate(700deg)';

                // 현재 위치 마커
                var userMarker = L.marker(userLocation).addTo(map);
                userMarker.bindPopup('현재 위치').openPopup();

                // 하단에 확대/축소 버튼 추가
                L.control.zoom({
                  position: 'bottomright'
                }).addTo(map);

                // 현재 위치로 이동하는 커스텀 버튼 추가
                var locateButton = L.control({position: 'bottomleft'});
                locateButton.onAdd = function(map) {
                  var div = L.DomUtil.create('div', 'leaflet-bar');
                  div.innerHTML = '<a href="#" title="현재 위치로 이동"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-crosshair"><circle cx="12" cy="12" r="10"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/></svg></a>';
                  div.onclick = function() {
                    map.setView(userLocation, 13);
                  };
                  return div;
                };
                locateButton.addTo(map);

                // 지도 이동/확대/축소 시 React Native로 상태 전달
                map.on('moveend', function() {
                  var center = map.getCenter();
                  var zoom = map.getZoom();
                  window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'mapStatus',
                    center: { latitude: center.lat, longitude: center.lng },
                    zoom: zoom
                  }));
                });

                // 지도 초기화 완료 메시지 전송
                window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'mapReady' }));
              }

              function addRestStopMarkers() {
                if (restStopsAdded) return; // 이미 추가된 경우 중단
                restStops.forEach(function(stop) {
                  var marker = L.marker([parseFloat(stop.위도), parseFloat(stop.경도)]);
                  // 데이터 키 사용 및 기본값 제공
                  marker.bindPopup(
                    (stop.휴게소명 || '이름 정보 없음') + '<br>' +
                    (stop.도로종류 || '도로 종류 정보 없음') + '<br>' +
                    (stop.휴게소종류 || '종류 정보 없음')
                  );
                  restStopMarkers.addLayer(marker);
                });
                map.addLayer(restStopMarkers);
                restStopsAdded = true; // 추가 완료
              }

              function removeRestStopMarkers() {
                if (!restStopsAdded) return; // 추가되지 않은 경우 중단
                map.removeLayer(restStopMarkers);
                restStopsAdded = false; // 제거 완료
              }

              function addChargingStationMarkers() {
                if (chargingStationsAdded) return; // 이미 추가된 경우 중단
                chargingStations.forEach(function(station) {
                  var marker = L.marker([parseFloat(station.위도), parseFloat(station.경도)]);
                  // 데이터 키 사용 및 기본값 제공
                  marker.bindPopup(
                    (station.충전소명 || '충전소 이름 없음') + '<br>' +
                    (station.주소 || '주소 정보 없음') + '<br>' +
                    (station.충전기타입 || '타입 정보 없음')
                  );
                  chargingStationMarkers.addLayer(marker);
                });
                map.addLayer(chargingStationMarkers);
                chargingStationsAdded = true; // 추가 완료
              }

              function removeChargingStationMarkers() {
                if (!chargingStationsAdded) return; // 추가되지 않은 경우 중단
                map.removeLayer(chargingStationMarkers);
                chargingStationsAdded = false; // 제거 완료
              }

              // React Native로부터 메시지 수신
              document.addEventListener('message', function(event) {
                try {
                  var message = JSON.parse(event.data);
                  if (message.type === 'toggleRestStops') {
                    if (message.show) {
                      addRestStopMarkers();
                    } else {
                      removeRestStopMarkers();
                    }
                  } else if (message.type === 'toggleChargingStations') {
                    if (message.show) {
                      addChargingStationMarkers();
                    } else {
                      removeChargingStationMarkers();
                    }
                  } else if (message.type === 'resetMap') {
                    map.setView(userLocation, 13);
                  }
                } catch (error) {
                  console.error('Error parsing message from React Native:', error);
                }
              });

              // 지도 초기화
              initializeMap();
            })();
          </script>
        </body>
        </html>
      `;
      setHtmlContent(initialHtml);
    }
  }, [userLocation, htmlContent]);

  // WebView 메시지 핸들러
  const onMessage = useCallback((event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'mapReady') {
        if (!initialToggleSent.current) { // 초기 토글 메시지를 한 번만 전송
          setMapReady(true);
          // 초기 토글 상태 전송
          webviewRef.current.postMessage(
            JSON.stringify({ type: 'toggleRestStops', show: showRestStops })
          );
          webviewRef.current.postMessage(
            JSON.stringify({ type: 'toggleChargingStations', show: showChargingStations })
          );
          initialToggleSent.current = true; // 토글 메시지 전송 완료
        }
      } else if (data.type === 'mapStatus') {
        // 지도 상태 업데이트 처리 (선택 사항)
      }
    } catch (error) {
      console.error('Error parsing message from WebView:', error);
    }
  }, [showRestStops, showChargingStations]);

  // 지도 초기화 완료 후 리셋 기능 노출
  useImperativeHandle(ref, () => ({
    resetMap: () => {
      if (webviewRef.current) {
        webviewRef.current.postMessage(JSON.stringify({ type: 'resetMap' }));
      }
    },
  }));

  // 토글 상태가 변경될 때 메시지 전송
  useEffect(() => {
    if (mapReady && webviewRef.current) {
      webviewRef.current.postMessage(
        JSON.stringify({ type: 'toggleRestStops', show: showRestStops })
      );
    }
  }, [showRestStops, mapReady]);

  useEffect(() => {
    if (mapReady && webviewRef.current) {
      webviewRef.current.postMessage(
        JSON.stringify({ type: 'toggleChargingStations', show: showChargingStations })
      );
    }
  }, [showChargingStations, mapReady]);

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {htmlContent ? (
        <WebView
          originWhitelist={['*']}
          source={{ html: htmlContent }}
          style={{ flex: 1 }}
          javaScriptEnabled={true}
          ref={webviewRef}
          onMessage={onMessage}
          javaScriptCanOpenWindowsAutomatically={false}
          domStorageEnabled={true}
          startInLoadingState={true}
          renderLoading={() => <ActivityIndicator size="large" color="#0000ff" style={styles.loading} />}
        />
      ) : (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loading} />
      )}
    </View>
  );
});

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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
});

export default MapView;
