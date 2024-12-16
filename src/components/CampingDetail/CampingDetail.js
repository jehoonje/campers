import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useContext,
} from 'react';
import {
  View,
  TouchableOpacity,
  useWindowDimensions,
  StyleSheet,
  Image,
} from 'react-native';
import PropTypes from 'prop-types';
import Ionicons from 'react-native-vector-icons/Ionicons';
import sharedStyles from '../Shared/styles';
import axios from 'axios';
import styles from '../CampingDetail/styles';
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
import KakaoNaviButton from '../Shared/KakaoNaviButton';

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
    justifyContent: 'space-between',
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
});

function CampingDetail({route, navigation}) {
  const {campground} = route.params;
  const {width} = useWindowDimensions();
  const {userId} = useContext(AuthContext);

  const [activeTab, setActiveTab] = useState('detail');
  const [averageRating, setAverageRating] = useState(0);
  const [imageLoading, setImageLoading] = useState(true);

  const {isFavorite, toggleFavorite, loading} = useFavorite(
    'CAMPGROUND',
    campground.id,
  );

  const handleTabPress = tab => {
    setActiveTab(tab);
  };

  const fetchAverageRating = useCallback(async () => {
    try {
      const response = await axios.get(
        `http://13.124.234.143:8080/api/reviews/average/Campground/${campground.id}`,
      );
      setAverageRating(response.data.averageRating);
    } catch (error) {
      console.error('Error fetching average rating:', error);
      setAverageRating(0);
    }
  }, [campground.id]);

  useEffect(() => {
    fetchAverageRating();
  }, [fetchAverageRating]);

  const isParkingAvailable =
    campground.parkingleports && campground.parkingleports.includes('가능');

  const isPetAvailable =
    campground.chkpetleports && campground.chkpetleports.includes('가능');

  const defaultImage = require('../../assets/campsite.png');

  const combinedText = useMemo(() => {
    const feature = campground.feature || '';
    const description = campground.description || '';
    return `${feature} ${description}`;
  }, [campground.feature, campground.description]);

  const matchedFacilities = useMemo(() => {
    return FACILITY_KEYWORDS.filter(facility =>
      facility.keywords.some(keyword => combinedText.includes(keyword)),
    );
  }, [combinedText]);

  const handleGoBack = () => {
    navigation.goBack();
  };

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

      {/* 즐겨찾기 토글 버튼 */}
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
        {/* KakaoNaviButton 사용. CampingDetail에서는 latitude, longitude를 사용 */}
        <KakaoNaviButton
          name={campground.name}
          latitude={campground.latitude}
          longitude={campground.longitude}
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

      {activeTab === 'detail' ? (
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
  isFavorite: false,
};

export default React.memo(CampingDetail);
