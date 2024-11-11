// src/components/FishingDetail/FishingDetail.js
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
import {FontAwesome} from '@expo/vector-icons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ReviewComponent from '../ReviewComponent/ReviewComponent';
import axios from 'axios';
import PropTypes from 'prop-types';

function FishingDetail({route, navigation}) {
  const {fishing} = route.params;
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
          `http://10.0.2.2:8080/api/reviews/average/Fishing/${fishing.id}`,
        );
        setAverageRating(response.data.averageRating);
      } catch (error) {
        console.error('Error fetching average rating:', error);
        setAverageRating(0);
      }
    };

    fetchAverageRating();
  }, [fishing.id]);

  // 이미지 로딩 상태 관리
  const [imageLoading, setImageLoading] = useState(true);

  // 시설 정보를 합쳐서 단어를 검색합니다.
  const facilitiesText = `${fishing.facilities || ''}`;

  // 검색할 단어 목록
  const facilityWords = [
    '화장실',
    '샤워',
    '바베큐',
    '매점',
    '식당',
    '대여',
    '에어컨',
  ];

  // 단어와 아이콘 매핑
  const facilityIcons = {
    화장실: 'toilet',
    매점: 'cart',
    샤워: 'shower',
    바베큐: 'barbecue',
    식당: 'silverware-fork-knife',
    대여: 'account-convert',
    에어컨: 'air-conditioner',
  };

  // 포함된 시설 단어 목록
  const includedFacilities = facilityWords.filter(word =>
    facilitiesText.includes(word),
  );

  // 주차 가능 여부 확인
  const isParkingAvailable =
    fishing.parkingleports && fishing.parkingleports.includes('가능');

  // 이미지 URL 배열 생성 및 필터링
  const imageUrls = [
    fishing.image1,
    fishing.image2,
    fishing.image3,
    fishing.image4,
    fishing.image5,
  ].filter(Boolean); // 존재하는 이미지 URL만 남김

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
      {imageUrls.length > 0 && (
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
            {imageUrls.map((uri, index) => (
              <Image
                key={index}
                source={{uri: uri}}
                style={styles.image}
                resizeMode="cover"
                onLoadEnd={() => setImageLoading(false)}
                onError={() => setImageLoading(false)}
              />
            ))}
          </ScrollView>
        </View>
      )}

      {/* 낚시터 이름 */}
      <Text style={styles.name}>{fishing.title}</Text>

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
                  name={facilityIcons[facility] || 'information'}
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
          </View>

          {/* 낚시터 주소 */}
          <InfoRow
            iconName="location-outline"
            text={fishing.addr || '주소 정보가 없습니다.'}
            onPress={() => {
              if (fishing.addr) {
                const url = Platform.select({
                  ios: `maps:0,0?q=${fishing.addr}`,
                  android: `geo:0,0?q=${fishing.addr}`,
                });
                Linking.openURL(url);
              }
            }}
          />

          {/* 낚시터 설명 */}
          {fishing.description && (
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
                source={{html: fishing.description}}
                tagsStyles={tagsStyles}
                onLinkPress={(evt, href) => {
                  Linking.openURL(href);
                }}
              />
            </>
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
            <InfoRow
              iconName="calendar-outline"
              text={`개장기간: ${fishing.openperiod}`}
            />
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
            <InfoRow
              iconName="close-circle-outline"
              text={`쉬는날: ${fishing.restdateleports}`}
            />
          )}

          {/* 이용요금 */}
          {fishing.fishingfee && (
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
                source={{html: fishing.fishingfee}}
                tagsStyles={tagsStyles}
                onLinkPress={(evt, href) => {
                  Linking.openURL(href);
                }}
              />
            </>
          )}

          {/* 부대시설 */}
          {fishing.facilities && (
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
                source={{html: fishing.facilities}}
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
        <ReviewComponent contentType="Fishing" contentId={fishing.id} />
      )}
    </View>
  );
}

FishingDetail.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      fishing: PropTypes.object.isRequired,
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
    marginBottom: 6,
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

export default FishingDetail;
