import React from 'react';
import {Text, View} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/Home';
import DetailScreen from './screens/Detail';

import io from 'socket.io-client'

export const socket = io('http://10.200.158.175:5000')

socket.on('connect', () => {
  console.log('Socket is Connected')
})

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen}/>
        <Stack.Screen name="Detail" component={DetailScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default App;