import React from 'react';
import { View } from 'react-native';
import Spinner from 'react-native-spinkit';

const LoadingIndicator = () => (
  <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
    <Spinner
      isVisible={true}
      size={small}
      type="WanderingCubes" // 사각형 형태의 스피너 타입
      color="#184035"
    />
  </View>
);

export default LoadingIndicator;
