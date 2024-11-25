// src/components/LoadingScreen/LoadingScreen.js
import React, { useEffect } from 'react';
import { View, Image, StyleSheet, ActivityIndicator } from 'react-native';

const LoadingScreen = ({ navigation }) => {
  useEffect(() => {
    const loadResources = async () => {
      try {
        // Replace the following line with actual resource loading
        await new Promise((resolve) => setTimeout(resolve, 13000));

        // Navigate to Main after loading
        navigation.replace('Main');
      } catch (error) {
        console.error('Error loading resources:', error);
        // Optionally, navigate to an error screen or retry
      }
    };

    loadResources();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // Vertically centered
    alignItems: 'center', // Horizontally centered
    backgroundColor: '#ffffff', // Set a background color if desired
  },
  logo: {
    width: 200, // Adjust as needed
    height: 200, // Adjust as needed
    marginBottom: 20,
  },
  loader: {
    marginTop: 20,
  },
});

export default LoadingScreen;
