import {View, Text, Image, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView} from 'react-native'
import React, {useContext, useState, useEffect} from 'react'
import { StatusBar } from 'expo-status-bar'
import Animated, { BounceInLeft, BounceInRight, FadeInDown,} from 'react-native-reanimated'
import { useNavigation } from '@react-navigation/native'
import { UserContext } from '../UserInfo/UserContext'
import { ClickContext } from '../UserInfo/NewMessages'
import { JSHash, CONSTANTS } from 'react-native-hash'
import { LoginContext } from '../UserInfo/LoginContext'



export default function LoginScreen() {
    const navigation = useNavigation();
    const {setUser} = useContext(UserContext);
    const [pass, setPass] = useState('');
    const [tempUser, setTempUser] = useState('');

    const processLogin = async (login) => {
        console.log("Searching for user...");  
        if (login.length == 0) {
            console.log("User not found.");
            Alert.alert('User not found.');
        } else {
            console.log("User found.");
            JSHash(pass, CONSTANTS.HashAlgorithms.sha1).then(b => {
                if ((login[0]["password"] == b)) {
                    console.log(login)
                    setUser({username: login[0]["username"], first: login[0]["firstName"], last: login[0]["lastName"], contacts: login[0]["contacts"]});
                    Alert.alert('Successful Login.');
                    console.log("SUCCESSFUL LOGIN");
                    navigation.push("Home");
                } else {
                    Alert.alert('Password Incorrect.');
                    console.log("WRONG PASSWORD");
                    setPass('');
                }
            })
        }
    }

    const fetchLogin = async () => {
        try {
            const response = await fetch("http://aelious.me:8084/"+(tempUser).toLowerCase());
            if (!response.ok) {
              throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            return data["data"]; // Assuming data is in JSON format
          } catch (error) {
            console.error('Error fetching data:', error);
            throw error; // Rethrow the error to be handled by the calling code
          }
    }
    
    const getLogin = async () => {
        try {
            const data = await fetchLogin();
            try {processLogin(data);} 
            catch (error) {console.log("ERROR:",error); throw error;}
            
        } catch (error) {
            console.log("ERROR:",error);
            throw error;
        }
    }
    
    return (
        <KeyboardAvoidingView className="bg-white h-full w-full">
            <StatusBar style="light"/>
            <Image className="h-full w-full absolute" source={require('../assets/images/background.png')}/>
           
            <View className="flex-row justify-around w-full absolute">
                <Animated.Image entering={BounceInRight.duration(1000).springify().damping(3)} className="h-[250] w-[115]" source={require('../assets/images/stars.png')}/>
                <Animated.Image entering={BounceInRight.delay(400).duration(1000).springify().damping(3)} className="h-[120] w-[50]" source={require('../assets/images/stars.png')}/>
                <Animated.Image entering={BounceInLeft.delay(200).duration(1000).springify().damping(3)} className="h-[175] w-[65]" source={require('../assets/images/stars.png')}/>
            </View>
            <View className="h-full w-full flex justify-around pt-40 pb-10">
                <View className="flex items-center">
                    <Text className="text-white font-bold tracking-wider text-5xl absolute">Login</Text>
                </View>
                <View className="flex items-center mx-4 space-y-4">
                    <Animated.View entering={FadeInDown.duration(1000).springify()} className="bg-pink-100 p-5 rounded-2xl w-full mt-10">
                        <TextInput placeholder="Username" placeholderTextColor='gray' require value={tempUser} onChangeText={setTempUser}/>
                    </Animated.View>
                    <Animated.View entering={FadeInDown.delay(200).duration(1000).springify()} className={`bg-pink-100 p-5 rounded-2xl w-full mb-3`}>
                        <TextInput placeholder="Password" placeholderTextColor={'gray'} secureTextEntry require value={pass} onChangeText={setPass}/>
                    </Animated.View>
                    
                    <Animated.View entering={FadeInDown.delay(400).duration(1000).springify()} className={`w-full flex-row justify-center`}>
                        <TouchableOpacity className="w-full bg-pink-200 p-3 rounded-2xl mb-3" onPress={()=> getLogin()}>
                            <Text className={`font-bold text-white text-center`}>Login</Text>
                        </TouchableOpacity>
                    </Animated.View>
                    <Animated.View entering={FadeInDown.delay(600).duration(1000).springify()} className="flex-row justify-center">
                        <Text>Don't have an account? </Text>
                        <TouchableOpacity onPress={()=> {setUser(''); navigation.push('Sign Up')}}>
                            <Text className="text-pink-300">Sign up</Text>
                        </TouchableOpacity>
                    </Animated.View>
                    <Animated.View entering={FadeInDown.delay(800).duration(1000).springify()} className="flex-row justify-center">
                        <TouchableOpacity onPress={()=> {setUser('');navigation.push('Home')}}>
                            <Text className="text-pink-300">Home</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </View>

            </View>
        </KeyboardAvoidingView>
    )
}