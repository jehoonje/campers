// src/components/CampingDetail/components/TabSection.js
import React from 'react';
import {
  ScrollView,
  View,
  Text,
  Linking,
  Platform,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import PropTypes from 'prop-types';
import Ionicons from 'react-native-vector-icons/Ionicons';
import RenderHTML from 'react-native-render-html';
import FacilityIcon from '../../Shared/components/FacilityIcon';
import InfoRow from '../../Shared/components/InfoRow';
import sharedStyles from '../../Shared/styles';

// 버튼 이미지를 가져옵니다.
import RouteButtonImage from '../../../assets/campsite.png';

const localStyles = StyleSheet.create({
  sectionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    marginLeft: 10,
    fontWeight: 'bold',
    color: '#555',
  },
  // 주소와 버튼을 담을 컨테이너 스타일을 추가합니다.
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  addressText: {
    flex: 1,
    color: '#333',
    fontSize: 16,
  },
  routeButton: {
    marginLeft: 8,
  },
  routeButtonImage: {
    width: 24,
    height: 24,
  },
});

const TabSection = ({
  width,
  includedFacilities,
  facilityIcons,
  isParkingAvailable,
  isPetAvailable,
  campground,
  tagsStyles,
}) => {
  // 카카오 내비로 경로 탐색 함수
  const openKakaoNavi = () => {
    const { latitude, longitude, name } = campground;

    if (!latitude || !longitude) {
      alert('위치 정보가 없습니다.');
      return;
    }

    const scheme = `kakaonavi://route?ep=${latitude},${longitude}&name=${encodeURIComponent(
      name || '목적지',
    )}`;

    const fallbackUrl = 'https://kakaonavi.kakao.com/launch/index.do';

    // 카카오 내비 앱이 설치되어 있는지 확인
    Linking.canOpenURL(scheme)
      .then(supported => {
        if (supported) {
          Linking.openURL(scheme);
        } else {
          // 앱이 설치되어 있지 않으면 웹 페이지로 이동
          Linking.openURL(fallbackUrl);
        }
      })
      .catch(err => console.error('An error occurred', err));
  };

  return (
    <ScrollView
      contentContainerStyle={sharedStyles.contentContainer}
      showsVerticalScrollIndicator={false}>
      {/* 시설 아이콘 표시 */}
      <View style={sharedStyles.facilityContainer}>
        {includedFacilities.map((facility, index) => (
          <FacilityIcon
            key={index}
            iconName={facilityIcons[facility]}
            label={facility}
          />
        ))}
        {/* 주차 가능 아이콘 추가 */}
        {isParkingAvailable && (
          <FacilityIcon iconName="parking" label="주차 가능" />
        )}
        {/* 애견 동반 가능 아이콘 추가 */}
        {isPetAvailable && (
          <FacilityIcon iconName="dog" label="반려 동물" />
        )}
      </View>

      {/* 캠핑장 주소와 경로 탐색 버튼 */}
      <View style={localStyles.addressContainer}>
        <TouchableOpacity
          style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}
          onPress={() => {
            if (campground.address) {
              const url = Platform.select({
                ios: `maps:0,0?q=${campground.address}`,
                android: `geo:0,0?q=${campground.address}`,
              });
              Linking.openURL(url);
            }
          }}>
          <Ionicons
            name="location-outline"
            size={24}
            color="#555"
            style={sharedStyles.icon}
          />
          <Text style={localStyles.addressText}>
            {campground.address || '주소 정보가 없습니다.'}
          </Text>
        </TouchableOpacity>
        {/* 경로 탐색 버튼 */}
        <TouchableOpacity
          style={localStyles.routeButton}
          onPress={openKakaoNavi}
          accessible={true}
          accessibilityLabel="카카오 내비로 경로 탐색">
          <Image
            source={RouteButtonImage}
            style={localStyles.routeButtonImage}
          />
        </TouchableOpacity>
      </View>

      {/* 캠핑장 설명 */}
      {campground.description && (
        <>
          <View style={localStyles.sectionContainer}>
            <Ionicons
              name="information-circle-outline"
              size={24}
              color="#555"
              style={sharedStyles.icon}
            />
            <Text style={localStyles.sectionTitle}>소개</Text>
          </View>
          <RenderHTML
            contentWidth={width - 32}
            source={{ html: campground.description }}
            tagsStyles={tagsStyles}
            accessible={true}
            onLinkPress={(evt, href) => {
              Linking.openURL(href);
            }}
          />
        </>
      )}

      {/* 홈페이지 정보 */}
      {campground.website && (
        <InfoRow
          iconName="link-outline"
          text={campground.website}
          onPress={() => Linking.openURL(campground.website)}
        />
      )}
    </ScrollView>
  );
};

TabSection.propTypes = {
  width: PropTypes.number.isRequired,
  includedFacilities: PropTypes.arrayOf(PropTypes.string).isRequired,
  facilityIcons: PropTypes.object.isRequired,
  isParkingAvailable: PropTypes.bool.isRequired,
  isPetAvailable: PropTypes.bool.isRequired,
  campground: PropTypes.object.isRequired,
  tagsStyles: PropTypes.object.isRequired,
};

export default React.memo(TabSection);
