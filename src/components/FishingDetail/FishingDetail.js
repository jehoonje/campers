// src/components/FishingDetail/FishingDetail.js

import React, {useState, useMemo, useContext} from 'react';
import {
  View,
  TouchableOpacity,
  Platform,
  Linking,
  useWindowDimensions,
  StyleSheet,
  Image,
} from 'react-native';
import PropTypes from 'prop-types';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axiosInstance from '../../utils/axiosInstance';
import sharedStyles from '../Shared/styles';
import styles from '../FishingDetail/styles';
import TabSection from './components/TabSection';
import LoadingIndicator from '../Shared/components/LoadingIndicator';
import FavoriteButton from '../Shared/FavoriteButton';
import useFavorite from '../../hooks/useFavorite';
import {AuthContext} from '../../AuthContext';
import CustomText from '../CustomText';
import Swiper from 'react-native-swiper';
import KakaoNaviButton from '../Shared/KakaoNaviButton';


// 경로 탐색 버튼 이미지
import RouteButtonImage from '../../assets/getdirections.png';

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

// 추가적인 로컬 스타일
const localStyles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    marginHorizontal: 18,
    alignItems: 'center', // 추가: 수직 정렬
    marginBottom: 5,
  },
  titleRatingContainer: {
    flex: 1,
    flexWrap: 'wrap',
  },
  nameText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 3,
  },
  addressText: {
    // 추가: 주소 텍스트 스타일 
    fontSize: 14,
    marginRight: 18,
    color: '#000',
  },
  routeButton: {
    marginLeft: 8,
    marginTop: 9,
    paddingLeft: 15,
    paddingBottom: 5,
    borderLeftWidth: 1,
    marginBottom: 6,
    borderColor: '#dadada',
  },
  routeButtonImage: {
    width: 80,
    height: 50,
  },
});

function FishingDetail({route, navigation}) {
  const {fishing} = route.params;
  const {width} = useWindowDimensions();

  const [imageLoading, setImageLoading] = useState(true);

  // AuthContext에서 userId 가져오기
  const {userId} = useContext(AuthContext);

  // 즐겨찾기 훅 사용
  const {isFavorite, toggleFavorite, loading} = useFavorite(
    'FISHING',
    fishing.contentId,
  );

  // 시설 정보를 합쳐서 단어를 검색합니다.
  const facilitiesText = `${fishing.facilities || ''} ${
    fishing.mainfacilities || ''
  }`;

  // 포함된 시설 단어 목록
  const includedFacilities = useMemo(() => {
    return facilityWords.filter(word => facilitiesText.includes(word));
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

  // 주소를 클릭했을 때 동작하는 함수
  const openMaps = () => {
    if (fishing.addr) {
      const url = Platform.select({
        ios: `maps:0,0?q=${fishing.addr}`,
        android: `geo:0,0?q=${fishing.addr}`,
      });
      Linking.openURL(url).catch(err =>
        console.error('An error occurred', err),
      );
    } else {
      alert('주소 정보가 없습니다.');
    }
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
      <FavoriteButton
        isFavorite={isFavorite || false}
        toggleFavorite={toggleFavorite}
        loading={loading}
      />

      {/* 이미지 슬라이더 with pagination dots */}
      <View style={styles.imageSlider}>
        <Swiper
          showsPagination={true} // 페이지네이션 점 표시
          paginationStyle={{
            bottom: 10, // 기본값보다 더 아래로 이동 (예: 10으로 설정)
          }}
          dotStyle={{
            backgroundColor: 'rgba(0,0,0,.2)',
            width: 8,
            height: 8,
            borderRadius: 4,
            margin: 3,
          }}
          activeDotStyle={{
            backgroundColor: '#fff',
            width: 8,
            height: 8,
            borderRadius: 4,
            margin: 3,
          }}
          imageLoading={imageLoading}
          setImageLoading={setImageLoading}>
          {imageUrls.map((url, index) => (
            <Image
              key={index}
              source={{uri: url}}
              style={{width: '100%', height: 250}}
              resizeMode="cover"
            />
          ))}
        </Swiper>
      </View>

      {/* 낚시터 이름, 주소, 경로 버튼 */}
      <View style={localStyles.headerContainer}>
        <View style={localStyles.titleRatingContainer}>
          <CustomText style={localStyles.nameText}>{fishing.title}</CustomText>
          {/* 주소 텍스트 추가 */}
          <TouchableOpacity
            onPress={openMaps}
            accessible={true}
            accessibilityLabel="주소 클릭">
            <CustomText style={localStyles.addressText}>
              {fishing.addr || '주소 정보가 없습니다.'}
            </CustomText>
          </TouchableOpacity>
        </View>
        <KakaoNaviButton
          name={fishing.title}
          latitude={fishing.lat}
          longitude={fishing.lng}
        />
      </View>

      {/* 구분선 */}
      <View style={styles.divider} />

      {/* 낚시터 정보 */}
      <TabSection
        width={width}
        includedFacilities={includedFacilities}
        facilityIcons={facilityIconsMapped}
        isParkingAvailable={isParkingAvailable}
        fishing={fishing}
        tagsStyles={styles.tagsStyles}
      />
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
