import React, {useState, useEffect} from 'react';
import {StyleSheet, Alert, View, TouchableOpacity} from 'react-native';
import database from '@react-native-firebase/database';
import storage from '@react-native-firebase/storage';
import {Text, Input, Button, Image} from '@rneui/themed';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
  const [show, setShow] = useState(false);

  const handleClick = () => setShow(!show);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const isAuthenticated = await AsyncStorage.getItem('isAuthenticated');
      if (isAuthenticated) {
        navigation.navigate('Dashboard Screen');
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const userData = await database()
        .ref('users')
        .orderByChild('contactInfo/username')
        .equalTo(username)
        .once('value');

      if (userData.exists()) {
        const userDataVal = userData.val();
        const userKeys = Object.keys(userDataVal);
        const user = userKeys
          .map(key => userDataVal[key])
          .find(user => user.contactInfo.password === password);

        if (user) {
          const userKey = userKeys.find(key => userDataVal[key] === user);
          await AsyncStorage.setItem('userKey', userKey);
          await AsyncStorage.setItem('isAuthenticated', 'true');
          navigation.navigate('Dashboard Screen', {user});
        } else {
          Alert.alert('Warning', 'Incorrect password');
        }
      } else {
        // Create a new account if user doesn't exist
        const newUserKey = await database().ref('users').push().key;
        await database().ref(`users/${newUserKey}/contactInfo`).set({
          username,
          password,
        });
        await AsyncStorage.setItem('userKey', newUserKey);
        await AsyncStorage.setItem('isAuthenticated', 'true');
        navigation.navigate('Dashboard Screen', {
          user: {contactInfo: {username}},
        });
      }
    } catch (error) {
      console.error('Error logging in:', error);
      Alert.alert('Error logging in. Please try again.');
    }
  };

  const createAccount = () => {
    navigation.navigate('My Account');
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../images/farmer.png')}
        alt="Logo"
        style={styles.avatar}
      />
      <Text style={styles.heading}>Login</Text>
      <View>
        <Input
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          inputContainerStyle={styles.input}
        />
      </View>
      <View>
        <Input
          type={show ? 'text' : 'password'}
          value={password}
          onChangeText={text => setPassword(text)}
          InputRightElement={
            <Button onPress={handleClick}>{show ? 'Hide' : 'Show'}</Button>
          }
          placeholder="Password"
          inputContainerStyle={styles.input}
        />
      </View>
      <Button
        onPress={handleSubmit}
        title="Login"
        containerStyle={styles.button}
      />

      <View>
        <View style={styles.linkContainer}>
          <View>
            <TouchableOpacity>
              <Text style={styles.link}>Forget password?</Text>
            </TouchableOpacity>
            <Text>No Account?</Text>
            <TouchableOpacity onPress={createAccount}>
              <Text style={styles.link}>Create an account!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  avatar: {
    marginBottom: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    marginBottom: 10,
    width: '70%',
  },
  button: {
    backgroundColor: '#007bff',
    alignSelf: 'center',
    width: '70%',
  },
  link: {
    fontSize: 20,
    color: '#0335fc',
  },
  linkContainer: {
    flex: 0.2,
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginVertical: 12,
    alignItems: 'center',
    height: 'auto',
    paddingVertical: 8,
    lineHeight: 2,
  },
});

export default LoginScreen;
