import { getLibraryPlaylists, libraryPlaylists } from "@/lib/library";
import { useAtomValue } from "jotai";
import { ScrollView } from "react-native";
import { List, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Library() {
    const playlists = useAtomValue(libraryPlaylists);
    return (
        <ScrollView>
            <SafeAreaView >
                <Text style={{
                    padding: 16,
                    fontWeight: 'bold'
                }} variant="displayMedium">Library</Text>


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
                        left={props => <List.Icon {...props} icon="refresh" />}
                        onPress={() => { getLibraryPlaylists() }}
                    />
                    {playlists.map((playlist, idx) => <List.Item
                        title={playlist.attributes.name}
                        key={idx}
                        left={props => <List.Icon {...props} icon="music-note" />}
                        onPress={() => { }}
                    />)}


                </List.Section>
            </SafeAreaView>
        </ScrollView>
    )
}