import { IOState } from "@/lib/io";
import { isPlaying, seekTo } from "@/lib/playback-control";
import Slider from "@react-native-community/slider";
import { useAtomValue } from "jotai";
import { useCallback, useEffect, useMemo, useState } from "react";
import { PixelRatio, Platform, StyleSheet, useWindowDimensions, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import Animated, { Easing, useAnimatedProps, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";
import Svg, { Circle, Path, Rect } from "react-native-svg";

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedRect = Animated.createAnimatedComponent(Rect);

export function ProgressBar() {
  const progress = useAtomValue(IOState.progress);
  const duration = useAtomValue(IOState.duration);
  const playing = useAtomValue(isPlaying);
  const theme = useTheme();
  const [isSliding, setIsSliding] = useState(false);
  const [tempProgress, setTempProgress] = useState(0);
  const { width: windowWidth } = useWindowDimensions();

  const deviceScale = useMemo(() => {
    const fontScale = Math.min(PixelRatio.getFontScale?.() ?? 1, 1.3);
    const widthClass = windowWidth < 600 ? 1 : windowWidth < 840 ? 1.1 : 1.2;
    const platformBump = Platform.OS === 'android' ? 1.05 : 1;
    return fontScale * widthClass * platformBump;
  }, [windowWidth]);

  const [layoutWidth, setLayoutWidth] = useState(0);
  const onLayout = useCallback((e: any) => {
    const { width } = e.nativeEvent.layout;
    setLayoutWidth(width);
  }, []);

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

  const phase = useSharedValue(0);
  useEffect(() => {
    phase.value = 0;
    phase.value = withRepeat(
      withTiming(2 * Math.PI, { duration: Platform.OS === 'android' ? 6500 : 6000, easing: Easing.linear }),
      -1,
      false
    );
  }, [phase]);

  const trackHeight = Math.round(14 * deviceScale); // container height = 14dp
  const baseTrackThickness = Math.round(4 * deviceScale); // baseline thickness = 4dp
  const strokeWidth = Math.max(2, Math.round(3 * deviceScale)); // wave stroke = 3dp
  const amplitude = Math.max(2, Math.round(3 * deviceScale)); // wave amplitude = 3dp
  const wavelength = Math.max(36, Math.round(40 * deviceScale)); // wavelength = 40dp

  const widthShared = useSharedValue(0);
  const heightShared = useSharedValue(trackHeight);
  const progressRatioShared = useSharedValue(0);
  if (widthShared.value !== layoutWidth) widthShared.value = layoutWidth;
  if (heightShared.value !== trackHeight) heightShared.value = trackHeight;

  useEffect(() => {
    const ratio = duration > 0 ? currentDisplayProgress / duration : 0;
    if (playing) {
      progressRatioShared.value = withTiming(ratio, { duration: 180, easing: Easing.out(Easing.cubic) });
    } else {
      progressRatioShared.value = ratio;
    }
  }, [currentDisplayProgress, duration, playing, progressRatioShared]);

  const buildPath = useCallback((w: number, h: number, amp: number, wl: number, ph: number, overflow: number) => {
    'worklet';
    const midY = h / 2;
    const step = Math.max(3, Math.floor(wl / 28)); // smoother wave sampling
    let d = `M ${-overflow} ${midY}`;
    for (let x = -overflow; x <= w + overflow; x += step) {
      const y = midY + amp * Math.sin((2 * Math.PI * x) / wl + ph);
      d += ` L ${x} ${y}`;
    }
    return d;
  }, []);

  const overflowX = Math.ceil(amplitude + strokeWidth * 4);

  const animatedProps = useAnimatedProps(() => {
    const totalW = widthShared.value;
    const h = heightShared.value;
    const d = buildPath(totalW, h, amplitude, wavelength, phase.value, overflowX);
    return { d } as any;
  });

  const unfilledRectProps = useAnimatedProps(() => {
    const totalW = widthShared.value;
    const progressW = Math.max(0, Math.min(totalW, totalW * progressRatioShared.value));
    const startX = progressW + strokeWidth / 2;
    return {
      x: startX,
      y: (heightShared.value - baseTrackThickness) / 2,
      width: Math.max(0, totalW - startX),
      height: baseTrackThickness,
      rx: baseTrackThickness / 2,
      ry: baseTrackThickness / 2,
    } as any;
  });

  // animated props for a vertical drag bar at the progress boundary
  const dragBarWidth = Math.max(1, Math.round(4 * deviceScale));
  const dragBarMarginV = 0;
  const dragBarProps = useAnimatedProps(() => {
    const totalW = widthShared.value;
    const progressW = Math.max(0, Math.min(totalW, totalW * progressRatioShared.value));
    const x = Math.max(0, Math.min(totalW - dragBarWidth, progressW + strokeWidth * 0.5 - dragBarWidth / 2));
    return {
      x,
      y: dragBarMarginV,
      width: dragBarWidth,
      height: heightShared.value,
      rx: dragBarWidth / 2,
      ry: dragBarWidth / 2,
    } as any;
  });

  return (
    <View style={styles.container}>
      <View style={[styles.sliderContainer, { height: trackHeight }]}>
        <View style={StyleSheet.absoluteFill} onLayout={onLayout}>
          {!!layoutWidth && (
            <Svg width={layoutWidth} height={trackHeight}>
              {/* wave across full width */}
              <AnimatedPath
                animatedProps={animatedProps}
                fill="none"
                stroke={theme.colors.primary}
                strokeOpacity={0.95}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* mask wave to the right of progress */}
              {(() => {
                const totalW = layoutWidth;
                const ratio = duration > 0 ? currentDisplayProgress / duration : 0;
                const progressW = Math.max(0, Math.min(totalW, totalW * ratio));
                const x = progressW;
                const w = Math.max(0, totalW - x);
                return (
                  <Rect
                    x={x}
                    y={0}
                    width={w}
                    height={trackHeight}
                    fill={theme.colors.background}
                  />
                );
              })()}

              {/* crispy edge.. */}
              <AnimatedRect
                animatedProps={unfilledRectProps}
                fill={theme.colors.outline}
                opacity={0.35}
              />

              {/* Drag handle bar */}
              <AnimatedRect
                animatedProps={dragBarProps}
                fill={theme.colors.primary}
                opacity={1}
              />

              {(() => {
                const endInset = Math.round(2 * deviceScale);
                const dotMarginV = Math.round(6 * deviceScale);
                const r = Math.max(1, (trackHeight - 2 * dotMarginV) / 2);
                const cx = Math.max(r, layoutWidth - endInset - r);
                const cy = trackHeight / 2;
                return <Circle cx={cx} cy={cy} r={r} fill={theme.colors.primary} />;
              })()}
            </Svg>
          )}
        </View>

        <Slider
          style={StyleSheet.absoluteFill}
          minimumValue={0}
          maximumValue={duration}
          value={currentDisplayProgress}
          onSlidingStart={handleSlidingStart}
          onValueChange={handleValueChange}
          onSlidingComplete={handleSlidingComplete}
          minimumTrackTintColor="transparent"
          maximumTrackTintColor="transparent"
          thumbTintColor="transparent"
        />
      </View>
      <View style={styles.timeContainer}>
        <Text variant="labelSmall" style={[styles.timeText, { color: theme.colors.onSurfaceVariant }]}>
          {formatTime(currentDisplayProgress)}
        </Text>
        <Text variant="labelSmall" style={[styles.timeText, { color: theme.colors.onSurfaceVariant }]}>
          {formatRemainingTime(currentDisplayProgress, duration)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
    width: '100%',
    paddingVertical: 0,
    margin: 'auto'
  },
  sliderContainer: {
    justifyContent: 'center',
    position: 'relative',
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    fontSize: 12,
    fontVariant: ['tabular-nums'],
  },
});
