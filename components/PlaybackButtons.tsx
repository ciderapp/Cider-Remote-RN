import { isPlaying as isPlayingAtom, isShuffleOn as isShuffleOnAtom, nextTrack, playPause, previousTrack, repeatMode as repeatModeAtom, toggleRepeat, toggleShuffle } from "@/lib/playback-control";
import { useAtomValue } from "jotai";
import { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { IconButton, useTheme } from "react-native-paper";
import { IconSource } from "react-native-paper/lib/typescript/components/Icon";

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
    switch (repeatMode) {
      case 1:
      return 'repeat-once' as IconSource;
      case 2:
      return 'repeat' as IconSource;
      default:
      return 'repeat' as IconSource;
    }
  }, [repeatMode])

  return (
    <View style={styles.container}>
      {/* Main playback controls with shuffle and repeat */}
      <View style={styles.primaryControls}>
        <IconButton
          icon={isShuffleOn ? "shuffle" : "shuffle-disabled"}
          size={24}
          mode="contained-tonal"
          selected={isShuffleOn}
          onPress={handleShuffle}
          style={styles.compactIcon}
        />

        <IconButton
          icon="skip-previous"
          size={36}
          mode="contained-tonal"
          iconColor={theme.colors.onSecondaryContainer}
          onPress={handleSkipPrevious}
          style={[styles.skipButton, styles.blockButton]}
          contentStyle={styles.blockButtonContent}
        />

        <IconButton
          icon={isPlaying ? "pause" : "play"}
          size={48}
          containerColor={theme.colors.primary}
          iconColor="#FFFFFF"
          onPress={handlePlayPause}
          style={styles.primaryAction}
          contentStyle={styles.primaryActionContent}
        />

        <IconButton
          icon="skip-next"
          size={36}
          mode="contained-tonal"
          iconColor={theme.colors.onSecondaryContainer}
          onPress={handleSkipNext}
          style={[styles.skipButton, styles.blockButton]}
          contentStyle={styles.blockButtonContent}
        />

        <IconButton
          icon={repeatIcon}
          size={24}
          mode="contained-tonal"
          selected={repeatMode !== 0}
          onPress={handleRepeat}
          style={styles.compactIcon}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  primaryControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
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
  blockButton: {
    borderRadius: 18,
    width: 64,
    height: 56,
  },
  blockButtonContent: {
    width: 64,
    height: 56,
  },
  primaryAction: {
    borderRadius: 22,
    width: 108,
    height: 72,
  },
  primaryActionContent: {
    width: 108,
    height: 72,
  },
  compactIcon: {
    margin: 0,
  },
});
