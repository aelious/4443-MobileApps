// In App.js in a new project
import React, {useState, } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import HomeScreen from './screens/Home';
import SearchScreen from './screens/SearchScreen';
import SearchResults from './screens/SearchResults';
import MapScreen from './screens/MapScreen';
import DetailedResults from './screens/DetailedResults';
import Profile from './screens/ProfileScreen';
import Chat from './screens/Chat';
import LocationScreen from './screens/Location';
import UploadImageScreen from './screens/ImageUpload';
import { UserContext } from './UserInfo/UserContext';
import { ClickContext } from './UserInfo/NewMessages'
import { SentContext } from './UserInfo/SentContext';
import { LoginContext } from './UserInfo/LoginContext';
import { LocationContext } from './UserInfo/LocationContext';

const Stack = createNativeStackNavigator();

function App() {
  const [user, setUser] = useState('');
  const [clicked, setClicked] = useState(false);
  const [wasSent, setWasSent] = useState('');
  const [userLogin, setUserLogin] = useState([]);
  const [userLocation, setUserLocation] = useState([]);
  return (
    <NavigationContainer>
      <LocationContext.Provider value={{userLocation, setUserLocation}}>
      <LoginContext.Provider value={{userLogin, setUserLogin}}>
      <UserContext.Provider value={{user, setUser}}>
        <ClickContext.Provider value={{clicked, setClicked}}>
        <SentContext.Provider value={{wasSent, setWasSent}}>
        <Stack.Navigator initialRouteName="Home" screenOptions={{headerShown: false, animation: 'none'}}>
          <Stack.Screen name="Login" component={LoginScreen}/>
          <Stack.Screen name="Sign Up" component={SignupScreen} />
          <Stack.Screen name='Home' component={HomeScreen} />
          <Stack.Screen name='Search' component={SearchScreen}/>
          <Stack.Screen name='Search Results' component={SearchResults} />
          <Stack.Screen name='Map' component={MapScreen} options={{animation: 'none'}}/>
          <Stack.Screen name='Detailed Results' component={DetailedResults} />
          <Stack.Screen name='Profile' component={Profile} options={{animation: 'none'}}/>
          <Stack.Screen name='Chat' component={Chat} options={{animation: 'none'}}/>
          <Stack.Screen name='Image Upload' component={UploadImageScreen} options={{animation: 'none'}}/>
          <Stack.Screen name='Location' component={LocationScreen} options={{animation: 'none'}}/>
        </Stack.Navigator>
        </SentContext.Provider>
        </ClickContext.Provider>
      </UserContext.Provider>
      </LoginContext.Provider>
      </LocationContext.Provider>
    </NavigationContainer>
  );


/*   if (!loading && (userLogin.length != 0 && userLocation.length != 0)) {
    
    return (
      <NavigationContainer>
        <LocationContext.Provider value={{userLocation, setUserLocation}}>
        <LoginContext.Provider value={{userLogin, setUserLogin}}>
        <UserContext.Provider value={{user, setUser}}>
          <ClickContext.Provider value={{clicked, setClicked}}>
          <SentContext.Provider value={{wasSent, setWasSent}}>
          <Stack.Navigator initialRouteName="Landing" screenOptions={{headerShown: false}}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Sign Up" component={SignupScreen} />
            <Stack.Screen name='Home' component={HomeScreen} />
            <Stack.Screen name='Search' component={SearchScreen} />
            <Stack.Screen name='Search Results' component={SearchResults} />
            <Stack.Screen name='Map' component={MapScreen} />
            <Stack.Screen name='Detailed Results' component={DetailedResults} />
            <Stack.Screen name='Cart' component={Cart} />
            <Stack.Screen name='Payment' component={Payment} />
            <Stack.Screen name='Profile' component={Profile} />
            <Stack.Screen name='Chat' component={Chat}/>
            <Stack.Screen name='Conversation' component={Conversation}/>
            <Stack.Screen name='ConversationNew' component={ConversationNew} options={{animation: 'none'}}/>
            <Stack.Screen name='Location' component={LocationScreen}/>
          </Stack.Navigator>
          </SentContext.Provider>
          </ClickContext.Provider>
        </UserContext.Provider>
        </LoginContext.Provider>
        </LocationContext.Provider>
      </NavigationContainer>
    );
  } else {
    return (
      <View className="bg-white h-full w-full">
            <StatusBar style="light"/>
            <Image className="h-full w-full absolute" source={require('./assets/images/loaded.png')}/>
        </View>
    )
  } */
  
}

export default App;