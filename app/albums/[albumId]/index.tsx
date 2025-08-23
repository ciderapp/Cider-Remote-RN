import { TrackList } from "@/components/TrackList";
import { v3 } from "@/lib/am-api";
import { getTracks } from "@/lib/tracks";
import { Album, Song } from "@/types/search";
import { useRoute } from "@react-navigation/native";
import { useEffect, useMemo, useState } from "react";
import { ScrollView, View } from "react-native";
import { Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AlbumPage() {
    const [tracks, setTracks] = useState<Song[]>([]);
    const [item, setItem] = useState<Album>();

    const route = useRoute();

    const id = useMemo(() => {
        return (route.params as { albumId: string }).albumId;
    }, [route])

    const href = useMemo(() => {
        return `/v1/catalog/us/albums/${id}`;
    }, [id])


    const getData = async () => {
        const res = await v3<{
            data: {
                data: Album[],
            }
        }>(href);
        setItem(res?.data.data[0]);
        if (!item?.id) return;
        const tracks = await getTracks(item.href.split('?')[0] + '/tracks');
        setTracks(tracks);
    }

    useEffect(() => {
        getData();
    }, [])

    return (
        <ScrollView>
            <SafeAreaView>
                <Text>Album ID: {id}</Text>
                {item && <View><Text>Album Name: {item?.attributes.name}</Text>
                    <TrackList tracks={tracks} />
                </View>}
            </SafeAreaView>
        </ScrollView>
    );
}