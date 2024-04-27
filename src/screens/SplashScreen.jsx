import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text, Image} from '@rneui/base';
import {Button} from '@rneui/themed';

const SplashScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      <View flex={1} justifyContent="center" alignItems="center">
        <Image
          source={require('../images/farmer.png')}
          alt="Logo"
          style={styles.logo}
        />
        <Text style={styles.title}>Local Farmers Market Directory</Text>
        <Text style={styles.subtitle}>
          "Your platform for connecting farmers"
        </Text>
        <Button
          title="Continue"
          onPress={() => {
            navigation.navigate('Authentication');
          }}
          containerStyle={{
            height: 40,
            width: 100,
            marginVertical: 5,
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // Set your desired background color
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    width: '80%',
  },
});

export default SplashScreen;
