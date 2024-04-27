import React from 'react';
import SlideItem from './SlideItem';
import {View} from 'react-native';

const ImageSlider = ({items}) => {
  return (
    <View>
      {items.map((item, index) => (
        <SlideItem item={item} key={index} />
      ))}
    </View>
  );
};

export default ImageSlider;
