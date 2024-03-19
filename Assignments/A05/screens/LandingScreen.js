import {View, Text, Image, TouchableOpacity} from 'react-native'
import React from 'react'
import { StatusBar } from 'expo-status-bar'
import Animated, { Easing, useAnimatedStyle, useSharedValue, FadeInDown, withRepeat, withTiming} from 'react-native-reanimated'
import { useNavigation } from '@react-navigation/native'
const duration = 2000;
const easing = Easing.bezier(0.25, -0.5, 0.25, 1);

export default function LandingScreen() {
    const navigation = useNavigation();
    const sv = useSharedValue(0);

    React.useEffect(() => {
      sv.value = withRepeat(withTiming(1, { duration, easing }), -1);
    }, []);
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${sv.value * 360}deg` }],
    }));
    return (
        
        <View className="bg-white h-full w-full">
            <StatusBar style="light"/>
            <Image className="h-full w-full absolute" source={require('../assets/images/lsbackground.png')}/>
            <Text className="mt-10"></Text>
            
            <Animated.Image className="h-[400] w-[400]" source={require('../assets/images/logo.png')} style={[, animatedStyle]}/>
            <View className="flex items-center mx-8">
                <Text className="mt-30"></Text>
                <Animated.View entering={FadeInDown.delay(0).duration(1000).springify()} className={`w-full flex-row justify-center`}>
                        <TouchableOpacity 
                            className="flex-1 bg-pink-200 p-4 rounded-2xl mb-3" onPress={()=> navigation.push('Search')}>
                            <Text className={`font-bold text-white text-center`}>Search</Text>
                        </TouchableOpacity>
                    </Animated.View>
                    <Animated.View entering={FadeInDown.delay(200).duration(1000).springify()} className={`w-full flex-row justify-center`}>
                        <TouchableOpacity 
                            className="flex-1 bg-pink-200 p-4 rounded-2xl mb-3" onPress={()=> navigation.push('Login')}>
                            <Text className={`font-bold text-white text-center`}>Login</Text>
                        </TouchableOpacity>
                    </Animated.View>
                    <Animated.View entering={FadeInDown.delay(400).duration(1000).springify()} className={`w-full flex-row justify-center`}>
                        <TouchableOpacity 
                            className="flex-1 bg-pink-200 p-4 rounded-2xl mb-3" onPress={()=> navigation.push('Sign Up')}>
                            <Text className={`font-bold text-white text-center`}>Register</Text>
                        </TouchableOpacity>
                    </Animated.View>
            </View>

        </View>
    )
}