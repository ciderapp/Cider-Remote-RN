/** @format */

import { isPlaying, nowPlayingItem, UpdateNotification } from "@/lib/playback-control";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { Dimensions, View } from "react-native";
import { SegmentedButtons } from "react-native-paper";
import Lyrics from "./Lyrics";
import { NowPlayingArtwork } from "./NowPlayingArtwork";
import { NowPlayingMetadata } from "./NowPlayingMetadata";
import { PlaybackButtons } from "./PlaybackButtons";
import { ProgressBar } from "./ProgressBar";
import Queue from "./Queue";
import { VolumeBar } from "./VolumeBar";

export function NowPlayingView() {
  const nowPlaying = useAtomValue(nowPlayingItem);
  const isPlayingB = useAtomValue(isPlaying);  

  const [orientation] = useState<"portrait" | "landscape">(
    Dimensions.get("window").width > Dimensions.get("window").height
      ? "landscape"
      : "portrait"
  );

  useEffect(() => {
    const task = async ()=> {
      try {
        await UpdateNotification();
      } catch (e) {
        console.error("Error updating notification:", e);
      }
    };
    task();
  }, []);

  useEffect(() => {
    try {
      UpdateNotification(null);
    } catch (e) {
      console.error("Error updating notification:", e);
    }
  }, [isPlayingB]);


  const [playerMode, setPlayerMode] = useState<"player" | "queue" | "lyrics">(
    "player"
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
            flexDirection: orientation === "landscape" ? "row" : "column",
            width: "100%",
            height: "100%",
            justifyContent: "space-evenly",
            alignItems: "center",
            gap: orientation === "landscape" ? 32 : undefined,
          }}
        >
          {/* Segmented Controls */}
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 8,
              alignItems: "center",
              maxWidth: 300,
            }}
          >
            <SegmentedButtons
              value={playerMode}
              onValueChange={setPlayerMode}
              density="regular"
              buttons={[
                {
                  value: "player",
                  label: "Player",
                  icon: "play",
                },
                {
                  value: "queue",
                  label: "Queue",
                  icon: "playlist-music",
                },
                {
                  value: "lyrics",
                  label: "Lyrics",
                  icon: "music-note",
                },
              ]}
            />
          </View>

          {/* Player Modes */}
          <View
            style={{
              flex: 1,
            }}
          >
            {playerMode === "player" && (
              <View
                style={{
                  marginTop: orientation === "portrait" ? "8%" : 0,
                  paddingHorizontal: 48,
                }}
              >
                <NowPlayingArtwork />
                <View
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    flex: 1,
                    width: orientation === "landscape" ? undefined : "100%",
                    gap: 16,
                    paddingHorizontal: 16,
                  }}
                >
                  <View style={{ flexShrink: 1 }}>
                    <NowPlayingMetadata nowPlaying={nowPlaying} />
                  </View>
                  <View>
                    <ProgressBar />
                    <PlaybackButtons />
                    <VolumeBar />
                  </View>
                </View>
              </View>
            )}
            {playerMode === "queue" && (
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  flex: 1,
                  width: "100%",
                  display: "flex",
                }}
              >
                <Queue />
              </View>
            )}
            {playerMode === "lyrics" && (
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  flex: 1,
                  display: "flex",
                  width: "100%",
                }}
              >
                <Lyrics />
              </View>
            )}
          </View>
        </View>
      )}
    </View>
  );
}
