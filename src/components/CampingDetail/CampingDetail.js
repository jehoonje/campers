// src/components/CampingDetail/CampingDetail.js
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

function CampingDetail({ route, navigation }) {
  const { campground } = route.params;

  return (
    <View style={styles.container}>
      {/* 닫기 버튼 */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backButtonText}>{'<'}</Text>
      </TouchableOpacity>

      {/* 캠핑장 이미지 */}
      {campground.imageUrl && (
        <Image source={{ uri: campground.imageUrl }} style={styles.image} />
      )}

      {/* 캠핑장 이름 */}
      <Text style={styles.name}>{campground.name}</Text>

      {/* 캠핑장 설명 */}
      <Text style={styles.description}>
        {campground.description || '설명 정보가 없습니다.'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60, // 상단 여백 추가
    paddingHorizontal: 16,
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 1,
  },
  backButtonText: {
    fontSize: 24,
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
  },
});

export default CampingDetail;
