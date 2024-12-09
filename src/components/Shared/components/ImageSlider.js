// src/components/Shared/components/ImageSlider.js
import React from 'react';
import { View, Image, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';

const localStyles = StyleSheet.create({
  imageSlider: {
    marginBottom: 20,
    height: 250,
    overflow: 'hidden',
    backgroundColor: '#e0f7fa',
  },
  imageLoader: {
    position: 'absolute',
    zIndex: 1,
    alignSelf: 'center',
    top: '50%',
  },
  image: {
    width: Dimensions.get('window').width,
    height: 250,
  },
});

const ImageSlider = ({ images, imageLoading, setImageLoading, defaultImage }) => (
  <View style={localStyles.imageSlider}>
    {imageLoading && (
      <ActivityIndicator
        size="large"
        color="#1e90ff"
        style={localStyles.imageLoader}
      />
    )}
    <ScrollView
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}>
      {images.map((imageUri, index) => (
        <Image
          key={index}
          source={imageUri ? { uri: imageUri } : defaultImage}
          style={localStyles.image}
          resizeMode="cover"
          onLoadEnd={() => setImageLoading(false)}
          onError={() => setImageLoading(false)}
        />
      ))}
    </ScrollView>
  </View>
);

ImageSlider.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
  imageLoading: PropTypes.bool.isRequired,
  setImageLoading: PropTypes.func.isRequired,
  defaultImage: PropTypes.any.isRequired,
};

export default React.memo(ImageSlider);
