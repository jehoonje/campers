// src/components/CampingDetail/CampingDetail.js
import React, { useMemo } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import RenderHTML from 'react-native-render-html';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import PropTypes from 'prop-types';

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

function CampingDetail({ route, navigation }) {
  const { campground } = route.params;
  const { width } = useWindowDimensions();

  // Combine 'feature' and 'description' fields for keyword search
  const combinedText = useMemo(() => {
    const feature = campground.feature || '';
    const description = campground.description || '';
    return `${feature} ${description}`;
  }, [campground.feature, campground.description]);

  // Determine which facilities to display based on keywords
  const matchedFacilities = useMemo(() => {
    return FACILITY_KEYWORDS.filter(facility =>
      facility.keywords.some(keyword => combinedText.includes(keyword))
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
        accessibilityLabel="뒤로 가기">
        <Text style={styles.backButtonText}>{'<'}</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* 캠핑장 이미지 */}
        {campground.imageUrl && (
          <Image source={{uri: campground.imageUrl}} style={styles.image} />
        )}

        {/* 캠핑장 이름 */}
        <Text style={styles.name}>{campground.name}</Text>

        {/* 캠핑장 주소 */}
        <Text style={styles.sectionTitle}>주소</Text>
        <Text style={styles.addr}>{campground.address}</Text>

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

        {/* 캠핑장 설명 */}
        {campground.description && (
          <>
            <Text style={styles.sectionTitle}>소개</Text>
            <RenderHTML
              contentWidth={width - 32} // 패딩을 고려하여 너비 조정
              source={{ html: campground.description }}
              tagsStyles={tagsStyles}
              accessible={true}
              onLinkPress={(evt, href) => {
                Linking.openURL(href);
              }}
            />
          </>
        )}
      </ScrollView>
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
    paddingBottom: 20,
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 16,
    zIndex: 1,
    padding: 8,
    backgroundColor: 'rgba(245, 245, 245, 0)', // 반투명 배경
    borderRadius: 20,
  },
  backButtonText: {
    fontSize: 32,
    color: '#333',
  },
  sectionTitle: {
    fontSize: 20,
    marginTop: 24,
    marginBottom: 12,
    fontWeight: 'bold',
    color: '#555',
  },
  image: {
    height: 250,
    marginBottom: 20,
    marginTop: 15,
    borderRadius: 10,
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
    marginBottom: 20,
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
});

export default React.memo(CampingDetail);
