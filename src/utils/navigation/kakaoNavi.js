// utils/navigation/kakaoNavi.js
import { NativeModules, Alert } from 'react-native';

const { KakaoNaviModule } = NativeModules;

export async function openKakaoNavi({ name, latitude, longitude, lat, lng }) {
  const finalLat = (typeof latitude !== 'undefined') ? latitude : lat;
  const finalLng = (typeof longitude !== 'undefined') ? longitude : lng;

  if (!finalLat || !finalLng) {
    Alert.alert('오류', '위치 정보가 없습니다.');
    return;
  }

  try {
    // 카카오 내비게이션 모듈 호출
    const result = await KakaoNaviModule.navigateTo(
      name || '목적지',
      String(finalLng),
      String(finalLat)
    );
    console.log('카카오내비 호출 결과:', result);
  } catch (error) {
    console.error('카카오내비 실행 오류:', error);
    Alert.alert('오류', '카카오내비를 실행할 수 없습니다.');
  }
}
