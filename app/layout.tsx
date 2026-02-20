// CSS
import "../global.css";

import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "./index";
import FlashCardSession from "./flashcardsession";

const Stack = createNativeStackNavigator();

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="home" component={HomeScreen} /> 
          <Stack.Screen name="flashcardsession" component={FlashCardSession} /> 
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}