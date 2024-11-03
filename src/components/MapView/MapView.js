// src/components/MapView/MapView.js
import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from 'react';
import {View, StyleSheet, ActivityIndicator, Text} from 'react-native';
import {WebView} from 'react-native-webview';
import restStopsData from '../../data/reststops.json';
import wifisData from '../../data/wifi.json';
// 새로운 데이터 임포트
import countrysideData from '../../data/countryside.json';
import axios from 'axios';
import chargingStationsData from '../../data/chargingStations.json';
import useLocation from '../../hooks/useLocation';

const MapView = forwardRef(
  (
    {
      showAllMarkers,
      showRestStops,
      showCountrysides,
      showChargingStations,
      showFishings,
      showCampgrounds,
      showCampsites,
      showAutoCamps,
      showBeaches,
      showWifis,
      navigation,
    },
    ref,
  ) => {
    const {userLocation, heading, error} = useLocation();
    const [mapReady, setMapReady] = useState(false);
    const webviewRef = useRef(null);
    const [campgroundsData, setCampgroundsData] = useState([]);
    const [beachesData, setBeachesData] = useState([]);
    const [campsitesData, setCampsitesData] = useState([]);
    const [autocampsData, setAutoCampsData] = useState([]);
    const [fishingsData, setFishingsData] = useState([]);

    const initialToggleSent = useRef(false);

    useImperativeHandle(ref, () => ({
      resetMap: () => {
        if (webviewRef.current) {
          webviewRef.current.postMessage(JSON.stringify({type: 'resetMap'}));
        }
      },
    }));

    // 낚시터 데이터를 가져오는 부분
    useEffect(() => {
      const fetchFishingsData = async () => {
        try {
          const response = await axios.get('http://10.0.2.2:8080/api/fishings');
          setFishingsData(response.data);
          console.log('낚시터 데이터가 성공적으로 로드되었습니다.');
        } catch (error) {
          console.error('낚시터 데이터를 가져오는 중 오류 발생:', error);
          setFishingsData([]); // 빈 배열로 설정
        }
      };

      fetchFishingsData();
    }, []);

    // 캠핑장 데이터를 가져오는 부분
    useEffect(() => {
      const fetchCampgroundsData = async () => {
        try {
          const response = await axios.get(
            'http://10.0.2.2:8080/api/campgrounds',
          );
          setCampgroundsData(response.data);
          console.log('캠핑장 데이터가 성공적으로 로드되었습니다.');
        } catch (error) {
          console.error('캠핑장 데이터를 가져오는 중 오류 발생:', error);
          setCampgroundsData([]); // 빈 배열로 설정
        }
      };

      fetchCampgroundsData();
    }, []);

    // 해수욕장 데이터를 가져오는 부분 추가
    useEffect(() => {
      const fetchBeachesData = async () => {
        try {
          const response = await axios.get('http://10.0.2.2:8080/api/beaches');
          setBeachesData(response.data);
          console.log('해수욕장 데이터가 성공적으로 로드되었습니다.');
        } catch (error) {
          console.error('해수욕장 데이터를 가져오는 중 오류 발생:', error);
          setBeachesData([]); // 빈 배열로 설정
        }
      };

      fetchBeachesData();
    }, []);

    // 야영장 데이터를 가져오는 부분 추가
    useEffect(() => {
      const fetchCampsitesData = async () => {
        try {
          const response = await axios.get(
            'http://10.0.2.2:8080/api/campsites',
          );
          setCampsitesData(response.data);
          console.log('야영장 데이터가 성공적으로 로드되었습니다.');
        } catch (error) {
          console.error('야영장 데이터를 가져오는 중 오류 발생:', error);
          setCampsitesData([]); // 빈 배열로 설정
        }
      };

      fetchCampsitesData();
    }, []);

    // 오토 캠핑장 데이터를 가져오는 부분 추가
    useEffect(() => {
      const fetchAutoCampsData = async () => {
        try {
          const response = await axios.get(
            'http://10.0.2.2:8080/api/autocamps',
          );
          setAutoCampsData(response.data);
          console.log('오토 캠핑장 데이터가 성공적으로 로드되었습니다.');
        } catch (error) {
          console.error('오토 캠핑장 데이터를 가져오는 중 오류 발생:', error);
          setAutoCampsData([]); // 빈 배열로 설정
        }
      };

      fetchAutoCampsData();
    }, []);

    // 사용자 위치가 설정되면 WebView 로드
    useEffect(() => {
      if (userLocation) {
        setMapReady(true);
      }
    }, [userLocation]);

    // WebView 메시지 핸들러
    const onMessage = useCallback(
      event => {
        try {
          const data = JSON.parse(event.nativeEvent.data);
          // console.log('Received message type:', data.type); // 수정된 로그

          if (data.type === 'jsError') {
            console.error(
              `WebView JS Error: ${data.message} at ${data.source}:${data.lineno}:${data.colno}`,
              data.error,
            );
          }

          if (data.type === 'mapReady') {
            if (!initialToggleSent.current) {
              console.log('Sending initialData message');
              // 초기 데이터 전송
              webviewRef.current.postMessage(
                JSON.stringify({
                  type: 'initialData',
                  userLocation: userLocation || {latitude: 0, longitude: 0},
                  heading: heading || 0, // 초기 방위각 포함
                  restStopsData: restStopsData || [],
                  wifisData: wifisData || [],
                  fishingsData: fishingsData || [],
                  chargingStationsData: chargingStationsData || [],
                  countrysideData: countrysideData || [],
                  campgroundsData: campgroundsData || [],
                  campsitesData: campsitesData || [],
                  autocampsData: autocampsData || [],
                  beachesData: beachesData || [],
                  showAllMarkers,
                  showRestStops,
                  showChargingStations,
                  showCountrysides,
                  showFishings,
                  showCampgrounds,
                  showAutoCamps,
                  showCampsites,
                  showBeaches,
                  showWifis,
                }),
              );

              initialToggleSent.current = true; // 토글 메시지 전송 완료
            }
          } else if (data.type === 'campgroundSelected') {
            // 캠핑장 선택 메시지 처리
            navigation.navigate('CampingDetail', {campground: data.data});
          } else if (data.type === 'countrysideSelected') {
            // 농어촌체험마을 선택 시 처리
            navigation.navigate('CountryDetail', {countryside: data.data});
          } else if (data.type === 'beachSelected') {
            // 해수욕장 선택 시 처리
            navigation.navigate('BeachDetail', {beach: data.data});
          } else if (data.type === 'campsiteSelected') {
            // 야영장 선택 시 처리
            navigation.navigate('CampsiteDetail', {campsite: data.data});
          } else if (data.type === 'autocampSelected') {
            // 오토캠핑장 선택 시 처리
            navigation.navigate('AutoCampDetail', {autocamp: data.data});
          } else if (data.type === 'fishingSelected') {
            // 낚시터 선택 시 처리
            navigation.navigate('FishingDetail', {fishing: data.data});
          }
        } catch (error) {
          console.error('Error parsing message from WebView:', error);
        }
      },
      [
        navigation,
        showAllMarkers,
        showCampgrounds,
        showCampsites,
        showAutoCamps,
        showFishings,
        showRestStops,
        showChargingStations,
        showCountrysides,
        showBeaches,
        showWifis,
        wifisData,
        campgroundsData,
        campsitesData,
        fishingsData,
        autocampsData,
        beachesData,
        userLocation,
      ],
    );

    // 토글 상태가 변경될 때 메시지 전송
    useEffect(() => {
      if (mapReady && webviewRef.current) {
        webviewRef.current.postMessage(
          JSON.stringify({
            type: 'toggleLayers',
            showAllMarkers,
            showCampgrounds,
            showCampsites,
            showAutoCamps,
            showCountrysides,
            showFishings,
            showBeaches,
            showRestStops,
            showWifis,
            showChargingStations,
          }),
        );
      }
    }, [
      showAllMarkers,
      showCampgrounds,
      showCampsites,
      showAutoCamps,
      showCountrysides,
      showFishings,
      showBeaches,
      showRestStops,
      showWifis,
      showChargingStations,
      mapReady,
    ]);

    // 위치 및 방향 데이터가 변경될 때마다 WebView에 업데이트 메시지 전송
    useEffect(() => {
      if (mapReady && webviewRef.current && userLocation) {
        webviewRef.current.postMessage(
          JSON.stringify({
            type: 'updateLocation',
            userLocation,
            heading,
          }),
        );
      }
    }, [userLocation, heading, mapReady]);

    if (error) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        {mapReady ? (
          <WebView
            originWhitelist={['*']}
            source={{uri: 'file:///android_asset/map.html'}} // 로컬 HTML 파일 로드
            style={{flex: 1}}
            javaScriptEnabled={true}
            ref={webviewRef}
            onMessage={onMessage}
            javaScriptCanOpenWindowsAutomatically={false}
            domStorageEnabled={true}
            startInLoadingState={true}
            allowFileAccess={true}
            allowFileAccessFromFileURLs={true}
            allowUniversalAccessFromFileURLs={true}
            mixedContentMode="always"
            renderLoading={() => (
              <ActivityIndicator
                size="large"
                color="#0000ff"
                style={styles.loading}
              />
            )}
            onError={syntheticEvent => {
              const {nativeEvent} = syntheticEvent;
              console.error('WebView error: ', nativeEvent);
            }}
          />
        ) : (
          <ActivityIndicator
            size="large"
            color="#0000ff"
            style={styles.loading}
          />
        )}
      </View>
    );
  },
);

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
