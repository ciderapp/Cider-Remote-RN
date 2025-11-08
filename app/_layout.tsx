import { Roboto_400Regular, Roboto_500Medium, Roboto_700Bold, Roboto_900Black, useFonts as useRobotoFonts } from "@expo-google-fonts/roboto";
import { RobotoFlex_400Regular, useFonts as useRobotoFlexFonts } from "@expo-google-fonts/roboto-flex";
import { ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { router, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { safeMaterialYouChecker, useMaterialYouTheme } from "@/hooks/useMaterialYouTheme";
import { MaterialYouService } from "@assembless/react-native-material-you";
import TrackPlayer, { AppKilledPlaybackBehavior, Capability } from "@weights-ai/react-native-track-player";
import { createAudioPlayer } from "expo-audio";
import * as Linking from 'expo-linking';
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";
import { configureReanimatedLogger } from "react-native-reanimated";

configureReanimatedLogger({
  strict: false, // Reanimated runs in strict mode by default
});
function ThemedProviders() {
  const { paperTheme, navTheme } = useMaterialYouTheme();
  TrackPlayer.setupPlayer().then(() => {;
  TrackPlayer.updateOptions({
        // Media controls capabilities
        capabilities: [
            Capability.Play,
            Capability.Pause,
            Capability.Stop,
            Capability.SkipToNext,
            Capability.SkipToPrevious,
        ],
        notificationCapabilities: [
            Capability.Play,
            Capability.Pause,
            Capability.Stop,
            Capability.SkipToNext,
            Capability.SkipToPrevious,
        ],

        playIcon: require("../assets/icons/play-pause.png"),
        pauseIcon: require("../assets/icons/play-pause.png"),
        stopIcon: require("../assets/icons/stop.png"),
        previousIcon: require("../assets/icons/skip-previous.png"),
        nextIcon: require("../assets/icons/skip-next.png"),

        android: {
            appKilledPlaybackBehavior: AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
            
        },
  })});

  useEffect(() => {
    function deepLinkHandler(data: { url: string }) {
      console.log('deepLinkHandler', data.url);
      // Navigate to Now Playing screen when notification is clicked
      router.navigate('/modals/now-playing');

    }
    const subscription = Linking.addEventListener('url', deepLinkHandler);

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <PaperProvider theme={paperTheme}>
      <ThemeProvider value={navTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
          <Stack.Screen
            name="albums/[id]/index"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="playlists/[id]/index"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="artists/[id]/index"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="artists/[id]/view/[viewId]/index"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="play-action"
            options={{
              presentation: "transparentModal",
              animation: "slide_from_bottom",
              title: "Play Action",
              headerShown: false,
              animationDuration: 300,
            }}
          />
          <Stack.Screen
            name="modals/now-playing"
            options={{
              presentation: "transparentModal",
              animation: "slide_from_bottom",
              title: "Now Playing",
              headerShown: false,
              animationMatchesGesture: true,
            }}
          />
          <Stack.Screen
            name="modals/connect-qr"
            options={{
              presentation: "modal",
              animation: "slide_from_bottom",
              title: "Scan QR Code",
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="modals/settings"
            options={{
              presentation: "modal",
              animation: "slide_from_bottom",
              headerShown: false,
            }}
          />
        </Stack>

        <StatusBar style="auto" />
      </ThemeProvider>
    </PaperProvider>
  );
}





export let audioPlayer = createAudioPlayer(undefined, 50 );

export default function RootLayout() {
  const [localLoaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    RobotoFlex: require("../assets/fonts/RobotoFlex.ttf"),
  });
  const [googleFlexLoaded] = useRobotoFlexFonts({ RobotoFlex_400Regular });
  const [googleRobotoLoaded] = useRobotoFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_700Bold,
    Roboto_900Black,
  });
  const loaded = localLoaded && googleFlexLoaded && googleRobotoLoaded;

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  const materialYouElement = safeMaterialYouChecker() ? (
    <MaterialYouService>
      <ThemedProviders/>
    </MaterialYouService>
  ) : (
    <ThemedProviders/>
  );


  return (
    <GestureHandlerRootView>
      {materialYouElement}
    </GestureHandlerRootView>
  );

}

