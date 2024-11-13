import { useEffect, useState } from 'react';
import Geolocation from 'react-native-geolocation-service';
import {
  SensorTypes,
  setUpdateIntervalForType,
  gyroscope,
} from 'react-native-sensors';
import { Platform, PermissionsAndroid } from 'react-native';

const useLocation = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [error, setError] = useState(null);
  const [heading, setHeading] = useState(0);

  useEffect(() => {
    const requestLocationPermission = async () => {
      try {
        if (Platform.OS === 'ios') {
          const status = await Geolocation.requestAuthorization('whenInUse');
          if (status !== 'granted') {
            setError('위치 권한이 거부되었습니다.');
            return false;
          }
        } else {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          );
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            setError('위치 권한이 거부되었습니다.');
            return false;
          }
        }
        return true;
      } catch (error) {
        setError('위치 권한 요청 중 오류 발생: ' + error.message);
        return false;
      }
    };

    const startWatchingPosition = async () => {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        return;
      }

      const watchId = Geolocation.watchPosition(
        position => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        error => {
          setError(error.message);
        },
        {
          enableHighAccuracy: true,
          distanceFilter: 1,
          interval: 1000,
          fastestInterval: 500,
          showsBackgroundLocationIndicator: true,
        },
      );

      // 방향(방위각) 데이터 수집
      setUpdateIntervalForType(SensorTypes.gyroscope, 100); // 밀리초 단위
      const subscription = gyroscope.subscribe(({ x, y, z }) => {
        // 간단한 방위각 계산 (예제)
        const angle = Math.atan2(y, x) * (180 / Math.PI);
        setHeading(angle);
      });

      // 클린업 함수에서 watchId와 subscription을 정리합니다.
      return () => {
        Geolocation.clearWatch(watchId);
        subscription.unsubscribe();
      };
    };

    // 위치 추적 시작
    startWatchingPosition();
  }, []);

  return { userLocation, error, heading };
};

export default useLocation;
