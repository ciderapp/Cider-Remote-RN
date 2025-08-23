import { Artwork } from "@/components/Artwork";
import { TrackList } from "@/components/TrackList";
import { v3 } from "@/lib/am-api";
import { interact } from "@/lib/interact";
import { getTracks } from "@/lib/tracks";
import { ItemTypes, Playlist, Song } from "@/types/search";
import { useRoute } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ScrollView, View } from "react-native";
import { Button, IconButton, MD3Colors, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PlaylistPage() {
    const [tracks, setTracks] = useState<Song[]>([]);
    const [item, setItem] = useState<Playlist>();

    const route = useRoute();
    const router = useRouter();

    const id = useMemo(() => {
        return (route.params as { id: string }).id;
    }, [route])

    const href = useMemo(() => {
        if (id.includes('.')) {
            return `/v1/me/library/playlists/${id}`;
        }
        return `/v1/catalog/us/playlists/${id}`;
    }, [id])

    const lastModifiedDate = useMemo(() => {
        return item?.attributes.lastModifiedDate
            ? new Date(item.attributes.lastModifiedDate).toLocaleDateString()
            : undefined;
    }, [item])

    const trackCount = useMemo(() => {
        return tracks.length;
    }, [tracks])

    const duration = useMemo(() => {
        const totalMillis = tracks.reduce((acc, track) => acc + (track.attributes?.durationInMillis ?? 0), 0);
        const totalSeconds = Math.floor(totalMillis / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);

        if (hours > 0) {
            return `${hours} hour${hours > 1 ? "s" : ""}, ${minutes} min${minutes !== 1 ? "s" : ""}`;
        }
        return `${minutes} min${minutes !== 1 ? "s" : ""}`;
    }, [tracks])

    const getData = async () => {
        const res = await v3<{
            data: {
                data: Playlist[],
            }
        }>(href);
        setItem(res?.data.data[0]);
        if (!res?.data.data[0]?.id) return;
        const tracks = await getTracks(res?.data.data[0].href.split('?')[0] + '/tracks');
        setTracks(tracks);
    }

    useEffect(() => {
        getData();
    }, [])

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    height: 64,
                }}
            >
                <IconButton
                    icon="arrow-left"
                    onPress={() => router.back()}
                    style={{ position: "absolute", left: 0, zIndex: 1 }}
                />
            </View>

            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                {item && <View>
                    <View style={{
                        padding: 16,
                        alignItems: 'center',
                        maxWidth: 400,
                        width: '100%',
                        margin: 'auto',
                    }}>
                        <Artwork
                            artwork={item?.attributes.artwork}
                            options={{ width: 600, height: 600 }}
                            mode="page"
                            style={{
                                width: '100%',
                                height: 'auto',

                                aspectRatio: 1,
                            }}
                        />

                        <Text
                            style={{
                                fontSize: 24,
                                fontWeight: 'bold',
                                marginTop: 16,
                                textAlign: 'center',
                            }}
                        >
                            {item?.attributes.name}
                        </Text>

                        <Text
                            style={{
                                fontSize: 18,
                                color: MD3Colors.primary50,
                                marginTop: 8,
                                textAlign: 'center',
                                fontWeight: '500',
                                letterSpacing: 0.2,
                            }}
                        >
                            {item.attributes?.curatorName}
                        </Text>

                        <Text
                            style={{
                                fontSize: 15,
                                color: '#888',
                                marginTop: 2,
                                textAlign: 'center',
                                fontWeight: '400',
                                letterSpacing: 0.1,
                            }}
                        >
                            {lastModifiedDate}
                        </Text>

                        <Text
                            style={{
                                fontSize: 15,
                                color: '#888',
                                marginTop: 2,
                                textAlign: 'center',
                                fontWeight: '400',
                                letterSpacing: 0.1,
                            }}
                        >
                            {duration} &#8226; {trackCount} {trackCount === 1 ? 'song' : 'songs'}
                        </Text>

                        <View style={{ marginTop: 16, width: '100%' }}>
                            <Button
                                icon="play"
                                mode="contained"
                                onPress={() => {
                                    if (item) {
                                        interact({
                                            item: item as ItemTypes,
                                            playItem: true,
                                        })
                                    }
                                }}
                            >
                                Play
                            </Button>
                        </View>
                    </View>
                    <TrackList tracks={tracks} container={item} />
                </View>}
            </ScrollView>
        </SafeAreaView>
    );
}