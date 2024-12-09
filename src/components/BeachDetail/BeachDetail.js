// src/components/BeachDetail/BeachDetail.js
import React, {useState, useContext} from 'react';
import CustomText from '../CustomText';
import {
  View,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {useWindowDimensions} from 'react-native'; // 화면 너비를 가져오기 위해 사용
import RenderHTML from 'react-native-render-html';
import FavoriteButton from '../Shared/FavoriteButton'; // 추가
import Ionicons from 'react-native-vector-icons/Ionicons'; // 아이콘 라이브러리 추가
import useFavorite from '../../hooks/useFavorite'; // useFavorite 훅 임포트
import {AuthContext} from '../../AuthContext'; // AuthContext 임포트 추가

const BeachDetail = ({route, navigation}) => {
  const {beach} = route.params;
  const {width} = useWindowDimensions();

  // AuthContext에서 userId 가져오기
  const {userId} = useContext(AuthContext);

  // 즐겨찾기 훅 사용
  const {isFavorite, toggleFavorite, loading} = useFavorite(
    'BEACH',
    beach.contentId,
  );

  // 이미지 로딩 상태 관리
  const [imageLoading, setImageLoading] = useState(true);

  // 재사용 가능한 InfoRow 컴포넌트
  const InfoRow = ({iconName, text, onPress}) => (
    <TouchableOpacity
      style={styles.infoRow}
      onPress={onPress}
      disabled={!onPress}>
      <Ionicons name={iconName} size={24} color="#555" style={styles.icon} />
      <CustomText style={[styles.infoText, onPress && styles.link]}>{text}</CustomText>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* 뒤로가기 버튼 */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      {/* 즐겨찾기 토글 버튼 추가 */}
      <FavoriteButton
        isFavorite={isFavorite || false}
        toggleFavorite={toggleFavorite}
        loading={loading}
      />

      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* 이미지 */}
        <View style={styles.imageContainer}>
          {imageLoading && (
            <ActivityIndicator
              size="large"
              color="#1e90ff"
              style={styles.imageLoader}
            />
          )}
          {beach.image1 ? (
            <Image
              source={{uri: beach.image1}}
              style={styles.image}
              resizeMode="cover"
              onLoadEnd={() => setImageLoading(false)}
              onError={() => setImageLoading(false)}
            />
          ) : (
            <Image
              source={require('../../assets/placeholder.png')}
              style={styles.image}
              resizeMode="cover"
              onLoadEnd={() => setImageLoading(false)}
            />
          )}
        </View>

        {/* 해수욕장 이름 */}
        <CustomText style={styles.title}>{beach.title || '해수욕장 이름 없음'}</CustomText>

        <View style={styles.context}>
        {/* 주소 */}
        {beach.addr && (
          <>
            <InfoRow
              iconName="location-outline"
              text={beach.addr || '주소 정보가 없습니다.'}
              onPress={() => {
                if (beach.addr) {
                  const url = Platform.select({
                    ios: `maps:0,0?q=${beach.addr}`,
                    android: `geo:0,0?q=${beach.addr}`,
                  });
                  Linking.openURL(url);
                }
              }}
            />
          </>
        )}

        {/* 소개 */}
        {beach.description && (
          <>
            <View style={styles.sectionContainer}>
              <Ionicons
                name="information-circle-outline"
                size={24}
                color="#555"
                style={styles.icon}
              />
              <CustomText style={styles.sectionTitle}>소개</CustomText>
            </View>
            <RenderHTML
              contentWidth={width - 32} // 패딩을 고려하여 너비 조정
              source={{html: beach.description}}
              tagsStyles={tagsStyles}
            />
          </>
        )}
        </View>
      </ScrollView>
    </View>
  );
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
    paddingTop: 35, // 상단 여백 추가
    backgroundColor: '#f5f5f5', // 전체 배경색 설정
  },
  contentContainer: {
    paddingBottom: 20,
  },
  backButton: {
    position: 'absolute',
    top: 5,
    left: 8,
    zIndex: 1,
    padding: 8,
    backgroundColor: 'rgba(245, 245, 245, 0)', // 반투명 배경
  },
  imageContainer: {
    marginBottom: 20,
    marginTop: 15,
    height: 250,
    overflow: 'hidden',
    backgroundColor: '#e0f7fa',
  },
  imageLoader: {
    position: 'absolute',
    zIndex: 1,
    alignSelf: 'center',
    top: '50%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 26,
    marginBottom: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  sectionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 12,
  },
  context: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    marginLeft: 8,
    fontWeight: 'bold',
    color: '#555',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  icon: {
    marginRight: 8,
  },
  infoText: {
    fontSize: 16,
    color: '#666',
    flex: 1,
  },
  link: {
    color: '#1e90ff',
    textDecorationLine: 'underline',
  },
});

export default BeachDetail;
