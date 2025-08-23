import { ArtworkBlur } from "@/components/ArtworkBlur";
import { NowPlayingView } from "@/components/NowPlayingView";
import { useRouter } from 'expo-router';
import { useRef } from 'react';
import { View } from "react-native";
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { SafeAreaView } from "react-native-safe-area-context";

export default function NowPlayingModal() {
    const dragY = useRef(0);
    const router = useRouter();

    const onGestureEvent = (event: any) => {
        dragY.current = event.nativeEvent.translationY;
    };

    const onHandlerStateChange = (event: any) => {
        if (event.nativeEvent.state === State.END) {
            // If user swiped down enough (positive Y)
            if (dragY.current > 40) {
                router.back();
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
            <SafeAreaView style={{
                flex: 1
            }}>
                <ArtworkBlur />
                <View style={{
                    padding: 16,
                    flex: 1,
                }}>
                    <NowPlayingView />
                </View>
            </SafeAreaView>
        </PanGestureHandler>
    )
}