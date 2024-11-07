// src/components/CountryDetail/CountryDetail.js
import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ScrollView,
  Animated,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons'; // 변경된 아이콘 라이브러리

const { width: SCREEN_WIDTH } = Dimensions.get('window');

function CountryDetail({ route, navigation }) {
  const { countryside } = route.params;

  // 체험프로그램명을 '+' 기준으로 분리하여 리스트로 변환
  const programList = countryside.체험프로그램명
    ? countryside.체험프로그램명.split('+')
    : [];

  // ScrollView의 Y 스크롤 값을 추적하기 위한 Animated.Value
  const scrollY = useRef(new Animated.Value(0)).current;

  // 스크롤뷰의 콘텐츠 높이와 스크롤뷰의 높이를 상태로 관리
  const [contentHeight, setContentHeight] = useState(1);
  const [scrollViewHeight, setScrollViewHeight] = useState(120); // 초기 높이 120

  // 스크롤바의 높이 계산
  const scrollbarHeight =
    scrollViewHeight < contentHeight
      ? (scrollViewHeight / contentHeight) * scrollViewHeight
      : scrollViewHeight;

  // 스크롤바의 위치 계산
  const scrollbarTranslateY =
    contentHeight > scrollViewHeight
      ? scrollY.interpolate({
          inputRange: [0, contentHeight - scrollViewHeight],
          outputRange: [0, scrollViewHeight - scrollbarHeight],
          extrapolate: 'clamp',
        })
      : new Animated.Value(0);

  // 이미지 로딩 상태
  const [imageLoading, setImageLoading] = useState(true);

  return (
    <View style={styles.container}>
      {/* 닫기 버튼 */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false} // 전체 스크롤바 숨기기
      >
        {/* 이미지 */}
        <View style={styles.imageContainer}>
          {imageLoading && (
            <ActivityIndicator size="large" color="#1e90ff" style={styles.imageLoader} />
          )}
          {countryside.이미지url ? (
            <Image
              source={{ uri: countryside.이미지url }}
              style={styles.image}
              resizeMode="contain" // 이미지가 프레임 내에서 중앙에 위치하도록 설정
              onLoadEnd={() => setImageLoading(false)}
              onError={() => setImageLoading(false)}
            />
          ) : (
            <Image
              source={require('../../assets/placeholder.png')}
              style={styles.image}
              resizeMode="contain"
              onLoadEnd={() => setImageLoading(false)}
            />
          )}
        </View>

        {/* 마을 이름 */}
        <Text style={styles.name}>{countryside.체험마을명}</Text>

        {/* 프로그램 리스트 */}
        <Text style={styles.sectionTitle}>체험 프로그램</Text>
        {programList.length > 0 ? (
          <View style={styles.programContainer}>
            {/* 스크롤 힌트 그라데이션 */}
            <LinearGradient
              colors={['rgba(224, 247, 250, 1)', 'rgba(224, 247, 250, 0)']}
              style={styles.gradientTop}
            />

            {/* 프로그램 리스트 ScrollView */}
            <Animated.ScrollView
              contentContainerStyle={styles.programContent}
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                { useNativeDriver: false }
              )}
              scrollEventThrottle={16}
              showsVerticalScrollIndicator={false} // 기본 스크롤바 숨기기
              nestedScrollEnabled={true} // 중첩 스크롤 활성화
              onContentSizeChange={(w, h) => setContentHeight(h)}
              onLayout={(e) => setScrollViewHeight(e.nativeEvent.layout.height)}
            >
              {programList.map((program, index) => (
                <Text key={index} style={styles.listItem}>
                  {program}
                </Text>
              ))}
            </Animated.ScrollView>

            {/* 스크롤바 */}
            {contentHeight > scrollViewHeight && (
              <View style={styles.scrollbarContainer}>
                <Animated.View
                  style={[
                    styles.scrollbar,
                    {
                      height: scrollbarHeight,
                      transform: [{ translateY: scrollbarTranslateY }],
                    },
                  ]}
                />
              </View>
            )}

            {/* 스크롤 힌트 그라데이션 */}
            <LinearGradient
              colors={['rgba(224, 247, 250, 0)', 'rgba(224, 247, 250, 1)']}
              style={styles.gradientBottom}
            />
          </View>
        ) : (
          <Text style={styles.description}>프로그램 정보가 없습니다.</Text>
        )}

        {/* 주소 정보 */}
        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={24} color="#555" style={styles.icon} />
          <Text style={styles.description}>{countryside.소재지도로명주소 || '주소 정보가 없습니다.'}</Text>
        </View>

        {/* 전화번호 정보 */}
        <View style={styles.infoRow}>
          <Ionicons name="call-outline" size={24} color="#555" style={styles.icon} />
          <Text style={styles.description}>{countryside.대표전화번호 || '전화번호 정보가 없습니다.'}</Text>
        </View>

        {/* 홈페이지 정보 */}
        {countryside.홈페이지주소 ? (
          <View style={styles.infoRow}>
            <Ionicons name="link-outline" size={24} color="#555" style={styles.icon} />
            <Text
              style={[styles.description, styles.link]}
              onPress={() => Linking.openURL(countryside.홈페이지주소)}
            >
              {countryside.홈페이지주소}
            </Text>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60, // 상단 여백 추가
    paddingHorizontal: 16,
    backgroundColor: '#f5f5f5', // 전체 배경색 설정
  },
  contentContainer: {
    paddingBottom: 20,
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 1,
    padding: 8,
    backgroundColor: '#ffffffaa', // 반투명 배경
    borderRadius: 20,
  },
  imageContainer: {
    width: '100%',
    height: 250, // 고정 높이
    marginBottom: 16,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#F4F7F8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageLoader: {
    position: 'absolute',
    zIndex: 1,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  name: {
    fontSize: 24,
    marginBottom: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  sectionTitle: {
    fontSize: 20,
    marginTop: 16,
    marginBottom: 8,
    fontWeight: 'bold',
    color: '#555',
  },
  description: {
    fontSize: 16,
    color: '#666',
    flex: 1, // 텍스트가 공간을 충분히 차지하도록 설정
  },
  link: {
    color: '#333',
    textDecorationLine: 'underline',
  },
  listItem: {
    fontSize: 16,
    marginLeft: 16,
    marginBottom: 4,
    color: '#444',
  },
  programContainer: {
    backgroundColor: '#F4F7F8', // 스크롤 박스 배경색
    borderRadius: 10,
    padding: 10,
    height: 120, // 고정 높이로 변경
    marginBottom: 16,
    position: 'relative', // 그라데이션과 스크롤바를 위치시키기 위해
  },
  programContent: {
    paddingBottom: 10,
  },
  scrollbarContainer: {
    position: 'absolute',
    top: 10,
    right: 5,
    width: 4,
    height: '100%',
    backgroundColor: '#F4F7F8',
    borderRadius: 2,
  },
  scrollbar: {
    width: 4,
    backgroundColor: '#ccc',
    borderRadius: 2,
  },
  gradientTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  gradientBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 20,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  icon: {
    marginRight: 10,
  },
});

export default CountryDetail;
