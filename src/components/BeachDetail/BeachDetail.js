// src/components/BeachDetail/BeachDetail.js
import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useWindowDimensions } from 'react-native'; // 화면 너비를 가져오기 위해 사용
import RenderHTML from 'react-native-render-html';

const BeachDetail = ({ route, navigation }) => {
  const { beach } = route.params;
  const { width } = useWindowDimensions();

  return (
    <View style={styles.container}>
      {/* 뒤로가기 버튼 */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}>
        <Text style={styles.backButtonText}>{'<'}</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* 이미지 */}
        {beach.image1 ? (
          <Image source={{ uri: beach.image1 }} style={styles.image} />
        ) : (
          <Image
            source={require('../../assets/placeholder.png')}
            style={styles.image}
          />
        )}

        {/* 해수욕장 이름 */}
        <Text style={styles.title}>{beach.title || '해수욕장 이름 없음'}</Text>

        {/* 주소 */}
        {beach.addr && (
          <>
            <Text style={styles.sectionTitle}>주소</Text>
            <Text style={styles.address}>{beach.addr}</Text>
          </>
        )}

        {/* 소개 */}
        {beach.description && (
          <>
            <Text style={styles.sectionTitle}>소개</Text>
            <RenderHTML
              contentWidth={width - 32} // 패딩을 고려하여 너비 조정
              source={{ html: beach.description }}
              tagsStyles={tagsStyles}
            />
          </>
        )}
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
  image: {
    width: '100%',
    height: 250,
    marginBottom: 20,
    marginTop: 15,
    borderRadius: 10,

  },
  title: {
    fontSize: 26,
    marginBottom: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    marginTop: 24,
    marginBottom: 12,
    fontWeight: 'bold',
    color: '#555',
  },
  address: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
});

export default BeachDetail;
