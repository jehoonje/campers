// src/components/CountryDetail/CountryDetail.js
import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Linking,
  ScrollView,
  Animated,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import styles from './styles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import PropTypes from 'prop-types';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

function CountryDetail({route, navigation}) {
  const {countryside} = route.params;

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
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
        accessible={true}
        accessibilityLabel="뒤로 가기">
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>
      {/* 이미지 */}
      <View style={styles.imageContainer}>
        {imageLoading && (
          <ActivityIndicator
            size="large"
            color="#1e90ff"
            style={styles.imageLoader}
          />
        )}
        {countryside.이미지url ? (
          <Image
            source={{uri: countryside.이미지url}}
            style={styles.image}
            resizeMode="contain"
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

      {/* 구분선 */}
      <View style={styles.divider} />
      {/* 탭 내용 */}
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}>
        {/* 프로그램 리스트 */}

        <Text style={styles.sectionTitle}>체험 프로그램</Text>
        {programList.length > 0 ? (
          <View style={styles.programContainer}>
            {/* 프로그램 리스트 ScrollView */}
            <Animated.ScrollView
              contentContainerStyle={styles.programContent}
              onScroll={Animated.event(
                [{nativeEvent: {contentOffset: {y: scrollY}}}],
                {useNativeDriver: false},
              )}
              scrollEventThrottle={16}
              showsVerticalScrollIndicator={false} // 기본 스크롤바 숨기기
              nestedScrollEnabled={true} // 중첩 스크롤 활성화
              onContentSizeChange={(w, h) => setContentHeight(h)}
              onLayout={e => setScrollViewHeight(e.nativeEvent.layout.height)}>
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
                      transform: [{translateY: scrollbarTranslateY}],
                    },
                  ]}
                />
              </View>
            )}
          </View>
        ) : (
          <Text style={styles.description}>프로그램 정보가 없습니다.</Text>
        )}

        {/* 주소 정보 */}
        <View style={styles.infoRow}>
          <Ionicons
            name="location-outline"
            size={24}
            color="#555"
            style={styles.icon}
          />
          <Text style={styles.description}>
            {countryside.소재지도로명주소 || '주소 정보가 없습니다.'}
          </Text>
        </View>

        {/* 전화번호 정보 */}
        <View style={styles.infoRow}>
          <Ionicons
            name="call-outline"
            size={24}
            color="#555"
            style={styles.icon}
          />
          <Text style={styles.description}>
            {countryside.대표전화번호 || '전화번호 정보가 없습니다.'}
          </Text>
        </View>

        {/* 홈페이지 정보 */}
        {countryside.홈페이지주소 ? (
          <View style={styles.infoRow}>
            <Ionicons
              name="link-outline"
              size={24}
              color="#555"
              style={styles.icon}
            />
            <Text
              style={[styles.description, styles.link]}
              onPress={() => Linking.openURL(countryside.홈페이지주소)}>
              {countryside.홈페이지주소}
            </Text>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

CountryDetail.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      countryside: PropTypes.object.isRequired,
    }).isRequired,
  }).isRequired,
  navigation: PropTypes.object.isRequired,
};

export default CountryDetail;
