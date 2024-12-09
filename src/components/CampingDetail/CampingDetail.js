// src/components/CampingDetail/CampingDetail.js

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
  Linking,
  useWindowDimensions,
  StyleSheet,
  Image,
} from 'react-native';
import PropTypes from 'prop-types';
import Ionicons from 'react-native-vector-icons/Ionicons';
import sharedStyles from '../Shared/styles';
import axios from 'axios';
import styles from '../CampingDetail/styles'; // CampingDetail/styles.js를 참고한다고 했으니 가져옴
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

const FACILITY_KEYWORDS = [
  {
    keywords: ['화장실'],
    icon: 'toilet',
    label: '화장실',
  },
  {
    keywords: ['냇가', '물놀이', '계곡', '해수욕장'],
    icon: 'swim',
    label: '물놀이',
  },
  {
    keywords: ['낚시', '물고기'],
    icon: 'fish',
    label: '낚시',
  },
  {
    keywords: ['개수대'],
    icon: 'faucet',
    label: '개수대',
  },
  {
    keywords: ['마트', '매점'],
    icon: 'cart',
    label: '마트/매점',
  },
  {
    keywords: ['숲', '나무'],
    icon: 'tree',
    label: '숲/나무',
  },
  {
    keywords: ['무료'],
    icon: 'emoticon-happy-outline',
    label: '무료',
  },
];

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

function CampingDetail({route, navigation}) {
  const {campground} = route.params;
  const {width} = useWindowDimensions();

  // AuthContext에서 userId 가져오기
  const {userId} = useContext(AuthContext);

  const [activeTab, setActiveTab] = useState('detail');
  const [averageRating, setAverageRating] = useState(0);
  const [imageLoading, setImageLoading] = useState(true);

  // 즐겨찾기 훅 사용
  const {isFavorite, toggleFavorite, loading} = useFavorite(
    'CAMPGROUND',
    campground.id,
  );

  // 탭 버튼 클릭 핸들러
  const handleTabPress = tab => {
    setActiveTab(tab);
  };

  // 평균 별점 가져오는 함수 분리
  const fetchAverageRating = useCallback(async () => {
    try {
      const response = await axios.get(
        `http://10.0.2.2:8080/api/reviews/average/Campground/${campground.id}`,
      );
      setAverageRating(response.data.averageRating);
    } catch (error) {
      console.error('Error fetching average rating:', error);
      setAverageRating(0);
    }
  }, [campground.id]);

  // 평균 별점 가져오기
  useEffect(() => {
    fetchAverageRating();
  }, [fetchAverageRating]);

  const isParkingAvailable =
    campground.parkingleports && campground.parkingleports.includes('가능');

  const isPetAvailable =
    campground.chkpetleports && campground.chkpetleports.includes('가능');

  const defaultImage = require('../../assets/campsite.png');

  // Combine 'feature' and 'description' fields for keyword search
  const combinedText = useMemo(() => {
    const feature = campground.feature || '';
    const description = campground.description || '';
    return `${feature} ${description}`;
  }, [campground.feature, campground.description]);

  // Determine which facilities to display based on keywords
  const matchedFacilities = useMemo(() => {
    return FACILITY_KEYWORDS.filter(facility =>
      facility.keywords.some(keyword => combinedText.includes(keyword)),
    );
  }, [combinedText]);

  // Function to handle going back
  const handleGoBack = () => {
    navigation.goBack();
  };

  // If campground data is not available, show a loading indicator
  if (!campground) {
    return <LoadingIndicator />;
  }

  const includedFacilities = matchedFacilities.map(facility => facility.label);
  const facilityIconsMapped = matchedFacilities.reduce((acc, facility) => {
    acc[facility.label] = facility.icon;
    return acc;
  }, {});

  const handleReviewAdded = () => {
    fetchAverageRating();
  };

  // 카카오내비 연동 함수
  const openKakaoNavi = () => {
    const {latitude, longitude, name} = campground;

    if (!lat || !lng) {
      alert('위치 정보가 없습니다.');
      return;
    }

    const scheme = `kakaonavi://route?ep=${lat},${lng}&name=${encodeURIComponent(
      name || '목적지',
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

  return (
    <View style={styles.container}>
      {/* 닫기 버튼 */}
      <TouchableOpacity
        onPress={handleGoBack}
        style={styles.backButton}
        accessible={true}
        accessibilityLabel="뒤로 가기">
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      {/* 즐겨찾기 토글 버튼 추가 */}
      <FavoriteButton
        isFavorite={isFavorite || false}
        toggleFavorite={toggleFavorite}
        loading={loading}
      />

      {/* 캠핑장 이미지 */}
      <View style={styles.imageSlider}>
        <ImageSlider
          images={[campground.imageUrl]}
          imageLoading={imageLoading}
          setImageLoading={setImageLoading}
          defaultImage={defaultImage}
        />
      </View>

      {/* 캠핑장 이름, 별점, 경로 버튼 */}
      <View style={localStyles.headerContainer}>
        <View style={localStyles.titleRatingContainer}>
          <CustomText style={localStyles.nameText}>
            {campground.name}
          </CustomText>
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

      {/* 탭 내용 */}
      {activeTab === 'detail' ? (
        // Detail 내용
        <TabSection
          width={width}
          includedFacilities={includedFacilities}
          facilityIcons={facilityIconsMapped}
          isParkingAvailable={isParkingAvailable}
          isPetAvailable={isPetAvailable}
          campground={campground}
          tagsStyles={styles.tagsStyles}
        />
      ) : (
        // Review 내용
        <ReviewComponent
          contentType="Campground"
          contentId={campground.id}
          onReviewAdded={handleReviewAdded}
        />
      )}
    </View>
  );
}

CampingDetail.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      campground: PropTypes.object.isRequired,
    }).isRequired,
  }).isRequired,
  isFavorite: PropTypes.bool,
  navigation: PropTypes.object.isRequired,
};

FavoriteButton.defaultProps = {
  isFavorite: false, // 기본값
};

export default React.memo(CampingDetail);
