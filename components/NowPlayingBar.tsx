import { isPlaying as isPlayingAtom, nowPlayingItem, playPause } from "@/lib/playback-control";
import { useRouter } from "expo-router";
import { useAtomValue } from "jotai";
import { useEffect, useRef, useState } from 'react';
import { GestureResponderEvent, StyleSheet, View } from "react-native";
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { IconButton, Portal, Surface, Text, TouchableRipple } from "react-native-paper";
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { SafeAreaView } from "react-native-safe-area-context";
import { Artwork } from "./Artwork";
import { ArtworkBlur } from "./ArtworkBlur";
import { NowPlayingView } from "./NowPlayingView";

export function NowPlayingBar() {

    const nowPlaying = useAtomValue(nowPlayingItem);
    const isPlaying = useAtomValue(isPlayingAtom);

    const router = useRouter();
    const dragY = useRef(0);
    const [opened, setOpened] = useState(false);
    const translateY = useSharedValue(0);
    const overlayOpacity = useSharedValue(0);

    const animatedOverlayStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
        opacity: overlayOpacity.value * (1 - Math.min(1, translateY.value / 400)),
    }));

    useEffect(() => {
        if (opened) {
            overlayOpacity.value = withTiming(1, { duration: 200 });
        }
    }, [opened]);

    const handleOverlayDismiss = () => {
        overlayOpacity.value = withTiming(0, { duration: 120 }, (finished) => {
            if (finished) {
                runOnJS(setOpened)(false);
                translateY.value = 0;
            }
        });
    };

    const onOverlayGestureEvent = (event: any) => {
        // Only allow dragging down
        translateY.value = Math.max(0, event.nativeEvent.translationY);
    };

    const onOverlayHandlerStateChange = (event: any) => {
        if (event.nativeEvent.state === State.END) {
            if (translateY.value > 40) {
                // Animate out and dismiss
                translateY.value = withTiming(800, { duration: 250 });
                runOnJS(handleOverlayDismiss)();
            } else {
                // Animate back to position
                translateY.value = withTiming(0, { duration: 200 });
            }
        }
    };

    const handlePress = () => {
        setOpened(true);
        // overlayOpacity will animate in via useEffect
    }

    const playPress = (e: GestureResponderEvent) => {
        e.stopPropagation();
        playPause();
    }

    const onGestureEvent = (event: any) => {
        dragY.current = event.nativeEvent.translationY;
    };

    const onHandlerStateChange = (event: any) => {
        if (event.nativeEvent.state === State.END) {
            // If user swiped up enough (negative Y)
            if (dragY.current < -40) {
                router.push('/modals/now-playing');
            }
            dragY.current = 0;
        }
    };

    return (
        nowPlaying && (
            <>
                <Portal>
                    <View style={{
                        flex: 1,
                        pointerEvents: opened ? 'auto' : 'none'
                    }}>
                        <PanGestureHandler
                            onGestureEvent={onOverlayGestureEvent}
                            onHandlerStateChange={onOverlayHandlerStateChange}
                            activeOffsetY={[-10, 10]}
                        >
                            <Animated.View style={[
                                {
                                    position: 'absolute',
                                    inset: 0,
                                    flex: 1,
                                },
                                animatedOverlayStyle
                            ]}>
                                <Surface style={{
                                    flex: 1,
                                    padding: 32,
                                    alignItems: 'center',
                                    justifyContent: 'center',

                                }}>
                                    <ArtworkBlur />
                                    <SafeAreaView>
                                        <NowPlayingView />
                                    </SafeAreaView>
                                </Surface>
                            </Animated.View>
                        </PanGestureHandler>
                    </View>
                </Portal>
                <PanGestureHandler
                    onGestureEvent={onGestureEvent}
                    onHandlerStateChange={onHandlerStateChange}
                    activeOffsetY={[-10, 10]}
                >
                    <View>
                        <TouchableRipple onPress={handlePress}>
                            <>
                                <ArtworkBlur />
                                <View style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    padding: 2,
                                    paddingLeft: 14,
                                    paddingRight: 14,
                                    paddingVertical: 6,
                                    width: '100%',
                                    gap: 16,
                                }}>
                                    <Artwork
                                        mode="list-item"
                                        artwork={nowPlaying.artwork} style={{
                                            width: 55,
                                            height: 55,
                                        }} options={{ width: 600, height: 600 }} />
                                    <View style={styles.container}>
                                        <Text variant="titleMedium" numberOfLines={1}>
                                            {nowPlaying.name}
                                        </Text>
                                    </View>
                                    <IconButton
                                        icon={isPlaying ? "pause" : "play"}
                                        size={24}
                                        onPress={playPress}
                                    />
                                </View>
                            </>
                        </TouchableRipple>
                    </View>
                </PanGestureHandler>
            </>
        )
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'flex-start',
        paddingHorizontal: 0,
        paddingVertical: 0,
        flex: 1,
    },

});