// src/components/ReviewComponent/ReviewComponent.js

import React, {useState, useEffect, useContext} from 'react';
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
import {AuthContext} from '../../AuthContext';
import {useFocusEffect} from '@react-navigation/native';
import Spinner from 'react-native-spinkit';

function ReviewComponent({contentType, contentId, onReviewAdded}) {
  const [reviews, setReviews] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [newReviewContent, setNewReviewContent] = useState('');
  const {userId, userName, isLoggedIn, roles} = useContext(AuthContext);
  const [newRating, setNewRating] = useState(0);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      fetchReviews();
    }, [userId])
  );

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(
        `/reviews/${contentType}/${contentId}`
      );
      setReviews(response.data);

      if (userId) {
        const userReview = response.data.find(
          review => review.userId === userId,
        );
        setHasReviewed(!!userReview);
      } else {
        setHasReviewed(false);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      Alert.alert('오류', '리뷰를 가져오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
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
        userName: userName,
      });
      setReviews([...reviews, response.data]);
      setModalVisible(false);
      setNewReviewContent('');
      setNewRating(0);
      setHasReviewed(true);

      if (onReviewAdded && typeof onReviewAdded === 'function') {
        onReviewAdded();
      }
    } catch (error) {
      console.error('Error adding review:', error);
      if (error.response && error.response.status === 400) {
        Alert.alert('오류', '이미 이 컨텐츠에 리뷰를 작성하셨습니다.');
      } else {
        Alert.alert('오류', '리뷰를 작성하는 중 오류가 발생했습니다.');
      }
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await axiosInstance.delete(`/reviews/${reviewId}`);
      // 삭제 성공 시, 상태 업데이트
      setReviews(prevReviews => prevReviews.filter(r => r.id !== reviewId));
      // 본인이 작성한 리뷰를 지웠다면 hasReviewed도 갱신
      if (hasReviewed) {
        setHasReviewed(false);
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      Alert.alert('오류', '리뷰를 삭제하는 중 오류가 발생했습니다.');
    }
  };

  const isAdmin = roles && roles.includes('ROLE_ADMIN');

  return (
    <View style={styles.container}>
      {isLoading ? (
        <Spinner
          isVisible={true}
          size={50}
          type="WanderingCubes"
          color="#184035"
          style={styles.loading}
        />
      ) : (
        <>
          <TouchableOpacity
            style={[
              styles.addButton,
              (hasReviewed || !isLoggedIn) && styles.disabledButton,
            ]}
            onPress={() => {
              if (!isLoggedIn) {
                Alert.alert(
                  '로그인 필요',
                  '리뷰를 작성하려면 로그인이 필요합니다.',
                );
              } else if (hasReviewed) {
                Alert.alert('알림', '이미 이 컨텐츠에 리뷰를 작성하셨습니다.');
              } else {
                setModalVisible(true);
              }
            }}
            disabled={hasReviewed || !isLoggedIn}>
            <Text style={styles.addButtonText}>Reply</Text>
          </TouchableOpacity>
          {reviews.length === 0 ? (
            <Text style={styles.noReviewsText}>No reviews</Text>
          ) : (
            <FlatList
              data={reviews}
              keyExtractor={item => item.id.toString()}
              renderItem={({item}) => {
                const canDelete = (item.userId === userId) || isAdmin;
                return (
                  <View style={styles.reviewItem}>
                    <View style={styles.reviewHeader}>
                      <Text style={styles.reviewAuthor}>{item.userName}</Text>
                      <View style={styles.reviewRating}>
                        {Array.from({length: 5}, (_, index) => {
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
                    {canDelete && (
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => handleDeleteReview(item.id)}>
                        <Text style={styles.deleteButtonText}>삭제</Text>
                      </TouchableOpacity>
                    )}
                    
                  </View>
                );
              }}
            />
          )}

          <Modal
            visible={isModalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setModalVisible(false)}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <View style={styles.ratingSelection}>
                  {Array.from({length: 5}, (_, index) => {
                    const filled = index < newRating;
                    return (
                      <TouchableOpacity
                        key={index}
                        onPress={() => setNewRating(index + 1)}>
                        <MaterialCommunityIcons
                          name={filled ? 'star' : 'star-outline'}
                          size={32}
                          color={filled ? '#FFD700' : '#ccc'}
                        />
                      </TouchableOpacity>
                    );
                  })}
                </View>
                <TextInput
                  style={styles.textInput}
                  multiline
                  placeholder="내용을 작성해주세요."
                  value={newReviewContent}
                  onChangeText={setNewReviewContent}
                />
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleAddReview}>
                    <Text style={styles.submitButtonText}>작성</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => setModalVisible(false)}>
                    <Text style={styles.cancelButtonText}>취소</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </>
      )}
    </View>
  );
}

ReviewComponent.propTypes = {
  contentType: PropTypes.string.isRequired,
  contentId: PropTypes.number.isRequired,
  onReviewAdded: PropTypes.func,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loading: {
    alignSelf: 'center',
    marginTop: '25%',
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
  deleteButton: {
    marginBottom: 8,
    alignSelf: 'flex-end',
  },
  deleteButtonText: {
    fontSize: 16,
    color: 'red', // 원하는 색상
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
    backgroundColor: '#333',
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
