import {View, Text, Image, TextInput, TouchableOpacity, Alert} from 'react-native'
import React, {useState, useContext, useEffect} from 'react'
import { StatusBar } from 'expo-status-bar'
import Animated, { BounceInLeft, BounceInRight, FadeInDown,} from 'react-native-reanimated'
import { useNavigation } from '@react-navigation/native'
import { UserContext } from '../UserInfo/UserContext'
import { JSHash, CONSTANTS } from 'react-native-hash'
import defaultImage from '../assets/images/defaultUserImage.png'

export default function SignupScreen() {
    const navigation = useNavigation();
    const {setUser} = useContext(UserContext);
    const [pass, setPass] = useState('');
    const [rePass, setRePass] = useState('');
    const [tempUser, setTempUser] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [reEmail, setReEmail] = useState('');
    const processLogin = async (login, emailCheck) => {
        if(login.length == 0) {
            if (pass != '' && pass.length > 5) {
                if (pass == rePass) {
                    if (firstName != '') {
                        if (lastName != '') {
                            if (email != '' && email == reEmail) {
                                    if (emailCheck.length == 0) {
                                        if (email.search('@')){
                                            fetch("http://aelious.me:8084/location/"+tempUser.toLowerCase()+"/0.00/0.00", {
                                                method:'POST',
                                            })
                                            JSHash(pass, CONSTANTS.HashAlgorithms.sha1).then(b => {
                                                fetch("http://aelious.me:8084/register/"+tempUser.toLowerCase()+"/"+b+"/"+firstName+"/"+lastName+"/"+email, {
                                                    method:'POST',
                                            })})
                                            let formdata = new FormData();
                                            formdata.append("file", {uri: Image.resolveAssetSource(defaultImage).uri, name: 'image.png', type:'image/png'});
                                            fetch("http://aelious.me:8084/uploadfile/"+tempUser.toLowerCase(), {method:'POST', headers: {'Content-Type': 'multipart/form-data', 'Accept': "application/json"}, body: formdata}).then(response => response.json()).then((responseJson) => {
                                                console.log("Updating Image", responseJson);
                                            }).catch()
                                            setUser({username: tempUser.toLowerCase(), first: firstName, last: lastName, contacts: ['aelious', 'bannie', 'awills', 'jmama']});
                                            Alert.alert('Account successfully created.');
                                            navigation.navigate("Home");
                                            console.log("Account successfully created.");
                                        } else {
                                            Alert.alert('Please enter a valid email.');
                                        }
                                    } else {
                                        Alert.alert('Email already in use.');
                                    } 
                                } else {
                                    Alert.alert('Please enter a valid email and ensure your emails match');
                                }
                            } else {
                                Alert.alert('Please enter a last name.');
                            }
                        } else {
                            Alert.alert('Please enter a first name.');
                        }
                    } else {
                        Alert.alert('Please ensure your passwords match.');
                    }
                } else {
                    Alert.alert('Password must be 6 or more characters.');
                }
            } else {
                Alert.alert('Username already in use.');
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
    const fetchEmail = async () => {
        try {
            const response = await fetch("http://aelious.me:8084/email/"+(email).toLowerCase());
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
            const checkEmail = await fetchEmail();
            try {processLogin(data, checkEmail);} 
            catch (error) {console.log("ERROR:",error); throw error;}
        } catch (error) {
            console.log("ERROR:",error);
            throw error;
        }
    }

    return (
        <View className="bg-white h-full w-full">
            <StatusBar style="light"/>
            <Image className="h-full w-full absolute" source={require('../assets/images/lsbackground.png')}/>
            <View className="flex-row justify-around w-full absolute">
                <Animated.Image entering={BounceInRight.duration(1000).springify().damping(3)} className="h-[217.39] w-[100]" source={require('../assets/images/stars.png')}/>
                <Animated.Image entering={BounceInRight.delay(400).duration(1000).springify().damping(3)} className="h-[120] w-[50]" source={require('../assets/images/stars.png')}/>
                <Animated.Image entering={BounceInLeft.delay(200).duration(1000).springify().damping(3)} className="h-[175] w-[65]" source={require('../assets/images/stars.png')}/>
            </View>
            <View className="h-full w-full flex justify-around pt-40 pb-10">
                <View className="flex items-center">
                    <Text className="text-white font-bold tracking-wider text-5xl absolute">Sign up</Text>
                </View>
                <View className="flex items-center mx-4">
                
                <Animated.View entering={FadeInDown.duration(1000).springify()} className="bg-pink-100 p-3 rounded-2xl w-full mb-1">
                        <TextInput placeholder="Username" placeholderTextColor='gray' require value={tempUser} onChangeText={setTempUser}/>
                    </Animated.View>
                    <Animated.View entering={FadeInDown.delay(100).duration(1000).springify()} className={`bg-pink-100 p-3 rounded-2xl w-full mb-1`}>
                        <TextInput placeholder="Password" placeholderTextColor={'gray'} secureTextEntry require value={pass} onChangeText={setPass}/>
                    </Animated.View>
                    <Animated.View entering={FadeInDown.delay(200).duration(1000).springify()} className={`bg-pink-100 p-3 rounded-2xl w-full mb-1`}>
                        <TextInput placeholder="Re-enter Password" secureTextEntry placeholderTextColor={'gray'} require value={rePass} onChangeText={setRePass}/>
                    </Animated.View>
                    <Animated.View entering={FadeInDown.delay(300).duration(1000).springify()} className={`bg-pink-100 p-3 rounded-2xl w-full mb-1`}>
                        <TextInput placeholder="First Name" placeholderTextColor={'gray'} require value={firstName} onChangeText={setFirstName}/>
                    </Animated.View>
                    <Animated.View entering={FadeInDown.delay(400).duration(1000).springify()} className={`bg-pink-100 p-3 rounded-2xl w-full mb-1`}>
                        <TextInput placeholder="Last Name" placeholderTextColor={'gray'} require value={lastName} onChangeText={setLastName}/>
                    </Animated.View>
                    <Animated.View entering={FadeInDown.delay(500).duration(1000).springify()} className={`bg-pink-100 p-3 rounded-2xl w-full mb-1`}>
                        <TextInput placeholder="Email" placeholderTextColor={'gray'} require value={email} onChangeText={setEmail}/>
                    </Animated.View>
                    <Animated.View entering={FadeInDown.delay(600).duration(1000).springify()} className={`bg-pink-100 p-3 rounded-2xl w-full mb-1`}>
                        <TextInput placeholder="Re-enter Email" placeholderTextColor={'gray'} require value={reEmail} onChangeText={setReEmail}/>
                    </Animated.View>
                    <Animated.View entering={FadeInDown.delay(800).duration(1000).springify()} className={`w-full flex-row justify-center`}>
                        <TouchableOpacity className="w-full bg-pink-200 p-3 rounded-2xl mb-3" onPress={() => { if(tempUser != '') {getLogin()}  else {Alert.alert('Please enter a username.')}}}>
                            <Text className={`font-bold text-white text-center`}>Register</Text>
                        </TouchableOpacity>
                    </Animated.View>
                    <Animated.View entering={FadeInDown.delay(1000).duration(1000).springify()} className="flex-row justify-center">
                        <Text>Already have an account? </Text>
                        <TouchableOpacity onPress={()=> navigation.push('Login')}>
                            <Text className="text-pink-300">Login</Text>
                        </TouchableOpacity>
                    </Animated.View>
                    <Animated.View entering={FadeInDown.delay(1200).duration(1000).springify()} className="flex-row justify-center">
                        <TouchableOpacity onPress={()=> navigation.push('Home')}>
                            <Text className="text-pink-300">Home</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </View>

            </View>
        </View>
    )
}