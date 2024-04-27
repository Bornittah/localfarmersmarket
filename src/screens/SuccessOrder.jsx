import React from 'react';
import {View, Button} from 'react-native';

const SuccessOrder = ({navigation}) => {
  const handleGetStarted = () => {
    navigation.navigate('Pending Orders');
  };
  return (
    <View>
      <Taxt>SuccessOrder</Taxt>
      <Button onPress={handleGetStarted()} title="Back to Orders" />
    </View>
  );
};

export default SuccessOrder;
