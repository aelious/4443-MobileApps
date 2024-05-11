import {View, Text, Image, TouchableOpacity, TextInput, ScrollView, Alert} from 'react-native'
import React, {useContext, useState, useEffect} from 'react'
import { StatusBar } from 'expo-status-bar'
import Animated, { FadeInDown} from 'react-native-reanimated'
import { useNavigation } from '@react-navigation/native'
import { UserContext } from '../UserInfo/UserContext'
import { LocationContext } from '../UserInfo/LocationContext'
import { IconButton, MD3Colors } from 'react-native-paper'


export default function Profile() {
    const navigation = useNavigation();
    const {user, setUser} = useContext(UserContext);
    const [tempFirst, setTempFirst] = useState('');
    const [tempLast, setTempLast] = useState('');
    const [userLoc, setUserLoc] = useState('');
    const [loading, setLoading] = useState(false);

  const fetchLocationData = async () => {
    try {
      const response = await fetch("http://aelious.me:8084/location/"+user["username"]);
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
      const locationData = await fetchLocationData();
      setUserLoc(locationData);
      } catch (error) {
      console.error('Error fetching data:', error);
      } finally {
      setLoading(false); // Reset loading state after fetching data
      }
  };

  fetchData(); // Call the fetchData function when the component mounts
  }, []);
  if (!loading && userLoc != '') {
    return (

        <View className="bg-white h-full w-full items-center">
            <StatusBar style="light"/>
            <Image className="h-full w-full absolute" source={require('../assets/images/searchbg.png')}/>
            <View className="flex-row items-right mt-2">
                <Text className="flex-1"></Text>
                <IconButton className="flex-3" icon="logout" iconColor={MD3Colors.tertiary100} onPress={() => {setUser(''); console.log("Logged out."); Alert.alert('Successfully logged out.'); navigation.push('Home')}} />
            </View>
            <Text className="mt-14 mb-4 text-white font-bold tracking-wider text-5xl">Update Profile</Text>
            {/* <Animated.Image className="h-[400] w-[400]" source={require('../assets/images/reallogo.png')} style={[, animatedStyle]}/> */}
            <ScrollView className="flex items-left mx-8 w-[90%]">
                <View className="flex-row">
                <Text className="mb-4 text-pink-400 font-bold tracking-wider text-3xl">Username: </Text>
                <Text className="mb-4 text-pink-300 font-bold tracking-wider text-3xl">{user["username"]}</Text>
                </View>
                    <View className="flex-row">
                        <Text className="mb-1 text-pink-400 font-bold tracking-wider text-2xl">First Name: </Text>
                        <Text className="mb-1 text-pink-300 font-bold tracking-wider mr-3 text-2xl">{user["first"]}</Text>
                    </View>
                    <View className="flex-row">
                        <View className="bg-pink-100 p-3 rounded-2xl flex-1 mb-1 mr-1">
                            <TextInput placeholder="Update First Name" placeholderTextColor='gray' require value={tempFirst} onChangeText={setTempFirst}/>
                        </View>
                        <TouchableOpacity 
                            className="flex-2 bg-pink-300 p-4 rounded-2xl mb-1" onPress={()=> {
                                fetch("http://aelious.me:8084/"+user["username"]+"/updatefirst/"+tempFirst, {
                                    method:'PUT',
                                }).then(response => response.json()).then((responseJson) => {
                                    console.log("Fetching Data", responseJson);
                                })
                                setUser({username: user["username"], first: tempFirst, last: user["last"]});
                                setTempFirst('');
                            }}>
                            <Text className={`font-bold text-white text-center`}>Update</Text>
                        </TouchableOpacity>
                    </View>
                    <View className="flex-row">
                        <Text className="mt-3 mb-1 text-pink-400 font-bold tracking-wider text-2xl">Last Name: </Text>
                        <Text className="mt-3 mb-1 text-pink-300 font-bold tracking-wider mr-3 text-2xl">{user["last"]}</Text>
                    </View>
                    
                    <View className="flex-row">
                        <View entering={FadeInDown.delay(200).duration(1000).springify()} className="bg-pink-100 p-3 rounded-2xl flex-1 mb-1 mr-1">
                            <TextInput placeholder="Update First Name" placeholderTextColor='gray' require value={tempLast} onChangeText={setTempLast}/>
                        </View>
                        <TouchableOpacity 
                            className="flex-2 bg-pink-300 p-4 rounded-2xl mb-1" onPress={()=> {
                                fetch("http://aelious.me:8084/"+user["username"]+ "/updatelast/"+tempLast, {
                                        method:'PUT',
                                }).then(setTimeout(() => {}, 2000))
                                setUser({username: user["username"], first: user["first"], last: tempLast});
                                setTempLast('');
                            }}>
                            <Text className={`font-bold text-white text-center`}>Update</Text>
                            
                        </TouchableOpacity>
                    </View>
                    <Text className="mt-3 mb-1 text-pink-400 font-bold tracking-wider text-2xl">Current Location:</Text>
                    <View className="items-center">
                    
                    <View className="flex-row">
                        <Text className="mt-3 mb-1 text-pink-400 font-bold tracking-wider">Latitude: </Text>
                        <Text className="mt-3 mb-1 text-pink-300 font-bold tracking-wider mr-3">{userLoc[0]["latitude"]}</Text>
                        <Text className="mt-3 mb-1 text-pink-400 font-bold tracking-wider ">Longitude: </Text>
                        <Text className="mt-3 mb-1 text-pink-300 font-bold tracking-wider mr-3">{userLoc[0]["longitude"]}</Text>
                    </View>
                    
                    <View entering={FadeInDown.delay(400).duration(1000).springify()} className={`w-[90%] flex-row justify-center`}>
                        <TouchableOpacity 
                            className="flex-1 bg-pink-300 p-4 rounded-2xl mb-2 mt-3" onPress={()=> navigation.push('Location')}>
                            <Text className={`font-bold text-white text-center`}>Update Location</Text>
                        </TouchableOpacity>
                    </View>
                    <View entering={FadeInDown.delay(400).duration(1000).springify()} className={`w-[90%] flex-row justify-center`}>
                        <TouchableOpacity 
                            className="flex-1 bg-pink-300 p-4 rounded-2xl mb-2 mt-3" onPress={()=> navigation.push('Image Upload')}>
                            <Text className={`font-bold text-white text-center`}>Upload Image</Text>
                        </TouchableOpacity>
                    </View>
                    </View>                                       
            </ScrollView>
                    <View className="items-center mt-2">
            <View className="flex-row">
                <IconButton className="flex-1" iconColor={MD3Colors.tertiary100} icon="home" onPress={() => navigation.push('Home')} />
                <IconButton className="flex-1"   icon="account" />
                <IconButton className="flex-1" iconColor={MD3Colors.tertiary100}  icon="candy" onPress={() => navigation.push('Search')} />
                <IconButton className="flex-1" iconColor={MD3Colors.tertiary100} icon="map" onPress={() => navigation.push('Map')} />
                <IconButton className="flex-1" iconColor={MD3Colors.tertiary100}  icon="chat" onPress={() => navigation.push('Chat')} />
            </View>
            </View>
        </View>
    )
  } else {
    return (

        <View className="bg-white h-full w-full items-center">
            <StatusBar style="light"/>
            <Image className="h-full w-full absolute" source={require('../assets/images/searchbg.png')}/>
            <View className="flex-row items-right mt-2">
                <Text className="flex-1"></Text>
                <IconButton className="flex-3" icon="logout" iconColor={MD3Colors.tertiary100} onPress={() => {setUser(''); console.log("Logged out."); Alert.alert('Successfully logged out.'); navigation.push('Home')}} />
            </View>
            <Text className="mt-14 mb-4 text-white font-bold tracking-wider text-5xl">Update Profile</Text>
            {/* <Animated.Image className="h-[400] w-[400]" source={require('../assets/images/reallogo.png')} style={[, animatedStyle]}/> */}
            <ScrollView className="flex items-left mx-8 w-[90%]">
            <View className="flex-row">
                <Text className="mb-4 text-pink-400 font-bold tracking-wider text-3xl">Username: </Text>
                <Text className="mb-4 text-pink-300 font-bold tracking-wider text-3xl">{user["username"]}</Text>
                </View>
                    <View className="flex-row">
                        <Text className="mb-1 text-pink-400 font-bold tracking-wider text-2xl">First Name: </Text>
                        <Text className="mb-1 text-pink-300 font-bold tracking-wider mr-3 text-2xl">{user["first"]}</Text>
                    </View>
                    <View className="flex-row">
                        <View className="bg-pink-100 p-3 rounded-2xl flex-1 mb-1 mr-1">
                            <TextInput placeholder="Update First Name" placeholderTextColor='gray' require value={tempFirst} onChangeText={setTempFirst}/>
                        </View>
                        <TouchableOpacity 
                            className="flex-2 bg-pink-300 p-4 rounded-2xl mb-1" onPress={()=> {
                                console.log(user["username"]);
                                console.log("http://aelious.me:8084/"+user["username"]+"/updatefirst/"+tempFirst);
                                fetch("http://aelious.me:8084/"+user["username"]+"/updatefirst/"+tempFirst, {
                                    method:'PUT',
                                }).then(response => response.json()).then((responseJson) => {
                                    console.log("Fetching Data", responseJson);
                                    setTimeout(() => {}, 2000);
                                })
                                setUser({username: user["username"], first: tempFirst, last: user["last"]});
                                setTempFirst('');
                            }}>
                            <Text className={`font-bold text-white text-center`}>Update</Text>
                        </TouchableOpacity>
                    </View>
                    <View className="flex-row">
                        <Text className="mt-3 mb-1 text-pink-400 font-bold tracking-wider text-2xl">Last Name: </Text>
                        <Text className="mt-3 mb-1 text-pink-300 font-bold tracking-wider mr-3 text-2xl">{user["last"]}</Text>
                    </View>
                    
                    <View className="flex-row">
                        <View entering={FadeInDown.delay(200).duration(1000).springify()} className="bg-pink-100 p-3 rounded-2xl flex-1 mb-1 mr-1">
                            <TextInput placeholder="Update First Name" placeholderTextColor='gray' require value={tempLast} onChangeText={setTempLast}/>
                        </View>
                        <TouchableOpacity 
                            className="flex-2 bg-pink-300 p-4 rounded-2xl mb-1" onPress={()=> {
                                console.log("http://aelious.me:8084/"+user["username"]+"/updatelast/"+tempLast);
                                fetch("http://aelious.me:8084/"+user["username"]+ "/updatelast/"+tempLast, {
                                        method:'PUT',
                                }).then(setTimeout(() => {}, 2000))
                                setUser({username: user["username"], first: user["first"], last: tempLast});
                                setTempLast('');
                            }}>
                            <Text className={`font-bold text-white text-center`}>Update</Text>
                            
                        </TouchableOpacity>
                    </View>
                    <Text className="mt-3 mb-1 text-pink-400 font-bold tracking-wider text-2xl">Current Location:</Text>
                    <View className="items-center">
                    
                    <View className="flex-row">
                        <Text className="mt-3 mb-1 text-pink-400 font-bold tracking-wider">Latitude: </Text>
                        <Text className="mt-3 mb-1 text-pink-300 font-bold tracking-wider mr-3">Loading. . .</Text>
                        <Text className="mt-3 mb-1 text-pink-400 font-bold tracking-wider ">Longitude: </Text>
                        <Text className="mt-3 mb-1 text-pink-300 font-bold tracking-wider mr-3">Loading. . .</Text>
                    </View>
                    
                    <View entering={FadeInDown.delay(400).duration(1000).springify()} className={`w-[90%] flex-row justify-center`}>
                        <TouchableOpacity 
                            className="flex-1 bg-pink-300 p-4 rounded-2xl mb-2 mt-3" onPress={()=> navigation.push('Location')}>
                            <Text className={`font-bold text-white text-center`}>Update Location</Text>
                        </TouchableOpacity>
                    </View>
                    <View entering={FadeInDown.delay(400).duration(1000).springify()} className={`w-[90%] flex-row justify-center`}>
                        <TouchableOpacity 
                            className="flex-1 bg-pink-300 p-4 rounded-2xl mb-2 mt-3" onPress={()=> navigation.push('Location')}>
                            <Text className={`font-bold text-white text-center`}>Upload Image</Text>
                        </TouchableOpacity>
                    </View>
                    </View>                                       
            </ScrollView>
                    <View className="items-center mt-2">
            <View className="flex-row">
                <IconButton className="flex-1" iconColor={MD3Colors.tertiary100} icon="home" onPress={() => navigation.push('Home')} />
                <IconButton className="flex-1"   icon="account" />
                <IconButton className="flex-1" iconColor={MD3Colors.tertiary100}  icon="candy" onPress={() => navigation.push('Search')} />
                <IconButton className="flex-1" iconColor={MD3Colors.tertiary100} icon="map" onPress={() => navigation.push('Map')} />
                <IconButton className="flex-1" iconColor={MD3Colors.tertiary100}  icon="chat" onPress={() => navigation.push('Chat')} />
            </View>
            </View>
        </View>
    )
  }
    
}

