import { interact } from "@/lib/interact";
import { getLibraryPlaylists, libraryPlaylists, libraryPlaylistsLoading } from "@/lib/library";
import { ItemTypes } from "@/types/search";
import { useRouter } from "expo-router";
import { useAtomValue } from "jotai";
import { useEffect } from "react";
import { ScrollView, View } from "react-native";
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
    return (
        <ScrollView>
            <SafeAreaView >
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
                    }}></IconButton>
                </View>


                <List.Section>
                    <List.Item
                        title="Recently Added"
                        left={props => <List.Icon {...props} icon="clock-outline" />}
                        onPress={() => { }}
                    />
                    <List.Item
                        title="Songs"
                        left={props => <List.Icon {...props} icon="music-note" />}
                        onPress={() => { }}
                    />
                    <List.Item
                        title="Albums"
                        left={props => <List.Icon {...props} icon="album" />}
                        onPress={() => { }}
                    />
                    <List.Item
                        title="Artists"
                        left={props => <List.Icon {...props} icon="account-music" />}
                        onPress={() => { }}
                    />
                </List.Section>

                <Text style={{
                    padding: 16,
                    fontWeight: 'bold'
                }} variant="headlineSmall">Playlists</Text>
                <List.Section>
                    <List.Item
                        title="Refresh"
                        left={props =>
                            playlistsLoading
                                ? <ActivityIndicator animating={true} color={theme.colors.primary} />
                                : <List.Icon {...props} icon="refresh" />
                        }
                        onPress={() => { getLibraryPlaylists() }}
                    />
                    {playlists.map((item, idx) => <List.Item
                        title={item.attributes.name}
                        key={idx}
                        left={props => <List.Icon {...props} icon="music-note" />}
                        onPress={() => {
                            interact({ item: (item as unknown as ItemTypes) })
                        }}
                    />)}


                </List.Section>
            </SafeAreaView>
        </ScrollView>
    )
}