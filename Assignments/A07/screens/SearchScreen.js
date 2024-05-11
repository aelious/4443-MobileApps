import {View, Text, Image, TouchableOpacity, FlatList, ScrollView, Alert} from 'react-native';
import React, {Component, useState, setState, useReducer, useContext} from 'react';
import { StatusBar } from 'expo-status-bar';
import Animated, {FadeInDown,} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { SelectList } from 'react-native-dropdown-select-list';
import { categories } from '../assets/categories';
import { UserContext } from '../UserInfo/UserContext';
import { IconButton, MD3Colors } from 'react-native-paper';




 const SearchScreen = () => {
    const navigation = useNavigation();
    const [selected, setSelected] = useState("");
    const {user, setUser} = useContext(UserContext);
    return (
        <View className="bg-white h-full w-full">
            <StatusBar style="light"/>
            <Image className="h-full w-full absolute" source={require('../assets/images/searchbg.png')}/>
            <View className="flex-row items-right mt-2">
                <Text className="flex-1"></Text>
                <IconButton className="flex-3" icon="logout" iconColor={MD3Colors.tertiary100} onPress={() => {setUser(''); console.log("Logged out."); Alert.alert('Successfully logged out.'); navigation.push('Home')}} />
            </View>
            <ScrollView>
                <View className="flex items-center mx-4 space-y-4">
                <Text className="text-white mt-8"></Text>
                <Text className={`text-white font-bold tracking-wider text-5xl`}>Search</Text>
                <View entering={FadeInDown.delay(0).duration(1000).springify()} className={`w-full flex-row justify-center`}>
                <View className={"w-full h-[100%]"}>
                    <SelectList placeholder='Select Category' data={categories} setSelected={setSelected} search={false}/>
                </View>
                </View>
                <View className={`w-full flex-row justify-center`}>
                        <TouchableOpacity className="w-full bg-pink-200 p-3 rounded-2xl h-10" onPress={()=> {
                            if (selected != undefined) {
                                console.log(selected);
                                fetch("http://aelious.me:8084/candies/category/"+selected)
                                .then(response => response.json()).then((responseJson) => {
                                    navigation.navigate("Search Results", {itemList: responseJson["data"], choice: selected});
                                })
                            } else {
                                Alert.alert('Please select a category')
                            }
                            
                            }}>
                            <Text className={`font-bold text-white text-center`}>Search Candies</Text>
                        </TouchableOpacity>
                </View>
                </View>
            </ScrollView>
            <View className="items-center">
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

export default SearchScreen;