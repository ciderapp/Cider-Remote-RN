import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }
  return (
    <GestureHandlerRootView>
      <PaperProvider>
        <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
            <Stack.Screen name="albums/[id]/index" options={{ headerShown: false }} />
            <Stack.Screen name="playlists/[id]/index" options={{ headerShown: false }} />
            <Stack.Screen
              name="play-action"
              options={{
                presentation: 'transparentModal',
                animation: 'slide_from_bottom',
                title: 'Play Action',
                headerShown: false,
                animationDuration: 300,
              }}
            />
            <Stack.Screen
              name="modals/now-playing"
              options={{
                presentation: 'card',
                animation: 'slide_from_bottom',
                title: 'Now Playing',
                headerShown: false,
                animationMatchesGesture: true,
              }}
            />
            <Stack.Screen
              name="modals/connect-qr"
              options={{
                presentation: 'modal',
                animation: 'slide_from_bottom',
                title: 'Scan QR Code',
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="modals/settings"
              options={{
                presentation: 'modal',
                animation: 'slide_from_bottom',
                headerShown: false,
              }}
            />
          </Stack>

          <StatusBar style="auto" />
        </ThemeProvider>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}
