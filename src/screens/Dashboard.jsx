import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import {Button, Image} from '@rneui/themed';
import {useNavigation} from '@react-navigation/native';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Dashboard = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [contactInfo, setContactInfo] = useState(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [image, setImage] = useState(null);
  const [hasContactInfo, setHasContactInfo] = useState(false);

  useEffect(() => {
    retrieveUserKey();
  }, []);

  const retrieveUserKey = async () => {
    try {
      const userKey = await AsyncStorage.getItem('userKey');
      if (userKey) {
        fetchContactInfo(userKey);
      } else {
        Alert.alert('Error', 'User key not found.');
        setLoading(false);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to retrieve user key.');
      setLoading(false);
    }
  };

  const fetchContactInfo = async userKey => {
    try {
      const contactRef = database().ref(`users/${userKey}/contactInfo`);
      contactRef.once('value', snapshot => {
        const data = snapshot.val();
        if (data) {
          setContactInfo(data);
          setName(data.fullname);
          setPhone(data.phone);
          setImage(data.image);
          setHasContactInfo(true);
        } else {
          setHasContactInfo(false);
        }
        setLoading(false);
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch contact information.');
      setLoading(false);
    }
  };

  const handleNavigateToAccount = () => {
    navigation.navigate('Account');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          Welcome to Local Farmers Market Directory
        </Text>
      </View>
      <View px={4} py={3} justifyContent="space-between">
        <View>
          {image && (
            <Image
              source={{uri: image}}
              alt="Alternate Text"
              size="xl"
              style={{
                borderRadius: 150,
                height: 150,
                width: 150,
              }}
            />
          )}
          <Text>Phone Number: {phone}</Text>
        </View>
        <View>
          <Text>{name}</Text>
          <Text>Account Info</Text>
          <Button onPress={handleNavigateToAccount} bg="green.700">
            View & Update
          </Button>
        </View>
      </View>
      <View style={styles.content}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => {
            navigation.navigate('My Products');
          }}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>My Products</Text>
            <Text>See All</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.card}
          onPress={() => {
            navigation.navigate('Cart');
          }}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>My Cart</Text>
            <Text>See All</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.card}
          onPress={() => {
            navigation.navigate('Orders');
          }}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>My Orders</Text>
            <Text>See All</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Rating and Reviews</Text>
            <Text>See All</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  content: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#fff',
    marginVertical: 8,
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 15,
  },
});

export default Dashboard;
