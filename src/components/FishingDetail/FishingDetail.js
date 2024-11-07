// src/components/CampsiteDetail/CampsiteDetail.js
import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import RenderHTML from 'react-native-render-html';
import {useWindowDimensions} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { FontAwesome } from '@expo/vector-icons';

function FishingDetail({route, navigation}) {
  const {fishing} = route.params;
  const {width} = useWindowDimensions();

  // 시설 정보를 합쳐서 단어를 검색합니다.
  const facilitiesText = `${fishing.facilities || ''}`;

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
    취사: 'silverware-fork-knife',
    매점: 'alpha-m-box',
    샤워: 'shower',
    바베큐: 'barbecue', // 'wifi'는 'barbecue'로 변경 (적절한 아이콘 선택)
    식당: 'silverware-fork-knife', // 'water-boiler'는 'silverware-fork-knife'로 변경
    대여: 'account-convert',
    에어컨: 'air-conditioner',
  };

  // 포함된 시설 단어 목록
  const includedFacilities = facilityWords.filter(word =>
    facilitiesText.includes(word),
  );

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

  return (
    <View style={styles.container}>
      {/* 닫기 버튼 */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}>
        <Text style={styles.backButtonText}>{'<'}</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* 이미지 슬라이더 */}
        {imageUrls.length > 0 && (
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            style={styles.imageSlider}>
            {imageUrls.map((uri, index) => (
              <Image
                key={index}
                source={{uri}}
                style={styles.image}
                resizeMode="cover"
              />
            ))}
          </ScrollView>
        )}

        {/* 낚시터 이름 */}
        <Text style={styles.name}>{fishing.title}</Text>

        {/* 낚시터 주소 */}
        <Text style={styles.addr}>{fishing.addr}</Text>

        {/* 시설 아이콘 표시 */}
        <View style={styles.facilityContainer}>
          {includedFacilities.map((facility, index) => (
            <View key={index} style={styles.facilityItem}>
              <MaterialCommunityIcons
                name={facilityIcons[facility] || 'information'}
                size={32}
                color="#555"
              />
              <Text style={styles.facilityText}>{facility}</Text>
            </View>
          ))}
          {/* 주차 가능 아이콘 추가 */}
          {isParkingAvailable && (
            <View style={styles.facilityItem}>
              <MaterialCommunityIcons name="parking" size={32} color="#555" />
              <Text style={styles.facilityText}>주차 가능</Text>
            </View>
          )}
        </View>

        {/* 캠핑장 설명 */}
        {fishing.description && (
          <>
            <RenderHTML
              contentWidth={width - 32}
              source={{html: fishing.description}}
              tagsStyles={tagsStyles}
            />
          </>
        )}

        {/* 나머지 필드들 */}

        {/* 문의 및 안내 */}
        {fishing.infocenterleports && (
          <View style={styles.fieldContainer}>
            <Text style={styles.sectionTitle}>문의 및 안내</Text>
            <RenderHTML
              contentWidth={width - 32}
              source={{html: fishing.infocenterleports}}
              tagsStyles={tagsStyles}
            />
          </View>
        )}

        {/* 개장기간 */}
        {fishing.openperiod && (
          <View style={styles.fieldContainer}>
            <Text style={styles.sectionTitle}>개장기간</Text>
            <RenderHTML
              contentWidth={width - 32}
              source={{html: fishing.openperiod}}
              tagsStyles={tagsStyles}
            />
          </View>
        )}

        {/* 주차요금 */}
        {fishing.parkingfeeleports && (
          <View style={styles.fieldContainer}>
            <Text style={styles.sectionTitle}>주차요금</Text>
            <RenderHTML
              contentWidth={width - 32}
              source={{html: fishing.parkingfeeleports}}
              tagsStyles={tagsStyles}
            />
          </View>
        )}

        {/* 주차시설 */}
        {fishing.parkingleports && (
          <View style={styles.fieldContainer}>
            <Text style={styles.sectionTitle}>주차시설</Text>
            <RenderHTML
              contentWidth={width - 32}
              source={{html: fishing.parkingleports}}
              tagsStyles={tagsStyles}
            />
          </View>
        )}

        {/* 예약안내 */}
        {fishing.reservation && (
          <View style={styles.fieldContainer}>
            <Text style={styles.sectionTitle}>예약안내</Text>
            <RenderHTML
              contentWidth={width - 32}
              source={{html: fishing.reservation}}
              tagsStyles={tagsStyles}
            />
          </View>
        )}

        {/* 쉬는날 */}
        {fishing.restdateleports && (
          <View style={styles.fieldContainer}>
            <Text style={styles.sectionTitle}>쉬는날</Text>
            <RenderHTML
              contentWidth={width - 32}
              source={{html: fishing.restdateleports}}
              tagsStyles={tagsStyles}
            />
          </View>
        )}

        {/* 이용시간 */}
        {fishing.usetimeleports && (
          <View style={styles.fieldContainer}>
            <Text style={styles.sectionTitle}>이용시간</Text>
            <RenderHTML
              contentWidth={width - 32}
              source={{html: fishing.usetimeleports}}
              tagsStyles={tagsStyles}
            />
          </View>
        )}

        {/* 이용요금 */}
        {fishing.campingfee && (
          <View style={styles.fieldContainer}>
            <Text style={styles.sectionTitle}>이용요금</Text>
            <RenderHTML
              contentWidth={width - 32}
              source={{html: fishing.fishingfee}}
              tagsStyles={tagsStyles}
            />
          </View>
        )}

        {/* 부대시설 */}
        {fishing.facilities && (
          <View style={styles.fieldContainer}>
            <Text style={styles.sectionTitle}>주요시설</Text>
            <RenderHTML
              contentWidth={width - 32}
              source={{html: fishing.facilities}}
              tagsStyles={tagsStyles}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

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
    paddingTop: 60,
    backgroundColor: '#f5f5f5',
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
    backgroundColor: 'rgba(245, 245, 245, 0)',
    borderRadius: 20,
  },
  backButtonText: {
    fontSize: 32,
    color: '#333',
  },
  imageSlider: {
    marginBottom: 20,
    marginTop: 15,
  },
  image: {
    width: Dimensions.get('window').width - 32, // 콘텐츠 패딩을 고려
    height: 250,
    // marginRight: 10, // 이미지 간 간격
    // borderRadius: 10, // 이미지 모서리 둥글게
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
    textAlign: 'center',
    color: '#666',
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
  },
  sectionTitle: {
    fontSize: 20,
    marginTop: 24,
    marginBottom: 12,
    fontWeight: 'bold',
    color: '#555',
  },
  fieldContainer: {
    marginBottom: 16,
  },
  fieldText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
});

export default FishingDetail;
