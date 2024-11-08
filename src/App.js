// src/App.js
import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createStackNavigator} from '@react-navigation/stack';
import { TransitionSpecs, CardStyleInterpolators } from '@react-navigation/stack';
import AppContent from './AppContent';
import RNBootSplash from 'react-native-bootsplash';
import LeftDrawerContent from './components/LeftDrawerContent';
import CampingDetail from './components/CampingDetail/CampingDetail'; // CampingDetail 컴포넌트 임포트
import CountryDetail from './components/CountryDetail/CountryDetail';
import AutoCampDetail from './components/AutoCampDetail/AutoCampDetail';
import CampsiteDetail from './components/CampsiteDetail/CampsiteDetail';
import FishingDetail from './components/FishingDetail/FishingDetail';
import BeachDetail from './components/BeachDetail/BeachDetail';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const MainStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="AppContent"
      component={AppContent}
      options={{headerShown: false}} // AppContent 내부에서 헤더를 관리
    />
    <Stack.Screen
      name="CampingDetail"
      component={CampingDetail}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="CountryDetail"
      component={CountryDetail}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="BeachDetail"
      component={BeachDetail}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="FishingDetail"
      component={FishingDetail}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="AutoCampDetail"
      component={AutoCampDetail}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="CampsiteDetail"
      component={CampsiteDetail}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="LoginScreen"
      component={LoginScreen}
      options={{
        headerShown: false,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        transitionSpec: {
          open: TransitionSpecs.TransitionIOSSpec,
          close: TransitionSpecs.TransitionIOSSpec,
        },
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    />
    <Stack.Screen
      name="SignupScreen"
      component={SignupScreen}
      options={{headerShown: false}}
    />
  </Stack.Navigator>
);

const App = () => {
  useEffect(() => {
    // 초기 설정 또는 데이터 로딩 후 스플래시 스크린 숨기기
    RNBootSplash.hide({fade: true});
  }, []);

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
        drawerContent={props => <LeftDrawerContent {...props} />}>
        <Drawer.Screen name="Main" component={MainStack} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default App;
