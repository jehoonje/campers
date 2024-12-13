// src/components/MapView/MapView.js
import React, {
  memo,
  useEffect,
  useContext,
  useState,
  useRef,
  useCallback,
  forwardRef,
  useImperativeHandle,
  useMemo,
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
import {AuthContext} from '../../AuthContext';
import RNBootSplash from 'react-native-bootsplash';
import Spinner from 'react-native-spinkit';
import {useFocusEffect} from '@react-navigation/native';

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
    const {userLocation, error} = useLocation();
    const [mapReady, setMapReady] = useState(false);
    const {favorites, addFavorite, removeFavorite} = useFavorites(); // 즐겨찾기 훅 사용
    const webviewRef = useRef(null);
    const [campgroundsData, setCampgroundsData] = useState([]);
    const [beachesData, setBeachesData] = useState([]);
    const [campsitesData, setCampsitesData] = useState([]);
    const [autocampsData, setAutoCampsData] = useState([]);
    const [fishingsData, setFishingsData] = useState([]);
    const [favoritesData, setFavoritesData] = useState([]);
    const [dataLoaded, setDataLoaded] = useState(false); // 모든 데이터 로드 상태
    const initialDataSent = useRef(false); // useRef로 복원
    const [isLoading, setIsLoading] = useState(true);
    // const lastHeadingRef = useRef(heading);
    const dataFetchedRef = useRef(false);
    const lastLocationRef = useRef(userLocation);
    const [lastUpdateTime, setLastUpdateTime] = useState(Date.now());

    const LOCATION_THRESHOLD = 0.05;

    // 사용자 위치가 없을 때 기본 위치를 설정
    const defaultLocation = {latitude: 37.5665, longitude: 126.978}; // 예: 서울 시청 좌표

    // WebView source 메모화
    const webviewSource = useMemo(
      () => ({uri: 'file:///android_asset/map.html'}),
      [],
    );

    useImperativeHandle(ref, () => ({
      resetMap: () => {
        if (webviewRef.current) {
          webviewRef.current.postMessage(JSON.stringify({type: 'resetMap'}));
        }
      },
    }));

    // AuthContext에서 userId 가져오기
    const {userId} = useContext(AuthContext);
    // console.log('MapView - userId from AuthContext:', userId); // 추가: userId 확인

    // 모든 데이터를 가져오는 함수
    useEffect(() => {
      if (!dataFetchedRef.current) {
        dataFetchedRef.current = true;
        const fetchAllData = async () => {
          try {
            const promises = [];

            // 노지 캠핑장 데이터 가져오기
            const fetchCampgroundsData = axiosInstance
              .get('/campgrounds')
              .then(response => {
                setCampgroundsData(response.data);
                console.log('캠핑장 데이터가 성공적으로 로드되었습니다.');
              })
              .catch(error => {
                console.error('캠핑장 데이터를 가져오는 중 오류 발생:', error);
                setCampgroundsData([]); // 빈 배열로 설정
              });
            promises.push(fetchCampgroundsData);

            // 낚시터 데이터 가져오기
            const fetchFishingsData = axiosInstance
              .get('/fishings')
              .then(response => {
                setFishingsData(response.data);
                console.log('낚시터 데이터가 성공적으로 로드되었습니다.');
              })
              .catch(error => {
                console.error('낚시터 데이터를 가져오는 중 오류 발생:', error);
                setFishingsData([]); // 빈 배열로 설정
              });
            promises.push(fetchFishingsData);

            // 해수욕장 데이터 가져오기
            const fetchBeachesData = axiosInstance
              .get('/beaches')
              .then(response => {
                setBeachesData(response.data);
                console.log('해수욕장 데이터가 성공적으로 로드되었습니다.');
              })
              .catch(error => {
                console.error(
                  '해수욕장 데이터를 가져오는 중 오류 발생:',
                  error,
                );
                setBeachesData([]); // 빈 배열로 설정
              });
            promises.push(fetchBeachesData);

            // 야영장 데이터 가져오기
            const fetchCampsitesData = axiosInstance
              .get('/campsites')
              .then(response => {
                setCampsitesData(response.data);
                console.log('야영장 데이터가 성공적으로 로드되었습니다.');
              })
              .catch(error => {
                console.error('야영장 데이터를 가져오는 중 오류 발생:', error);
                setCampsitesData([]); // 빈 배열로 설정
              });
            promises.push(fetchCampsitesData);

            // 오토 캠핑장 데이터 가져오기
            const fetchAutoCampsData = axiosInstance
              .get('/autocamps')
              .then(response => {
                setAutoCampsData(response.data);
                console.log('오토 캠핑장 데이터가 성공적으로 로드되었습니다.');
              })
              .catch(error => {
                console.error(
                  '오토 캠핑장 데이터를 가져오는 중 오류 발생:',
                  error,
                );
                setAutoCampsData([]); // 빈 배열로 설정
              });
            promises.push(fetchAutoCampsData);

            await Promise.all(promises);
            setDataLoaded(true); // 모든 데이터 로드 완료
          } catch (error) {
            console.error('데이터를 가져오는 중 오류 발생:', error);
          }
        };

        fetchAllData();
      }
    }, []);

    // 즐겨찾기 데이터 fetching useFocusEffect 추가
    useFocusEffect(
      React.useCallback(() => {
        if (userId) {
          const fetchFavoritesData = async () => {
            try {
              const response = await axiosInstance.get(
                `/favorites/user/${userId}`,
              );
              setFavoritesData(response.data);
              console.log(
                '즐겨찾기 데이터가 성공적으로 로드되었습니다.',
                response.data,
              );
            } catch (error) {
              console.error('즐겨찾기 데이터를 가져오는 중 오류 발생:', error);
              setFavoritesData([]); // 빈 배열로 설정
            }
          };
          fetchFavoritesData();
        } else {
          setFavoritesData([]); // userId가 없을 때는 빈 배열로 설정
        }
      }, [userId]),
    );

    // 사용자 위치가 설정되면 WebView 로드
    useEffect(() => {
      console.log('userLocation:', userLocation);
      if (userLocation) {
        setMapReady(true);
      } else {
        // 위치 권한이 거부되었거나 위치 정보를 가져올 수 없는 경우 처리
        setMapReady(false);
      }
    }, [userLocation]);

    useEffect(() => {
      console.log(
        'useEffect called: mapReady:',
        mapReady,
        ', dataLoaded:',
        dataLoaded,
        ', initialDataSent.current:',
        initialDataSent.current,
      );
      if (mapReady) {
        RNBootSplash.hide({fade: true});
        if (dataLoaded && !initialDataSent.current) {
          sendInitialData();
        }
      }
    }, [mapReady, dataLoaded, sendInitialData]);

    // 초기 데이터를 WebView에 전송하는 함수
    const sendInitialData = useCallback(() => {
      if (webviewRef.current) {
        console.log('Sending initialData message');
        webviewRef.current.postMessage(
          JSON.stringify({
            type: 'initialData',
            userLocation: userLocation || defaultLocation,
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
        initialDataSent.current = true;
        setIsLoading(false);
      }
    }, [
      userLocation,
      restStopsData,
      wifisData,
      fishingsData,
      chargingStationsData,
      countrysideData,
      campgroundsData,
      campsitesData,
      autocampsData,
      beachesData,
      favoritesData,
      showAllMarkers,
      showFavorites,
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
    ]);

    // WebView 메시지 핸들러
    const onMessage = useCallback(
      event => {
        try {
          const data = JSON.parse(event.nativeEvent.data);

          if (data.type === 'jsError') {
            console.error(
              `WebView JS Error: ${data.message} at ${data.source}:${data.lineno}:${data.colno}`,
              data.error,
            );
          }

          if (data.type === 'mapReady') {
            if (!initialDataSent.current) {
              // 데이터 로드가 완료되었는지 확인
              if (dataLoaded) {
                sendInitialData();
              } else {
                // 데이터 로드가 완료될 때까지 대기
                const interval = setInterval(() => {
                  if (dataLoaded) {
                    sendInitialData();
                    clearInterval(interval);
                  }
                }, 100);
              }
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
      [navigation, sendInitialData, dataLoaded],
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

    useEffect(() => {
      if (
        mapReady &&
        webviewRef.current &&
        userLocation &&
        initialDataSent.current
      ) {
        const now = Date.now();
        // 1초에 한 번만 전송
        if (now - lastUpdateTime > 1000) {
          const lastLoc = lastLocationRef.current || defaultLocation;
          const latDiff = Math.abs(userLocation.latitude - lastLoc.latitude);
          const lngDiff = Math.abs(userLocation.longitude - lastLoc.longitude);
          // const HEADING_THRESHOLD = 30;
          // const headingDiff = Math.abs((heading || 0) - (lastHeadingRef.current || 0));

          if (latDiff > LOCATION_THRESHOLD || lngDiff > LOCATION_THRESHOLD) {
            webviewRef.current.postMessage(
              JSON.stringify({type: 'updateLocation', userLocation }),
            );
            lastLocationRef.current = userLocation;
            setLastUpdateTime(now);
          }
        }
      }
    }, [userLocation, mapReady]);

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
        <WebView
          originWhitelist={['*']}
          source={webviewSource}
          style={{flex: 1}}
          javaScriptEnabled={true}
          ref={webviewRef}
          onMessage={onMessage}
          javaScriptCanOpenWindowsAutomatically={false}
          domStorageEnabled={true}
          allowFileAccess={true}
          allowFileAccessFromFileURLs={true}
          allowUniversalAccessFromFileURLs={true}
          mixedContentMode="always"
          onError={syntheticEvent => {
            const {nativeEvent} = syntheticEvent;
            console.error('WebView error: ', nativeEvent);
          }}
        />
        {isLoading && (
          <Spinner
            isVisible={true}
            size={50}
            type="WanderingCubes"
            color="#184035"
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
    top: '45%',
    left: '50%',
    marginTop: -25, // 스피너 높이의 절반을 음수로 설정
    marginLeft: -25, // 스피너 너비의 절반을 음수로 설정
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

export default memo(MapView);
