// src/components/AutoCampDetail/AutoCampDetail.js
import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  useWindowDimensions,
  Linking,
  Platform,
  ActivityIndicator,
} from 'react-native';
import RenderHTML from 'react-native-render-html';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

function AutoCampDetail({ route, navigation }) {
  const { autocamp } = route.params;
  const { width } = useWindowDimensions();

  // 이미지 로딩 상태 관리
  const [imageLoading, setImageLoading] = useState(true);

  // 시설 정보를 합쳐서 단어를 검색합니다.
  const facilitiesText = `${autocamp.facilities || ''} ${
    autocamp.mainfacilities || ''
  }`;

  // 검색할 단어 목록
  const facilityWords = [
    '화장실',
    '개수대',
    '취사',
    '전기',
    '샤워',
    '무선인터넷',
    '온수',
    '장작',
    '분리수거',
    '운동',
    '애견',
  ];

  // 단어와 아이콘 매핑
  const facilityIcons = {
    화장실: 'toilet',
    개수대: 'faucet',
    취사: 'silverware-fork-knife',
    전기: 'power-plug',
    샤워: 'shower',
    무선인터넷: 'wifi',
    온수: 'water-boiler',
    장작: 'fire',
    분리수거: 'recycle',
    운동: 'run',
    애견: 'dog',
  };

  // 포함된 시설 단어 목록
  const includedFacilities = facilityWords.filter((word) =>
    facilitiesText.includes(word)
  );

  // 주차 가능 여부 확인
  const isParkingAvailable =
    autocamp.parkingleports && autocamp.parkingleports.includes('가능');

  // 애견동반 가능 여부 확인
  const isPetAvailable =
    autocamp.chkpetleports && autocamp.chkpetleports.includes('가능');

  // 재사용 가능한 InfoRow 컴포넌트
  const InfoRow = ({ iconName, text, onPress }) => (
    <TouchableOpacity
      style={styles.infoRow}
      onPress={onPress}
      disabled={!onPress}
    >
      <Ionicons name={iconName} size={24} color="#555" style={styles.icon} />
      <Text style={[styles.infoText, onPress && styles.link]}>{text}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* 닫기 버튼 */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* 이미지 슬라이더 */}
        {(autocamp.image1 || autocamp.image2) && (
          <View style={styles.imageSlider}>
            {imageLoading && (
              <ActivityIndicator
                size="large"
                color="#1e90ff"
                style={styles.imageLoader}
              />
            )}
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
            >
              {autocamp.image1 && (
                <Image
                  source={{ uri: autocamp.image1 }}
                  style={styles.image}
                  resizeMode="cover"
                  onLoadEnd={() => setImageLoading(false)}
                  onError={() => setImageLoading(false)}
                />
              )}
              {autocamp.image2 && (
                <Image
                  source={{ uri: autocamp.image2 }}
                  style={styles.image}
                  resizeMode="cover"
                  onLoadEnd={() => setImageLoading(false)}
                />
              )}
            </ScrollView>
          </View>
        )}

        {/* 캠핑장 이름 */}
        <Text style={styles.name}>{autocamp.title}</Text>

        {/* 캠핑장 주소 */}
        <InfoRow
          iconName="location-outline"
          text={autocamp.addr || '주소 정보가 없습니다.'}
          onPress={() => {
            if (autocamp.addr) {
              const url = Platform.select({
                ios: `maps:0,0?q=${autocamp.addr}`,
                android: `geo:0,0?q=${autocamp.addr}`,
              });
              Linking.openURL(url);
            }
          }}
        />

        {/* 시설 아이콘 표시 */}
        <View style={styles.facilityContainer}>
          {includedFacilities.map((facility, index) => (
            <View key={index} style={styles.facilityItem}>
              <MaterialCommunityIcons
                name={facilityIcons[facility]}
                size={32}
                color="#555"
              />
              <Text style={styles.facilityText}>{facility}</Text>
            </View>
          ))}
          {/* 주차 가능 아이콘 추가 */}
          {isParkingAvailable && (
            <View style={styles.facilityItem}>
              <MaterialCommunityIcons name="parking" size={32} color="#555" />
              <Text style={styles.facilityText}>주차 가능</Text>
            </View>
          )}
          {/* 애견 동반 가능 아이콘 추가 */}
          {isPetAvailable && (
            <View style={styles.facilityItem}>
              <MaterialCommunityIcons name="dog" size={32} color="#555" />
              <Text style={styles.facilityText}>반려 동물</Text>
            </View>
          )}
        </View>

        {/* 캠핑장 설명 */}
        {autocamp.description && (
          <>
            <View style={styles.sectionContainer}>
              <Ionicons
                name="information-circle-outline"
                size={24}
                color="#555"
                style={styles.icon}
              />
              <Text style={styles.sectionTitle}>소개</Text>
            </View>
            <RenderHTML
              contentWidth={width - 32}
              source={{ html: autocamp.description }}
              tagsStyles={tagsStyles}
              onLinkPress={(evt, href) => {
                Linking.openURL(href);
              }}
            />
          </>
        )}

        {/* 문의 및 안내 */}
        {autocamp.infocenterleports && (
          <InfoRow
            iconName="call-outline"
            text={autocamp.infocenterleports}
            onPress={() => {
              const phoneNumber = autocamp.infocenterleports.match(
                /(\d{2,3}-\d{3,4}-\d{4})/
              );
              if (phoneNumber) {
                Linking.openURL(`tel:${phoneNumber[0]}`);
              }
            }}
          />
        )}

        {/* 예약 안내 */}
        {autocamp.reservation && (
          <>
            <View style={styles.sectionContainer}>
              <Ionicons
                name="document-text-outline"
                size={24}
                color="#555"
                style={styles.icon}
              />
              <Text style={styles.sectionTitle}>예약 안내</Text>
            </View>
            <RenderHTML
              contentWidth={width - 32}
              source={{ html: autocamp.reservation }}
              tagsStyles={tagsStyles}
              onLinkPress={(evt, href) => {
                Linking.openURL(href);
              }}
            />
          </>
        )}

        {/* 개장기간 */}
        {autocamp.openperiod && (
          <InfoRow
            iconName="calendar-outline"
            text={`개장기간: ${autocamp.openperiod}`}
          />
        )}

        {/* 이용시간 */}
        {autocamp.usetimeleports && (
          <InfoRow
            iconName="time-outline"
            text={`이용시간: ${autocamp.usetimeleports}`}
          />
        )}

        {/* 쉬는날 */}
        {autocamp.restdateleports && (
          <InfoRow
            iconName="close-circle-outline"
            text={`쉬는날: ${autocamp.restdateleports}`}
          />
        )}

        {/* 이용요금 */}
        {autocamp.campingfee && (
          <>
            <View style={styles.sectionContainer}>
              <Ionicons
                name="cash-outline"
                size={24}
                color="#555"
                style={styles.icon}
              />
              <Text style={styles.sectionTitle}>이용요금</Text>
            </View>
            <RenderHTML
              contentWidth={width - 32}
              source={{ html: autocamp.campingfee }}
              tagsStyles={tagsStyles}
              onLinkPress={(evt, href) => {
                Linking.openURL(href);
              }}
            />
          </>
        )}

        {/* 부대시설 */}
        {autocamp.facilities && (
          <>
            <View style={styles.sectionContainer}>
              <Ionicons
                name="construct-outline"
                size={24}
                color="#555"
                style={styles.icon}
              />
              <Text style={styles.sectionTitle}>부대시설</Text>
            </View>
            <RenderHTML
              contentWidth={width - 32}
              source={{ html: autocamp.facilities }}
              tagsStyles={tagsStyles}
              onLinkPress={(evt, href) => {
                Linking.openURL(href);
              }}
            />
          </>
        )}

        {/* 주요시설 */}
        {autocamp.mainfacilities && (
          <>
            <View style={styles.sectionContainer}>
              <Ionicons
                name="apps-outline"
                size={24}
                color="#555"
                style={styles.icon}
              />
              <Text style={styles.sectionTitle}>주요시설</Text>
            </View>
            <RenderHTML
              contentWidth={width - 32}
              source={{ html: autocamp.mainfacilities }}
              tagsStyles={tagsStyles}
              onLinkPress={(evt, href) => {
                Linking.openURL(href);
              }}
            />
          </>
        )}
      </ScrollView>
    </View>
  );
}

const tagsStyles = {
  body: {
    whiteSpace: 'normal',
    color: '#666',
    fontSize: 16,
    lineHeight: 24,
  },
  p: {
    marginVertical: 8,
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 1,
    padding: 8,
    backgroundColor: 'rgba(245, 245, 245, 0)',
    borderRadius: 20,
  },
  imageSlider: {
    marginBottom: 20,
    marginTop: 15,
    height: 250,
    // 이미지 보더 제거
    // borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#e0f7fa',
  },
  imageLoader: {
    position: 'absolute',
    zIndex: 1,
    alignSelf: 'center',
    top: '50%',
  },
  image: {
    width: Dimensions.get('window').width - 32,
    height: 250,
  },
  name: {
    fontSize: 26,
    marginBottom: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  facilityContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  facilityItem: {
    alignItems: 'center',
    margin: 10,
  },
  facilityText: {
    marginTop: 5,
    fontSize: 14,
    color: '#555',
  },
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
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  icon: {
    marginRight: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#666',
    flex: 1,
  },
  link: {
    color: '#1e90ff',
    textDecorationLine: 'underline',
  },
});

export default AutoCampDetail;
