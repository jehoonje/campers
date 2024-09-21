// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import AppContent from './AppContent';
import LeftDrawerContent from './components/LeftDrawerContent';
import RightDrawerContent from './components/RightDrawerContent';

const Drawer = createDrawerNavigator();

const App = () => {
  return (
    <NavigationContainer>
      {/* 왼쪽 드로어를 위한 Drawer.Navigator */}
      <Drawer.Navigator
        initialRouteName="Main"
        screenOptions={{
          headerShown: false, // 헤더는 AppContent에서 관리
          drawerType: 'front', // 기본 드로어 타입
          drawerStyle: {
            marginTop: 60, // 헤더 높이만큼 여백 추가
            width: 250, // 드로어 너비 설정
          },
          overlayColor: 'transparent', // 드로어 오버레이 색상 설정
        }}
        drawerContent={(props) => <LeftDrawerContent {...props} />}
      >
        {/* 메인 컨텐츠와 오른쪽 드로어를 위한 스택 네비게이터 */}
        <Drawer.Screen name="Main" component={MainStack} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

// 오른쪽 드로어를 위한 별도의 Drawer.Navigator
const RightDrawer = createDrawerNavigator();

const MainStack = () => {
  return (
    <RightDrawer.Navigator
      initialRouteName="AppContent"
      screenOptions={{
        headerShown: false, // 헤더는 AppContent에서 관리
        drawerType: 'front',
        drawerPosition: 'right', // 오른쪽 드로어 설정
        drawerStyle: {
          marginTop: 60, // 헤더 높이만큼 여백 추가
          width: 250, // 드로어 너비 설정
        },
        overlayColor: 'transparent', // 드로어 오버레이 색상 설정
      }}
      drawerContent={(props) => <RightDrawerContent {...props} />}
    >
      <RightDrawer.Screen name="AppContent" component={AppContent} />
    </RightDrawer.Navigator>
  );
};

export default App;
