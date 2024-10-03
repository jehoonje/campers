// src/App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack'; // Stack Navigator 추가
import AppContent from './AppContent';
import LeftDrawerContent from './components/LeftDrawerContent';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator(); // Stack Navigator 생성

const MainStack = () => (
  <Stack.Navigator>
    <Stack.Screen 
      name="AppContent" 
      component={AppContent} 
      options={{ headerShown: false }} // AppContent 내부에서 헤더를 관리
    />
    {/* 필요에 따라 다른 스크린을 추가할 수 있습니다 */}
  </Stack.Navigator>
);

const App = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName="Main"
        screenOptions={{
          headerShown: false, // 헤더는 AppContent에서 관리
          drawerType: 'front',
          drawerStyle: {
            marginTop: 60, // 헤더 높이에 맞춤
            width: 250,
          },
          overlayColor: 'transparent',
        }}
        drawerContent={(props) => <LeftDrawerContent {...props} />}
      >
        <Drawer.Screen name="Main" component={MainStack} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default App;
