import { isPlaying as isPlayingAtom, nextTrack, playPause, previousTrack, toggleRepeat, toggleShuffle } from "@/lib/playback-control";
import { useAtomValue } from "jotai";
import { StyleSheet, View } from "react-native";
import { IconButton, useTheme } from "react-native-paper";

export function PlaybackButtons() {
  const isPlaying = useAtomValue(isPlayingAtom);
  const theme = useTheme();

  // Mock playback state - replace with actual state management
  const isShuffleOn = false;
  const repeatMode = "off"; // 'off', 'all', 'one'

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
          icon={"repeat-once"}
          size={24}
          iconColor={
            repeatMode !== "off"
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
    gap: 24,
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
