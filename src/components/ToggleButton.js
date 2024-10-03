// src/components/ToggleButton.js
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const ToggleButton = ({ onPress, title, active }) => {
  return (
    <TouchableOpacity
      style={[styles.button, active ? styles.activeButton : null]}
      onPress={onPress}
    >
      <Text style={[styles.buttonText, active ? styles.activeText : null]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#ffffff',
    padding: 10,
    marginRight: 10,
    borderRadius: 5,
    elevation: 2, // Android 그림자
    shadowColor: '#000', // iOS 그림자
    shadowOffset: { width: 0, height: 2 }, // iOS 그림자
    shadowOpacity: 0.3, // iOS 그림자
    shadowRadius: 2, // iOS 그림자
  },
  activeButton: {
    backgroundColor: '#007bff',
  },
  buttonText: {
    fontSize: 16,
    color: '#000',
  },
  activeText: {
    color: '#fff',
  },
});

export default ToggleButton;
