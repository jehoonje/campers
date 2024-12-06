// src/components/CampsiteDetail/CampsiteDetail.js
import React, { useState, useContext, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
  Linking,
  useWindowDimensions,
} from 'react-native';
import PropTypes from 'prop-types';
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './styles';
import sharedStyles from '../Shared/styles';
import FacilityIcon from '../Shared/components/FacilityIcon';
import InfoRow from '../Shared/components/InfoRow';
import TabButton from '../Shared/components/TabButton';
import RatingDisplay from '../Shared/components/RatingDisplay';
import ImageSlider from '../Shared/components/ImageSlider';
import TabSection from './components/TabSection';
import LoadingIndicator from '../Shared/components/LoadingIndicator';
import ReviewComponent from '../ReviewComponent/ReviewComponent';
import FavoriteButton from '../Shared/FavoriteButton'; // 추가
import useFavorite from '../../hooks/useFavorite'; // 추가
import {AuthContext} from '../../AuthContext'; // AuthContext 임포트 추가

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

function CampsiteDetail({ route, navigation }) {
  const { campsite } = route.params;
  const { width } = useWindowDimensions();

  const [activeTab, setActiveTab] = useState('detail');
  const [averageRating, setAverageRating] = useState(0);
  const [imageLoading, setImageLoading] = useState(true);

  // AuthContext에서 userId 가져오기
  const { userId } = useContext(AuthContext);

  // 즐겨찾기 훅 사용
  const { isFavorite, toggleFavorite, loading } = useFavorite('CAMPSITE', campsite.contentId);

  // 탭 버튼 클릭 핸들러
  const handleTabPress = (tab) => {
    setActiveTab(tab);
  };

  const fetchAverageRating = async () => {
    try {
      const response = await axios.get(
        `http://10.0.2.2:8080/api/reviews/average/Campsite/${campsite.contentId}`
      );
      setAverageRating(response.data.averageRating);
    } catch (error) {
      console.error('Error fetching average rating:', error);
      setAverageRating(0);
    }
  };

  // 평균 별점 가져오기
  useEffect(() => {
    fetchAverageRating();
  }, [fetchAverageRating]);

  // 시설 정보를 합쳐서 단어를 검색합니다.
  const facilitiesText = `${campsite.facilities || ''} ${campsite.mainfacilities || ''}`;

  // 포함된 시설 단어 목록
  const includedFacilities = useMemo(() => {
    return facilityWords.filter((word) => facilitiesText.includes(word));
  }, [facilitiesText]);

  // 주차 가능 여부 확인
  const isParkingAvailable =
    campsite.parkingleports && campsite.parkingleports.includes('가능');

  // 애견동반 가능 여부 확인
  const isPetAvailable =
    campsite.chkpetleports && campsite.chkpetleports.includes('가능');

  // 기본 이미지 경로 설정
  const defaultImage = require('../../assets/campsite.png');

  // 시설 아이콘 매핑 객체 생성
  const facilityIconsMapped = useMemo(() => {
    return includedFacilities.reduce((acc, facility) => {
      acc[facility] = facilityIcons[facility];
      return acc;
    }, {});
  }, [includedFacilities]);

  // If campsite data is not available, show a loading indicator
  if (!campsite) {
    return <LoadingIndicator />;
  }

  // Callback function to update average rating
  const handleReviewAdded = () => {
    fetchAverageRating();
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

      {/* 즐겨찾기 토글 버튼 추가 */}
      <FavoriteButton isFavorite={isFavorite || false} toggleFavorite={toggleFavorite} loading={loading} />


      {/* 이미지 슬라이더 */}
      <ImageSlider
        images={[campsite.image1, campsite.image2]}
        imageLoading={imageLoading}
        setImageLoading={setImageLoading}
        defaultImage={defaultImage}
      />

      {/* 캠핑장 이름 */}
      <Text style={styles.name}>{campsite.title}</Text>

      {/* 평균 별점 표시 */}
      <RatingDisplay averageRating={averageRating} />

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
          contentType="Campsite" 
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
  isFavorite: false, // 기본값
};

export default React.memo(CampsiteDetail);
