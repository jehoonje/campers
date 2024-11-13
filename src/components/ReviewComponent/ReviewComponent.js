// src/components/ReviewComponent/ReviewComponent.js

import React, { useState, useEffect, useContext } from 'react';
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
import axiosInstance from '../../utils/axiosInstance';
import PropTypes from 'prop-types';
import { AuthContext } from '../../AuthContext';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';

function ReviewComponent({ contentType, contentId }) {
  const [reviews, setReviews] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [newReviewContent, setNewReviewContent] = useState('');
  const { userId, isLoggedIn } = useContext(AuthContext); // `isLoggedIn` 사용
  const [newRating, setNewRating] = useState(0);
  const [hasReviewed, setHasReviewed] = useState(false);
  

  useFocusEffect(
    React.useCallback(() => {
      fetchReviews();
    }, [userId])
  );

  // // 로그인 상태 변화 또는 화면 포커스 변화 시 상태 업데이트
  // useEffect(() => {
  //   const unsubscribe = navigation.addListener('focus', () => {
  //     fetchReviews();
  //   });

  //   return unsubscribe;
  // }, [navigation, userId]);

  const fetchReviews = async () => {
    try {
      console.log('Current userId:', userId);
      const response = await axiosInstance.get(
        `/reviews/${contentType}/${contentId}`
      );
      setReviews(response.data);

      if (userId) {
        const userReview = response.data.find(
          (review) => review.userId === userId
        );
        setHasReviewed(!!userReview);
      } else {
        setHasReviewed(false);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      Alert.alert('오류', '리뷰를 가져오는 중 오류가 발생했습니다.');
    }
  };


  const handleAddReview = async () => {
    if (!isLoggedIn) {
      Alert.alert('로그인 필요', '리뷰를 작성하려면 로그인이 필요합니다.');
      return;
    }

    if (hasReviewed) {
      Alert.alert('알림', '이미 이 컨텐츠에 리뷰를 작성하셨습니다.');
      return;
    }

    if (newRating === 0 || newReviewContent.trim() === '') {
      Alert.alert('오류', '별점과 리뷰 내용을 입력해주세요.');
      return;
    }

    try {
      const response = await axiosInstance.post('/reviews', {
        contentType,
        contentId,
        content: newReviewContent,
        rating: newRating,
      });

      setReviews([...reviews, response.data]);
      setModalVisible(false);
      setNewReviewContent('');
      setNewRating(0);
      setHasReviewed(true); // 작성 완료 후 다시 작성 못하도록
    } catch (error) {
      console.error('Error adding review:', error);
      if (error.response && error.response.status === 400) {
        Alert.alert('오류', '이미 이 컨텐츠에 리뷰를 작성하셨습니다.');
      } else {
        Alert.alert('오류', '리뷰를 작성하는 중 오류가 발생했습니다.');
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* 리뷰 추가 버튼 */}
      <TouchableOpacity
        style={[styles.addButton, (hasReviewed || !isLoggedIn) && styles.disabledButton]}
        onPress={() => {
          if (!isLoggedIn) {
            Alert.alert('로그인 필요', '리뷰를 작성하려면 로그인이 필요합니다.');
          } else if (hasReviewed) {
            Alert.alert('알림', '이미 이 컨텐츠에 리뷰를 작성하셨습니다.');
          } else {
            setModalVisible(true);
          }
        }}
        disabled={hasReviewed || !isLoggedIn}
      >
        <Text style={styles.addButtonText}>Add Review</Text>
      </TouchableOpacity>

      {/* 리뷰 목록 */}
      {reviews.length === 0 ? (
        <Text style={styles.noReviewsText}>No reviews</Text>
      ) : (
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
      )}

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
  disabledButton: {
    backgroundColor: '#ccc',
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
  noReviewsText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 20,
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
