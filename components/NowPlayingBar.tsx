import { isPlaying as isPlayingAtom, nowPlayingItem, playPause } from "@/lib/playback-control";
import { useRouter } from "expo-router";
import { useAtomValue } from "jotai";
import { useRef } from 'react';
import { GestureResponderEvent, StyleSheet, View } from "react-native";
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { IconButton, Text, TouchableRipple } from "react-native-paper";
import { Artwork } from "./Artwork";
import { ArtworkBlur } from "./ArtworkBlur";

export function NowPlayingBar() {

    const nowPlaying = useAtomValue(nowPlayingItem);
    const isPlaying = useAtomValue(isPlayingAtom);

    const router = useRouter();
    const dragY = useRef(0);

    const handlePress = () => {
        router.push('/modals/now-playing');
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