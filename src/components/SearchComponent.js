// src/components/SearchComponent.js
import React, {useState, useEffect} from 'react';
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
} from 'react-native';
import axiosInstance from '../utils/axiosInstance'; // axiosInstance 사용

const SearchComponent = ({navigation}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.trim()) {
        fetchResults(query);
      } else {
        setResults([]);
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const fetchResults = async searchTerm => {
    try {
      const response = await axiosInstance.get(
        `/search?query=${encodeURIComponent(searchTerm)}`,
      );
      setResults(response.data);
    } catch (error) {
      console.error(error);
      Alert.alert('오류', '검색 결과를 불러오는 데 실패했습니다.');
    }
  };

  const goToDetail = async item => {
    let detailUrl = '';
    let paramName = '';
    let navigateScreen = '';
    let itemId = '';

    // 아이템의 고유 ID 필드 확인 (예: 'id' 또는 'contentId')
    // 여기서는 'id'와 'contentId' 필드를 사용
    if (item.id) {
      itemId = item.id;
    } else if (item.contentId) {
      itemId = item.contentId;
    } else {
      console.error('아이템에 고유 ID가 없습니다:', item);
      Alert.alert('오류', '선택한 항목에 고유 ID가 없습니다.');
      return;
    }

    switch (item.type) {
      case 'campground':
        detailUrl = `/campgrounds/${itemId}`; // ID 포함
        paramName = 'campground';
        navigateScreen = 'CampingDetail';
        break;
      case 'autocamp':
        detailUrl = `/autocamps/${itemId}`; // contentId 포함
        paramName = 'autocamp';
        navigateScreen = 'AutoCampDetail';
        break;
      case 'fishing':
        detailUrl = `/fishings/${itemId}`; // contentId 포함
        paramName = 'fishing';
        navigateScreen = 'FishingDetail';
        break;
      case 'beach':
        detailUrl = `/beaches/${itemId}`; // contentId 포함
        paramName = 'beach';
        navigateScreen = 'BeachDetail';
        break;
      case 'campsite':
        detailUrl = `/campsites/${itemId}`; // contentId 포함
        paramName = 'campsite';
        navigateScreen = 'CampsiteDetail';
        break;
      default:
        console.error('Unknown type:', item.type);
        Alert.alert('오류', '알 수 없는 항목 유형입니다.');
        return;
    }

    try {
      const detailResponse = await axiosInstance.get(detailUrl);
      const fullData = detailResponse.data;

      if (!fullData) {
        Alert.alert('오류', '상세 정보를 불러오는 데 실패했습니다.');
        return;
      }

      navigation.navigate(navigateScreen, {[paramName]: fullData});
    } catch (error) {
      console.error('세부정보 불러오기 오류:', error);
      Alert.alert('오류', '상세 정보를 불러오는 데 실패했습니다.');
    }
  };

  const renderItem = ({item}) => (
    <TouchableOpacity
      onPress={() => goToDetail(item)}
      style={styles.resultItem}>
      <Text style={styles.resultText}>{item.title}</Text>
      <Text style={styles.addrText}>{item.addr}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.searchContainer}>
      <TextInput
        style={styles.searchInput}
        placeholder="검색어를 입력하세요..."
        value={query}
        onChangeText={setQuery}
      />
      {results.length > 0 && (
        <FlatList
          style={styles.resultList}
          data={results}
          keyExtractor={item =>
            item.contentId?.toString() || item.id?.toString()
          }
          renderItem={renderItem}
          keyboardShouldPersistTaps="handled"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    backgroundColor: '#fff',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  searchInput: {
    height: 50,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 10,
  },
  resultItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  resultText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  addrText: {
    fontSize: 14,
    color: '#555',
  },
  resultList: {
    maxHeight: 350, // UI 요구 사항에 따라 이 값을 조정하세요
  },
});

export default SearchComponent;
