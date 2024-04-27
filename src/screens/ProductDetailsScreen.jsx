import React, {useState, useEffect} from 'react';
import {
  ScrollView,
  View,
  Text,
  Image,
  Button,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import database from '@react-native-firebase/database';
import storage from '@react-native-firebase/storage';
import {useRoute} from '@react-navigation/native';
import CustomHeader from '../components/CustomHeader';

const screenHeight = Dimensions.get('window').height;

const ProductDetailsScreen = () => {
  const route = useRoute();
  const [loading, setLoading] = useState(true);
  const [sellerContactInfo, setSellerContactInfo] = useState(null);

  if (!route.params) {
    console.error('No parameters received');
    return null; // or render a loading indicator or error message
  }

  const {item} = route.params;
  const userKey = item.userId;

  useEffect(() => {
    const fetchSellerContactInfo = async () => {
      try {
        const snapshot = await database()
          .ref(`users/${userKey}/contactInfo`)
          .once('value');
        const contactInfo = snapshot.val();
        setSellerContactInfo(contactInfo);
        console.log(sellerContactInfo);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching seller contact info:', error);
        setLoading(false);
      }
    };

    fetchSellerContactInfo();
  }, [userKey]);

  const addToCart = async () => {
    const data = {
      userId: userKey,
      name: item.name,
      unit: item.unit,
      quantity: item.quantity,
      price: item.price,
      image: item.image,
      category: item.category.label,
      description: item.description,
      address: item.address,
    };
    try {
      await database()
        .ref(`users/${userKey}/cart`)
        .push(data)
        .then(() => {
          Alert.alert('Success', 'Item Added to Cart');
          setItemName('');
          setUnit('');
          setQuantity('');
          setImage('');
          setPrice('');
          setCategory('');
          setDescription('');
          setAddress('');
        });
      console.log('Product Added To Cart');
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  return (
    <ScrollView>
      <CustomHeader title={item.name} />
      <View style={styles.container}>
        {sellerContactInfo && (
          <View py={3} justifyContent="space-between">
            <View>
              <Text style={styles.title}>
                Posted by: {sellerContactInfo.fullname}
              </Text>
              <Text>
                From: {sellerContactInfo.village}, {sellerContactInfo.parish},{' '}
                {sellerContactInfo.district}
              </Text>
            </View>
          </View>
        )}
      </View>
      {item.image && (
        <Image source={{uri: item.image}} style={styles.image} alt="product" />
      )}
      <Button title="Add to Cart" onPress={() => addToCart()} />
      <View style={styles.detailsContainer}>
        <View>
          <Text style={styles.title}>{item.name}</Text>
        </View>
        <Text style={styles.text}>Category: {item.category.label}</Text>
        <Text style={styles.price}>Price: {item.price}</Text>
        <Text style={styles.title}>Description:</Text>
        <Text style={styles.text}>{item.description}</Text>
        <Text style={styles.text}>Status: {item.status}</Text>
      </View>
      <View style={styles.buttonContainer}></View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  image: {
    width: Dimensions.get('screen').width,
    height: screenHeight * 0.4,
    resizeMode: 'cover',
  },
  detailsContainer: {
    paddingHorizontal: 20,
    height: screenHeight * 0.6,
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  text: {
    fontSize: 14,
    marginBottom: 10,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonContainer: {
    // marginTop: 20,
    position: 'absolute',
    flex: 0.1,
    left: 0,
    right: 0,
    bottom: -10,
    flexDirection: 'row',
    height: 80,
    width: Dimensions.get('window').width,
    alignItems: 'center',
  },
});

export default ProductDetailsScreen;
