// src/components/CampsiteDetail/CampsiteDetail.js

import React, {useState, useEffect, useMemo, useCallback, useContext} from 'react';
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
import styles from '../CampsiteDetail/styles'; // CampsiteDetail/styles.js를 참고한다고 했으니 가져옴
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
// 경로 탐색 버튼 이미지
import RouteButtonImage from '../../assets/getdirections.png';

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
    marginHorizontal: 24,
  },
  titleRatingContainer: {
    flexDirection: 'row',
    flex: 1,
    flexWrap: 'wrap',
    paddingTop: '4%',
  },
  nameText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: "7%",
    marginTop: "-5%",
    
  },
  routeButton: {
    marginLeft: 8,
    
  },
  routeButtonImage: {
    width: 120,
    height: 80,
    marginBottom: '20%',
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

  // 카카오내비 연동 함수
  const openKakaoNavi = () => {
    const {lat, lng, title} = campsite;

    if (!lat || !lng) {
      alert('위치 정보가 없습니다.');
      return;
    }

    const scheme = `kakaonavi://route?ep=${lat},${lng}&name=${encodeURIComponent(
      title || '목적지',
    )}`;
    const fallbackUrl = 'https://kakaonavi.kakao.com/launch/index.do';

    Linking.canOpenURL(scheme)
      .then(supported => {
        if (supported) {
          Linking.openURL(scheme);
        } else {
          Linking.openURL(fallbackUrl);
        }
      })
      .catch(err => console.error('An error occurred', err));
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

      {/* 이미지 슬라이더 */}
      <View style={styles.imageSlider}>
        <ImageSlider
          images={[campsite.image1, campsite.image2]}
          imageLoading={imageLoading}
          setImageLoading={setImageLoading}
          defaultImage={defaultImage}
        />j
      </View>

      {/* 캠핑장 이름, 별점, 경로 버튼 */}
      <View style={localStyles.headerContainer}>
        <View style={localStyles.titleRatingContainer}>
          <CustomText style={localStyles.nameText}>{campsite.title}</CustomText>
          <RatingDisplay averageRating={averageRating} />
        </View>
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
          tagsStyles={styles.tagsStyles} // CampsiteDetail/styles.js에 정의된 tagsStyles 활용
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
