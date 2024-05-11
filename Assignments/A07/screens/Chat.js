import {View, Text, Image, TouchableOpacity, Alert, ScrollView} from 'react-native'
import React, {useContext, useState} from 'react'
import { StatusBar } from 'expo-status-bar'
import { useNavigation } from '@react-navigation/native'
import { UserContext } from '../UserInfo/UserContext'
import { IconButton, MD3Colors, TextInput } from 'react-native-paper'
import { messages } from '../assets/messages'
import { SelectList } from 'react-native-dropdown-select-list'

export default function Chat() {
    const [currContact, setCurr] = useState('');
    const navigation = useNavigation();
    const {user, setUser} = useContext(UserContext);
    const [newMessage, setNewMessage] = useState('');
    const [tempMessage, setTempMessage] = useState(false);

    let chatMessages = []
    if(currContact !='') {
        chatMessages = messages.filter((message) => 
            (message["sender"] == currContact && message["receiver"] == (user["username"])) ||
            (message["receiver"] == currContact && message["sender"] == (user["username"]))
        )
    }
    if (user != '' && user["contacts"] != undefined){
        return (

            <View className="bg-white h-full w-full items-center">
                <StatusBar style="light"/>
                <Image className="h-full w-full absolute" source={require('../assets/images/lsbackground.png')}/>
                <View className="flex-row items-right mt-2">
                    <Text className="flex-1"></Text>
                    <IconButton className="flex-3" icon="logout" iconColor={MD3Colors.tertiary100} onPress={() => {setUser(''); console.log("Logged out."); Alert.alert('Successfully logged out.'); navigation.push('Home')}} />
                </View>
            <StatusBar style="light"/>
            <View className="items-center">
            <Text className="mt-6 mb-8 text-white font-bold tracking-wider text-3xl">{(currContact != '') ? "Conversation with " + currContact: "Chat"}</Text>
            </View>
            {/* <Animated.Image className="h-[400] w-[400]" source={require('../assets/images/reallogo.png')} style={[, animatedStyle]}/> */}
            <View className={"w-full"}>
                <SelectList placeholder='Select Contact' data={user["contacts"]} setSelected={setCurr} search={false}/>
            </View>
            <ScrollView className="flex mx-4">
            <View className="flex-1 bg-pink-400 p-4 rounded-2xl mb-1 mt-1 ml-5">
                                <View className="flex-row">
                                    <Text className=" text-white"> {(currContact != '') ? ("This is the start of your conversation with " + currContact) : "Please select a contact." }</Text>
                                </View>
                            
                            </View>
                {chatMessages.map((message, i) => {
                    
                    if (message["sender"] == (user["username"])) {
                        return (
                    
                            <View key={i} className="flex-1 bg-pink-400 p-4 rounded-2xl mb-1 mt-1 ml-5">
                                <View className="flex-row">
                                    <Text className={"flex-1 text-white text-left"}>{message["timestamp"]}</Text>
                                    
                                    <Text className={"text-white text-right"}>{message["sender"]}: </Text>
                                </View>
                                
                                <Text className={`font-bold text-white text-right`}>{message["message"]}</Text>
                            </View>)
                    }
                    return (
                    
                    <View key={i} className="flex-1 bg-pink-300 p-4 rounded-2xl mb-1 mt-1 mr-5">
                        <View className="flex-row w-full">
                                    <Text className={"flex-1 text-white text-left"}>{message["sender"]}</Text>
                                    
                                    <Text className={"flex-1 text-white text-right"}>{message["timestamp"]}: </Text>
                                </View>
                        <Text className={`font-bold text-white text-left`}>{message["message"]}</Text>
                    </View>)
                    
                })}
                {(tempMessage != '') ? <View className="flex-1 bg-pink-400 p-4 rounded-2xl mb-1 mt-1 ml-5">
                                <View className="flex-row">
                                    <Text className={"flex-1 text-white text-left"}>Just now.</Text>
                                    
                                    <Text className={"text-white text-right"}>{user["username"]}: </Text>
                                </View>
                                
                                <Text className={`font-bold text-white text-right`}>{tempMessage}</Text>
                            </View> : <View></View>}
                
                <View className="flex-row">
                    <TextInput placeholder="New message" placeholderTextColor='gray' className="flex-1 bg-pink-100 p-4 rounded-2xl mr-2 h-10" require value={newMessage} onChangeText={setNewMessage}/>
                    <TouchableOpacity className="flex-4 bg-pink-300 p-5 rounded-2xl mt-3 mb-3" onPress={() => {setTempMessage(newMessage); setNewMessage('')}}>
                        <Text className={`font-bold text-white text-center`}>Send</Text>
                    </TouchableOpacity>
                </View>
                
            </ScrollView>
            
                <View className="items-center">
                <View className="flex-row">
                    <IconButton className="flex-1" iconColor={MD3Colors.tertiary100} icon="home" onPress={() => navigation.push('Home')} />
                    <IconButton className="flex-1" iconColor={MD3Colors.tertiary100}  icon="account" onPress={() => navigation.push('Profile')} />
                    <IconButton className="flex-1" iconColor={MD3Colors.tertiary100}  icon="candy" onPress={() => navigation.push('Search')} />
                    <IconButton className="flex-1" iconColor={MD3Colors.tertiary100} icon="map" onPress={() => navigation.push('Map')} />
                    <IconButton className="flex-1"  icon="chat"  />
                </View>
                </View>
            </View>
        )
    } else {
        <View><Text>ERROR</Text></View>
    }
    
}