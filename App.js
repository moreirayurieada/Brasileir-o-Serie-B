import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Image } from 'react-native';

import HomeScreen from './screens/HomeScreen';
import NewsScreen from './screens/NewsScreen';

const Stack = createNativeStackNavigator();

export default function App() {
return (
<NavigationContainer>
<Stack.Navigator initialRouteName="HomeScreen">
<Stack.Screen
name="HomeScreen"
component={HomeScreen}
options={{ headerShown: false }}
/>
<Stack.Screen
name="NewsScreen"
component={NewsScreen}
options={{
headerTitle: () => (
<Image
source={require('../project/assets/serieB.png')}
style={{ width: 120, height: 35, resizeMode: 'contain' }}
/>
),
headerTitleAlign: 'center',
}}
/>
</Stack.Navigator>
</NavigationContainer>
);
}