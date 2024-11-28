// src/App.js
import React, { useEffect, useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import AppContent from './AppContent';
import { AuthProvider, AuthContext } from './AuthContext';
import RNBootSplash from 'react-native-bootsplash';
import LeftDrawerContent from './components/LeftDrawerContent';
import CampingDetail from './components/CampingDetail/CampingDetail';
import CountryDetail from './components/CountryDetail/CountryDetail';
import AutoCampDetail from './components/AutoCampDetail/AutoCampDetail';
import CampsiteDetail from './components/CampsiteDetail/CampsiteDetail';
import FishingDetail from './components/FishingDetail/FishingDetail';
import BeachDetail from './components/BeachDetail/BeachDetail';
import LoginScreen from './screens/LoginScreen';
import MyProfile from './components/MyPage/MyProfile';
import EditProfile from './components/MyPage/EditProfile';
import SignupScreen from './screens/SignupScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const MainStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="AppContent"
      component={AppContent}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="CampingDetail"
      component={CampingDetail}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="CountryDetail"
      component={CountryDetail}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="BeachDetail"
      component={BeachDetail}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="FishingDetail"
      component={FishingDetail}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="AutoCampDetail"
      component={AutoCampDetail}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="CampsiteDetail"
      component={CampsiteDetail}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="LoginScreen"
      component={LoginScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="SignupScreen"
      component={SignupScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="MyProfile" // MyProfile 추가
      component={MyProfile}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="EditProfile" // MyProfile 추가
      component={EditProfile}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

const App = () => {
  return (
    <AuthProvider>
      <AppContainer />
    </AuthProvider>
  );
};

const AppContainer = () => {
  const { checkAuthStatus } = useContext(AuthContext);
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    checkAuthStatus(); // 앱 시작 시 로그인 상태 확인
  }, []);
  

  // useEffect(() => {
  //   RNBootSplash.hide({ fade: true });
  // }, []);

  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName="Main"
        screenOptions={{
          headerShown: false,
          drawerType: 'front',
          drawerStyle: {
            marginTop: 50,
            width: 250,
          },
          overlayColor: 'transparent',
        }}
        drawerContent={props => <LeftDrawerContent {...props} />}
      >
        <Drawer.Screen name="Main" component={MainStack} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default App;
