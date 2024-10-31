// src/components/autocampDetail/autocampDetail.js
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

function AutoCampDetail({route, navigation}) {
  const {autocamp} = route.params;
  const {width} = useWindowDimensions();

  // 시설 정보를 합쳐서 단어를 검색합니다.
  const facilitiesText = `${autocamp.facilities || ''} ${
    autocamp.mainfacilities || ''
  }`;

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

  // 포함된 시설 단어 목록
  const includedFacilities = facilityWords.filter(word =>
    facilitiesText.includes(word),
  );

  // 주차 가능 여부 확인
  const isParkingAvailable =
    autocamp.parkingleports && autocamp.parkingleports.includes('가능');
    
  
  // 애견동반 가능 여부 확인
  const isPetAvailable =
    autocamp.chkpetleports && autocamp.chkpetleports.includes('가능');


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
        {(autocamp.image1 || autocamp.image2) && (
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            style={styles.imageSlider}>
            {autocamp.image1 && (
              <Image
                source={{uri: autocamp.image1}}
                style={styles.image}
                resizeMode="cover"
              />
            )}
            {autocamp.image2 && (
              <Image
                source={{uri: autocamp.image2}}
                style={styles.image}
                resizeMode="cover"
              />
            )}
          </ScrollView>
        )}

        {/* 캠핑장 이름 */}
        <Text style={styles.name}>{autocamp.title}</Text>

        {/* 캠핑장 주소 */}
        <Text style={styles.addr}>{autocamp.addr}</Text>

        {/* 시설 아이콘 표시 */}
        <View style={styles.facilityContainer}>
          {includedFacilities.map((facility, index) => (
            <View key={index} style={styles.facilityItem}>
              <MaterialCommunityIcons
                name={facilityIcons[facility]}
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
          {/* 애견 동반 가능 아이콘 추가 */}
          {isPetAvailable && (
            <View style={styles.facilityItem}>
              <MaterialCommunityIcons name="dog" size={32} color="#555" />
              <Text style={styles.facilityText}>반려 동물</Text>
            </View>
          )}
        </View>

        {/* 캠핑장 설명 */}
        {autocamp.description && (
          <>
            <RenderHTML
              contentWidth={width - 32}
              source={{html: autocamp.description}}
              tagsStyles={tagsStyles}
            />
          </>
        )}

        {/* 나머지 필드들 */}

        {/* 문의 및 안내 */}
        {autocamp.infocenterleports && (
          <View style={styles.fieldContainer}>
            <Text style={styles.sectionTitle}>문의 및 안내</Text>
            <RenderHTML
              contentWidth={width - 32}
              source={{html: autocamp.infocenterleports}}
              tagsStyles={tagsStyles}
            />
          </View>
        )}

        {/* 개장기간 */}
        {autocamp.openperiod && (
          <View style={styles.fieldContainer}>
            <Text style={styles.sectionTitle}>개장기간</Text>
            <RenderHTML
              contentWidth={width - 32}
              source={{html: autocamp.openperiod}}
              tagsStyles={tagsStyles}
            />
          </View>
        )}

        {/* 주차요금 */}
        {autocamp.parkingfeeleports && (
          <View style={styles.fieldContainer}>
            <Text style={styles.sectionTitle}>주차요금</Text>
            <RenderHTML
              contentWidth={width - 32}
              source={{html: autocamp.parkingfeeleports}}
              tagsStyles={tagsStyles}
            />
          </View>
        )}

        {/* 주차시설 */}
        {autocamp.parkingleports && (
          <View style={styles.fieldContainer}>
            <Text style={styles.sectionTitle}>주차시설</Text>
            <RenderHTML
              contentWidth={width - 32}
              source={{html: autocamp.parkingleports}}
              tagsStyles={tagsStyles}
            />
          </View>
        )}

        {/* 예약안내 */}
        {autocamp.reservation && (
          <View style={styles.fieldContainer}>
            <Text style={styles.sectionTitle}>예약안내</Text>
            <RenderHTML
              contentWidth={width - 32}
              source={{html: autocamp.reservation}}
              tagsStyles={tagsStyles}
            />
          </View>
        )}

        {/* 쉬는날 */}
        {autocamp.restdateleports && (
          <View style={styles.fieldContainer}>
            <Text style={styles.sectionTitle}>쉬는날</Text>
            <RenderHTML
              contentWidth={width - 32}
              source={{html: autocamp.restdateleports}}
              tagsStyles={tagsStyles}
            />
          </View>
        )}

        {/* 이용시간 */}
        {autocamp.usetimeleports && (
          <View style={styles.fieldContainer}>
            <Text style={styles.sectionTitle}>이용시간</Text>
            <RenderHTML
              contentWidth={width - 32}
              source={{html: autocamp.usetimeleports}}
              tagsStyles={tagsStyles}
            />
          </View>
        )}

        {/* 이용요금 */}
        {autocamp.campingfee && (
          <View style={styles.fieldContainer}>
            <Text style={styles.sectionTitle}>이용요금</Text>
            <RenderHTML
              contentWidth={width - 32}
              source={{html: autocamp.campingfee}}
              tagsStyles={tagsStyles}
            />
          </View>
        )}

        {/* 부대시설 */}
        {autocamp.facilities && (
          <View style={styles.fieldContainer}>
            <Text style={styles.sectionTitle}>부대시설</Text>
            <RenderHTML
              contentWidth={width - 32}
              source={{html: autocamp.facilities}}
              tagsStyles={tagsStyles}
            />
          </View>
        )}

        {/* 주요시설 */}
        {autocamp.mainfacilities && (
          <View style={styles.fieldContainer}>
            <Text style={styles.sectionTitle}>주요시설</Text>
            <RenderHTML
              contentWidth={width - 32}
              source={{html: autocamp.mainfacilities}}
              tagsStyles={tagsStyles}
            />
          </View>
        )}

        {/* 애완동물 동반 가능 */}
        {autocamp.chkpetleports && (
          <View style={styles.fieldContainer}>
            <Text style={styles.sectionTitle}>애완동물 동반 가능</Text>
            <RenderHTML
              contentWidth={width - 32}
              source={{html: autocamp.chkpetleports}}
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
    width: Dimensions.get('window').width,
    height: 250,
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
  fieldText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
});

export default AutoCampDetail;
