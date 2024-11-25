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
    let watchId = null;
    let subscription = null;

    const startWatchingPosition = async () => {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        return;
      }

      watchId = Geolocation.watchPosition(
        position => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        error => {
          setError('위치 정보를 가져오는 중 오류 발생: ' + error.message);
        },
        {
          enableHighAccuracy: true,
          distanceFilter: 1,
          interval: 1000,
          fastestInterval: 500,
        },
      );

      // 방향(방위각) 데이터 수집
      setUpdateIntervalForType(SensorTypes.gyroscope, 100); // 밀리초 단위
      subscription = gyroscope.subscribe(({ x, y, z }) => {
        // 간단한 방위각 계산 (예제)
        const angle = Math.atan2(y, x) * (180 / Math.PI);
        setHeading(angle);
      });
    };

    const requestLocationPermission = async () => {
      try {
        let hasPermission = false;
        if (Platform.OS === 'ios') {
          const status = await Geolocation.requestAuthorization('whenInUse');
          hasPermission = status === 'granted';
        } else {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          );
          hasPermission = granted === PermissionsAndroid.RESULTS.GRANTED;
        }

        if (!hasPermission) {
          setError('위치 권한이 거부되었습니다.');
          return false;
        }
        return true;
      } catch (error) {
        setError('위치 권한 요청 중 오류 발생: ' + error.message);
        return false;
      }
    };

    // 즉시 실행 함수로 비동기 함수 호출
    (async () => {
      await startWatchingPosition();
    })();

    // 클린업 함수에서 watchId와 subscription을 정리합니다.
    return () => {
      if (watchId !== null) {
        Geolocation.clearWatch(watchId);
      }
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  return { userLocation, error, heading };
};

export default useLocation;
