import { nowPlayingItem } from "@/lib/playback-control";
import { useAtomValue } from "jotai";
import { useState } from "react";
import { Dimensions, View } from "react-native";
import { NowPlayingArtwork } from "./NowPlayingArtwork";
import { NowPlayingMetadata } from "./NowPlayingMetadata";
import { PlaybackButtons } from "./PlaybackButtons";
import { ProgressBar } from "./ProgressBar";

export function NowPlayingView() {

    const nowPlaying = useAtomValue(nowPlayingItem);

    const [orientation, setOrientation] = useState<"portrait" | "landscape">(
        Dimensions.get("window").width > Dimensions.get("window").height
            ? "landscape"
            : "portrait"
    );

    return (
        <View
            style={{
                flex: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                overflow: "hidden",
            }}
        >
            {nowPlaying && (
                <View
                    style={{
                        display: "flex",
                        flexDirection:
                            orientation === "landscape" ? "row" : "column",
                        width: "100%",
                        height: "100%",
                        justifyContent: "space-evenly",
                        alignItems: "center",
                        gap: orientation === "landscape" ? 32 : undefined,
                    }}
                >
                    <View
                        style={{
                            marginTop: orientation == 'portrait' ? '16%' : 0,
                        }}
                    >
                        <NowPlayingArtwork />
                    </View>
                    <View
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            flex: 1,
                            width: orientation === "landscape" ? undefined : "100%",
                            gap: 16,
                        }}
                    >
                        <View style={{ flexShrink: 1 }}>
                            <NowPlayingMetadata nowPlaying={nowPlaying} />
                        </View>

                        <View>
                            <ProgressBar />
                            <PlaybackButtons />
                        </View>
                    </View>
                </View>
            )}
        </View>
    )
}