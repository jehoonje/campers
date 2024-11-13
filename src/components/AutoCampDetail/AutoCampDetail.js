// src/components/AutoCampDetail/AutoCampDetail.js
import React, { useState, useEffect, useMemo } from 'react';
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

function AutoCampDetail({ route, navigation }) {
  const { autocamp } = route.params;
  const { width } = useWindowDimensions();

  const [activeTab, setActiveTab] = useState('detail');
  const [averageRating, setAverageRating] = useState(0);
  const [imageLoading, setImageLoading] = useState(true);

  // 탭 버튼 클릭 핸들러
  const handleTabPress = (tab) => {
    setActiveTab(tab);
  };

  // 평균 별점 가져오기
  useEffect(() => {
    const fetchAverageRating = async () => {
      try {
        const response = await axios.get(
          `http://10.0.2.2:8080/api/reviews/average/autocamp/${autocamp.contentId}`
        );
        setAverageRating(response.data.averageRating);
      } catch (error) {
        console.error('Error fetching average rating:', error);
        setAverageRating(0);
      }
    };

    fetchAverageRating();
  }, [autocamp.contentId]);

  // 시설 정보를 합쳐서 단어를 검색합니다.
  const facilitiesText = `${autocamp.facilities || ''} ${autocamp.mainfacilities || ''}`;

  // 포함된 시설 단어 목록
  const includedFacilities = useMemo(() => {
    return facilityWords.filter((word) => facilitiesText.includes(word));
  }, [facilitiesText]);

  // 주차 가능 여부 확인
  const isParkingAvailable =
    autocamp.parkingleports && autocamp.parkingleports.includes('가능');

  // 애견동반 가능 여부 확인
  const isPetAvailable =
    autocamp.chkpetleports && autocamp.chkpetleports.includes('가능');

  // 기본 이미지 경로 설정
  const defaultImage = require('../../assets/campsite.png');

  // 시설 아이콘 매핑 객체 생성
  const facilityIconsMapped = useMemo(() => {
    return includedFacilities.reduce((acc, facility) => {
      acc[facility] = facilityIcons[facility];
      return acc;
    }, {});
  }, [includedFacilities]);

  // If autocamp data is not available, show a loading indicator
  if (!autocamp) {
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

      {/* 이미지 슬라이더 */}
      <ImageSlider
        images={[autocamp.image1, autocamp.image2]}
        imageLoading={imageLoading}
        setImageLoading={setImageLoading}
        defaultImage={defaultImage}
      />

      {/* 캠핑장 이름 */}
      <Text style={styles.name}>{autocamp.title}</Text>

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
          autocamp={autocamp}
          tagsStyles={styles.tagsStyles}
        />
      ) : (
        <ReviewComponent contentType="Autocamp" contentId={autocamp.contentId} />
      )}
    </View>
  );
}

AutoCampDetail.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      autocamp: PropTypes.object.isRequired,
    }).isRequired,
  }).isRequired,
  navigation: PropTypes.object.isRequired,
};

export default React.memo(AutoCampDetail);
