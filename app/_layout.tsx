// CSS
import "../global.css";

import { SafeAreaProvider } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "react-native";
import { useColorScheme } from "react-native";


export default function RootLayout() {
  const isDarkMode = useColorScheme() === "dark";
  
  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen
            name="flashcardsession"
            options={{ headerShown: false }}
          />
          <Stack.Screen name="result" options={{ headerShown: false }} />
        </Stack>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
