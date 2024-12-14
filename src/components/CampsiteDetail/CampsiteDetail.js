// src/components/CampsiteDetail/CampsiteDetail.js

import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useContext,
} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  Linking,
  useWindowDimensions,
  StyleSheet,
  Image,
} from 'react-native';
import PropTypes from 'prop-types';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axiosInstance from '../../utils/axiosInstance';
import sharedStyles from '../Shared/styles';
import styles from '../CampsiteDetail/styles';
import TabButton from '../Shared/components/TabButton';
import RatingDisplay from '../Shared/components/RatingDisplay';
import ImageSlider from '../Shared/components/ImageSlider';
import TabSection from './components/TabSection';
import LoadingIndicator from '../Shared/components/LoadingIndicator';
import ReviewComponent from '../ReviewComponent/ReviewComponent';
import FavoriteButton from '../Shared/FavoriteButton';
import useFavorite from '../../hooks/useFavorite';
import {AuthContext} from '../../AuthContext';
import CustomText from '../CustomText';
import Swiper from 'react-native-swiper';
import KakaoNaviButton from '../Shared/KakaoNaviButton';

// 시설 관련 단어 및 아이콘
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

// 추가적인 로컬 스타일
const localStyles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    justifyContent: 'space-between', // 양 끝으로 배치
    alignItems: 'center',
  },
  titleRatingContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    flex: 1, 
    paddingBottom: 10,
  },
  nameText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    paddingBottom: 4,
    marginTop: 4,
  },
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

function CampsiteDetail({route, navigation}) {
  const {campsite} = route.params;
  const {width} = useWindowDimensions();
  const {userId} = useContext(AuthContext);

  const [activeTab, setActiveTab] = useState('detail');
  const [averageRating, setAverageRating] = useState(0);
  const [imageLoading, setImageLoading] = useState(true);

  const {isFavorite, toggleFavorite, loading} = useFavorite(
    'CAMPSITE',
    campsite.contentId,
  );

  const fetchAverageRating = useCallback(async () => {
    try {
      const response = await axiosInstance.get(
        `/reviews/average/campsite/${campsite.contentId}`,
      );
      setAverageRating(response.data.averageRating);
    } catch (error) {
      console.error('Error fetching average rating:', error);
      setAverageRating(0);
    }
  }, [campsite.contentId]);

  useEffect(() => {
    fetchAverageRating();
  }, [fetchAverageRating]);

  const facilitiesText = `${campsite.facilities || ''} ${
    campsite.mainfacilities || ''
  }`;

  const includedFacilities = useMemo(() => {
    return facilityWords.filter(word => facilitiesText.includes(word));
  }, [facilitiesText]);

  const isParkingAvailable =
    campsite.parkingleports && campsite.parkingleports.includes('가능');

  const isPetAvailable =
    campsite.chkpetleports && campsite.chkpetleports.includes('가능');

  // 이미지 URL 배열 생성 및 필터링
  const imageUrls = [
    campsite.image1,
    campsite.image2,
    campsite.image3,
    campsite.image4,
    campsite.image5,
  ].filter(Boolean); // 존재하는 이미지 URL만 남김

  const defaultImage = require('../../assets/campsite.png');

  const facilityIconsMapped = useMemo(() => {
    return includedFacilities.reduce((acc, facility) => {
      acc[facility] = facilityIcons[facility];
      return acc;
    }, {});
  }, [includedFacilities]);

  if (!campsite) {
    return <LoadingIndicator />;
  }

  const handleReviewAdded = () => {
    fetchAverageRating();
  };

  const handleTabPress = tab => {
    setActiveTab(tab);
  };

  return (
    <View style={styles.container}>
      {/* 뒤로가기 버튼 */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
        accessible={true}
        accessibilityLabel="뒤로 가기">
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      {/* 즐겨찾기 버튼 */}
      <FavoriteButton
        isFavorite={isFavorite || false}
        toggleFavorite={toggleFavorite}
        loading={loading}
      />

      {/* 이미지 슬라이더 with pagination dots */}
      <View style={styles.imageSlider}>
        <Swiper
          showsPagination={true} // 페이지네이션 점 표시
          paginationStyle={{
            bottom: 10, // 기본값보다 더 아래로 이동 (예: 10으로 설정)
          }}
          dotStyle={{
            backgroundColor: 'rgba(0,0,0,.2)',
            width: 8,
            height: 8,
            borderRadius: 4,
            margin: 3,
          }}
          activeDotStyle={{
            backgroundColor: '#fff',
            width: 8,
            height: 8,
            borderRadius: 4,
            margin: 3,
          }}>
          {imageUrls.map((url, index) => (
            <Image
              key={index}
              source={{uri: url}}
              imageLoading={imageLoading}
              setImageLoading={setImageLoading}
              style={{width: '100%', height: 250}}
              resizeMode="cover"
            />
          ))}
        </Swiper>
      </View>

      {/* 캠핑장 이름, 별점, 경로 버튼 */}
      <View style={localStyles.headerContainer}>
        <View style={localStyles.titleRatingContainer}>
          <CustomText style={localStyles.nameText}>{campsite.title}</CustomText>
          <RatingDisplay averageRating={averageRating} />
        </View>
        <KakaoNaviButton
          name={campsite.title}
          latitude={campsite.lat}
          longitude={campsite.lng}
        />
      </View>

      {/* 구분선 */}
      <View style={styles.divider} />

      {/* 탭 버튼 */}
      <View style={sharedStyles.tabContainer}>
        <TabButton
          title="Detail"
          active={activeTab === 'detail'}
          onPress={() => handleTabPress('detail')}
        />
        <TabButton
          title="Review"
          active={activeTab === 'review'}
          onPress={() => handleTabPress('review')}
        />
      </View>

      {/* 탭 컨텐츠 영역 */}
      {activeTab === 'detail' ? (
        <TabSection
          width={width}
          includedFacilities={includedFacilities}
          facilityIcons={facilityIconsMapped}
          isParkingAvailable={isParkingAvailable}
          isPetAvailable={isPetAvailable}
          campsite={campsite}
          tagsStyles={styles.tagsStyles}
        />
      ) : (
        <ReviewComponent
          contentType="campsite"
          contentId={campsite.contentId}
          onReviewAdded={handleReviewAdded}
        />
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
  isFavorite: PropTypes.bool,
  navigation: PropTypes.object.isRequired,
};

FavoriteButton.defaultProps = {
  isFavorite: false,
};

export default React.memo(CampsiteDetail);
