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
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ReviewComponent from '../ReviewComponent/ReviewComponent';
import Ionicons from 'react-native-vector-icons/Ionicons'; // 추가된 아이콘 라이브러리
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

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

// Reusable component for rendering individual facility icons
const FacilityIcon = ({ iconName, label }) => (
  <View style={styles.facilityItem}>
    <MaterialCommunityIcons
      name={iconName}
      size={32}
      color="#555"
      accessible={true}
      accessibilityLabel={label}
    />
    <Text style={styles.facilityText}>{label}</Text>
  </View>
);

FacilityIcon.propTypes = {
  iconName: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};

// Reusable component for rendering information rows with icons
const InfoRow = ({ iconName, text, onPress }) => (
  <TouchableOpacity
    style={styles.infoRow}
    onPress={onPress}
    disabled={!onPress}
    accessible={true}
    accessibilityLabel={text}
  >
    <Ionicons name={iconName} size={24} color="#555" style={styles.icon} />
    <Text style={[styles.infoText, onPress && styles.link]}>{text}</Text>
  </TouchableOpacity>
);

InfoRow.propTypes = {
  iconName: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  onPress: PropTypes.func,
};

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
      <View style={styles.ratingContainer}>
        {Array.from({ length: 5 }, (_, index) => {
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
        <Text style={styles.averageRatingText}>
          {averageRating.toFixed(1)}
        </Text>
      </View>

      {/* 탭 버튼 */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'detail' && styles.activeTabButton,
          ]}
          onPress={() => handleTabPress('detail')}
        >
          <Text
            style={[
              styles.tabButtonText,
              activeTab === 'detail'
                ? styles.activeTabButtonText
                : styles.inactiveTabButtonText,
            ]}
          >
            Detail
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'review' && styles.activeTabButton,
          ]}
          onPress={() => handleTabPress('review')}
        >
          <Text
            style={[
              styles.tabButtonText,
              activeTab === 'review'
                ? styles.activeTabButtonText
                : styles.inactiveTabButtonText,
            ]}
          >
            Review
          </Text>
        </TouchableOpacity>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60, // 상단 여백 추가
    backgroundColor: '#f5f5f5', // 전체 배경색 설정
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 10,
    marginTop:10,
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 1,
    padding: 8,
    backgroundColor: 'rgba(245, 245, 245, 0)', // 반투명 배경
    borderRadius: 20,
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
  image: {
    width: '100%',
    height: 250,
    marginBottom: 10,
    marginTop: 15,
    // borderRadius: 10, // 보더 제거
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
    borderColor: '#333', // 선택된 탭의 하단 보더 색상
  },
  tabButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  activeTabButtonText: {
    color: '#333', // 선택된 탭의 글씨 색상
  },
  inactiveTabButtonText: {
    color: '#aaa', // 선택되지 않은 탭의 글씨 색상
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
  name: {
    fontSize: 26,
    marginBottom: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  addr: {
    fontSize: 20,
    marginBottom: 16,
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
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    flex: 1, // 텍스트가 공간을 충분히 차지하도록 설정
  },
  link: {
    color: '#1e90ff',
    textDecorationLine: 'underline',
  },
});

export default React.memo(CampingDetail);
