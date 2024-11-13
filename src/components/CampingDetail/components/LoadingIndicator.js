// src/components/CampingDetail/components/LoadingIndicator.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#0000ff',
  },
});

const LoadingIndicator = () => (
  <View style={styles.loadingContainer}>
    <MaterialCommunityIcons name="loading" size={48} color="#0000ff" />
    <Text style={styles.loadingText}>Loading...</Text>
  </View>
);

export default React.memo(LoadingIndicator);
