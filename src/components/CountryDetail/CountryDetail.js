// src/components/CountryDetail/CountryDetail.js
import React, { useRef, useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Linking, ScrollView, Animated, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Ionicons } from '@expo/vector-icons'; // 아이콘 라이브러리 설치 필요

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

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
  const scrollbarHeight = scrollViewHeight < contentHeight
    ? (scrollViewHeight / contentHeight) * scrollViewHeight
    : scrollViewHeight;

  // 스크롤바의 위치 계산
  const scrollbarTranslateY = contentHeight > scrollViewHeight ? scrollY.interpolate({
    inputRange: [0, contentHeight - scrollViewHeight],
    outputRange: [0, scrollViewHeight - scrollbarHeight],
    extrapolate: 'clamp',
  }) : new Animated.Value(0);

  return (
    <View style={styles.container}>
      {/* 닫기 버튼 */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backButtonText}>{'<'}</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* 이미지 */}
        {countryside.이미지url ? (
          <Image source={{ uri: countryside.이미지url }} style={styles.image} />
        ) : (
          <Image source={require('../../assets/placeholder.png')} style={styles.image} />
        )}

        {/* 마을 이름 */}
        <Text style={styles.name}>{countryside.체험마을명}</Text>

        {/* 프로그램 리스트 */}
        <Text style={styles.sectionTitle}>체험 프로그램</Text>
        {programList.length > 0 ? (
          <View style={styles.programContainer}>
            {/* 스크롤 힌트 그라데이션 */}
            <LinearGradient colors={['rgba(224, 247, 250, 1)', 'rgba(224, 247, 250, 0)']} style={styles.gradientTop} />
            
            {/* 프로그램 리스트 ScrollView */}
            <Animated.ScrollView
              contentContainerStyle={styles.programContent}
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                { useNativeDriver: false }
              )}
              scrollEventThrottle={16}
              showsVerticalScrollIndicator={false} // 기본 스크롤바 숨기기
              onContentSizeChange={(w, h) => setContentHeight(h)}
              onLayout={(e) => setScrollViewHeight(e.nativeEvent.layout.height)}
            >
              {programList.map((program, index) => (
                <Text key={index} style={styles.listItem}>{program}</Text>
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
            <LinearGradient colors={['rgba(224, 247, 250, 1)', 'rgba(224, 247, 250, 0)']} style={styles.gradientBottom} />
          </View>
        ) : (
          <Text style={styles.description}>프로그램 정보가 없습니다.</Text>
        )}

        {/* 주소 */}
        <Text style={styles.sectionTitle}>주소</Text>
        <Text style={styles.description}>{countryside.소재지도로명주소 || '주소 정보가 없습니다.'}</Text>

        {/* 전화번호 */}
        <Text style={styles.sectionTitle}>대표 전화번호</Text>
        <Text style={styles.description}>{countryside.대표전화번호 || '전화번호 정보가 없습니다.'}</Text>

        {/* 홈페이지 */}
        {countryside.홈페이지주소 ? (
          <>
            <Text style={styles.sectionTitle}>홈페이지</Text>
            <Text
              style={[styles.description, styles.link]}
              onPress={() => Linking.openURL(countryside.홈페이지주소)}
            >
              {countryside.홈페이지주소}
            </Text>
          </>
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
  backButtonText: {
    fontSize: 24,
    color: '#333',
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 16,
    borderRadius: 10,
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
  },
  link: {
    color: '#1e90ff',
    textDecorationLine: 'underline',
  },
  listItem: {
    fontSize: 16,
    marginLeft: 16,
    marginBottom: 4,
    color: '#444',
  },
  programContainer: {
    backgroundColor: '#e0f7fa', // 스크롤 박스 배경색
    borderRadius: 10,
    padding: 10,
    maxHeight: 120, // 스크롤뷰 높이 설정
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
    backgroundColor: '#ccc',
    borderRadius: 2,
  },
  scrollbar: {
    width: 4,
    backgroundColor: '#1e90ff',
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
});

export default CountryDetail;
