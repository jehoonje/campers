// src/components/RightDrawerContent.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const RightDrawerContent = () => {
  return (
    <View style={styles.drawerContainer}>
      <Text style={styles.drawerText}>오른쪽 드로어 내용</Text>
      {/* 추가적인 드로어 메뉴 항목 */}
    </View>
  );
};

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  drawerText: {
    fontSize: 16,
    marginVertical: 10,
  },
});

export default RightDrawerContent;
