import React, {useState, useEffect} from 'react';
import {View, Text, Input, Image} from '@rneui/base';
import {StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import {useRoute, useNavigation} from '@react-navigation/native';

function Search() {
  const user = auth().currentUser;
  const userKey = user ? user.uid : null;
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const route = useRoute();
  const {query} = route.params;
  const navigation = useNavigation();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const snapshot = await database().ref('users').once('value');
        const users = snapshot.val();
        let allProducts = [];
        for (const userKey in users) {
          const userProductsSnapshot = await database()
            .ref(`users/${userKey}/products`)
            .once('value');
          const userProducts = userProductsSnapshot.val();
          if (userProducts) {
            const userProductsArray = Object.values(userProducts);
            allProducts = allProducts.concat(userProductsArray);
          }
        }
        const filteredResults = allProducts.filter(product =>
          product.name.toLowerCase().includes(query.toLowerCase()),
        );
        setSearchResults(filteredResults);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [query]);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: `Search Results for: ${query}`,
    });
  }, [navigation, query]);

  const handleSearch = query => {
    setSearchQuery(query);
    const filteredProducts = products.filter(product =>
      product.name.toLowerCase().includes(query.toLowerCase()),
    );
    setSearchResults(filteredProducts);
  };

  const renderItem = ({item}) => (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('MainProductDetails', {item});
      }}>
      <Box style={styles.card}>
        {item.image && (
          <Image
            source={{uri: item.image}}
            style={styles.image}
            alt="product"
          />
        )}
        <Text style={styles.title}>{item.name}</Text>
      </Box>
    </TouchableOpacity>
  );

  return (
    <View>
      <Input
        placeholder="Search products"
        value={searchQuery}
        onChangeText={handleSearch}
        mt={4}
        mb={2}
      />
      <View style={styles.content}>
        {loading ? (
          <Text>Loading...</Text>
        ) : searchResults.length === 0 ? (
          <Text>No results found for "{query}"</Text>
        ) : (
          <FlatList
            data={searchResults}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            numColumns={2}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 4,
    marginHorizontal: 12,
  },
  content: {
    marginVertical: 12,
  },
  card: {
    flex: 0.5,
    margin: 5,
  },
  image: {
    height: 100,
    width: 100,
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 5,
  },
});

export default Search;
