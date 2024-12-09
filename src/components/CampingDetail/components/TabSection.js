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
        {isPetAvailable && <FacilityIcon iconName="dog" label="반려 동물" />}
      </View>

      {/* 캠핑장 주소와 경로 탐색 버튼 */}
      <View style={localStyles.addressContainer}>
        <TouchableOpacity
          style={{flexDirection: 'row', alignItems: 'center', flex: 1}}
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
            source={{html: campground.description}}
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
