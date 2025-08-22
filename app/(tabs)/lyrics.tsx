import { ArtworkBlur } from "@/components/ArtworkBlur";
import { IOState } from "@/lib/io";
import { getLyrics, LyricLine } from "@/lib/lyrics";
import { nowPlayingItem, seekTo } from "@/lib/playback-control";
import { useIsFocused } from "@react-navigation/native";
import { useAtomValue } from "jotai";
import { useEffect, useRef, useState } from "react";
import { Animated, Platform, ScrollView, StyleSheet, useWindowDimensions, View } from "react-native";
import { ActivityIndicator, Text, TouchableRipple, useTheme } from "react-native-paper";

export default function Lyrics() {
    const isFocused = useIsFocused();
    if(!isFocused) {
        return null;
    }
    return (
        <View>
            <LyricsView/>
        </View>
    );
}

export function LyricsView() {
    const nowPlaying = useAtomValue(nowPlayingItem);
    const progress = useAtomValue(IOState.progress);
    const [lyrics, setLyrics] = useState<LyricLine[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [scrollViewHeight, setScrollViewHeight] = useState(0);

    const scrollViewRef = useRef<ScrollView>(null);
    const lineRefs = useRef<(View | null)[]>([]);
    const linePositions = useRef<number[]>([]);
    const theme = useTheme();
    const scrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
    // Animated values for each lyric line
    const animatedScales = useRef<Animated.Value[]>([]);
    const { width } = useWindowDimensions();

    async function fetchLyrics() {
        if (!nowPlaying?.playParams?.id) {
            setLyrics(null);
            setCurrentIndex(-1);
            return;
        }
        setLoading(true);
        setLyrics(null);
        try {
            console.log(nowPlaying.playParams)
            const lines = await getLyrics(nowPlaying.playParams.catalogId || nowPlaying.playParams.id);
            setLyrics(lines);
            setCurrentIndex(-1);
        } catch (error) {
            console.error("Failed to fetch lyrics:", error);
            setLyrics([]); // Indicate an error or no lyrics
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchLyrics();
        lineRefs.current = [];
        linePositions.current = [];
    }, [nowPlaying?.playParams?.id]);

    useEffect(() => {
        if (!lyrics || lyrics.length === 0) return;

        const newIndex = lyrics.findIndex(
            (line) => progress >= line.begin && progress < line.end
        );

        if (newIndex !== currentIndex) {
            setCurrentIndex(newIndex);
        }
    }, [progress, lyrics, currentIndex]);

    useEffect(() => {
        if (
            currentIndex === -1 ||
            !scrollViewRef.current ||
            !lineRefs.current[currentIndex] ||
            scrollViewHeight === 0 ||
            !lyrics ||
            lyrics.length === 0
        ) {
            return;
        }

        // Clear any existing scroll timeout to prevent rapid scrolling
        if (scrollTimeout.current) {
            clearTimeout(scrollTimeout.current);
        }

        scrollTimeout.current = setTimeout(() => {
            const lineView = lineRefs.current[currentIndex];
            if (!lineView || !scrollViewRef.current) return;

            if (Platform.OS === 'web') {
                // For web, calculate position based on index and estimated height
                const lineHeight = 80; // Approximate height of each line including margins
                const targetY = currentIndex * lineHeight;
                const yOffset = Math.max(0, targetY - scrollViewHeight / 2 + 40);
                scrollViewRef.current.scrollTo({ y: yOffset, animated: true });
            } else {
                // Native approach using measureLayout
                lineView.measureLayout(
                    scrollViewRef.current as any,
                    (x, y, width, height) => {
                        const yOffset = Math.max(0, y - scrollViewHeight / 2 + height / 2);
                        scrollViewRef.current?.scrollTo({ y: yOffset, animated: true });
                    },
                    () => {
                        console.warn("Could not measure layout of lyric line");
                    }
                );
            }
        }, 150); // Increased delay to allow layout to settle

        // Cleanup timeout on unmount
        return () => {
            if (scrollTimeout.current) {
                clearTimeout(scrollTimeout.current);
            }
        };
    }, [currentIndex, scrollViewHeight, lyrics]);

    const handleLyricPress = async (line: LyricLine) => {
        try {
            console.log('Seeking to lyric time:', line.begin);
            await seekTo(line.begin);
        } catch (error) {
            console.error('Failed to seek to lyric:', error);
        }
    };

    useEffect(() => {
        if (!lyrics) return;
        // Initialize animated values for each lyric line
        animatedScales.current = lyrics.map((_, i) => new Animated.Value(i === currentIndex ? 1 : 0.8));
    }, [lyrics]);

    useEffect(() => {
        if (!lyrics) return;
        lyrics.forEach((_, i) => {
            Animated.spring(animatedScales.current[i], {
                toValue: i === currentIndex ? 1 : 0.8,
                useNativeDriver: true,
            }).start();
        });
    }, [currentIndex, lyrics]);

    return (
        <View style={{
            backgroundColor: 'black',
            height: '100%',
        }}>
            {nowPlaying && <ArtworkBlur />}
            <ScrollView
                ref={scrollViewRef}
                onLayout={(event) => {
                    setScrollViewHeight(event.nativeEvent.layout.height);
                }}
                contentContainerStyle={[styles.container, { maxWidth: width - 48 }]}
                showsVerticalScrollIndicator={false}
                bounces={true}
                bouncesZoom={true}
                scrollEventThrottle={16}
                decelerationRate="normal"
            >
                {loading && <ActivityIndicator animating={true} size="large" />}
                {!loading && (!lyrics || lyrics.length === 0) && (
                    <Text variant="titleMedium">No lyrics available for this song.</Text>
                )}
                {!loading &&
                    lyrics &&
                    lyrics.map((line, index) => {
                        const isActive = index === currentIndex;
                        return (
                            <Animated.View
                                key={index}
                                style={{
                                    transformOrigin: 'left',
                                    transform: [{ scale: animatedScales.current[index] || 1 }],
                                }}
                            >
                                <View
                                    ref={(el) => { lineRefs.current[index] = el; }}
                                >
                                    <TouchableRipple
                                        onPress={() => handleLyricPress(line)}
                                        rippleColor={theme.colors.primary}
                                        style={styles.lyricTouchable}
                                    >
                                        <Text
                                            variant={'displaySmall'}
                                            style={[
                                                styles.lyricLine,
                                                isActive ? styles.activeLyric : styles.inactiveLyric,
                                                {
                                                    color: "#fff",
                                                    textShadowColor: isActive ? "#ffffff88" : undefined,
                                                    textShadowOffset: isActive
                                                        ? { width: 0, height: 0 }
                                                        : undefined,
                                                    textShadowRadius: isActive ? 12 : 0,
                                                },
                                            ]}
                                        >
                                            {line.text}
                                        </Text>
                                    </TouchableRipple>
                                </View>
                            </Animated.View>
                        );
                    })}
            </ScrollView>
        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 32,
        paddingVertical: 200, // Fixed padding instead of dynamic
        alignItems: "flex-start",
    },
    lyricTouchable: {
        borderRadius: 8,
        width: '100%',
    },
    lyricLine: {
        marginVertical: 32,
        textAlign: "left",
        fontWeight: "800",
    },
    activeLyric: {
        opacity: 1,
    },
    inactiveLyric: {
        opacity: 0.6,
        filter: 'blur(2px)'
    },
});
