import React, {useState, useEffect} from 'react';
import {ScrollView, View, StyleSheet, Alert} from 'react-native';
import {Input, Button, Text, Image} from '@rneui/themed';
import * as ImagePicker from 'react-native-image-picker';
import database from '@react-native-firebase/database';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import {useRoute} from '@react-navigation/native';
import CustomHeader from '../components/CustomHeader';
import {Dropdown} from 'react-native-element-dropdown';

function Account() {
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState(null);
  const [fullname, setFullname] = useState('');
  const [nin, setNin] = useState('');
  const [phone, setPhone] = useState('');
  const [district, setDistrict] = useState('');
  const [parish, setParish] = useState('');
  const [village, setVillage] = useState('');
  const [description, setDescription] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');

  const currentDate = new Date().toISOString();
  const [show, setShow] = useState(false);
  const user = auth().currentUser;
  const userKey = user ? user.uid : null;
  const route = useRoute();
  const [contactInfo, setContactInfo] = useState(null);

  const districtOptions = [
    {label: 'Mbarara', value: 'Mbarara'},
    {label: 'Bushenyi', value: 'Bushenyi'},
    {label: 'Isingiro', value: 'Isingiro'},
    {label: 'Kashari', value: 'Kashari'},
    {label: 'Ibanda', value: 'Ibanda'},
    {label: 'Buhweju', value: 'Buhweju'},
  ];

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const handleClick = () => setShow(!show);

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
            setLoading(false);
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

  const fetchContactInfo = async () => {
    try {
      if (!userKey) {
        throw new Error('User not authenticated');
      }
      // Fetch contact information from Firebase
      setPhone(user.phoneNumber);
      const contactRef = await database().ref(`users/${userKey}/contactInfo`);
      const snapshot = await contactRef.once('value');
      const data = snapshot.val();
      if (data) {
        // Set contact information in state
        setContactInfo(data);
        setImage(data.image);
        setFullname(data.fullname);
        setNin(data.nin);
        setPhone(data.phone);
        setDistrict(data.district);
        setParish(data.parish);
        setVillage(data.village);
        setDescription(data.description);
        setUsername(data.username);
        setPassword(data.password);
        console.log('Contact information fetched successfully:', data);
      } else {
        console.log('No contact information found');
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching contact info:', error);
      Alert.alert('Error', 'Failed to fetch contact information');
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      // Construct the data object to be saved
      const data = {
        userId: userKey,
        image: image,
        fullname: fullname,
        phone: phone,
        nin: nin,
        district: district,
        parish: parish,
        village: village,
        description: description,
        username: username,
        password: password,
        timestamp: currentDate,
      };
      const contactRef = await database().ref(`users/${userKey}/contactInfo`);
      if (contactInfo) {
        await contactRef.update(data);
        Alert.alert('Success', 'Contact information saved successfully!');
        console.log('Contact information updated successfully:', data);
      } else {
        await contactRef.set(data);
        Alert.alert('Success', 'Contact information created successfully!');
        console.log('Contact information created successfully:', data);
      }
      // Fetch the updated contact information
      fetchContactInfo();
    } catch (error) {
      console.error('Error saving contact info:', error);
      Alert.alert('Error', 'Failed to save contact information');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView>
      <CustomHeader title="Account" />
      <View>
        <Text>Contact information:</Text>
        {loading ? (
          <Text>Loading...</Text>
        ) : (
          <>
            {image && (
              <View style={styles.imageContainer}>
                <Image
                  source={{uri: image}}
                  style={styles.image}
                  alt="profile"
                />
              </View>
            )}
            <Button
              onPress={handleImagePicker}
              title="Select Image: less than 1MB."
            />
            <View>
              <Text>Name</Text>
              <Input
                placeholder="Enter Name"
                value={fullname}
                onChangeText={text => setFullname(text)}
                inputContainerStyle={{
                  borderWidth: 1,
                  borderColor: '#CCCCCC',
                  borderRadius: 10,
                }}
              />
            </View>
            <View>
              <Text>NIN</Text>
              <Input
                placeholder="Enter NIN"
                value={nin}
                onChangeText={text => setNin(text)}
                maxLength={14}
                inputContainerStyle={{
                  borderWidth: 1,
                  borderColor: '#CCCCCC',
                  borderRadius: 10,
                }}
              />
            </View>
            <View>
              <Text>Phone</Text>
              <Input
                placeholder="Enter Phone"
                value={phone}
                keyboardType="numeric"
                onChangeText={text => setPhone(text)}
                maxLength={14}
                inputContainerStyle={{
                  borderWidth: 1,
                  borderColor: '#CCCCCC',
                  borderRadius: 10,
                }}
              />
            </View>

            <View>
              <Text>District</Text>
              <Dropdown
                search
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder="Choose District"
                searchPlaceholder="Choose District."
                value={district}
                onChange={itemValue => setDistrict(itemValue)}
                data={districtOptions}
                textStyle={{color: 'black'}}
                dropdownStyle={{backgroundColor: 'white'}}
                style={{
                  borderWidth: 1,
                  borderColor: '#CCCCCC',
                  borderRadius: 10,
                }}
              />
            </View>
            <View>
              <Text>Parish</Text>
              <Input
                placeholder="Enter Parish"
                value={parish}
                onChangeText={text => setParish(text)}
                inputContainerStyle={{
                  borderWidth: 1,
                  borderColor: '#CCCCCC',
                  borderRadius: 10,
                }}
              />
            </View>
            <View>
              <Text>Village</Text>
              <Input
                placeholder="Enter Village"
                value={village}
                onChangeText={text => setVillage(text)}
                inputContainerStyle={{
                  borderWidth: 1,
                  borderColor: '#CCCCCC',
                  borderRadius: 10,
                }}
              />
            </View>
            <View>
              <Text>Description</Text>
              <Input
                value={description}
                onChangeText={text => setDescription(text)}
                multiline
                numberOfLines={8}
                inputContainerStyle={{
                  borderWidth: 1,
                  borderColor: '#CCCCCC',
                  borderRadius: 10,
                }}
              />
            </View>
            <View>
              <Text>Username</Text>
              <Input
                placeholder="Enter Username"
                value={username}
                onChangeText={text => setUsername(text)}
                inputContainerStyle={{
                  borderWidth: 1,
                  borderColor: '#CCCCCC',
                  borderRadius: 10,
                }}
              />
            </View>
            <View>
              <Text>Password</Text>
              <Input
                type={show ? 'text' : 'password'}
                value={password}
                onChangeText={text => setPassword(text)}
                inputContainerStyle={{
                  borderWidth: 1,
                  borderColor: '#CCCCCC',
                  borderRadius: 10,
                }}
                InputRightElement={
                  <Button
                    onPress={handleClick}
                    title={show ? 'Hide' : 'Show'}
                  />
                }
                placeholder="Password"
              />
            </View>
            <View>
              <Button onPress={handleSubmit} title={'Update'} />
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'cover',
    borderRadius: 50,
  },
  selectText: {
    fontSize: 18,
    color: 'blue',
  },
  button: {
    // marginTop: 20,
    // marginBottom: 24,
  },
});

export default Account;
