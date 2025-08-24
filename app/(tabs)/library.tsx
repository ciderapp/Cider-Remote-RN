import { interact } from "@/lib/interact";
import { getLibraryPlaylists, libraryPlaylists, libraryPlaylistsLoading } from "@/lib/library";
import { ItemTypes } from "@/types/search";
import { useRouter } from "expo-router";
import { useAtomValue } from "jotai";
import { useEffect, useMemo } from "react";
import { FlatList, View } from "react-native";
import { ActivityIndicator, IconButton, List, Text, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Library() {
    const theme = useTheme();
    const playlists = useAtomValue(libraryPlaylists);
    const playlistsLoading = useAtomValue(libraryPlaylistsLoading);
    const router = useRouter();

    useEffect(() => {
        getLibraryPlaylists();
    }, [])

    // Compose all page sections into a single array for FlatList
    const flatData = useMemo(() => {
        const data: Array<{ type: string; key: string; [key: string]: any }> = [
            { type: "header", key: "library-header" },
            { type: "static", key: "recently-added", title: "Recently Added", icon: "clock-outline" },
            { type: "static", key: "songs", title: "Songs", icon: "music-note" },
            { type: "static", key: "albums", title: "Albums", icon: "album" },
            { type: "static", key: "artists", title: "Artists", icon: "account-music" },
            { type: "subheader", key: "playlists-header" },
            { type: "refresh", key: "refresh" },
        ];
        if (playlists.length) {
            playlists.forEach((item, idx) => {
                data.push({
                    type: "playlist",
                    key: `playlist-${idx}`,
                    item,
                });
            });
        }
        return data;
    }, [playlists]);

    function renderItem({ item }: { item: any }) {
        switch (item.type) {
            case "header":
                return (
                    <SafeAreaView>
                        <View style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between"
                        }}>
                            <Text style={{
                                padding: 16,
                                fontWeight: 'bold'
                            }} variant="displayMedium">Library</Text>
                            <IconButton icon="cog" onPress={() => {
                                router.push('/modals/settings')
                            }} />
                        </View>
                    </SafeAreaView>
                );
            case "static":
                return (
                    <List.Item
                        title={item.title}
                        left={props => <List.Icon {...props} icon={item.icon} />}
                        onPress={() => { }}
                    />
                );
            case "subheader":
                return (
                    <Text style={{
                        padding: 16,
                        fontWeight: 'bold'
                    }} variant="headlineSmall">Playlists</Text>
                );
            case "refresh":
                return (
                    <List.Item
                        title="Refresh"
                        left={props =>
                            playlistsLoading
                                ? <ActivityIndicator animating={true} color={theme.colors.primary} />
                                : <List.Icon {...props} icon="refresh" />
                        }
                        onPress={() => { getLibraryPlaylists() }}
                    />
                );
            case "playlist":
                return (
                    <List.Item
                        title={item.item.attributes.name}
                        left={props => <List.Icon {...props} icon="music-note" />}
                        onPress={() => {
                            interact({ item: (item.item as unknown as ItemTypes) })
                        }}
                    />
                );
            default:
                return null;
        }
    }

    return (
        <FlatList
            data={flatData}
            keyExtractor={item => item.key}
            renderItem={renderItem}
            ListEmptyComponent={playlistsLoading ? null : <Text style={{ padding: 16 }}>No playlists found.</Text>}
        />
    )
}