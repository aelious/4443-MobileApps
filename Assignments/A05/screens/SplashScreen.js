import React, { useEffect } from "react";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { View, Text, Image} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";



const duration = 2000;
const easing = Easing.bezier(0.25, -0.5, 0.25, 1);

const SplashScreen = () => {
    {/* Testing sound killed the program, so this is temporary for now. */}
/*     Sound.setCategory('Playback');
    var ding = new Sound('../assets/sounds/loading.mp3', Sound.MAIN_BUNDLE, (error) => {
        if (error) {
          console.log('failed to load the sound', error);
          return;
        }
        // when loaded successfully
        console.log('duration in seconds: ' + whoosh.getDuration() + 'number of channels: ' + whoosh.getNumberOfChannels());
    });
    ding.play(success => {
        if (success) {
          console.log('successfully finished playing');
        } else {
          console.log('playback failed due to audio decoding errors');
        }
    }); */
    const sv = useSharedValue(0);

    React.useEffect(() => {
      sv.value = withRepeat(withTiming(1, { duration, easing }), -1);
    }, []);
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${sv.value * 360}deg` }],
      }));
    
    const navigation = useNavigation();
    const navigateToLogin = () => {
        navigation.navigate('Landing');
    };
    useEffect(() => {
        const timeout = setTimeout(navigateToLogin, 3000);
        return () => {
            clearTimeout(timeout);}
    }, []);
    return (
        <View className="bg-white h-full w-full">
            <StatusBar style="light"/>
            <Image className="h-full w-full absolute" source={require('../assets/images/lbg.png')}/>
            <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
            <Text className="text-white font-bold tracking-wider text-5xl">Loading</Text>
            <Animated.Image source={require('../assets/images/stars.png')} style={[, animatedStyle]} />
            </View>
        </View>
        
    );
    
    
    
};
export default SplashScreen;
