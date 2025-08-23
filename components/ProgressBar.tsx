import { IOState } from "@/lib/io";
import { isPlaying, seekTo } from "@/lib/playback-control";
import Slider from "@react-native-community/slider";
import { useAtomValue } from "jotai";
import { useCallback, useEffect, useMemo, useState } from "react";
import { PixelRatio, Platform, StyleSheet, useWindowDimensions, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import Animated, { Easing, useAnimatedProps, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";
import Svg, { Circle, ClipPath, Defs, G, Path, Rect } from "react-native-svg";

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

  // Material 3 expressive scaling heuristic based on window class and font scale
  const deviceScale = useMemo(() => {
    const fontScale = Math.min(PixelRatio.getFontScale?.() ?? 1, 1.3);
    const widthClass = windowWidth < 600 ? 1 : windowWidth < 840 ? 1.1 : 1.2;
    const platformBump = Platform.OS === 'android' ? 1.05 : 1;
    return fontScale * widthClass * platformBump;
  }, [windowWidth]);

  // Layout state for SVG sizing
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
  useMemo(() => {
    phase.value = 0;
    phase.value = withRepeat(
      withTiming(2 * Math.PI, { duration: Platform.OS === 'android' ? 6500 : 6000, easing: Easing.linear }),
      -1,
      false
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const trackHeight = Math.round(14 * deviceScale); // container height = 14dp
  const baseTrackThickness = Math.round(4 * deviceScale); // baseline thickness = 4dp
  const strokeWidth = Math.max(2, Math.round(4 * deviceScale)); // wave stroke = 4dp
  const amplitude = Math.max(2, Math.round(2.1 * deviceScale)); // wave amplitude = 2.1dp
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
    const step = Math.max(4, Math.floor(wl / 20)); // tune for smoother perf
    let d = `M ${-overflow} ${midY}`;
    for (let x = -overflow; x <= w + overflow; x += step) {
      const y = midY + amp * Math.sin((2 * Math.PI * x) / wl + ph);
      d += ` L ${x} ${y}`;
    }
    return d;
  }, []);

  const overflowX = Math.ceil(amplitude + strokeWidth * 3);

  const animatedProps = useAnimatedProps(() => {
    const totalW = widthShared.value;
    const h = heightShared.value;
    const progressW = Math.max(0, Math.min(totalW, totalW * progressRatioShared.value));
    const d = buildPath(progressW, h, amplitude, wavelength, phase.value, overflowX);
    return { d } as any;
  });

  const clipRectProps = useAnimatedProps(() => {
    const totalW = widthShared.value;
    const progressW = Math.max(0, Math.min(totalW, totalW * progressRatioShared.value));
    return {
      x: -overflowX,
      y: 0,
      width: Math.max(0, progressW + overflowX * 2),
      height: heightShared.value,
    } as any;
  });

  const unfilledRectProps = useAnimatedProps(() => {
    const totalW = widthShared.value;
    const progressW = Math.max(0, Math.min(totalW, totalW * progressRatioShared.value));
    const startX = progressW + strokeWidth / 0.21;
    return {
      x: startX,
      y: (heightShared.value - baseTrackThickness) / 2,
      width: Math.max(0, totalW - startX),
      height: baseTrackThickness,
      rx: baseTrackThickness / 2,
      ry: baseTrackThickness / 2,
    } as any;
  });

  return (
    <View style={styles.container}>
      <View style={[styles.sliderContainer, { height: trackHeight }]}>
        <View style={StyleSheet.absoluteFill} onLayout={onLayout}>
          {!!layoutWidth && (
            <Svg width={layoutWidth} height={trackHeight}>
              <Defs>
                <ClipPath id="progressClip">
                  <AnimatedRect animatedProps={clipRectProps} />
                </ClipPath>
              </Defs>

              <AnimatedRect
                animatedProps={unfilledRectProps}
                fill={theme.colors.outline}
                opacity={0.35}
              />

              <G clipPath="url(#progressClip)">
                <AnimatedPath
                  animatedProps={animatedProps}
                  fill="none"
                  stroke={theme.colors.primary}
                  strokeOpacity={0.95}
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </G>

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
