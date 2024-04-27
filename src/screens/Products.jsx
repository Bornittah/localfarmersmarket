import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import {Text, Image, Button, ListItem, Input} from '@rneui/base';
import database from '@react-native-firebase/database';
import {useNavigation} from '@react-navigation/native';
import CustomHeader from '../components/CustomHeader';

const Products = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
    fetchAllProducts();
  }, []);

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

  const fetchAllProducts = async () => {
    try {
      let allProducts = [];
      const snapshot = await database().ref('users').once('value');
      const users = snapshot.val();
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
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const fetchProductsByCategory = async categoryName => {
    try {
      let allProducts = [];
      const snapshot = await database().ref('users').once('value');
      const users = snapshot.val();
      for (const userKey in users) {
        const productsSnapshot = await database()
          .ref(`users/${userKey}/products`)
          .orderByChild('category')
          .equalTo(categoryName.toLowerCase())
          .once('value');
        const products = productsSnapshot.val();
        if (products) {
          const userProducts = Object.values(products);
          allProducts = allProducts.concat(userProducts);
        }
      }
      setProducts(allProducts);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products by category:', error);
      setLoading(false);
    }
  };

  const renderItem = ({item}) => (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('ProductDetails', {item});
      }}
      style={styles.cardContainer}>
      <View style={styles.card}>
        {item.image && (
          <Image
            source={{uri: item.image}}
            style={styles.image}
            alt="product"
          />
        )}
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.subtitle}>UGX: {item.price}</Text>
        </View>
        <Button
          title="Add To Cart"
          size="small"
          containerStyle={styles.buttonContainer}
          buttonStyle={styles.button}
          titleStyle={styles.buttonTitle}
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <View>
      <CustomHeader title="All Categories"></CustomHeader>
      <View style={styles.container}>
        {/* <Input placeholder="Search Food and Others" /> */}
        {/* Left Menu */}
        <View style={styles.menu}>
          <Text style={styles.menuTitle}>All</Text>
          <FlatList
            data={categories}
            renderItem={({item}) => (
              <ListItem onPress={() => fetchProductsByCategory(item.name)}>
                <ListItem.Content>
                  <ListItem.Subtitle>{item.name}</ListItem.Subtitle>
                </ListItem.Content>
              </ListItem>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
        {/* Right Content */}
        <View style={styles.content}>
          {loading ? (
            <Text>Loading...</Text>
          ) : products.length === 0 ? (
            <Text>No products available.</Text>
          ) : (
            <FlatList
              data={products}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
              numColumns={3}
            />
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // height: Dimensions.get('window').height,
    // flex: 1,
    flexDirection: 'row',
    backgroundColor: '#ededeb',
  },
  menu: {
    width: '25%',
    backgroundColor: 'white',
    padding: 5,
  },
  menuTitle: {
    fontWeight: 'bold',
    marginBottom: 10,
    fontSize: 14,
  },
  content: {
    width: '75%',
    padding: 10,
  },
  cardContainer: {
    flex: 1,
    width: '50%',
    marginBottom: 10,
  },
  card: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
    overflow: 'hidden',
    marginHorizontal: 2,
    borderRadius: 8,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
  },
  textContainer: {
    flex: 1,
    padding: 10,
  },
  title: {
    // fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    // fontSize: 14,
    marginBottom: 5,
  },
  buttonContainer: {
    alignSelf: 'flex-start',
    width: '100%',
  },
  button: {
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  buttonTitle: {
    whiteSpace: 'nowrap',
    fontSize: 12,
  },
});

export default Products;
