import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60, // 상단 여백 추가
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
    backgroundColor: '#f5f5f5', // 반투명 배경
  },
  imageContainer: {
    width: '100%',
    height: 250, // 고정 높이
    marginTop: 15,
    marginBottom: 24,
    overflow: 'hidden',
    backgroundColor: '#999',
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
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  sectionTitle: {
    fontSize: 20,
    marginTop: 16,
    marginLeft: 10,
    marginBottom: 16,
    fontWeight: 'bold',
    color: '#555',
    paddingHorizontal: 10,
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
    backgroundColor: '#fff', // 스크롤 박스 배경색
    paddingHorizontal: 12,
    padding: 10,
    height: 120, // 고정 높이로 변경
    marginBottom: 16,
    position: 'relative', // 그라데이션과 스크롤바를 위치시키기 위해
  },
  programContent: {
    paddingBottom: 10,
    flexDirection: 'row',
    flexWrap: 'wrap', // 내용이 넘칠 경우 다음 줄로 이동
  },
  scrollbarContainer: {
    position: 'absolute',
    top: 10,
    right: 5,
    width: 4,
    height: '100%',
    backgroundColor: '#F4F7F8',
    borderRadius: 2,
    paddingRight: 10,
    marginRight: 6,
  },
  scrollbar: {
    width: 10,
    height: 20,
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
  },
  icon: {
    marginRight: 10,
    paddingHorizontal: 18,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderColor: 'transparent',
  },
  divider: {
    marginTop: 12,
    marginHorizontal: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  activeTabButton: {
    borderColor: '#333',
  },
  tabButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  activeTabButtonText: {
    color: '#333',
  },
  inactiveTabButtonText: {
    color: '#aaa',
  },
});

export default styles;