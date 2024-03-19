import {View, Text, Image, TouchableOpacity, FlatList} from 'react-native';
import React, {Component} from 'react';
import { StatusBar } from 'expo-status-bar';
import Animated, {FadeInDown,} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { SelectList } from 'react-native-dropdown-select-list';
import { categories } from '../assets/categories';

export default function SearchScreen() {
    const navigation = useNavigation();
    const [selected, setSelected] = React.useState("");
    
    return (
        
        <View className="bg-white h-full w-full">
            <StatusBar style="light"/>
            <Image className="h-full w-full absolute" source={require('../assets/images/searchbg.png')}/>
            
            <View className="flex items-center mx-4 space-y-4">
                <Text className="text-white mt-20"></Text>
                <Text className={`text-white font-bold tracking-wider text-5xl`}>Search</Text>
                <Text className="text-white mb-2"></Text>
                <Animated.View entering={FadeInDown.delay(0).duration(1000).springify()} className={`w-full flex-row justify-center`}>
                <View className={"w-full h-[100%]"}>
                    <SelectList data={categories} setSelected={setSelected} search={false}/>
                </View>
                </Animated.View>
                <Animated.View entering={FadeInDown.delay(200).duration(1000).springify()} className={`w-full flex-row justify-center`}>
                        <TouchableOpacity className="w-full bg-pink-200 p-3 rounded-2xl h-10" onPress={()=> {
                            console.log(selected);
                            fetch("http://aelious.me:8080/candies/category/"+selected)
                            .then(response => response.json()).then((responseJson) => {
                                console.log("Fetching Candy Data", responseJson);
                                setTimeout(() => {}, 2000);
                            });

                            }}>
                            <Text className={`font-bold text-white text-center`}>Search Candies</Text>
                            
                        </TouchableOpacity>
                </Animated.View>
                <View>
                </View>
            </View>
            <Text className="w-full bg-pink-100 p-3 rounded-2xl mt-5 h-[45%] justify-center"></Text>

            <TouchableOpacity onPress={()=> navigation.push('Landing')} className="flex-row justify-center">
                <Text className="mt-[20%] text-pink-300">Home</Text>
            </TouchableOpacity>
        </View>
    )
}

