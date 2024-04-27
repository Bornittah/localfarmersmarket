import React from 'react';
import {View, StyleSheet, Image, Dimensions} from 'react-native';

const SlideItem = ({item}) => {
  const {width, height} = Dimensions.get('screen');
  return (
    <View>
      <Image style={styles.image} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('screen'),
    height: Dimensions.get('screen'),
    padding: 10,
    marginHorizontal: 12,
  },
  image: {
    flex: 0.5,
    width: '100%',
  },
  content: {
    flex: 0.4,
  },
  image: {
    height: 100,
    width: 100,
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  description: {
    fontSize: 18,
    marginBottom: 5,
  },
  price: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 5,
  },
});
export default SlideItem;
