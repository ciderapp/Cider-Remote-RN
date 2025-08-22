import { IOState } from "@/lib/io";
import { seekTo } from "@/lib/playback-control";
import Slider from "@react-native-community/slider";
import { useAtomValue } from "jotai";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";

export function ProgressBar() {
  const progress = useAtomValue(IOState.progress);
  const duration = useAtomValue(IOState.duration);
  const theme = useTheme();
  const [isSliding, setIsSliding] = useState(false);
  const [tempProgress, setTempProgress] = useState(0);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatRemainingTime = (current: number, total: number): string => {
    const remaining = total - current;
    const mins = Math.floor(remaining / 60);
    const secs = Math.floor(remaining % 60);
    return `-${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSeek = async (position: number) => {
    try {
      console.log('Seeking to position:', position);
      await seekTo(position);
      console.log('Seek completed');
    } catch (error) {
      console.error('Failed to seek:', error);
    }
  };

  const handleSlidingStart = () => {
    console.log('Sliding started');
    setIsSliding(true);
  };

  const handleValueChange = (value: number) => {
    if (isSliding) {
      setTempProgress(value);
    }
  };

  const handleSlidingComplete = (value: number) => {
    console.log('Sliding completed, seeking to:', value);
    setIsSliding(false);
    handleSeek(value);
  };

  const currentDisplayProgress = isSliding ? tempProgress : progress;

  return (
    <View style={styles.container}>
      <View style={styles.sliderContainer}>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={duration}
          value={currentDisplayProgress}
          onSlidingStart={handleSlidingStart}
          onValueChange={handleValueChange}
          onSlidingComplete={handleSlidingComplete}
          minimumTrackTintColor={theme.colors.primary}
          maximumTrackTintColor={theme.colors.outline}
        />
      </View>
      <View style={styles.timeContainer}>
        <Text variant="bodySmall" style={[styles.timeText, { color: theme.colors.onSurfaceVariant }]}>
          {formatTime(currentDisplayProgress)}
        </Text>
        <Text variant="bodySmall" style={[styles.timeText, { color: theme.colors.onSurfaceVariant }]}>
          {formatRemainingTime(currentDisplayProgress, duration)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 32,
    paddingVertical: 8,
  },
  sliderContainer: {
    height: 40,
    justifyContent: 'center',
    position: 'relative',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  timeText: {
    fontSize: 12,
    fontVariant: ['tabular-nums'],
  },
});
