// src/hooks/useFavorite.js

import { useState, useEffect, useContext } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { AuthContext } from '../AuthContext'; // AuthContext 임포트 추가

const useFavorite = (markerType, markerId) => {
  const { userId } = useContext(AuthContext); // AuthContext에서 userId 가져오기
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);

  // 즐겨찾기 상태 확인
  useEffect(() => {
    const checkFavoriteStatus = async () => {

      if (!userId || !markerType || !markerId) {
        console.error('필수 값 누락: ', { userId, markerType, markerId });
        setLoading(false);
        return;
      }
      
      try {
        const response = await axiosInstance.get(`/favorites/status`, {
          params: { userId, markerType, markerId },
        });
        setIsFavorite(response.data.isFavorite);
      } catch (error) {
        console.error('Error checking favorite status:', error);
      } finally {
        setLoading(false);
      }
    };

    checkFavoriteStatus();
  }, [markerType, markerId, userId]);

  // 즐겨찾기 토글 함수
  const toggleFavorite = async () => {
    if (!userId) {
      alert('로그인이 필요합니다.');
      return;
    }

    setLoading(true);
    try {
      if (isFavorite) {
        // 즐겨찾기 삭제
        await axiosInstance.delete(`/favorites`, {
          data: { userId, markerType, markerId },
        });
        setIsFavorite(false);
      } else {
        // 즐겨찾기 추가
        await axiosInstance.post(`/favorites`, { userId, markerType, markerId });
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      alert('즐겨찾기 상태를 변경하는 데 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return { isFavorite, toggleFavorite, loading };
};

export default useFavorite;
