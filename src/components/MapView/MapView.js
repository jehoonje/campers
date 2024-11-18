// src/components/MapView/MapView.js
import React, {
  useEffect,
  useContext,
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
import countrysideData from '../../data/countryside.json';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from '../../utils/axiosInstance'; 
import chargingStationsData from '../../data/chargingStations.json';
import useLocation from '../../hooks/useLocation'; 
import useFavorites from '../../hooks/useFavorite';
import { AuthContext } from '../../AuthContext';

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
      showFavorites,
      navigation,
    },
    ref,
  ) => {
    const {userLocation, heading, error} = useLocation();
    const [mapReady, setMapReady] = useState(false);
    const { favorites, addFavorite, removeFavorite } = useFavorites(); // 즐겨찾기 훅 사용
    const webviewRef = useRef(null);
    const [campgroundsData, setCampgroundsData] = useState([]);
    const [beachesData, setBeachesData] = useState([]);
    const [campsitesData, setCampsitesData] = useState([]);
    const [autocampsData, setAutoCampsData] = useState([]);
    const [fishingsData, setFishingsData] = useState([]);
    const [favoritesData, setFavoritesData] = useState([]);



    const initialToggleSent = useRef(false);

    useImperativeHandle(ref, () => ({
      resetMap: () => {
        if (webviewRef.current) {
          webviewRef.current.postMessage(JSON.stringify({type: 'resetMap'}));
        }
      },
    }));

    // AuthContext에서 userId 가져오기
    const { userId } = useContext(AuthContext);
    console.log('MapView - userId from AuthContext:', userId); // 추가: userId 확인

    // 사용자 즐겨찾기 데이터 가져오기
    useEffect(() => {
      if (!userId) {
        console.warn('userId가 존재하지 않습니다. 즐겨찾기 데이터를 가져올 수 없습니다.');
        return;
      }

      const fetchFavoritesData = async () => {
        try {
          console.log('Fetching favorites for userId:', userId); // 추가
          const response = await axiosInstance.get(`/favorites/user/${userId}`);
          console.log('Favorites API Response:', response.data); // 추가
          setFavoritesData(response.data);
          console.log('즐겨찾기 데이터가 성공적으로 로드되었습니다.', response.data);
        } catch (error) {
          console.error('즐겨찾기 데이터를 가져오는 중 오류 발생:', error);
          setFavoritesData([]); // 빈 배열로 설정
        }
      };

      fetchFavoritesData();
    }, [userId]);

    // 노지 캠핑장 데이터 가져오기
    useEffect(() => {
      const fetchCampgroundsData = async () => {
        try {
          const response = await axiosInstance.get('/campgrounds');
          setCampgroundsData(response.data);
          console.log('캠핑장 데이터가 성공적으로 로드되었습니다.');
        } catch (error) {
          console.error('캠핑장 데이터를 가져오는 중 오류 발생:', error);
          setCampgroundsData([]); // 빈 배열로 설정
        }
      };

      fetchCampgroundsData();
    }, []);

    // 낚시터 데이터를 가져오는 부분
    useEffect(() => {
      const fetchFishingsData = async () => {
        try {
          const response = await axiosInstance.get('/fishings');
          setFishingsData(response.data);
          console.log('낚시터 데이터가 성공적으로 로드되었습니다.');
        } catch (error) {
          console.error('낚시터 데이터를 가져오는 중 오류 발생:', error);
          setFishingsData([]); // 빈 배열로 설정
        }
      };

      fetchFishingsData();
    }, []);

    // 해수욕장 데이터를 가져오는 부분
    useEffect(() => {
      const fetchBeachesData = async () => {
        try {
          const response = await axiosInstance.get('/beaches');
          setBeachesData(response.data);
          console.log('해수욕장 데이터가 성공적으로 로드되었습니다.');
        } catch (error) {
          console.error('해수욕장 데이터를 가져오는 중 오류 발생:', error);
          setBeachesData([]); // 빈 배열로 설정
        }
      };

      fetchBeachesData();
    }, []);

    // 야영장 데이터를 가져오는 부분
    useEffect(() => {
      const fetchCampsitesData = async () => {
        try {
          const response = await axiosInstance.get('/campsites');
          setCampsitesData(response.data);
          console.log('야영장 데이터가 성공적으로 로드되었습니다.');
        } catch (error) {
          console.error('야영장 데이터를 가져오는 중 오류 발생:', error);
          setCampsitesData([]); // 빈 배열로 설정
        }
      };

      fetchCampsitesData();
    }, []);

    // 오토 캠핑장 데이터를 가져오는 부분
    useEffect(() => {
      const fetchAutoCampsData = async () => {
        try {
          const response = await axiosInstance.get('/autocamps');
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
                  favoritesData: favoritesData || [],
                  showAllMarkers,
                  showFavorites: showFavorites || false,
                  showRestStops,
                  showChargingStations,
                  showCountrysides,
                  showFishings,
                  showCampgrounds,
                  showAutoCamps,
                  showCampsites,
                  showBeaches,
                  showWifis,
                  favorites,
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
        showFavorites,
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
        favoritesData,
        addFavorite,
        removeFavorite,
        beachesData,
        userLocation,
        favorites,
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
            showFavorites,
            showFishings,
            showBeaches,
            showRestStops,
            showWifis,
            showChargingStations,
            favoritesData: favoritesData,          
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
      showFavorites,
      showWifis,
      showChargingStations,
      mapReady,
      favoritesData,
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

    // 즐겨찾기 데이터가 변경될 때마다 WebView에 업데이트 메시지 전송
    useEffect(() => {
      if (mapReady && webviewRef.current) {
        webviewRef.current.postMessage(
          JSON.stringify({
            type: 'updateFavorites',
            favoritesData: favoritesData || [],
            showFavorites,
          }),
        );
      }
    }, [favoritesData, showFavorites, mapReady]);

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
