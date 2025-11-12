import { Roboto_400Regular, Roboto_500Medium, Roboto_700Bold, Roboto_900Black, useFonts as useRobotoFonts } from "@expo-google-fonts/roboto";
import { RobotoFlex_400Regular, useFonts as useRobotoFlexFonts } from "@expo-google-fonts/roboto-flex";
import { ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { safeMaterialYouChecker, useMaterialYouTheme } from "@/hooks/useMaterialYouTheme";
import { nextTrack, playPause, previousTrack, seekTo, UpdateNotification } from "@/lib/playback-control";
import { MaterialYouService } from "@assembless/react-native-material-you";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import MusicControl, { Command } from "react-native-music-control";
import { PaperProvider } from "react-native-paper";
import { configureReanimatedLogger } from "react-native-reanimated";




configureReanimatedLogger({
  strict: false, // Reanimated runs in strict mode by default
});

function ThemedProviders() {
  const { paperTheme, navTheme } = useMaterialYouTheme();

  useEffect(() => {
    MusicControl.enableBackgroundMode(true);

    MusicControl.handleAudioInterruptions(false);

    MusicControl.enableControl("play", true);
    MusicControl.enableControl("pause", true);
    MusicControl.enableControl("nextTrack", true);
    MusicControl.enableControl("previousTrack", true);

    // Changing track position on lockscreen
    MusicControl.enableControl("changePlaybackPosition", true);
    MusicControl.enableControl("seek", true);
    MusicControl.on(Command.play, ()=> {
        try {playPause().then(() => UpdateNotification(null))} catch (e) {console.error(e)}})
    MusicControl.on(Command.pause, ()=> {
        try {playPause().then(() => UpdateNotification(null))} catch (e) {console.error(e)}})
    MusicControl.on(Command.nextTrack, ()=> {
        try {nextTrack().then(() => UpdateNotification(null))} catch (e) {console.error(e)}})
    MusicControl.on(Command.previousTrack, ()=> {
        try {previousTrack().then(() => UpdateNotification(null))} catch (e) {console.error(e)}})
    MusicControl.on(Command.seek, (pos)=> {
        try {
          seekTo(pos);
          MusicControl.updatePlayback({
              elapsedTime: pos,
          });
        } catch (e) {
          console.error(e);
        }
    });
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

