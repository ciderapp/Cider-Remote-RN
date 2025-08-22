import { isPlaying as isPlayingAtom, isShuffleOn as isShuffleOnAtom, nextTrack, playPause, previousTrack, repeatMode as repeatModeAtom, toggleRepeat, toggleShuffle } from "@/lib/playback-control";
import { useAtomValue } from "jotai";
import { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { IconButton, useTheme } from "react-native-paper";

export function PlaybackButtons() {
  const isPlaying = useAtomValue(isPlayingAtom);
  const theme = useTheme();

  // Mock playback state - replace with actual state management
  const isShuffleOn = useAtomValue(isShuffleOnAtom);
  const repeatMode = useAtomValue(repeatModeAtom);

  const handlePlayPause = () => {
    playPause();
  };

  const handleSkipNext = () => {
    nextTrack();
  };

  const handleSkipPrevious = () => {
    previousTrack();
  };

  const handleShuffle = () => {
    toggleShuffle();
  };

  const handleRepeat = () => {
    toggleRepeat();
  };

  const repeatIcon = useMemo(() => {
    if(repeatMode == 0) {
      return 'repeat';
    }
    if(repeatMode == 1) {
      return 'repeat-once';
    }
    if(repeatMode == 2) {
      return 'repeat'
    }
  }, [repeatMode])

  return (
    <View style={styles.container}>
      {/* Main playback controls with shuffle and repeat */}
      <View style={styles.primaryControls}>
        <IconButton
          icon={isShuffleOn ? "shuffle" : "shuffle-disabled"}
          size={24}
          iconColor={
            isShuffleOn ? theme.colors.primary : theme.colors.onSurfaceVariant
          }
          onPress={handleShuffle}
        />

        <IconButton
          icon="skip-previous"
          size={36}
          iconColor={theme.colors.onSurface}
          onPress={handleSkipPrevious}
          style={styles.skipButton}
        />

        <IconButton
          icon={isPlaying ? "pause-circle" : "play-circle"}
          size={72}
          iconColor={theme.colors.onSurface}
          onPress={handlePlayPause}
        />

        <IconButton
          icon="skip-next"
          size={36}
          iconColor={theme.colors.onSurface}
          onPress={handleSkipNext}
          style={styles.skipButton}
        />

        <IconButton
          icon={repeatIcon}
          size={24}
          iconColor={
            repeatMode !== 0
              ? theme.colors.primary
              : theme.colors.onSurfaceVariant
          }
          onPress={handleRepeat}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 32,
    paddingVertical: 24,
    alignItems: "center",
  },
  primaryControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 0,
  },
  playButton: {
    borderRadius: 36,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  skipButton: {
    borderRadius: 18,
  },
});
