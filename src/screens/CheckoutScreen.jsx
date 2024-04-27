import React, {useState} from 'react';
import {
  ScrollView,
  View,
  Text,
  Image,
  Button,
  Input,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

const CheckoutScreen = () => {
  const product = {
    name: 'Product 1',
    price: 2400,
    image: require('../images/slider1.jpg'),
  };

  // Sample user information
  const user = {
    name: 'Stuart',
    email: 'stuart@gmail.com',
    address: 'Mbarara Main Street, Mbarara City, Uganda',
  };

  // Sample state for quantity and payment method
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');

  // Calculate total amount
  const totalAmount = product.price * quantity;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Product Image */}
      <Image source={product.image} style={styles.image} />

      {/* Product Details */}
      <View style={styles.section}>
        <Text style={styles.title}>Product Details</Text>
        <Text>Name: {product.name}</Text>
        <Text>Price: UGX {product.price}</Text>
      </View>

      {/* User Details */}
      <View style={styles.section}>
        <Text style={styles.title}>User Details</Text>
        <Text>Name: {user.name}</Text>
        <Text>Email: {user.email}</Text>
        <Text>Enter Destination Address:</Text>
        <Input
          placeholder="Destination Address ie District, parish, Village"
          value={address}
          onChangeText={setPhone}
        />
      </View>

      {/* Quantity */}
      <View style={styles.section}>
        <Text style={styles.title}>Quantity</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            onPress={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}>
            <Text style={styles.quantityButton}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantity}>{quantity}</Text>
          <TouchableOpacity onPress={() => setQuantity(quantity + 1)}>
            <Text style={styles.quantityButton}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Total Amount */}
      <View style={styles.section}>
        <Text style={styles.title}>Total Amount</Text>
        <Text style={styles.totalAmount}>UGX {totalAmount}</Text>
      </View>

      {/* Payment Method */}
      <View style={styles.section}>
        <Text style={styles.title}>Payment Method</Text>
        <TouchableOpacity onPress={() => setPaymentMethod('Cash on Delivery')}>
          <Text
            style={[
              styles.paymentMethod,
              paymentMethod === 'Cash on Delivery' &&
                styles.selectedPaymentMethod,
            ]}>
            Cash on Delivery
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setPaymentMethod('Mobile Money')}>
          <Text
            style={[
              styles.paymentMethod,
              paymentMethod === 'Mobile Money' && styles.selectedPaymentMethod,
            ]}>
            Mobile Money
          </Text>
        </TouchableOpacity>
      </View>

      {/* Confirm and Cancel Buttons */}
      <View style={styles.buttonContainer}>
        <Button
          title="Confirm Order"
          onPress={() => console.log('Order confirmed')}
        />
        <Button title="Cancel" onPress={() => console.log('Order canceled')} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    fontSize: 20,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  quantity: {
    fontSize: 18,
    marginHorizontal: 10,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  paymentMethod: {
    fontSize: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
  },
  selectedPaymentMethod: {
    backgroundColor: '#e0e0e0',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default CheckoutScreen;
