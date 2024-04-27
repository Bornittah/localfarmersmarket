import React, {useState, useEffect} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {ThemeProvider} from '@rneui/themed';
import BottomNavBar from '../components/BottomNavBar';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import Authentication from '../screens/Authenticatiocation';
import SplashScreen from '../screens/SplashScreen';
import HomeScreen from '../screens/HomeScreen';
import Products from '../screens/Products';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';

const Router = () => {
  // const [initializing, setInitializing] = useState(true);
  // const [user, setUser] = useState();

  // // Handle user state changes
  // function onAuthStateChanged(user) {
  //   setUser(user);
  //   if (initializing) setInitializing(false);
  // }

  // useEffect(() => {
  //   const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
  //   return subscriber;
  // }, []);

  // if (initializing) {
  //   return <SplashScreen />;
  // }
  const Stack = createNativeStackNavigator();

  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator>
          {/* <Stack.Screen
              name="home"
              component={Products}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Product Details"
              component={ProductDetailsScreen}
              options={{headerShown: false}}
            /> */}
          <Stack.Screen
            name="BottomNavBar"
            component={BottomNavBar}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="SplashScreen"
            component={SplashScreen}
            options={{headerShown: false}}
          />
          {/* <Stack.Screen
              name="Authentication"
              component={Authentication}
              options={{headerShown: false}}
            /> */}
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
};

export default Router;
