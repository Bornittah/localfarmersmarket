import React, {useEffect, useState} from 'react';
import {Alert, View, ScrollView} from 'react-native';
import {Text, Button, Image} from '@rneui/base';
import database from '@react-native-firebase/database';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MyProducts = () => {
  const navigation = useNavigation();

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [userKey, setUserKey] = useState(null);

  const retrieveUserKey = async () => {
    try {
      const userKey = await AsyncStorage.getItem('userKey');
      setUserKey(userKey);
    } catch (error) {
      console.error('Error retrieving user key:', error);
    }
  };

  const retrieveProducts = async () => {
    try {
      const snapshot = await database()
        .ref(`users/${userKey}/products`)
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
    retrieveUserKey();
  }, []);

  useEffect(() => {
    if (userKey) {
      retrieveProducts();
    }
  }, [userKey]);

  const handleDelete = async product => {
    try {
      await database().ref(`users/${userKey}/products/${product.key}`).remove();
      retrieveProducts();
      Alert.alert('Success', 'Product Deleted Successfully.');
    } catch (error) {
      Alert.alert('Error', 'Error deleting product: ' + error.message);
      console.log(error.message);
    }
  };

  return (
    <ScrollView>
      <Text>MyProducts</Text>
      <View px={4} py={3} justifyContent="space-between" bg="white">
        <Text>My Products</Text>
        <Button
          onPress={() => {
            navigation.navigate('UploadProduct');
          }}
          bg="green.700">
          Upload Product
        </Button>
      </View>
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
            <Image
              source={{uri: item.image}}
              style={{width: 50, height: 50, marginRight: 10}}
              alt="item"
            />
            <Text style={{flex: 1}}>{item.name}</Text>
            <Text style={{marginRight: 10}}>{item.price}</Text>
            <View space={2}>
              <Button
                onPress={() => {
                  navigation.navigate('Product Detail', {item});
                }}
                variant="outline"
                size="sm"
                colorScheme="primary">
                View
              </Button>
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
    </ScrollView>
  );
};

export default MyProducts;
