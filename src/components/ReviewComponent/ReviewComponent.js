// src/components/ReviewComponent/ReviewComponent.js

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import axiosInstance from '../../utils/axiosInstance'; // 변경
import AsyncStorage from '@react-native-async-storage/async-storage';
import PropTypes from 'prop-types';

function ReviewComponent({ contentType, contentId }) {
  const [reviews, setReviews] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [newReviewContent, setNewReviewContent] = useState('');
  const [newRating, setNewRating] = useState(0);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await axiosInstance.get(
        `/reviews/${contentType}/${contentId}`
      );
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      Alert.alert('오류', '리뷰를 가져오는 중 오류가 발생했습니다.');
    }
  };

  const handleAddReview = async () => {
    const token = await AsyncStorage.getItem('accessToken');
    if (!token) {
      Alert.alert('로그인 필요', '리뷰를 작성하려면 로그인이 필요합니다.');
      return;
    }

    if (newRating === 0 || newReviewContent.trim() === '') {
      Alert.alert('오류', '별점과 리뷰 내용을 입력해주세요.');
      return;
    }

    try {
      const response = await axiosInstance.post(
        '/reviews',
        {
          contentType,
          contentId,
          content: newReviewContent,
          rating: newRating,
        }
        // Axios 인스턴스가 이미 헤더에 Authorization 포함
      );

      setReviews([...reviews, response.data]);
      setModalVisible(false);
      setNewReviewContent('');
      setNewRating(0);
    } catch (error) {
      console.error('Error adding review:', error);
      Alert.alert('오류', '리뷰를 작성하는 중 오류가 발생했습니다.');
    }
  };

  return (
    <View style={styles.container}>
      {/* 리뷰 추가 버튼 */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>Add Review</Text>
      </TouchableOpacity>

      {/* 리뷰 목록 */}
      <FlatList
        data={reviews}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.reviewItem}>
            <View style={styles.reviewHeader}>
              <Text style={styles.reviewAuthor}>{item.userName}</Text>
              {/* 별점 표시 */}
              <View style={styles.reviewRating}>
                {Array.from({ length: 5 }, (_, index) => {
                  const filled = index < item.rating;
                  return (
                    <MaterialCommunityIcons
                      key={index}
                      name={filled ? 'star' : 'star-outline'}
                      size={16}
                      color={filled ? '#FFD700' : '#ccc'}
                    />
                  );
                })}
              </View>
            </View>
            <Text style={styles.reviewContent}>{item.content}</Text>
          </View>
        )}
      />

      {/* 리뷰 작성 모달 */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Write a Review</Text>
            {/* 별점 선택 */}
            <View style={styles.ratingSelection}>
              {Array.from({ length: 5 }, (_, index) => {
                const filled = index < newRating;
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => setNewRating(index + 1)}
                  >
                    <MaterialCommunityIcons
                      name={filled ? 'star' : 'star-outline'}
                      size={32}
                      color={filled ? '#FFD700' : '#ccc'}
                    />
                  </TouchableOpacity>
                );
              })}
            </View>
            {/* 리뷰 내용 입력 */}
            <TextInput
              style={styles.textInput}
              multiline
              placeholder="Write your review..."
              value={newReviewContent}
              onChangeText={setNewReviewContent}
            />
            {/* 버튼들 */}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleAddReview}
              >
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

ReviewComponent.propTypes = {
  contentType: PropTypes.string.isRequired,
  contentId: PropTypes.number.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  addButton: {
    padding: 12,
    backgroundColor: '#545554',
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  reviewItem: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  reviewAuthor: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  reviewRating: {
    flexDirection: 'row',
  },
  reviewContent: {
    fontSize: 14,
    color: '#333',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
  },
  modalContent: {
    margin: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  ratingSelection: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
  },
  textInput: {
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  submitButton: {
    padding: 12,
    backgroundColor: '#1e90ff',
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  cancelButton: {
    padding: 12,
    backgroundColor: '#ccc',
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
  },
});

export default ReviewComponent;
