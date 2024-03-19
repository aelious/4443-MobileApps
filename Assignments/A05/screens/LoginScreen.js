import {View, Text, Image, TextInput, TouchableOpacity} from 'react-native'
import React, {useState} from 'react'
import { StatusBar } from 'expo-status-bar'
import Animated, { BounceInLeft, BounceInRight, FadeInDown,} from 'react-native-reanimated'
import { useNavigation } from '@react-navigation/native'

export default function LoginScreen() {
    const navigation = useNavigation();
    const [user, password, userTextChange, pwTextChange] = useState('');
    
    return (
        <View className="bg-white h-full w-full">
            <StatusBar style="light"/>
            <Image className="h-full w-full absolute" source={require('../assets/images/background.png')}/>
            
            {/*stars*/}
            <View className="flex-row justify-around w-full absolute">
                <Animated.Image entering={BounceInRight.duration(1000).springify().damping(3)} className="h-[250] w-[115]" source={require('../assets/images/stars.png')}/>
                <Animated.Image entering={BounceInRight.delay(400).duration(1000).springify().damping(3)} className="h-[120] w-[50]" source={require('../assets/images/stars.png')}/>
                <Animated.Image entering={BounceInLeft.delay(200).duration(1000).springify().damping(3)} className="h-[175] w-[65]" source={require('../assets/images/stars.png')}/>
            </View>

            {/*title and form*/}
            <View className="h-full w-full flex justify-around pt-40 pb-10">
                {/* Title */}
                <View className="flex items-center">
                    <Text className="text-white font-bold tracking-wider text-5xl">Login</Text>
                </View>
                {/* Form */}
                <View className="flex items-center mx-4 space-y-4">
                    <Animated.View entering={FadeInDown.duration(1000).springify()} className="bg-pink-100 p-5 rounded-2xl w-full">
                        <TextInput placeholder="Username" placeholderTextColor='gray' require userTextChange={user => userTextChange(user)}/>
                    </Animated.View>
                    <Animated.View entering={FadeInDown.delay(200).duration(1000).springify()} className={`bg-pink-100 p-5 rounded-2xl w-full mb-3`} require pwTextChange={password => pwTextChange(password)}>
                        <TextInput placeholder="Password" placeholderTextColor={'gray'} secureTextEntry/>
                    </Animated.View>
                    <Animated.View entering={FadeInDown.delay(400).duration(1000).springify()} className={`w-full flex-row justify-center`}>
                        <TouchableOpacity className="w-full bg-pink-200 p-3 rounded-2xl mb-3" onPress={()=> navigation.push('Landing')}>
                            <Text className={`font-bold text-white text-center`}>Login</Text>
                        </TouchableOpacity>
                    </Animated.View>
                    <Animated.View entering={FadeInDown.delay(600).duration(1000).springify()} className="flex-row justify-center">
                        <Text>Don't have an account? </Text>
                        <TouchableOpacity onPress={()=> navigation.push('Sign Up')}>
                            <Text className="text-pink-300">Sign up</Text>
                        </TouchableOpacity>
                    </Animated.View>
                    <Animated.View entering={FadeInDown.delay(800).duration(1000).springify()} className="flex-row justify-center">
                        <TouchableOpacity onPress={()=> navigation.push('Landing')}>
                            <Text className="text-pink-300">Home</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </View>

            </View>
        </View>
    )
}