import { nowPlayingItem } from "@/lib/playback-control";
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
    return nowPlaying.artwork.url.replace('{w}', '600').replace('{h}', '600');
  }, [nowPlaying]);

  useEffect(() => {
    console.log("Artwork URI changed:", artworkUri);
    fetch(artworkUri)
      .then(data => {
        console.log("Fetched artwork data:", data);
      })
      .catch(error => {
        console.error("Error fetching artwork data:", error);
      });
  }, [artworkUri]);
  
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

  const artworkSize = Math.min(screenDimensions.width, screenDimensions.height, 400) * 0.8;
  
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
    marginVertical: 24,
  },
  artwork: {
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
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
