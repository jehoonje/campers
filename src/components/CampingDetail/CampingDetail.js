// src/components/CampingDetail/CampingDetail.js
import React, { useMemo, useState, useEffect } from 'react';
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
import RenderHTML from 'react-native-render-html';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import PropTypes from 'prop-types';
import axios from 'axios';

import FacilityIcon from './components/FacilityIcon';
import InfoRow from './components/InfoRow';
import TabButton from './components/TabButton';
import RatingDisplay from './components/RatingDisplay';
import ReviewComponent from '../ReviewComponent/ReviewComponent';
import styles from './styles';

// Define keyword categories and their corresponding icons
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

function CampingDetail({ route, navigation }) {
  const { campground } = route.params;
  const { width } = useWindowDimensions();

  const [activeTab, setActiveTab] = useState('detail'); 
  const [averageRating, setAverageRating] = useState(0);

  // 탭 버튼 클릭 핸들러
  const handleTabPress = (tab) => {
    setActiveTab(tab);
  };

  // 평균 별점 가져오기
  useEffect(() => {
    const fetchAverageRating = async () => {
      try {
        const response = await axios.get(
          `http://10.0.2.2:8080/api/reviews/average/Campground/${campground.id}`
        );
        setAverageRating(response.data.averageRating);
      } catch (error) {
        console.error('Error fetching average rating:', error);
        setAverageRating(0);
      }
    };

    fetchAverageRating();
  }, [campground.id]);

  // Combine 'feature' and 'description' fields for keyword search
  const combinedText = useMemo(() => {
    const feature = campground.feature || '';
    const description = campground.description || '';
    return `${feature} ${description}`;
  }, [campground.feature, campground.description]);

  // Determine which facilities to display based on keywords
  const matchedFacilities = useMemo(() => {
    return FACILITY_KEYWORDS.filter((facility) =>
      facility.keywords.some((keyword) => combinedText.includes(keyword))
    );
  }, [combinedText]);

  // Function to handle going back
  const handleGoBack = () => {
    navigation.goBack();
  };

  // If campground data is not available, show a loading indicator
  if (!campground) {
    return (
      <View style={styles.loadingContainer}>
        <MaterialCommunityIcons name="loading" size={48} color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 닫기 버튼 */}
      <TouchableOpacity
        onPress={handleGoBack}
        style={styles.backButton}
        accessible={true}
        accessibilityLabel="뒤로 가기"
      >
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      {/* 캠핑장 이미지 */}
      {campground.imageUrl && (
        <Image source={{ uri: campground.imageUrl }} style={styles.image} />
      )}

      {/* 캠핑장 이름 */}
      <Text style={styles.name}>{campground.name}</Text>

      {/* 평균 별점 표시 */}
      <RatingDisplay averageRating={averageRating} />

      {/* 탭 버튼 */}
      <View style={styles.tabContainer}>
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
        <ScrollView
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* 시설 아이콘 표시 */}
          {matchedFacilities.length > 0 && (
            <View style={styles.facilityContainer}>
              {matchedFacilities.map((facility, index) => (
                <FacilityIcon
                  key={index}
                  iconName={facility.icon}
                  label={facility.label}
                />
              ))}
            </View>
          )}

          {/* 주소 정보 */}
          <InfoRow
            iconName="location-outline"
            text={campground.address || '주소 정보가 없습니다.'}
            onPress={() => {
              if (campground.address) {
                const url = Platform.select({
                  ios: `maps:0,0?q=${campground.address}`,
                  android: `geo:0,0?q=${campground.address}`,
                });
                Linking.openURL(url);
              }
            }}
          />

          {/* 소개 정보 */}
          <View style={styles.sectionContainer}>
            <Ionicons
              name="information-outline"
              size={24}
              color="#555"
              style={styles.icon}
            />
            <Text style={styles.sectionTitle}>소개</Text>
          </View>
          {campground.description && (
            <RenderHTML
              contentWidth={width - 32}
              source={{ html: campground.description }}
              tagsStyles={tagsStyles}
              accessible={true}
              onLinkPress={(evt, href) => {
                Linking.openURL(href);
              }}
            />
          )}

          {/* 홈페이지 정보 */}
          {campground.website && (
            <InfoRow
              iconName="link-outline"
              text={campground.website}
              onPress={() => Linking.openURL(campground.website)}
            />
          )}
        </ScrollView>
      ) : (
        // Review 내용
        <ReviewComponent contentType="Campground" contentId={campground.id} />
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

export default React.memo(CampingDetail);
