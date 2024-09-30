import React, { useState } from 'react';
import { SafeAreaView, View, StyleSheet } from 'react-native';
import Header from './components/Header';
import RightDrawerContent from './components/RightDrawerContent';
import MainContent from './components/MainContent';

const AppContent = () => {
  const [isRightDrawerOpen, setIsRightDrawerOpen] = useState(false);

  // 오른쪽 드로어 열기/닫기 토글 함수
  const toggleRightDrawer = () => {
    setIsRightDrawerOpen(!isRightDrawerOpen);
  };

  // 오른쪽 드로어 닫기 함수
  const closeRightDrawer = () => {
    if (isRightDrawerOpen) {
      setIsRightDrawerOpen(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      {/* 헤더: 오른쪽 드로어 닫기 기능을 포함하여 전달 */}
      <Header toggleRightDrawer={toggleRightDrawer} closeRightDrawer={closeRightDrawer} />

      {/* 메인 콘텐츠 */}
      <View style={{ flex: 1 }}>
        <MainContent />
      </View>

      {/* 오른쪽 드로어 */}
      <RightDrawerContent isOpen={isRightDrawerOpen} onClose={toggleRightDrawer} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default AppContent;
