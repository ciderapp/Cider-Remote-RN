import { ArtworkBlur } from "@/components/ArtworkBlur";
import { NowPlayingView } from "@/components/NowPlayingView";
import { useRouter } from 'expo-router';
import { useRef } from 'react';
import { View } from "react-native";
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { Surface } from "react-native-paper";
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { SafeAreaView } from "react-native-safe-area-context";
export default function NowPlayingModal() {
    const dragY = useRef(0);
    const router = useRouter();
    const translateY = useSharedValue(0);
    const opacity = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => {
        // Opacity decreases as translateY increases, clamped between 1 and 0.3
        const minOpacity = 0.3;
        const maxDrag = 800;
        // If dismissing, use opacity.value, else calculate based on drag
        const currentOpacity = opacity.value !== 1
            ? opacity.value
            : Math.max(minOpacity, Math.min(1, 1 - ((translateY.value / maxDrag) * (1 - minOpacity))));
        return {
            transform: [{ translateY: translateY.value }],
            opacity: currentOpacity,
        };
    });

    const onGestureEvent = (event: any) => {
        // Only allow dragging down (positive translationY)
        dragY.current = Math.max(0, event.nativeEvent.translationY);
        translateY.value = dragY.current;
        opacity.value = 1; // Reset opacity while dragging
    };

    const handleDismiss = () => {
        router.back();
    };

    const onHandlerStateChange = (event: any) => {
        if (event.nativeEvent.state === State.END) {
            if (dragY.current > 40) {
                // Animate down and fade out, then dismiss
                opacity.value = withTiming(0, { duration: 120 }, (finished) => {
                    if (finished) {
                        runOnJS(handleDismiss)();
                        // Do not reset opacity here; modal will unmount
                    }
                });
                translateY.value = withTiming(800, { duration: 250 });
            } else {
                // Animate back to position and restore opacity
                translateY.value = withTiming(0, { duration: 200 });
                opacity.value = withTiming(1, { duration: 200 });
            }
            dragY.current = 0;
        }
    };

    return (
        <PanGestureHandler
            onGestureEvent={onGestureEvent}
            onHandlerStateChange={onHandlerStateChange}
            activeOffsetY={[-10, 10]}
        >
            <Animated.View style={[{ flex: 1, }, animatedStyle]}>
                <Surface style={{flex: 1}}>
                    <SafeAreaView style={{ flex: 1 }}>
                        <ArtworkBlur />
                        <View style={{
                            padding: 16,
                            flex: 1,
                        }}>
                            <NowPlayingView />
                        </View>
                    </SafeAreaView>
                </Surface>
            </Animated.View>
        </PanGestureHandler>
    )
}