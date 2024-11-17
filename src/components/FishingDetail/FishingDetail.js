// src/components/FishingDetail/FishingDetail.js
import React, { useState, useContext, useEffect, useMemo } from 'react';
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
import useFavorite from '../../hooks/useFavorite'; // useFavorite 훅 임포트
import { AuthContext } from '../../AuthContext'; // AuthContext 임포트 추가

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

function FishingDetail({ route, navigation }) {
  const { fishing } = route.params;
  const { width } = useWindowDimensions();

  const [activeTab, setActiveTab] = useState('detail');
  const [averageRating, setAverageRating] = useState(0);
  const [imageLoading, setImageLoading] = useState(true);

  // AuthContext에서 userId 가져오기
  const { userId } = useContext(AuthContext);


  // 즐겨찾기 훅 사용
  const { isFavorite, toggleFavorite, loading } = useFavorite('FISHING', fishing.id);

  // 탭 버튼 클릭 핸들러
  const handleTabPress = (tab) => {
    setActiveTab(tab);
  };

  

  // 평균 별점 가져오기
  useEffect(() => {
    const fetchAverageRating = async () => {
      try {
        const response = await axiosInstance.get(
          `/reviews/average/Fishing/${fishing.id}`
        );
        setAverageRating(response.data.averageRating);
      } catch (error) {
        console.error('Error fetching average rating:', error);
        setAverageRating(0);
      }
    };

    fetchAverageRating();
  }, [fishing.contentId]);

  // 시설 정보를 합쳐서 단어를 검색합니다.
  const facilitiesText = `${fishing.facilities || ''} ${fishing.mainfacilities || ''}`;

  // 포함된 시설 단어 목록
  const includedFacilities = useMemo(() => {
    return facilityWords.filter((word) => facilitiesText.includes(word));
  }, [facilitiesText]);

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

  // 기본 이미지 경로 설정
  const defaultImage = require('../../assets/campsite.png');

  // 시설 아이콘 매핑 객체 생성
  const facilityIconsMapped = useMemo(() => {
    return includedFacilities.reduce((acc, facility) => {
      acc[facility] = facilityIcons[facility];
      return acc;
    }, {});
  }, [includedFacilities]);

  // If fishing data is not available, show a loading indicator
  if (!fishing) {
    return <LoadingIndicator />;
  }

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
        images={imageUrls}
        imageLoading={imageLoading}
        setImageLoading={setImageLoading}
        defaultImage={defaultImage}
      />

      {/* 낚시터 이름 */}
      <Text style={styles.name}>{fishing.title}</Text>

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
          fishing={fishing}
          tagsStyles={styles.tagsStyles}
        />
      ) : (
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
  isFavorite: PropTypes.bool,
  navigation: PropTypes.object.isRequired,
};

FavoriteButton.defaultProps = {
  isFavorite: false, // 기본값
};

export default React.memo(FishingDetail);
