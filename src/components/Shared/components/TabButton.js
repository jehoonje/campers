// src/components/Shared/components/TabButton.js
import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import PropTypes from 'prop-types';
import styles from '../styles';

const TabButton = ({ title, active, onPress }) => (
  <TouchableOpacity
    style={[
      styles.tabButton,
      active && styles.activeTabButton,
    ]}
    onPress={onPress}
  >
    <Text
      style={[
        styles.tabButtonText,
        active
          ? styles.activeTabButtonText
          : styles.inactiveTabButtonText,
      ]}
    >
      {title}
    </Text>
  </TouchableOpacity>
);

TabButton.propTypes = {
  title: PropTypes.string.isRequired,
  active: PropTypes.bool.isRequired,
  onPress: PropTypes.func.isRequired,
};

export default React.memo(TabButton);
