// components/shared/KakaoNaviButton.js
import React from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { openKakaoNavi } from '../../utils/navigation/kakaoNavi';

// 경로 탐색 버튼 이미지
import RouteButtonImage from '../../assets/getdirections.png';

const styles = StyleSheet.create({
  routeButton: {
    marginTop: 9,
    paddingLeft: 15,
    paddingBottom: 5,
    borderLeftWidth: 1,
    marginBottom: 6,
    borderColor: '#dadada',
  },
  routeButtonImage: {
    width: 80,
    height: 50,
  },
});

const KakaoNaviButton = ({ name, latitude, longitude, lat, lng }) => {
  const handlePress = () => {
    openKakaoNavi({ name, latitude, longitude, lat, lng });
  };

  return (
    <TouchableOpacity
      style={styles.routeButton}
      onPress={handlePress}
      accessible={true}
      accessibilityLabel="카카오 내비로 경로 탐색"
    >
      <Image source={RouteButtonImage} style={styles.routeButtonImage} />
    </TouchableOpacity>
  );
};

KakaoNaviButton.propTypes = {
  name: PropTypes.string,
  latitude: PropTypes.number,
  longitude: PropTypes.number,
  lat: PropTypes.number,
  lng: PropTypes.number,
};

export default KakaoNaviButton;
