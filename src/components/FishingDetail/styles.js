// src/components/FishingDetail/styles.js
import { StyleSheet, Dimensions } from 'react-native';
import sharedStyles from '../Shared/styles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 33, // 상단 여백 추가
    backgroundColor: '#f5f5f5', // 전체 배경색 설정
  },
  backButton: {
    position: 'absolute',
    top: 5,
    left: 16,
    zIndex: 1,
    padding: 8,
    backgroundColor: 'rgba(245, 245, 245, 0)', // 반투명 배경
    borderRadius: 20,
  },
  imageSlider: {
    marginTop: 15,
    height: 250,
    overflow: 'hidden',
    backgroundColor: '#dadada',
  },
  imageLoader: {
    position: 'absolute',
    zIndex: 1,
    alignSelf: 'center',
    top: '50%',
  },
  image: {
    width: Dimensions.get('window').width,
    height: 250,
  },
  divider: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  sectionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    marginLeft: 10,
    fontWeight: 'bold',
    color: '#555',
  },
  tagsStyles: {
    body: {
      whiteSpace: 'normal',
      color: '#666',
      fontSize: 16,
      lineHeight: 24,
    },
    p: {
      marginVertical: 8,
    },
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;
