// src/components/CampsiteDetail/CampsiteDetail.js
import React, {useState, useEffect} from 'react';
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
import ReviewComponent from '../ReviewComponent/ReviewComponent';
import axios from 'axios';
import PropTypes from 'prop-types';

function CampsiteDetail({route, navigation}) {
  const {campsite} = route.params;
  const {width} = useWindowDimensions();

  // 탭 상태 관리
  const [activeTab, setActiveTab] = useState('detail');
  const [averageRating, setAverageRating] = useState(0);

  // 탭 버튼 클릭 핸들러
  const handleTabPress = tab => {
    setActiveTab(tab);
  };

  // 평균 별점 가져오기
  useEffect(() => {
    const fetchAverageRating = async () => {
      try {
        const response = await axios.get(
          `http://10.0.2.2:8080/api/reviews/average/Campsite/${campsite.id}`,
        );
        setAverageRating(response.data.averageRating);
      } catch (error) {
        console.error('Error fetching average rating:', error);
        setAverageRating(0);
      }
    };

    fetchAverageRating();
  }, [campsite.id]);

  // 이미지 로딩 상태 관리
  const [imageLoading, setImageLoading] = useState(true);

  // 시설 정보를 합쳐서 단어를 검색합니다.
  const facilitiesText = `${campsite.facilities || ''} ${
    campsite.mainfacilities || ''
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
  const includedFacilities = facilityWords.filter(word =>
    facilitiesText.includes(word),
  );

  // 주차 가능 여부 확인
  const isParkingAvailable =
    campsite.parkingleports && campsite.parkingleports.includes('가능');

  // 애견동반 가능 여부 확인
  const isPetAvailable =
    campsite.chkpetleports && campsite.chkpetleports.includes('가능');

  // 재사용 가능한 InfoRow 컴포넌트
  const InfoRow = ({iconName, text, onPress}) => (
    <TouchableOpacity
      style={styles.infoRow}
      onPress={onPress}
      disabled={!onPress}
      accessible={true}
      accessibilityLabel={text}>
      <Ionicons name={iconName} size={24} color="#555" style={styles.icon} />
      <Text style={[styles.infoText, onPress && styles.link]}>{text}</Text>
    </TouchableOpacity>
  );

  InfoRow.propTypes = {
    iconName: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    onPress: PropTypes.func,
  };

  // 기본 이미지 경로 설정
  const defaultImage = require('../../assets/campsite.png');


  return (
    <View style={styles.container}>
      {/* 닫기 버튼 */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
        accessible={true}
        accessibilityLabel="뒤로 가기">
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      {/* 이미지 슬라이더 */}
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
          showsHorizontalScrollIndicator={false}>
          {/* 첫 번째 이미지 */}
          <Image
            source={campsite.image1 ? {uri: campsite.image1} : defaultImage}
            style={styles.image}
            resizeMode="cover"
            onLoadEnd={() => setImageLoading(false)}
            onError={() => setImageLoading(false)}
          />
          {/* 두 번째 이미지 */}
          <Image
            source={campsite.image2 ? {uri: campsite.image2} : defaultImage}
            style={styles.image}
            resizeMode="cover"
            onLoadEnd={() => setImageLoading(false)}
            onError={() => setImageLoading(false)}
          />
        </ScrollView>
      </View>

      {/* 캠핑장 이름 */}
      <Text style={styles.name}>{campsite.title}</Text>

      {/* 평균 별점 표시 */}
      <View style={styles.ratingContainer}>
        {Array.from({length: 5}, (_, index) => {
          const filled = index < Math.round(averageRating);
          return (
            <MaterialCommunityIcons
              key={index}
              name={filled ? 'star' : 'star-outline'}
              size={24}
              color={filled ? '#FFD700' : '#ccc'}
            />
          );
        })}
        <Text style={styles.averageRatingText}>{averageRating.toFixed(1)}</Text>
      </View>

      {/* 탭 버튼 */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'detail' && styles.activeTabButton,
          ]}
          onPress={() => handleTabPress('detail')}>
          <Text
            style={[
              styles.tabButtonText,
              activeTab === 'detail'
                ? styles.activeTabButtonText
                : styles.inactiveTabButtonText,
            ]}>
            Detail
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'review' && styles.activeTabButton,
          ]}
          onPress={() => handleTabPress('review')}>
          <Text
            style={[
              styles.tabButtonText,
              activeTab === 'review'
                ? styles.activeTabButtonText
                : styles.inactiveTabButtonText,
            ]}>
            Review
          </Text>
        </TouchableOpacity>
      </View>

      {/* 탭 내용 */}
      {activeTab === 'detail' ? (
        <ScrollView
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}>
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

          {/* 캠핑장 주소 */}
          <InfoRow
              iconName="location-outline"
              text={campsite.addr || '주소 정보가 없습니다.'}
              onPress={() => {
                if (campsite.addr) {
                  const url = Platform.select({
                    ios: `maps:0,0?q=${campsite.addr}`,
                    android: `geo:0,0?q=${campsite.addr}`,
                  });
                  Linking.openURL(url);
                }
              }}
            />

          {/* 캠핑장 설명 */}
          {campsite.description && (
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
                source={{html: campsite.description}}
                tagsStyles={tagsStyles}
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
                source={{html: campsite.reservation}}
                tagsStyles={tagsStyles}
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
                source={{html: campsite.campingfee}}
                tagsStyles={tagsStyles}
                onLinkPress={(evt, href) => {
                  Linking.openURL(href);
                }}
              />
            </>
          )}

          {/* 부대시설 */}
          {campsite.facilities && (
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
                source={{html: campsite.facilities}}
                tagsStyles={tagsStyles}
                onLinkPress={(evt, href) => {
                  Linking.openURL(href);
                }}
              />
            </>
          )}

          {/* 주요시설 */}
          {campsite.mainfacilities && (
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
                source={{html: campsite.mainfacilities}}
                tagsStyles={tagsStyles}
                onLinkPress={(evt, href) => {
                  Linking.openURL(href);
                }}
              />
            </>
          )}
        </ScrollView>
      ) : (
        // Review 내용
        <ReviewComponent contentType="Campsite" contentId={campsite.id} />
      )}
    </View>
  );
}

CampsiteDetail.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      campsite: PropTypes.object.isRequired,
    }).isRequired,
  }).isRequired,
  navigation: PropTypes.object.isRequired,
};

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
    paddingBottom: 10,
    marginTop:10,
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
    width: Dimensions.get('window').width,
    height: 250,
  },
  name: {
    fontSize: 26,
    marginBottom: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  averageRatingText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  facilityContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 5,
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
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderColor: 'transparent',
  },
  activeTabButton: {
    borderColor: '#333',
  },
  tabButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  activeTabButtonText: {
    color: '#333',
  },
  inactiveTabButtonText: {
    color: '#aaa',
  },
});

export default CampsiteDetail;
