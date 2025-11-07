import { getCastStatus, getVolume, isCasting, setVolume, toggleCast, volume as volumeAtom } from "@/lib/playback-control";
import Slider from "@react-native-community/slider";
import { useAtomValue } from "jotai";
import { useCallback, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { IconButton, useTheme } from "react-native-paper";

export function VolumeBar() {
  const volume = useAtomValue(volumeAtom);
  const theme = useTheme();
  const [isSliding, setIsSliding] = useState(false);
  const [tempVolume, setTempVolume] = useState(volume);

  useEffect(() => {
    getVolume();
  }, []);

  const handleSlidingStart = () => {
    setIsSliding(true);
  };

  const handleValueChange = (value: number) => {
    if (isSliding) {
      setTempVolume(value);
    }
  };

  const handleSlidingComplete = async (value: number) => {
    setIsSliding(false);
    await setVolume(value);
  };

  const handleMuteToggle = useCallback(async () => {
    const newVolume = volume > 0 ? 0 : 1;
    await setVolume(newVolume);
  }, [volume]);

  const currentDisplayVolume = isSliding ? tempVolume : volume;

  const getVolumeIcon = () => {
    if (currentDisplayVolume === 0) return "volume-off";
    if (currentDisplayVolume < 0.33) return "volume-low";
    if (currentDisplayVolume < 0.66) return "volume-medium";
    return "volume-high";
  };

  getCastStatus();

  return (
    <View style={styles.container}>
      <IconButton
        icon={useAtomValue(isCasting) ? "cellphone-sound" : "speaker-wireless"}
        size={24}
        onPress={
          toggleCast.bind(null, !useAtomValue(isCasting))
        }
      />
      <IconButton
        icon={getVolumeIcon()}
        size={24}
        onPress={handleMuteToggle}
        style={styles.volumeIcon}
      />
      <View style={styles.sliderContainer}>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={1}
          value={currentDisplayVolume}
          onSlidingStart={handleSlidingStart}
          onValueChange={handleValueChange}
          onSlidingComplete={handleSlidingComplete}
          minimumTrackTintColor={theme.colors.primary}
          maximumTrackTintColor={theme.colors.surfaceVariant}
          thumbTintColor={theme.colors.primary}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    gap: 8,
  },
  volumeIcon: {
    margin: 0,
  },
  sliderContainer: {
    flex: 1,
    justifyContent: "center",
  },
  slider: {
    width: "100%",
    height: 40,
  },
});