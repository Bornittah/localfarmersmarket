import React, {useState, useEffect} from 'react';
import {ScrollView, View, StyleSheet, Image, Alert} from 'react-native';
import {Input, Text, Button} from '@rneui/base';
import * as ImagePicker from 'react-native-image-picker';
import {Dropdown} from 'react-native-element-dropdown';
import database from '@react-native-firebase/database';
import storage from '@react-native-firebase/storage';
import CustomHeader from '../components/CustomHeader';
import {AsyncStorage} from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';

const UploadProduct = () => {
  const navigation = useNavigation();
  const [image, setImage] = useState(null);
  const [itemName, setItemName] = useState('');
  const [unit, setUnit] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');

  const categoryOptions = [
    {label: 'Vegetables', value: 'Vegetables'},
    {label: 'Fruits', value: 'Fruits'},
    {label: 'Poultry', value: 'Poultry'},
    {label: 'Animals', value: 'Animals'},
    {label: 'Food Crops', value: 'Food Crops'},
    {label: 'Cash Crops', value: 'Cash Crops'},
    {label: 'Others', value: 'Others'},
  ];
  const [userKey, setUserKey] = useState(null);

  useEffect(() => {
    const getUserKey = async () => {
      try {
        const key = await AsyncStorage.getItem('userKey');
        setUserKey(key);
      } catch (error) {
        console.error('Error retrieving user key:', error);
      }
    };

    getUserKey();
  }, []);

  const handleImagePicker = () => {
    const options = {
      mediaType: 'photo',
    };

    ImagePicker.launchImageLibrary(options, async response => {
      if (!response.didCancel) {
        if (response.assets[0].fileSize > 1024 * 1024) {
          Alert.alert('Error', 'Please select an image less than 1MB.');
        } else {
          const image = response.assets[0].uri;
          const imageName = response.assets[0].fileName;
          const storageRef = storage().ref(`images/${imageName}`);
          try {
            await storageRef.putFile(image);
            const downloadURL = await storageRef.getDownloadURL();
            setImage(downloadURL);
          } catch (error) {
            Alert.alert('Error', 'Failed to upload image');
          }
        }
      } else {
        if (response.error) {
          console.error('ImagePicker Error:', response.error);
        }
      }
    });
  };

  const saveProduct = async () => {
    if (!itemName.trim() || !image) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    const data = {
      userId: userKey,
      name: itemName,
      unit: unit,
      quantity: quantity,
      price: price,
      image: image,
      category: category,
      description: description,
      address: address,
    };
    try {
      await database()
        .ref(`users/${userKey}/products`)
        .push(data)
        .then(() => {
          Alert.alert('Success', 'Item uploaded successfully');
          setItemName('');
          setUnit('');
          setQuantity('');
          setImage('');
          setPrice('');
          setCategory('');
          setDescription('');
          setAddress('');
        });
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  return (
    <ScrollView>
      <CustomHeader title="Upload Product" />
      <View style={styles.container}>
        <Button onPress={handleImagePicker} w="90%" bg="green.700">
          Select Image: less than 1MB.
        </Button>
        {image && (
          <View style={styles.imageContainer}>
            <Image source={{uri: image}} style={styles.image} alt="profile" />
          </View>
        )}
        <View style={styles.formControl}>
          <Text>Item Name</Text>
          <Input
            value={itemName}
            onChangeText={text => setItemName(text)}
            inputContainerStyle={styles.inputContainer}
          />
        </View>
        <View style={styles.formControl}>
          <Text>Unit of Measure</Text>
          <Input
            value={unit}
            onChangeText={text => setUnit(text)}
            inputContainerStyle={styles.inputContainer}
          />
        </View>
        <View style={styles.formControl}>
          <Text>Quantity</Text>
          <Input
            value={quantity}
            onChangeText={text => setQuantity(text)}
            inputContainerStyle={styles.inputContainer}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.formControl}>
          <Text>Price</Text>
          <Input
            value={price}
            onChangeText={text => setPrice(text)}
            inputContainerStyle={styles.inputContainer}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.formControl}>
          <Text>Category</Text>
          <Dropdown
            search
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder="Choose Category"
            searchPlaceholder="Choose Category."
            value={category}
            onSelect={itemValue => setCategory(itemValue)}
            data={categoryOptions}
            textStyle={{color: 'black'}}
            dropdownStyle={{backgroundColor: 'white'}}
            style={styles.inputContainer}
          />
        </View>
        <View style={styles.formControl}>
          <Text>Description</Text>
          <Input
            value={description}
            onChangeText={text => setDescription(text)}
            multiline
            numberOfLines={8}
            inputContainerStyle={styles.inputContainer}
          />
        </View>
        <View style={styles.formControl}>
          <Text>Where to find this Product</Text>
          <Input
            value={address}
            onChangeText={text => setAddress(text)}
            placeholder="Enter Address"
            inputContainerStyle={styles.inputContainer}
          />
        </View>
        <Button style={styles.button} onPress={saveProduct}>
          Upload Product
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  button: {
    marginTop: 20,
    marginBottom: 24,
  },
  formControl: {
    width: '100%',
    paddingHorizontal: 5,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 10,
  },
});

export default UploadProduct;
