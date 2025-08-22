import { NowPlayingArtwork } from "@/components/Artwork";
import { ArtworkBlur } from "@/components/ArtworkBlur";
import { NowPlayingMetadata } from "@/components/NowPlayingMetadata";
import { PlaybackButtons } from "@/components/PlaybackButtons";
import { ProgressBar } from "@/components/ProgressBar";
import { IOState } from "@/lib/io";
import { nowPlayingItem } from "@/lib/playback-control";
import { useRouter } from "expo-router";
import { useAtom, useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { Dimensions, ScrollView, View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const [ready, setReady] = useState(false);
  const [hostAddress, setHostAddress] = useAtom(IOState.hostAddressAtom);

  const router = useRouter();

  useEffect(() => {
    IOState.load().then(() => {
      setReady(true);

      IOState.connect();
    });
  }, []);

  const connected = useAtomValue(IOState.connected);
  const [apiToken, setApiToken] = useAtom(IOState.apiToken);

  const nowPlaying = useAtomValue(nowPlayingItem);

  const [orientation, setOrientation] = useState<"portrait" | "landscape">(
    Dimensions.get("window").width > Dimensions.get("window").height
      ? "landscape"
      : "portrait"
  );

  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setOrientation(window.width > window.height ? "landscape" : "portrait");
    });
    return () => subscription?.remove();
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
      }}
    >
      {ready && (
        <>
          {connected && nowPlaying && <ArtworkBlur />}
          <ScrollView contentContainerStyle={{ flex: 1, width: "100%" }}>
            <View
              style={{
                flex: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                overflow: "hidden",
              }}
            >
              {connected && nowPlaying && (
                <View
                  style={{
                    display: "flex",
                    flexDirection:
                      orientation === "landscape" ? "row" : "column",
                    width: "100%",
                    height: "100%",
                    justifyContent: "space-evenly",
                    alignItems: "center",
                    gap: orientation === "landscape" ? 32 : undefined,
                  }}
                >
                  <View
                    style={{
                      marginTop: orientation == 'portrait' ? '16%' : 0,
                    }}
                  >
                    <NowPlayingArtwork />
                  </View>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      flex: 1,
                      width: orientation === "landscape" ? undefined : "100%",
                      gap: 16,
                    }}
                  >
                    <View style={{ flexShrink: 1 }}>
                      <NowPlayingMetadata nowPlaying={nowPlaying} />
                    </View>

                    <View>
                      <ProgressBar />
                      <PlaybackButtons />
                    </View>
                  </View>
                </View>
              )}
            </View>
          </ScrollView>
          {!connected && (
            <View
              style={{
                display: "flex",
                width: "100%",
                height: "100%",
                padding: 32,
                gap: 16,
              }}
            >
              <TextInput
                label="Host Address"
                value={hostAddress}
                onChangeText={setHostAddress}
                mode="outlined"
              />
              <TextInput
                label="API Token"
                value={apiToken || ""}
                onChangeText={setApiToken}
                mode="outlined"
              />
              <Button mode="contained" onPress={IOState.connect} disabled={!apiToken}>
                Connect
              </Button>
              <Button onPress={
                () => {
                  router.push('/modals/connect-qr');
                }
              }>
                Scan
              </Button>
            </View>
          )}
        </>
      )}
    </SafeAreaView>
  );
}
