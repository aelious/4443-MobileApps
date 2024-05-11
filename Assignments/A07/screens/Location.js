import React, {useEffect, useState, useContext} from 'react';
import { Text, View, Image, TouchableOpacity, ScrollView, Alert} from 'react-native';
import { UserContext } from '../UserInfo/UserContext';
import { StatusBar } from 'expo-status-bar';
import * as Location from 'expo-location';
import Animated, {FadeInDown,} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { IconButton, MD3Colors } from 'react-native-paper';


export default function LocationScreen() {
    const [errorMsg, setErrorMsg] = useState(null);
    const [flag, setFlag] = useState(false);
    const [lon, setLongitude] = useState(null);
    const [lat, setLatitude] = useState(null);
    const [foundError, setFoundError] = useState(false);
    const {user, setUser} = useContext(UserContext);
    const navigation = useNavigation();
    
    useEffect(() => {
        
        const getLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            setFoundError(true);
            return;
        }

        let location = await Location.getCurrentPositionAsync({});
        console.log(location);
        setLongitude(location["coords"]["longitude"]);
        setLatitude(location["coords"]["latitude"]);
        return;
        }
        const {routes, index} = navigation.getState();
        const currentRoute = routes[index].name;
        console.log(currentRoute)
        if(currentRoute == 'Location') {
            getLocation();
            setFlag(true);
        }
    }, []);

    if (foundError) {
            return (
                <View className="bg-white h-full w-full items-center">
                    <StatusBar style="light"/>
                    <Image className="h-full w-full absolute" source={require('../assets/images/searchbg.png')}/>
                    <Text className="mt-10"></Text>
                    <Text className="mt-14 mb-10 text-white font-bold tracking-wider text-5xl">Location Error</Text>
                    <View className="flex items-left mx-8 w-[90%]">
                            <Text className="mb-4 text-pink-400 font-bold tracking-wider text-3xl">Hi, {user["first"]}.</Text>
                            <Text className="mb-1 text-pink-300 font-bold tracking-wider text-2xl">There was a problem updating your location.</Text> 
                            <Text className="mb-1 text-pink-300 font-bold tracking-wider text-2xl">Please make sure you have given the app location permissions and ensure location services are enabled.</Text>    
                    </View>
                    <Animated.View entering={FadeInDown.delay(400).duration(1000).springify()} className={`w-[90%] flex-row justify-center`}>
                                <TouchableOpacity 
                                    className="flex-1 bg-pink-300 p-4 rounded-2xl mb-2 mt-3" onPress={()=> navigation.push('Home')}>
                                    <Text className={`font-bold text-white text-center`}>Home</Text>
                                </TouchableOpacity>
                            </Animated.View>
                </View>
            )
        } else {
            if ((lat != null && lon != null) && flag) {
                fetch("http://aelious.me:8084/location/"+user["username"]+"/"+lat+"/"+lon, {
                    method:'PUT',
                }).then(response => response.json()).then((responseJson) => {
                    console.log("Updating Location", responseJson);
                    setTimeout(() => {}, 2000);
                }).catch()
                setFlag(false);
            }
            if (!flag) {
                return (
                    <View className="bg-white h-full w-full items-center">
                        <StatusBar style="light"/>
                        <Image className="h-full w-full absolute" source={require('../assets/images/searchbg.png')}/>
                        <View className="flex-row items-right mt-2">
                            <Text className="flex-1"></Text>
                            <IconButton className="flex-3" icon="logout" iconColor={MD3Colors.tertiary100} onPress={() => {setUser(''); console.log("Logged out."); Alert.alert('Successfully logged out.'); navigation.push('Home')}} />
                        </View>
                        <Text className="mt-16 text-white font-bold tracking-wider text-4xl">Location Updated</Text>
                        {/* <Animated.Image className="h-[400] w-[400]" source={require('../assets/images/reallogo.png')} style={[, animatedStyle]}/> */}
                        <ScrollView className="flex mx-8 w-full">
                            <View className="items-left">
                                <Text className="mb-1 ml-4 text-pink-400 font-bold tracking-wider text-3xl mt-5">Hi, {user["first"]}.</Text>
                                <View className="flex items-center">
                                <Text className="mb-1 text-pink-300 font-bold tracking-wider text-2xl">Thank you for updating your location!</Text>
                                </View>
                                
                                <Text className="mb-1 ml-4 text-pink-400 font-bold tracking-wider text-2xl">Current Location:</Text>
                                <View className="flex-row justify-center">
                                    <Text className="mt-3 mb-1 text-pink-400 font-bold tracking-wider">Latitude: </Text>
                                    <Text className="mt-3 mb-1 text-pink-300 font-bold tracking-wider mr-3">{lat}</Text>
                                    <Text className="mt-3 mb-1 text-pink-400 font-bold tracking-wider ">Longitude: </Text>
                                    <Text className="mt-3 mb-1 text-pink-300 font-bold tracking-wider mr-3">{lon}</Text>
                                </View>
                                </View>
                                <View className="items-center">
                                <Animated.View entering={FadeInDown.delay(200).duration(1000).springify()} className="w-[90%] flex-row items-center">
                                    <TouchableOpacity 
                                        className="flex-1 bg-pink-300 p-4 rounded-2xl mb-2 mt-3" onPress={()=> navigation.push('Profile')}>
                                        <Text className={`font-bold text-white text-center`}>Back to Profile</Text>
                                    </TouchableOpacity>
                                </Animated.View>
                                </View>
                                
                        </ScrollView>
                        
                        
                                <View className="flex-row">
                <IconButton className="flex-1" iconColor={MD3Colors.tertiary100} icon="home" onPress={() => navigation.push('Home')} />
                <IconButton className="flex-1"   icon="account" />
                <IconButton className="flex-1" iconColor={MD3Colors.tertiary100}  icon="candy" onPress={() => navigation.push('Search')} />
                <IconButton className="flex-1" iconColor={MD3Colors.tertiary100} icon="map" onPress={() => navigation.push('Map')} />
                <IconButton className="flex-1" iconColor={MD3Colors.tertiary100}  icon="chat" onPress={() => navigation.push('Chat')} />
            </View>
                    </View>
                )
            } 
            

            
        }} 
        