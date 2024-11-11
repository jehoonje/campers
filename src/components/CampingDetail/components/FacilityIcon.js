// src/components/CampingDetail/components/FacilityIcon.js
import React from 'react';
import { View, Text } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import PropTypes from 'prop-types';
import styles from '../styles';

const FacilityIcon = ({ iconName, label }) => (
  <View style={styles.facilityItem}>
    <MaterialCommunityIcons
      name={iconName}
      size={32}
      color="#555"
      accessible={true}
      accessibilityLabel={label}
    />
    <Text style={styles.facilityText}>{label}</Text>
  </View>
);

FacilityIcon.propTypes = {
  iconName: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};

export default React.memo(FacilityIcon);
