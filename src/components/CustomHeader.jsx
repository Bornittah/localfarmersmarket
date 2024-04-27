import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import {Header, Text} from '@rneui/themed';
import {useNavigation} from '@react-navigation/native';

const CustomHeader = ({title}) => {
  const navigation = useNavigation();
  return (
    <View>
      <Header
        leftComponent={
          <Text style={{fontSize: 16, color: 'white', width: 400}}>
            {title}
          </Text>
        }
        rightComponent={
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Cart');
            }}>
            <Text>Cart</Text>
          </TouchableOpacity>
        }
      />
    </View>
  );
};

export default CustomHeader;
