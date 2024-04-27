import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {View, StyleSheet, Alert} from 'react-native';
import React, {useState, useEffect} from 'react';
import AboutScreen from '../screens/AboutScreen';
import Dashboard from '../screens/Dashboard';
import HomeScreen from '../screens/HomeScreen';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import Products from '../screens/Products';
import Account from '../screens/Account';
import Search from '../screens/Search';
import UploadProduct from '../screens/UploadProduct';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Weather from '../screens/WeatherScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import CartScreen from '../screens/CartScreen';
import MyProducts from '../screens/MyProducts';
import PendingOrders from '../screens/PendingOrders';
import SplashScreen from '../screens/SplashScreen';
import Orders from '../screens/Orders';
import LoginScreen from '../screens/LoginScreen';
import TipsScreen from '../screens/TipsScreen';
import Icon from 'react-native-vector-icons/FontAwesome';
// import {Icon} from 'react-native-vector-icons/MaterialCommunityIcons';

// const Stack = createNativeStackNavigator();
const CommonStack = createNativeStackNavigator();

function HomeScreens() {
  return (
    <CommonStack.Navigator>
      <CommonStack.Screen
        name="Home Screen"
        component={HomeScreen}
        options={{
          headerShown: false,
          tabBarIcon: <Icon name="archive" />,
        }}
      />
      <CommonStack.Screen
        name="MainProductDetails"
        component={ProductDetailsScreen}
        options={{headerShown: false}}
      />
      <CommonStack.Screen
        name="Cart"
        component={CartScreen}
        options={{headerShown: false}}
      />
      <CommonStack.Screen
        name="PendingOrders"
        component={PendingOrders}
        options={{headerShown: false}}
      />
    </CommonStack.Navigator>
  );
}

function ProductsScreens() {
  return (
    <CommonStack.Navigator>
      <CommonStack.Screen
        name="All Products"
        component={Products}
        options={{headerShown: false}}
      />
      <CommonStack.Screen
        name="ProductDetails"
        component={ProductDetailsScreen}
        options={{headerShown: false}}
      />
      <CommonStack.Screen
        name="Search"
        component={Search}
        options={{headerShown: false}}
      />
      <CommonStack.Screen
        name="Cart"
        component={CartScreen}
        options={{headerShown: false}}
      />
    </CommonStack.Navigator>
  );
}

function AuthScreens() {
  return (
    <CommonStack.Navigator>
      <CommonStack.Screen
        name="Splash"
        component={SplashScreen}
        options={{headerShown: false}}
      />
      <CommonStack.Screen
        name="Authentication"
        component={AuthScreens}
        options={{headerShown: false}}
      />
    </CommonStack.Navigator>
  );
}

function DashboardScreens() {
  return (
    <CommonStack.Navigator>
      <CommonStack.Screen
        name="Login"
        component={LoginScreen}
        options={{headerShown: false}}
      />
      <CommonStack.Screen
        name="Dashboard Screen"
        component={Dashboard}
        options={{headerShown: false}}
      />
      <CommonStack.Screen
        name="My Account"
        component={Account}
        options={{headerShown: false}}
      />
      <CommonStack.Screen
        name="UploadProduct"
        component={UploadProduct}
        options={{headerShown: false}}
      />
      <CommonStack.Screen
        name="My Products"
        component={MyProducts}
        options={{headerShown: false}}
      />
      <CommonStack.Screen
        name="Product Detail"
        component={ProductDetailsScreen}
        options={{headerShown: false}}
      />
      <CommonStack.Screen
        name="Orders"
        component={Orders}
        options={{headerShown: false}}
      />
      <CommonStack.Screen
        name="Pending Orders"
        component={PendingOrders}
        options={{headerShown: false}}
      />
      <CommonStack.Screen
        name="Confirm Order"
        component={CheckoutScreen}
        options={{headerShown: false}}
      />
    </CommonStack.Navigator>
  );
}

// Define a Tab Navigator
const Tab = createBottomTabNavigator();

function BottomNavBar() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={HomeScreens}
        options={{
          headerShown: false,
          tabBarLabel: 'Home',
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Products"
        component={ProductsScreens}
        options={{
          headerShown: false,
          tabBarLabel: 'Products',
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons name="book" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Weather"
        component={Weather}
        options={{
          headerShown: false,
          tabBarLabel: 'Weather',
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Tips"
        component={TipsScreen}
        options={{
          headerShown: false,
          tabBarLabel: 'Tips',
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="Account"
        component={DashboardScreens}
        options={{
          headerShown: false,
          tabBarLabel: 'Account',
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Help"
        component={AboutScreen}
        options={{
          headerShown: false,
          tabBarLabel: 'Help',
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  tabs: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BottomNavBar;
