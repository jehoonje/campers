import React from 'react';
import {Text} from 'react-native';
import MapScreen from './MapScreen';

const MainContent = ({ showRestStops }) => { // showRestStops를 받도록 수정
  return (
    <>
      <MapScreen showRestStops={showRestStops} />
      <Text>Main content goes here.</Text>
    </>
  );
};

export default MainContent;
