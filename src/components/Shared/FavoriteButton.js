// src/components/Shared/FavoriteButton.js

import React from 'react';
import { TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import PropTypes from 'prop-types';

const FavoriteButton = ({ isFavorite, toggleFavorite, loading }) => {
  return (
    <TouchableOpacity
      onPress={toggleFavorite}
      style={styles.favoriteButton}
      accessible={true}
      accessibilityLabel={isFavorite ? "즐겨찾기 삭제" : "즐겨찾기 추가"}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#333" />
      ) : (
        <Ionicons
          name={isFavorite ? "star" : "star-outline"}
          size={24}
          color={isFavorite ? "#FFD700" : "#333"}
        />
      )}
    </TouchableOpacity>
  );
};

FavoriteButton.propTypes = {
  isFavorite: PropTypes.bool.isRequired,
  toggleFavorite: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

const styles = StyleSheet.create({
  favoriteButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
    padding: 8,
    backgroundColor: 'rgba(245, 245, 245, 0)', // 반투명 배경
    borderRadius: 20,
  },
});

export default FavoriteButton;
