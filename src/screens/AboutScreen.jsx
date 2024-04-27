import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import CustomHeader from '../components/CustomHeader';

function AboutScreen() {
  return (
    <View>
      <CustomHeader title="About" />
      <Text style={styles.title}> About Local Farmers Market Directory</Text>
      <View style={styles.Container}>
        <Text style={styles.text}>
          "Local Farmers Market Directory App" is a mobile app that seamlessly
          connects farmers directly to consumers, revolutionizing the way fresh
          produce is accessed and distributed.
        </Text>
        <Text style={styles.text}>
          Through the app, farmers can showcase their products, including
          fruits, vegetables, dairy, and meats, with detailed descriptions of
          their farming practices and certifications.
        </Text>
        <Text style={styles.text}>
          Customers can browse through a wide variety of locally sourced,
          organic, and sustainably produced goods, place orders, and schedule
          deliveries or pickups directly from the farm.
        </Text>
        <Text style={styles.text}>
          With transparent pricing and real-time updates on product
          availability, Local Farmers Market Directory App empowers consumers to
          make informed choices while supporting local agriculture and fostering
          a healthier, more sustainable food ecosystem.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  Container: {
    justifyContent: 'center',
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
});

export default AboutScreen;
