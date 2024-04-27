import React, {useRef, useState, useEffect} from 'react';
import {
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from 'react-native';
import {ListItem, Button} from '@rneui/base';
import database from '@react-native-firebase/database'; // Import Firebase Realtime Database
import CustomHeader from '../components/CustomHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/EvilIcons';
// Sample data for the sections
const sliderImages = [
  {url: require('../images/slider1.jpg')},
  {url: require('../images/slider2.jpg')},
  {url: require('../images/slider3.jpg')},
  {url: require('../images/slider4.jpg')},
];

const healthTipsVideos = [
  {title: 'Health Tip 1', thumbnail: require('../images/slider1.jpg')},
  {title: 'Health Tip 2', thumbnail: require('../images/slider2.jpg')},
];

const screenWidth = Dimensions.get('window').width;

const HomeScreen = ({navigation}) => {
  const scrollViewRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [latestProducts, setLatestProducts] = useState({});
  const [userKey, setUserKey] = useState(null);

  const retrieveUserKey = async () => {
    try {
      const userKey = await AsyncStorage.getItem('userKey');
      setUserKey(userKey);
    } catch (error) {
      console.error('Error retrieving user key:', error);
    }
  };

  useEffect(() => {
    fetchAllProducts();
    fetchCategories();
    retrieveUserKey();
  }, []);

  const handleScroll = event => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / screenWidth);
    setActiveIndex(index);
  };

  const handlePaginationPress = index => {
    scrollViewRef.current.scrollTo({x: index * screenWidth, animated: true});
  };

  const fetchAllProducts = async () => {
    try {
      const snapshot = await database().ref('users').once('value');
      const users = snapshot.val();
      let allProducts = [];
      for (const userKey in users) {
        const productsSnapshot = await database()
          .ref(`users/${userKey}/products`)
          .once('value');
        const products = productsSnapshot.val();
        if (products) {
          const userProducts = Object.values(products);
          allProducts = allProducts.concat(userProducts);
        }
      }
      setProducts(allProducts);
      console.log(allProducts);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const addToCart = async item => {
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
        });
      console.log('Product Added To Cart');
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const contactRef = await database().ref(`categories`);
      contactRef.once('value', snapshot => {
        const data = snapshot.val();
        if (data) {
          setCategories(data);
          setLoading(false);
        }
      });
    } catch (error) {
      console.error('Error fetching categories:', error);
      setLoading(false);
    }
  };

  return (
    <View>
      <CustomHeader title="Local Farmers Market Directory" />

      <ScrollView>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          ref={scrollViewRef}
          onScroll={handleScroll}
          scrollEventThrottle={16}>
          {sliderImages.map((image, index) => (
            <Image
              key={index}
              source={image.url}
              style={{width: screenWidth, height: 200}}
            />
          ))}
        </ScrollView>

        {/* Pagination */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 10,
          }}>
          {sliderImages.map((image, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handlePaginationPress(index)}>
              <Text style={{fontSize: 14, marginRight: 10}}>-</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Featured Products Section */}
        <View style={{marginTop: 20, paddingHorizontal: 10}}>
          <TouchableOpacity style={styles.categoryHeading}>
            <Text style={styles.categoryTitle}>Featured Products</Text>
            <Text style={styles.categoryTitle}>
              {/* <Icon2 type="EvilIcons" name="navicon" /> */}
              See All
            </Text>
          </TouchableOpacity>
          {products.slice(0, 3).map((item, index) => (
            <ListItem key={index} bottomDivider>
              {item.image && (
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('MainProductDetails', {item});
                  }}>
                  <Image
                    source={{uri: item.image}}
                    style={{width: 50, height: 50, marginRight: 10}}
                  />
                </TouchableOpacity>
              )}
              <ListItem.Content>
                <ListItem.Title>{item.name}</ListItem.Title>
                <ListItem.Subtitle>{item.price}</ListItem.Subtitle>
              </ListItem.Content>
              <Button onPress={() => addToCart(item)} title=" Add To Cart" />
            </ListItem>
          ))}
        </View>

        {/* Health Tips Section */}
        <View style={{marginTop: 20, paddingHorizontal: 10}}>
          <TouchableOpacity style={styles.categoryHeading}>
            <Text style={styles.categoryTitle}>Health Tips</Text>
            <Text style={styles.categoryTitle}>
              {/* <Icon name="chart" /> */}
              See All
            </Text>
          </TouchableOpacity>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 10,
            }}>
            {healthTipsVideos.map((video, index) => (
              <View key={index} style={{width: '48%'}}>
                <Text>{video.title}</Text>
                <Image
                  source={video.thumbnail}
                  style={{width: '100%', height: 150, marginTop: 5}}
                />
              </View>
            ))}
          </View>
        </View>
        <View>
          <Text style={styles.shopby}>Shop by category</Text>
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            categories.map((category, index) => (
              <View key={index}>
                <TouchableOpacity style={styles.categoryHeading}>
                  <Text style={styles.categoryTitle}>{category.name}</Text>
                  <Text style={styles.categoryTitle}>See All</Text>
                </TouchableOpacity>
                <ScrollView horizontal>
                  {products
                    .filter(product => product.category.value === category.name)
                    .slice(0, 3)
                    .map((item, index) => (
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate('MainProductDetails', {item});
                        }}>
                        <View key={index} style={{marginRight: 10}}>
                          <Image
                            source={{uri: item.image}}
                            style={{width: 100, height: 100}}
                          />
                          <Text>{item.name}</Text>
                          <Text>{item.price}</Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                </ScrollView>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },

  title: {
    paddingVertical: 12,
    backgroundColor: 'gray',
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  text: {
    marginVertical: 6,
    textAlign: 'justify',
  },
  button: {
    marginTop: 20,
    marginBottom: 24,
  },
  categoryHeading: {
    backgroundColor: '#2089dc',
    paddingVertical: 8,
    paddingHorizontal: 8,
    marginVertical: 8,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryTitle: {
    fontSize: 18,
    color: 'white',
  },
  shopby: {
    backgroundColor: '#ff190c',
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginVertical: 8,
    color: 'white',
    fontWeight: 'bold',
    fontSize: 21,
  },
});

export default HomeScreen;
