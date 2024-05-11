import React, {useEffect, useState, useContext} from 'react';
import { Platform, Text, View, StyleSheet, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { UserContext } from '../UserInfo/UserContext';
import { StatusBar } from 'expo-status-bar';
import Animated, {FadeInDown,} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { IconButton, MD3Colors } from 'react-native-paper';

export default function UploadImageScreen() {
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState(null);
    const [foundError, setFoundError] = useState(false);
    const {user, setUser} = useContext(UserContext);
    const navigation = useNavigation();

    useEffect(() => {
        // Simulate asynchronous data fetching
        const fetchData = async () => {
              try {
                  setLoading(true); 
                  setImage("http://aelious.me:8084/show/"+user["username"])
                  } catch (error) {
                  console.error('Error fetching data:', error);
                  } finally {
                  setLoading(false); // Reset loading state after fetching data
                  }
        };
            fetchData();
        
        }, [image]);

      const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [3, 3],
          quality: 1,
        });
        
        if (!result.canceled) {
            const uploadImage = async () => {
                let formdata = new FormData();
                formdata.append("file", {uri: result.assets[0].uri, name: 'image.jpg', type:'image/jpeg'});
                return fetch("http://aelious.me:8084/uploadfile/"+user["username"], {method:'POST', headers: {'Content-Type': 'multipart/form-data', 'Accept': "application/json"}, body: formdata}).then(response => response.json()).then((responseJson) => {
                console.log("Updating Image", responseJson);
                Alert.alert('Successfully uploaded image.')
                navigation.push('Profile')
                setImage(result.assets[0].uri);
                }).catch()

            }
            const caller = async () => {
                const conf = await uploadImage();
                return conf;
            }
            caller();
            }
            
          
        }
      
    

    if (foundError) {
            return (
                <View className="bg-white h-full w-full items-center">
                    <StatusBar style="light"/>
                    <Image className="h-full w-full absolute" source={require('../assets/images/searchbg.png')}/>
                    <Text className="mt-10"></Text>
                    <Text className="mt-14 mb-10 text-white font-bold tracking-wider text-5xl">Image Error</Text>
                    <View className="flex items-left mx-8 w-[90%]">
                            <Text className="mb-4 text-pink-400 font-bold tracking-wider text-3xl">Hi, {user["first"]}.</Text>
                            <Text className="mb-1 text-pink-300 font-bold tracking-wider text-2xl">There was a problem retrieving your image data.</Text> 
                            <Text className="mb-1 text-pink-300 font-bold tracking-wider text-2xl">Developer made big oopsie.</Text>    
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
            if (!loading) {
                return (
                    <View className="bg-white h-full w-full items-center">
                        <StatusBar style="light"/>
                        <Image className="h-full w-full absolute" source={require('../assets/images/searchbg.png')}/>
                        <View className="flex-row items-right mt-2">
                            <Text className="flex-1"></Text>
                            <IconButton className="flex-3" icon="logout" iconColor={MD3Colors.tertiary100} onPress={() => {setUser(''); console.log("Logged out."); Alert.alert('Successfully logged out.'); navigation.push('Home')}} />
                        </View>
                        <Text className="mt-16 text-white font-bold tracking-wider text-4xl">Upload Image</Text>
                        <ScrollView className="flex mx-8 w-full ">
                            <View className="items-left">
                                <Text className="mb-1 ml-4 text-pink-400 font-bold tracking-wider text-3xl mt-5">Current Image:</Text>
                                </View>
                                <View className="flex items-center">
                                <Image source={{uri: image + '?' + new Date()}} style={{width: 320, height: 320}}/>
                                </View>
                                
                                <View className="items-center">
                                <Animated.View entering={FadeInDown.delay(0).duration(1000).springify()} className="w-[90%] flex-row items-center">
                                    <TouchableOpacity 
                                        className="flex-1 bg-pink-300 p-4 rounded-2xl mb-2 mt-3" onPress={()=> pickImage()}>
                                        <Text className={`font-bold text-white text-center`}>Upload New Image</Text>
                                    </TouchableOpacity>
                                </Animated.View>
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
            } else {
                return (<View><Text>LOADING</Text></View>)
            }
            
        }
    }  
            

            