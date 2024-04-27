import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  Platform,
  PermissionsAndroid,
  Alert,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import MapView, {Marker, Callout} from 'react-native-maps';
import {Input, Button} from '@rneui/base';
import Geolocation from '@react-native-community/geolocation';
import CustomHeader from '../components/CustomHeader';

const Weather = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [searchedLocation, setSearchedLocation] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(true);

  useEffect(() => {
    checkLocationEnabled();
  }, []);

  const checkLocationEnabled = () => {
    Geolocation.getCurrentPosition(
      position => {
        // Location is enabled, proceed to request location permission
        requestLocationPermission();
      },
      error => {
        // Location is not enabled, prompt user to enable it
        Alert.alert(
          'Location Services Disabled',
          'Please enable location services to use this app.',
          [
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {text: 'OK', onPress: () => console.log('OK Pressed')},
          ],
          {cancelable: false},
        );
      },
    );
  };
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);

    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };
  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message:
              'This app needs access to your location to show weather information.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Location permission granted');
          getUserLocation();
        } else {
          console.log('Location permission denied');
        }
      } else {
        getUserLocation();
      }
    } catch (error) {
      // console.error('Error requesting location permission:', error);
      Alert.alert('Error', error.message);
    }
  };

  const getUserLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        console.log('User location obtained:', position);
        const {latitude, longitude} = position.coords;
        setUserLocation({latitude, longitude});
        fetchWeatherData(latitude, longitude);
        fetchForecastData(latitude, longitude);
      },
      error => console.error('Error getting user location:', error),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );
  };

  const fetchWeatherData = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=839e1713cf4fcf9f2b418ee7d57eb00b`,
      );
      const data = await response.json();
      console.log('Current Weather data:', data);
      setSearchedLocation(data);
    } catch (error) {
      Alert.alert('Error fetching current weather data:', error);
    }
  };

  const fetchForecastData = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=839e1713cf4fcf9f2b418ee7d57eb00b`,
      );
      const data = await response.json();
      console.log('Forecast data:', data);
      setForecastData(data);
      setLoading(false);
    } catch (error) {
      Alert.alert('Error fetching forecast data:', error);
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    const data = await fetchCurrentWeatherData(
      userLocation.latitude,
      userLocation.longitude,
    );
    setLoading(false);
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <>
      <CustomHeader title="Weather Forecast" />
      <ScrollView>
        <Text>Weather Forecating</Text>
        <View style={{flex: 1, flexDirection: 'column'}}>
          <MapView
            style={{height: '50%'}}
            initialRegion={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0922,
            }}>
            {userLocation && (
              <Marker
                coordinate={{
                  latitude: userLocation.latitude,
                  longitude: userLocation.longitude,
                }}
                title="Your Location">
                <Callout tooltip>
                  <Text>Your current location weather</Text>
                </Callout>
              </Marker>
            )}

            {searchedLocation && (
              <Marker
                coordinate={{
                  latitude: searchedLocation.coord.lat,
                  longitude: searchedLocation.coord.lon,
                }}
                title={searchedLocation.name}>
                <Callout tooltip>
                  <Text>Temperature: {searchedLocation.main.temp}°C</Text>
                  <Text>
                    Weather: {searchedLocation.weather[0].description}
                  </Text>
                </Callout>
              </Marker>
            )}

            {forecastData &&
              forecastData.list &&
              forecastData.list.map(
                (item, index) =>
                  item.coord &&
                  item.coord.lat &&
                  item.coord.lon && (
                    <Marker
                      key={index}
                      coordinate={{
                        latitude: item.coord.lat,
                        longitude: item.coord.lon,
                      }}
                      title={item.name}>
                      <Callout tooltip>
                        <Text>Date: {item.dt_txt}</Text>
                        <Text>Temperature: {item.main.temp}°C</Text>
                        <Text>Weather: {item.weather[0].description}</Text>
                      </Callout>
                    </Marker>
                  ),
              )}
          </MapView>

          <View style={{padding: 10}}>
            <Text style={{fontWeight: 'bold', fontSize: 20}}>
              Current Weather
            </Text>
            {searchedLocation && (
              <View>
                <Text>Temperature: {searchedLocation.main.temp}°C</Text>
                <Text>Weather: {searchedLocation.weather[0].description}</Text>
              </View>
            )}

            <Text>Keep Informed</Text>
            <Text style={{fontWeight: 'bold', fontSize: 20, marginTop: 20}}>
              5-Day Forecast
            </Text>
            {forecastData &&
              forecastData.list &&
              forecastData.list.map((item, index) => (
                <View key={index}>
                  <Text style={styles.title}>Date: {item.dt_txt}</Text>
                  <Text>Temperature: {item.main.temp}°C</Text>
                  <Text>Weather: {item.weather[0].description}</Text>
                  <View
                    style={{
                      height: 1,
                      backgroundColor: 'gray',
                      marginVertical: 5,
                    }}
                  />
                </View>
              ))}
          </View>
        </View>
      </ScrollView>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    // width: Dimensions.get('screen'),
    // height: Dimensions.get('screen'),
    padding: 10,
    marginHorizontal: 12,
  },
  image: {
    flex: 0.5,
    width: '100%',
  },
  content: {
    flex: 0.4,
  },
  image: {
    // height: 100,
    // width: 100,
    // flex: 1,
  },
});

export default Weather;
