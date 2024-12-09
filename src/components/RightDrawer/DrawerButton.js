// src/components/RightDrawer/DrawerButton.js
import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Fontisto from 'react-native-vector-icons/Fontisto';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import CustomText from '../CustomText';

const DrawerButton = ({ name, icon, lib, onPress }) => {
  const renderIcon = () => {
    switch (lib) {
      case 'FontAwesome':
        return <Icon name={icon} size={20} color="#333" />;
      case 'Fontisto':
        return <Fontisto name={icon} size={20} color="#333" />;
      case 'FontAwesome5':
        return <FontAwesome5 name={icon} size={20} color="#333" />;
      default:
        return null;
    }
  };

  return (
    <TouchableOpacity 
      style={styles.button} 
      onPress={onPress} 
      accessibilityRole="button" 
      accessibilityLabel={name}
      activeOpacity={0.7} // 버튼 눌림 시 투명도 변경
    >
      <View style={styles.iconContainer}>{renderIcon()}</View>
      <CustomText style={styles.buttonText}>{name}</CustomText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: '#F5F7F8',
    justifyContent: 'flex-start',
    borderBottomWidth:0.2,
    borderBottomColor:'#c5c5c5',
    // marginBottom: 10, // 각 버튼 사이 간격 추가
  },
  iconContainer: {
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color:'#070324',
    marginLeft: 10,
  },
});

export default DrawerButton;
