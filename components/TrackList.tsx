import { Song } from "@/types/search";
import { View } from "react-native";
import { List } from "react-native-paper";

export function TrackList({ tracks }: { tracks: Song[] }) {
    return (
        <View>
            <List.Section>
                {tracks.map((track) => (
                    <List.Item key={track.id} title={track.attributes.name} />
                ))}
            </List.Section>
        </View>
    )
}