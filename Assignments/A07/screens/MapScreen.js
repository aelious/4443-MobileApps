import React, { useState, useEffect, useContext } from 'react';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import { StyleSheet, View, Image, Text, Alert} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { IconButton, MD3Colors } from 'react-native-paper';
import { UserContext } from '../UserInfo/UserContext';

export default function MapScreen() {
  let mapMarkers = []
  const navigation = useNavigation();
  const {user, setUser} = useContext(UserContext)
  const [userLogin, setUserLogin] = useState([]);
  const [userLocation, setUserLocation] = useState([]);
  const [loading, setLoading] = useState(false);
  const colors = ['tomato', 'orange', 'yellow', 'green', 'blue', 'purple']

    const fetchLoginData = async () => {
    try {
      const response = await fetch("http://aelious.me:8084/login");
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      return data["data"]; // Assuming data is in JSON format
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error; // Rethrow the error to be handled by the calling code
    }
  };
  const fetchLocationData = async () => {
    try {
      const response = await fetch("http://aelious.me:8084/location");
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      return data["data"]; // Assuming data is in JSON format
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error; // Rethrow the error to be handled by the calling code
    }
  };
  useEffect(() => {
  // Simulate asynchronous data fetching
  const fetchData = async () => {
      setLoading(true); 
      try {
      // Assuming fetchNewData is an asynchronous function that fetches data
      const loginData = await fetchLoginData();
      const locationData = await fetchLocationData();
      setUserLogin(loginData);
      setUserLocation(locationData);
      } catch (error) {
      console.error('Error fetching data:', error);
      } finally {
      setLoading(false); // Reset loading state after fetching data
      }
  };

  fetchData(); // Call the fetchData function when the component mounts
  }, []);
  
  if((userLogin != undefined && userLocation != undefined) && !loading) {
    userLogin.map((login) => {
      userLocation.map(location => {
        if(login["username"] == location["username"]) {
          mapMarkers.push({fullName: (login["firstName"] + " " + login["lastName"]), username: login["username"], coords: {latitude: location["latitude"], longitude: location["longitude"]}})
        }
      })
    })
    flag = true;
  }
  const renderMarkers = () => {
    return mapMarkers.map((marker, i) => (
    <Marker
      key={i}
      coordinate={marker.coords}
      title={marker["fullName"]}
      description={marker["username"]}
      pinColor={colors[i%6]}
    />
  ));
  };
  if(userLogin != undefined || mapMarkers.length > 0 && !loading) {
    return (
        <View className="bg-white h-full w-full items-center">
            <StatusBar style="light"/>
            <Image className="h-full w-full absolute" source={require('../assets/images/lsbackground.png')}/>
            <View className="flex-row items-right mt-2">
                <Text className="flex-1"></Text>
                <IconButton className="flex-3" icon="logout" iconColor={MD3Colors.tertiary100} onPress={() => {setUser(''); console.log("Logged out."); Alert.alert('Successfully logged out.'); navigation.push('Home')}} />
            </View>
        <MapView style={{width: '100%', height: '84.85%'}} 
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: 33.8737,
          longitude: -98.5334,
          latitudeDelta: 50,
          longitudeDelta: 50,
      }}>
      {renderMarkers()}
  
      </MapView>
      <View className="items-center mt-2">
            <View className="flex-row">
                <IconButton className="flex-1" iconColor={MD3Colors.tertiary100} icon="home" onPress={() => navigation.push('Home')} />
                <IconButton className="flex-1" iconColor={MD3Colors.tertiary100}  icon="account" onPress={() => navigation.push('Profile')} />
                <IconButton className="flex-1" iconColor={MD3Colors.tertiary100}  icon="candy" onPress={() => navigation.push('Search')} />
                <IconButton className="flex-1" icon="map" />
                <IconButton className="flex-1" iconColor={MD3Colors.tertiary100}  icon="chat" onPress={() => navigation.push('Chat')} />
            </View>
            </View>
      </View>
    );
  } else {

  }
  
}
