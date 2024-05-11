// In App.js in a new project

import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from './screens/SplashScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import LandingScreen from './screens/LandingScreen';
import SearchScreen from './screens/SearchScreen';


const Stack = createNativeStackNavigator();

function App() {
  return (
    // Builds a navigation container. This is essentially the entire app.
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{headerShown: false}}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Sign Up" component={SignupScreen} />
        <Stack.Screen name='Landing' component={LandingScreen} />
        <Stack.Screen name='Search' component={SearchScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;