import { nowPlayingItem } from "@/lib/playback-control";
import { Image } from "expo-image";
import { useAtomValue } from "jotai";
import { useMemo } from "react";
import { StyleSheet, useWindowDimensions } from "react-native";

export function ArtworkBlur() {
  const nowPlaying = useAtomValue(nowPlayingItem);
  const { width, height } = useWindowDimensions();

  const artworkUri = useMemo(() => {
    return nowPlaying?.artwork?.url;
  }, [nowPlaying]);

  if (!nowPlaying || !artworkUri) return null;

  return (
    <Image
      source={{ uri: artworkUri }}
      style={[
        styles.backdrop,
        {
          width,
          height,
        }
      ]}
      contentFit="cover"
      blurRadius={50}
      transition={1000}
    />
  );
}

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    opacity: 0.3,
    zIndex: -1,
    pointerEvents: 'none',
    userSelect: 'none',
  },
});
