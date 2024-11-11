// src/components/CampingDetail/components/InfoRow.js
import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import PropTypes from 'prop-types';
import styles from '../styles';

const InfoRow = ({ iconName, text, onPress }) => (
  <TouchableOpacity
    style={styles.infoRow}
    onPress={onPress}
    disabled={!onPress}
    accessible={true}
    accessibilityLabel={text}
  >
    <Ionicons name={iconName} size={24} color="#555" style={styles.icon} />
    <Text style={[styles.infoText, onPress && styles.link]}>{text}</Text>
  </TouchableOpacity>
);

InfoRow.propTypes = {
  iconName: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  onPress: PropTypes.func,
};

export default React.memo(InfoRow);
