import { IOState } from "@/lib/io";
import { nowPlayingItem } from "@/lib/playback-control";
import { useRouter } from "expo-router";
import { useAtom, useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { Dimensions, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const [ready, setReady] = useState(false);
  const [hostAddress, setHostAddress] = useAtom(IOState.hostAddressAtom);

  const router = useRouter();

  useEffect(() => {
    IOState.load().then(() => {
      setReady(true);
      if(IOState.store.get(IOState.apiToken)) {
        IOState.connect();
      }
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
        padding: 16,
      }}
    >
      {ready && (
        <>
          <Text
            style={{
              padding: 16,
              fontWeight: "bold",
            }}
            variant="displayMedium"
          >
            Home
          </Text>
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
              <Button
                mode="contained"
                onPress={IOState.connect}
                disabled={!apiToken}
              >
                Connect
              </Button>
              <Button
                onPress={() => {
                  router.push("/modals/connect-qr");
                }}
              >
                Scan QR Code
              </Button>
            </View>
          )}
        </>
      )}
    </SafeAreaView>
  );
}
