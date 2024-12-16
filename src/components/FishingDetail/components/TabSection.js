// src/components/FishingDetail/components/TabSection.js
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

const localStyles = StyleSheet.create({
  sectionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
  sectionWrapper: {
    marginBottom: 30,
  },
});

const TabSection = ({
  width,
  includedFacilities,
  facilityIcons,
  isParkingAvailable,
  fishing,
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
      </View>

      {/* 낚시터 설명 */}
      {fishing.description && (
        <View style={localStyles.sectionWrapper}>
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
            source={{ html: fishing.description }}
            tagsStyles={tagsStyles}
            accessible={true}
            onLinkPress={(evt, href) => {
              Linking.openURL(href);
            }}
          />
        </View>
      )}

      {/* 문의 및 안내 */}
      {fishing.infocenterleports && (
          <InfoRow
            iconName="call-outline"
            text={fishing.infocenterleports}
            onPress={() => {
              const phoneNumber = fishing.infocenterleports.match(
                /(\d{2,3}-\d{3,4}-\d{4})/,
              );
              if (phoneNumber) {
                Linking.openURL(`tel:${phoneNumber[0]}`);
              }
            }}
          />
      )}

      {/* 개장기간 */}
      {fishing.openperiod && (
        <View style={localStyles.sectionWrapper}>
          <InfoRow
            iconName="calendar-outline"
            text={`개장기간: ${fishing.openperiod}`}
          />
        </View>
      )}

      {/* 이용시간 */}
      {fishing.usetimeleports && (
          <InfoRow
            iconName="time-outline"
            text={`이용시간: ${fishing.usetimeleports}`}
          />
      )}

      {/* 쉬는날 */}
      {fishing.restdateleports && (
        <View style={localStyles.sectionWrapper}>
          <InfoRow
            iconName="close-circle-outline"
            text={`쉬는날: ${fishing.restdateleports}`}
          />
        </View>
      )}

      {/* 이용요금 */}
      {fishing.fishingfee && (
        <View style={localStyles.sectionWrapper}>
          <View style={localStyles.sectionContainer}>
            <Ionicons
              name="cash-outline"
              size={24}
              color="#555"
              style={sharedStyles.icon}
            />
            <Text style={localStyles.sectionTitle}>이용요금</Text>
          </View>
          <RenderHTML
            contentWidth={width - 32}
            source={{ html: fishing.fishingfee }}
            tagsStyles={tagsStyles}
            accessible={true}
            onLinkPress={(evt, href) => {
              Linking.openURL(href);
            }}
          />
        </View>
      )}

      {/* 부대시설 */}
      {fishing.facilities && (
        <View style={localStyles.sectionWrapper}>
          <View style={localStyles.sectionContainer}>
            <Ionicons
              name="construct-outline"
              size={24}
              color="#555"
              style={sharedStyles.icon}
            />
            <Text style={localStyles.sectionTitle}>부대시설</Text>
          </View>
          <RenderHTML
            contentWidth={width - 32}
            source={{ html: fishing.facilities }}
            tagsStyles={tagsStyles}
            accessible={true}
            onLinkPress={(evt, href) => {
              Linking.openURL(href);
            }}
          />
        </View>
      )}

      {/* 주요시설 */}
      {fishing.mainfacilities && (
        <View style={localStyles.sectionWrapper}>
          <View style={localStyles.sectionContainer}>
            <Ionicons
              name="apps-outline"
              size={24}
              color="#555"
              style={sharedStyles.icon}
            />
            <Text style={localStyles.sectionTitle}>주요시설</Text>
          </View>
          <RenderHTML
            contentWidth={width - 32}
            source={{ html: fishing.mainfacilities }}
            tagsStyles={tagsStyles}
            accessible={true}
            onLinkPress={(evt, href) => {
              Linking.openURL(href);
            }}
          />
        </View>
      )}
    </ScrollView>
  );
};

TabSection.propTypes = {
  width: PropTypes.number.isRequired,
  includedFacilities: PropTypes.arrayOf(PropTypes.string).isRequired,
  facilityIcons: PropTypes.object.isRequired,
  isParkingAvailable: PropTypes.bool.isRequired,
  fishing: PropTypes.object.isRequired,
  tagsStyles: PropTypes.object.isRequired,
};

export default React.memo(TabSection);
