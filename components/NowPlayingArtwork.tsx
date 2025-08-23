import { nowPlayingItem } from "@/lib/playback-control";
import { ArtworkStyles } from "@/styles/artwork";
import { formatArtworkUrl } from "@/utils/artwork";
import { Image } from "expo-image";
import { useAtomValue } from "jotai";
import { useEffect, useMemo, useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { Icon, useTheme } from "react-native-paper";

export function NowPlayingArtwork() {
  const nowPlaying = useAtomValue(nowPlayingItem);
  const [screenDimensions, setScreenDimensions] = useState(() => Dimensions.get('window'));

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenDimensions(window);
    });

    return () => subscription?.remove();
  }, []);

  if (!nowPlaying) return null;

  const artworkUri = useMemo(() => {
    if (!nowPlaying.artwork) return;
    return formatArtworkUrl(nowPlaying.artwork?.url, { width: 600, height: 600 });
  }, [nowPlaying]);

  const artworkSize = Math.min(screenDimensions.width, screenDimensions.height, 600) * 0.8;

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: artworkUri }}
        style={[styles.artwork, { width: artworkSize, height: artworkSize }]}
        contentFit="cover"
        transition={500}
        cachePolicy="memory-disk"
        recyclingKey={artworkUri}
        placeholderContentFit="cover"
      />
    </View>
  );
}

export function PlaceholderArtwork() {
  const theme = useTheme();
  const [screenDimensions, setScreenDimensions] = useState(() => Dimensions.get('window'));

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenDimensions(window);
    });

    return () => subscription?.remove();
  }, []);

  const artworkSize = Math.min(screenDimensions.width, screenDimensions.height, 600) * 0.8;

  return (
    <View style={[
      styles.container,
      styles.placeholder,
      {
        backgroundColor: theme.colors.surfaceVariant,
        width: artworkSize,
        height: artworkSize
      }
    ]}>
      <Icon
        source="music-note"
        size={60}
        color={theme.colors.onSurfaceVariant}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  artwork: {
    ...ArtworkStyles.artworkShadow
  },
  placeholder: {
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
});
