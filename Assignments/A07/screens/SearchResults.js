import {View, Text, Image, TouchableOpacity, ScrollView, FlatList, Alert} from 'react-native';
import React, {Component, useEffect, useState, useContext, useRef} from 'react';
import { StatusBar } from 'expo-status-bar';
import Animated, {FadeInDown,} from 'react-native-reanimated';
import { useNavigation, useRoute } from '@react-navigation/native';
import { UserContext } from '../UserInfo/UserContext';
import { IconButton, MD3Colors } from 'react-native-paper';

const SearchResults = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const scrollViewRef = useRef();
    const selected = route.params?.choice;
    const items = route.params?.itemList;
    const {user, setUser} = useContext(UserContext);
    let selectionLength = selected.length;
    let padding = "mb-10";
    if (selectionLength > 20) {
        padding = "mt-0";
    } 
    scrollViewRef.current?.scrollTo({y:0, animated:false})

    return (
        
        <View className="bg-white h-full w-full">
            <StatusBar style="light"/>
            <Image className="h-full w-full absolute" source={require('../assets/images/searchbg.png')}/>
            <View className="flex-row items-right mt-2">
            <IconButton className="flex-3" icon="keyboard-backspace" iconColor={MD3Colors.tertiary100} onPress={() => {navigation.push('Search')}} />
                <Text className="flex-1"></Text>
                <IconButton className="flex-3" icon="logout" iconColor={MD3Colors.tertiary100} onPress={() => {setUser(''); console.log("Logged out."); Alert.alert('Successfully logged out.'); navigation.push('Home')}} />
            </View>
            <View className="flex items-center mx-4 mt-2 h-[13.4%]">
                <Text className={padding}></Text>
                <Text className={`text-white font-bold tracking-wider text-4xl`}>{selected}</Text>
            </View>
            
            <View className="h-[69.42%]">
                <ScrollView ref={scrollViewRef}>
                    {items.map((item, i) => 
                    <TouchableOpacity key={i} className="w-full h-30" onPress={() => {
                        fetch("http://aelious.me:8084/candies/id/"+item.id)
                            .then(response => response.json()).then((responseJson) => {
                                navigation.navigate("Detailed Results", {candyQuery: responseJson["data"], choice: selected});
                            })}}>
                        <Text className="flex items-center text-white bg-pink-300 p-3 rounded-2xl h-10 mb-1">{item.name} ${item.price}</Text>
                    </TouchableOpacity>

                    )}
                </ScrollView>
            </View>
            <View className="items-center mt-4">
            <View className="flex-row">
                <IconButton className="flex-1" iconColor={MD3Colors.tertiary100}  icon="home" onPress={() => navigation.navigate('Home')} />
                <IconButton className="flex-1" iconColor={MD3Colors.tertiary100}  icon="account" onPress={() => navigation.navigate('Profile')} />
                <IconButton className="flex-1" icon="candy" />
                <IconButton className="flex-1" iconColor={MD3Colors.tertiary100}  icon="map" onPress={() => navigation.navigate('Map')} />
                <IconButton className="flex-1" iconColor={MD3Colors.tertiary100}  icon="chat" onPress={() => navigation.navigate('Chat')} />
            </View>
            </View>
        </View>
        
    )
}

export default SearchResults;