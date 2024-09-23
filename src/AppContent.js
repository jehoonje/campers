import React from 'react';
import { View, SafeAreaView } from 'react-native';
import Header from './components/Header';
import MainContent from './components/MainContent';
import styles from './styles/AppContentStyles';

const AppContent = () => {
  return (
    <SafeAreaView style={styles.safeContainer}>
      <Header />
      <View style={styles.container}>
        <MainContent />
      </View>
    </SafeAreaView>
  );
};

export default AppContent;
