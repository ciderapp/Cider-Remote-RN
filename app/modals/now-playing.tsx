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

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }));

    const onGestureEvent = (event: any) => {
        dragY.current = event.nativeEvent.translationY;
        translateY.value = dragY.current;
    };

    const handleDismiss = () => {
        router.back();
    };

    const onHandlerStateChange = (event: any) => {
        if (event.nativeEvent.state === State.END) {
            if (dragY.current > 40) {
                // Animate down, then dismiss
                translateY.value = withTiming(800, { duration: 250 }, (finished) => {
                    if (finished) {
                        runOnJS(handleDismiss)();
                    }
                });
            } else {
                // Animate back to position
                translateY.value = withTiming(0, { duration: 200 });
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