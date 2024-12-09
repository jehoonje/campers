// src/components/CampsiteDetail/components/TabSection.js
import React from 'react';
import {
  ScrollView,
  View,
  Text,
  Linking,
  Platform,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import Ionicons from 'react-native-vector-icons/Ionicons';
import RenderHTML from 'react-native-render-html';
import FacilityIcon from '../../Shared/components/FacilityIcon';
import InfoRow from '../../Shared/components/InfoRow';
import sharedStyles from '../../Shared/styles';
import CustomText from '../../CustomText';

const localStyles = StyleSheet.create({
  sectionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    // marginLeft: 10,
    fontWeight: 'bold',
    color: '#555',
  },
});

const TabSection = ({
  width,
  includedFacilities,
  facilityIcons,
  isParkingAvailable,
  isPetAvailable,
  campsite,
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

      {/* 캠핑장 주소 */}
      <View style={localStyles.addressContainer}>
        <TouchableOpacity
          style={{flexDirection: 'row', alignItems: 'center', flex: 1}}
          onPress={() => {
            if (campsite.addr) {
              const url = Platform.select({
                ios: `maps:0,0?q=${campsite.addr}`,
                android: `geo:0,0?q=${campsite.addr}`,
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
          <CustomText style={localStyles.addressText}>
            {campsite.addr || '주소 정보가 없습니다.'}
          </CustomText>
        </TouchableOpacity>
      </View>

      {/* 캠핑장 소개 */}
      {campsite.description && (
        <>
          <View style={localStyles.sectionContainer}>
            <Ionicons
              name="information-circle-outline"
              size={24}
              color="#555"
              style={sharedStyles.icon}
            />
            <CustomText style={localStyles.sectionTitle}>소개</CustomText>
          </View>
            <RenderHTML
              contentWidth={width - 32}
              source={{html: campsite.description}}
              tagsStyles={tagsStyles}
              accessible={true}
              onLinkPress={(evt, href) => {
                Linking.openURL(href);
              }}
            />
        </>
      )}

      {/* 문의 및 안내 */}
      {campsite.infocenterleports && (
        <InfoRow
          iconName="call-outline"
          text={campsite.infocenterleports}
          onPress={() => {
            const phoneNumber = campsite.infocenterleports.match(
              /(\d{2,3}-\d{3,4}-\d{4})/,
            );
            if (phoneNumber) {
              Linking.openURL(`tel:${phoneNumber[0]}`);
            }
          }}
        />
      )}

      {/* 예약 안내 */}
      {campsite.reservation && (
        <>
          <View style={localStyles.sectionContainer}>
            <Ionicons
              name="document-text-outline"
              size={24}
              color="#555"
              style={sharedStyles.icon}
            />
            <Text style={localStyles.sectionTitle}>예약 안내</Text>
          </View>
          <RenderHTML
            contentWidth={width - 32}
            source={{html: campsite.reservation}}
            tagsStyles={tagsStyles}
            accessible={true}
            onLinkPress={(evt, href) => {
              Linking.openURL(href);
            }}
          />
        </>
      )}

      {/* 개장기간 */}
      {campsite.openperiod && (
        <InfoRow
          iconName="calendar-outline"
          text={`개장기간: ${campsite.openperiod}`}
        />
      )}

      {/* 이용시간 */}
      {campsite.usetimeleports && (
        <InfoRow
          iconName="time-outline"
          text={`이용시간: ${campsite.usetimeleports}`}
        />
      )}

      {/* 쉬는날 */}
      {campsite.restdateleports && (
        <InfoRow
          iconName="close-circle-outline"
          text={`쉬는날: ${campsite.restdateleports}`}
        />
      )}

      {/* 이용요금 */}
      {campsite.campingfee && (
        <>
          <View style={localStyles.sectionContainer}>
            <Ionicons
              name="cash-outline"
              size={24}
              color="#555"
              style={sharedStyles.icon}
            />
            <CustomText style={localStyles.sectionTitle}>이용요금</CustomText>
          </View>
          <RenderHTML
            contentWidth={width - 32}
            source={{html: campsite.campingfee}}
            tagsStyles={tagsStyles}
            accessible={true}
            onLinkPress={(evt, href) => {
              Linking.openURL(href);
            }}
          />
        </>
      )}

      {/* 부대시설 */}
      {campsite.facilities && (
        <>
          <View style={localStyles.sectionContainer}>
            <Ionicons
              name="construct-outline"
              size={24}
              color="#555"
              style={sharedStyles.icon}
            />
            <CustomText style={localStyles.sectionTitle}>부대시설</CustomText>
          </View>
          <RenderHTML
            contentWidth={width - 32}
            source={{html: campsite.facilities}}
            tagsStyles={tagsStyles}
            accessible={true}
            onLinkPress={(evt, href) => {
              Linking.openURL(href);
            }}
          />
        </>
      )}

      {/* 주요시설 */}
      {campsite.mainfacilities && (
        <>
          <View style={localStyles.sectionContainer}>
            <Ionicons
              name="apps-outline"
              size={24}
              color="#555"
              style={sharedStyles.icon}
            />
            <CustomText style={localStyles.sectionTitle}>주요시설</CustomText>
          </View>
          <RenderHTML
            contentWidth={width - 32}
            source={{html: campsite.mainfacilities}}
            tagsStyles={tagsStyles}
            accessible={true}
            onLinkPress={(evt, href) => {
              Linking.openURL(href);
            }}
          />
        </>
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
  campsite: PropTypes.object.isRequired,
  tagsStyles: PropTypes.object.isRequired,
};

export default React.memo(TabSection);
