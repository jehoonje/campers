// src/components/CampingDetail/components/RatingDisplay.js
import React from 'react';
import { View, Text } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import PropTypes from 'prop-types';
import styles from '../styles';

const RatingDisplay = ({ averageRating }) => (
  <View style={styles.ratingContainer}>
    {Array.from({ length: 5 }, (_, index) => {
      const filled = index < Math.round(averageRating);
      return (
        <MaterialCommunityIcons
          key={index}
          name={filled ? 'star' : 'star-outline'}
          size={24}
          color={filled ? '#FFD700' : '#ccc'}
        />
      );
    })}
    <Text style={styles.averageRatingText}>
      {averageRating.toFixed(1)}
    </Text>
  </View>
);

RatingDisplay.propTypes = {
  averageRating: PropTypes.number.isRequired,
};

export default React.memo(RatingDisplay);
