// src/components/CampingDetail/CampingDetail.js
import React, {useMemo, useContext, useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  ActivityIndicator,
  Linking,
  Modal,
} from 'react-native';
import PropTypes from 'prop-types';
import axios from 'axios';

import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from './styles';
import sharedStyles from '../Shared/styles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FavoriteButton from '../Shared/FavoriteButton'; // 추가
import FacilityIcon from '../Shared/components/FacilityIcon';
import InfoRow from '../Shared/components/InfoRow';
import TabButton from '../Shared/components/TabButton';
import RatingDisplay from '../Shared/components/RatingDisplay';
import ImageSlider from '../Shared/components/ImageSlider';
import TabSection from './components/TabSection';
import LoadingIndicator from '../Shared/components/LoadingIndicator';
import ReviewComponent from '../ReviewComponent/ReviewComponent';
import useFavorite from '../../hooks/useFavorite'; 
import {AuthContext} from '../../AuthContext'; 

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

function CampingDetail({route, navigation}) {
  const {campground} = route.params;
  const {width} = useWindowDimensions();

  const [activeTab, setActiveTab] = useState('detail');
  const [averageRating, setAverageRating] = useState(0);

  // AuthContext에서 userId 가져오기
  const {userId} = useContext(AuthContext);

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

  // Callback function to update average rating
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

      {/* 즐겨찾기 토글 버튼 추가 */}
      <FavoriteButton
        isFavorite={isFavorite || false}
        toggleFavorite={toggleFavorite}
        loading={loading}
      />

      {/* 캠핑장 이미지 */}
      <ImageSlider
        images={[campground.imageUrl]}
        imageLoading={false}
        setImageLoading={() => {}}
        defaultImage={require('../../assets/campsite.png')}
      />

      {/* 캠핑장 이름 */}
      <Text style={styles.name}>{campground.name}</Text>

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
        // Detail 내용
        <TabSection
          width={width}
          includedFacilities={includedFacilities}
          facilityIcons={facilityIconsMapped}
          isParkingAvailable={
            campground.parkingleports &&
            campground.parkingleports.includes('가능')
          }
          isPetAvailable={
            campground.chkpetleports &&
            campground.chkpetleports.includes('가능')
          }
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
