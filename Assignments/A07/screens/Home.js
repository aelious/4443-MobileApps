import {View, Text, Image, TouchableOpacity, Alert, ScrollView} from 'react-native'
import React, {useContext} from 'react'
import { StatusBar } from 'expo-status-bar'
import Animated, { FadeInDown} from 'react-native-reanimated'
import { useNavigation} from '@react-navigation/native'
import { UserContext } from '../UserInfo/UserContext'
import { Icon, IconButton, MD3Colors } from 'react-native-paper'

const loggedIn = (navigation, user, setUser) => {
    return (
        <View className="bg-white h-full w-full items-center">
            <StatusBar style="light"/>
            <Image className="h-full w-full absolute" source={require('../assets/images/lsbackground.png')}/>
            <View className="flex-row items-right mt-2">
                <Text className="flex-1"></Text>
                <IconButton className="flex-3" icon="logout" iconColor={MD3Colors.tertiary100} onPress={() => {setUser(''); console.log("Logged out."); Alert.alert('Successfully logged out.'); navigation.push('Home')}} />
            </View>
            
        <ScrollView>
            
            <Text className="mt-4"></Text>
            
            <View className="flex items-center mx-8">
                <Text className="mt-5 mb-10 text-white font-bold tracking-wider text-3xl">Welcome back, {user["first"]}!</Text>
                <Animated.View entering={FadeInDown.delay(0).duration(1000).springify()} className={`w-full flex-row justify-center`}>
                        <TouchableOpacity 
                            className="flex-1 bg-pink-300 p-4 rounded-2xl mb-2" onPress={()=> {navigation.push('Profile')}}>
                            <Text className={`font-bold text-white text-center`}>Profile</Text>
                        </TouchableOpacity>
                    </Animated.View>
                    <Animated.View entering={FadeInDown.delay(200).duration(1000).springify()} className={`w-full flex-row justify-center`}>
                        <TouchableOpacity 
                            className="flex-1 bg-pink-300 p-4 rounded-2xl mb-2" onPress={()=> navigation.push('Search')}>
                            <Text className={`font-bold text-white text-center`}>Search</Text>
                        </TouchableOpacity>
                    </Animated.View>
                    <Animated.View entering={FadeInDown.delay(400).duration(1000).springify()} className={`w-full flex-row justify-center`}>
                        <TouchableOpacity 
                            className="flex-1 bg-pink-300 p-4 rounded-2xl mb-2" onPress={()=> navigation.push('Map')}>
                            <Text className={`font-bold text-white text-center`}>Map</Text>
                        </TouchableOpacity>
                    </Animated.View>
                    <Animated.View entering={FadeInDown.delay(600).duration(1000).springify()} className={`w-full flex-row justify-center`}>
                        <TouchableOpacity 
                            className="flex-1 bg-pink-300 p-4 rounded-2xl mb-2" onPress={()=> {navigation.push('Chat')}}>
                            <Text className={`font-bold text-white text-center`}>Chat</Text>
                        </TouchableOpacity>
                    </Animated.View>
                    <Animated.View entering={FadeInDown.delay(800).duration(1000).springify()} className={`w-full flex-row justify-center`}>
                        <TouchableOpacity 
                            className="flex-1 bg-pink-400 p-4 rounded-2xl mb-2" onPress={()=> {setUser(''); console.log("Logged out."); Alert.alert('Successfully logged out.'); navigation.push('Home')}}>
                            <Text className={`font-bold text-white text-center`}>Logout</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            </ScrollView>
            <View className="items-center">
            <View className="flex-row">
                <IconButton className="flex-1" icon="home" />
                <IconButton className="flex-1" iconColor={MD3Colors.tertiary100}  icon="account" onPress={() => navigation.push('Profile')} />
                <IconButton className="flex-1" iconColor={MD3Colors.tertiary100}  icon="candy" onPress={() => navigation.push('Search')} />
                <IconButton className="flex-1" iconColor={MD3Colors.tertiary100}  icon="map" onPress={() => navigation.push('Map')} />
                <IconButton className="flex-1" iconColor={MD3Colors.tertiary100}  icon="chat" onPress={() => navigation.push('Chat')} />
            </View>
            </View>
            
        </View>
    )
}

const notLoggedIn = (navigation) => {
    return (
        <View className="bg-white h-full w-full items-center">
            <StatusBar style="light"/>
            <Image className="h-full w-full absolute" source={require('../assets/images/lsbackground.png')}/>
            <Text className="mt-10"></Text>
            
            <Image className="h-[300] w-[400]" source={require('../assets/images/reallogo.png')} />
            <View className="flex mx-8 items-center">
                <Text className="mt-5 mb-3 text-white font-bold tracking-wider text-3xl">Welcome, guest!</Text>
                <Text className="mt-1 mb-10 text-white tracking-wider text-2xl">Please log in or create an account to continue.</Text>
                <Animated.View entering={FadeInDown.delay(0).duration(1000).springify()} className={`w-full flex-row justify-center`}>
                        <TouchableOpacity 
                            className="flex-1 bg-pink-300 p-4 rounded-2xl mb-3" onPress={()=> navigation.push('Login')}>
                            <Text className={`font-bold text-white text-center`}>Login</Text>
                        </TouchableOpacity>
                </Animated.View>
                <Animated.View entering={FadeInDown.delay(200).duration(1000).springify()} className={`w-full flex-row justify-center`}>
                    <TouchableOpacity 
                        className="flex-1 bg-pink-300 p-4 rounded-2xl mb-3" onPress={()=> navigation.push('Sign Up')}>
                        <Text className={`font-bold text-white text-center`}>Register</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </View>
    )
}


export default function HomeScreen() {
    const navigation = useNavigation();
    const {user, setUser} = useContext(UserContext);
    return ((user != '') ? loggedIn(navigation, user, setUser) : notLoggedIn(navigation, user, setUser));
}

