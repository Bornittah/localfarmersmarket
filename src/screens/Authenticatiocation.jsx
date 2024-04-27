import React, {useState} from 'react';
import auth from '@react-native-firebase/auth';
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {Button, Text, Image, Input} from '@rneui/themed';
import MaterialIcons from 'react-native-vector-icons/Ionicons';

function Authentication() {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [verificationId, setVerificationId] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePhoneNumber = async () => {
    setLoading(true);
    try {
      const confirmation = await auth().signInWithPhoneNumber(phone);
      setVerificationId(confirmation.verificationId);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      Alert.alert(
        'Error: Invalid Phone Number',
        'The format of the phone number provided is incorrect. Please enter the phone number in a format [+][country code][subscriber number]',
      );
    }
  };

  const confirmCode = async () => {
    setLoading(true);
    try {
      const credential = auth.PhoneAuthProvider.credential(
        verificationId,
        code,
      );
      await auth().signInWithCredential(credential);
    } catch (error) {
      setLoading(false);
      console.log('Error verifying code:', error);
      Alert.alert('Error verifying code:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={require('../images/farmer.png')}
        alt="Logo"
        style={styles.logo}
      />
      <Text style={styles.logoText}>Local Farmers Market Directory </Text>
      <Text>Phone Authentication</Text>
      <Text style={styles.infoText}>
        Verify your identity quickly and securely using your mobile phone
        number. Enter the code we send via SMS to get started.
      </Text>

      <View>
        <Text>Phone Number</Text>
        <Input
          placeholder="eg. +256 ----------"
          value={phone}
          onChangeText={setPhone}
          containerStyle={{
            height: 40,
            width: 200,
            marginVertical: 5,
          }}
        />
      </View>
      <Button
        containerStyle={{
          height: 40,
          width: 200,
          marginVertical: 10,
        }}
        onPress={handlePhoneNumber}
        isLoading={loading}
        disabled={loading}
        title={
          loading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            'Send Code'
          )
        }
      />

      <View>
        <Text>Verification Code</Text>
        <Input
          placeholder="Enter Code"
          value={code}
          onChangeText={setCode}
          containerStyle={{
            height: 40,
            width: 200,
            marginVertical: 5,
          }}
        />
      </View>
      <Button
        containerStyle={{
          height: 40,
          width: 200,
          marginHorizontal: 50,
          marginVertical: 10,
        }}
        onPress={confirmCode}
        isLoading={loading}
        disabled={loading}
        title={
          loading ? <ActivityIndicator size="small" color="white" /> : 'Confirm'
        }
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  infoText: {
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    marginVertical: 10,
  },
});

export default Authentication;
