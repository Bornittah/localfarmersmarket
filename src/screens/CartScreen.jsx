import React, {useEffect, useState} from 'react';
import {Alert, View} from 'react-native';
import {Button, Text} from '@rneui/base';
import {useNavigation} from '@react-navigation/native';
import database from '@react-native-firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomHeader from '../components/CustomHeader';

const CartScreen = () => {
  const navigation = useNavigation();

  const [userKey, setUserKey] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const retrieveUserKey = async () => {
      try {
        const key = await AsyncStorage.getItem('userKey');
        if (key !== null) {
          setUserKey(key);
        } else {
          console.warn('User key not found in AsyncStorage');
        }
      } catch (error) {
        console.error('Error retrieving user key from AsyncStorage:', error);
      }
    };

    retrieveUserKey();
  }, []);

  const retrieveProducts = async () => {
    try {
      if (!userKey) {
        console.warn('User key not available');
        return;
      }
      const snapshot = await database()
        .ref(`users/${userKey}/cart`)
        .once('value');
      const productsData = snapshot.val();
      if (productsData) {
        const productsList = Object.values(productsData);
        setProducts(productsList);
      }
    } catch (error) {
      console.error('Error retrieving products:', error);
    }
  };

  useEffect(() => {
    retrieveProducts();
  }, [userKey]);

  const handleDelete = async product => {
    try {
      if (!userKey) {
        console.warn('User key not available');
        return;
      }
      await database().ref(`users/${userKey}/cart/${product.key}`).remove();
      retrieveProducts();
      Alert.alert('Success', 'Product Deleted Successfully.');
    } catch (error) {
      Alert.alert('Error', 'Error deleting product: ' + error.message);
    }
  };

  const handleCheckout = () => {
    navigation.navigate('PendingOrders');
  };

  return (
    <View>
      <CustomHeader title="My Cart" />
      <Text>Cart Products</Text>
      <View space={2} alignItems="stretch">
        {products.map((item, index) => (
          <View
            key={index}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 10,
              borderBottomWidth: 1,
              borderBottomColor: '#ccc',
            }}>
            <Text style={{marginRight: 10}}>{index + 1}</Text>
            <Text style={{flex: 1}}>{item.name}</Text>
            <Text style={{marginRight: 10}}>{item.price}</Text>
            <View space={2}>
              <Button
                onPress={() => handleDelete(item)}
                variant="outline"
                size="sm"
                colorScheme="danger">
                Delete
              </Button>
            </View>
          </View>
        ))}
      </View>
      <Button title="Proceed to Check Out" onPress={handleCheckout} />
    </View>
  );
};

export default CartScreen;
