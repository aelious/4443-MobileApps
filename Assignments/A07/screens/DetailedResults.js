import {View, Text, Image, TouchableOpacity, ScrollView, FlatList, Alert} from 'react-native';
import React, {Component, useEffect, useState, useContext} from 'react';
import { StatusBar } from 'expo-status-bar';
import Animated, {FadeInDown,} from 'react-native-reanimated';
import { useNavigation, useRoute } from '@react-navigation/native';
import { UserContext } from '../UserInfo/UserContext';
import { IconButton, MD3Colors } from 'react-native-paper';

const DetailedResults = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const candy = route.params?.candyQuery;
    const selected = route.params?.choice;
    const {user, setUser} = useContext(UserContext);
    let padding = "mt-8";


    return (
        
        <View className="bg-white h-full w-full">
            <StatusBar style="light"/>
            <Image className="h-full w-full absolute" source={require('../assets/images/searchbg.png')}/>
            <View className="flex-row items-right mt-2">
            <IconButton className="flex-3" icon="keyboard-backspace" iconColor={MD3Colors.tertiary100} onPress={() => {
                                console.log(selected);
                                fetch("http://aelious.me:8084/candies/category/"+selected)
                                .then(response => response.json()).then((responseJson) => {
                                    navigation.navigate("Search Results", {itemList: responseJson["data"], choice: selected});
                                })
                            }} />
                <Text className="flex-1"></Text>
                <IconButton className="flex-3" icon="logout" iconColor={MD3Colors.tertiary100} onPress={() => {setUser(''); console.log("Logged out."); Alert.alert('Successfully logged out.'); navigation.push('Home')}} />
            </View>
            <View className="flex items-center mx-4">
            <Text className={padding}></Text>
                <Text className={`text-white font-bold tracking-wider text-5xl mt-2 mb-3`}>Candy Details</Text>
                <Animated.View entering={FadeInDown.delay(0).duration(1000).springify()} className={`w-full flex-row justify-center`}>
                <View className={"w-full h-[100%]"}>
                </View>
                </Animated.View>
            </View>
            
            <View className="h-[68.7%]">
                <ScrollView>
                    <View className="flex items-left mx-4 space-y-2">
                        <Text className="text-pink-500 font-bold tracking-wider text-2xl">{candy[0]["name"]}</Text>
                        <View className="flex-row">
                        <Text className="text-pink-500 font-bold tracking-wider text-2xl">Price: </Text>
                        <Text className="text-pink-400 font-bold tracking-wider text-2xl">${candy[0]["price"]}</Text>
                        </View>
                        <Image style={{width: '100%', height: 340}}source={{uri: candy[0]["img_url"]}}/>
                        <Text className="text-pink-500 font-bold tracking-wider text-2xl">Description:</Text>
                        <Text className="text-pink-400 font-bold tracking-wider">{candy[0]["desc"]}</Text>
{/*                         <TouchableOpacity className="bg-pink-300 p-3 rounded-2xl h-10" onPress={()=> { navigation.push('Search') }}>
                            <Text className={`font-bold text-white text-center`}>Add to cart</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="bg-pink-300 p-3 rounded-2xl h-10" onPress={()=> { navigation.push('Search') }}>
                            <Text className={`font-bold text-white text-center`}>Checkout</Text>
                        </TouchableOpacity> */}
                        <Text></Text>
                        <Text className="text-pink-500 font-bold tracking-wider text-2xl">Related Categories:</Text>
                        {candy.map((item, i) => {
                            return (
                                <TouchableOpacity key={i} className="w-full bg-pink-200 p-3 rounded-2xl h-10" onPress={()=> {
                                    console.log(item["category"]);
                                    fetch("http://aelious.me:8084/candies/category/"+item["category"])
                                    .then(response => response.json()).then((responseJson) => {
                                        navigation.navigate("Search Results", {itemList: responseJson["data"], choice: item["category"]});
                                    })
                                    }}>
                                    <Text className={`font-bold text-white text-center`}>{item["category"]}</Text>
                                    </TouchableOpacity>
                            )
                        })}
                    </View>
                    <Animated.View entering={FadeInDown.delay(200).duration(1000).springify()} className={`flex items-center mx-4 space-y-4`}>
                        <TouchableOpacity className="w-full bg-pink-300 p-3 rounded-2xl h-10 mt-2 mb-4" onPress={()=> { navigation.push('Search') }}>
                            <Text className={`font-bold text-white text-center`}>Return to Search</Text>
                        </TouchableOpacity>
                </Animated.View>
                </ScrollView>
            </View>
            <View className="items-center mt-4">
            <View className="flex-row">
                <IconButton className="flex-1"  iconColor={MD3Colors.tertiary100} icon="home" onPress={() => navigation.push('Home')} />
                <IconButton className="flex-1" iconColor={MD3Colors.tertiary100}  icon="account" onPress={() => navigation.push('Profile')} />
                <IconButton className="flex-1"  icon="candy" />
                <IconButton className="flex-1" iconColor={MD3Colors.tertiary100}  icon="map" onPress={() => navigation.push('Map')} />
                <IconButton className="flex-1" iconColor={MD3Colors.tertiary100}  icon="chat" onPress={() => navigation.push('Chat')} />
            </View>
            </View>
        </View>
    )
}

export default DetailedResults;