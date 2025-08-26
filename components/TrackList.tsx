import { interact } from "@/lib/interact";
import { Album, ItemTypes, Playlist, Song } from "@/types/search";
import { View } from "react-native";
import { List } from "react-native-paper";
import { Artwork } from "./Artwork";

type TrackListProps = {
    tracks: Song[];
    container?: Album | Playlist;
}

export function TrackList({ tracks, container }: TrackListProps) {

    const handlePress = (item: Song) => {
        if (container) {
            // get the index of the item in the container
            const index = tracks.findIndex(track => track.id === item.id);
            if (index !== -1) {
                interact({ item: item as ItemTypes, container: container, playAtIndex: index, playItem: true });
                return;
            }
        }

        interact({ item: item as ItemTypes });
    }

    return (
        <View>
            <List.Section>
                {tracks.map((track, idx) => (
                    <List.Item
                        key={idx}
                        title={track.attributes.name}
                        onPress={() => handlePress(track)}
                        description={track.attributes.artistName}
                        titleStyle={{
                            fontSize: 16,
                            fontWeight: '600',
                        }}
                        descriptionStyle={{
                            fontSize: 14,
                            fontWeight: '400',
                            color: '#888',
                        }}
                        left={() => {
                            return (
                                <Artwork
                                    artwork={track.attributes.artwork}
                                    options={{ width: 60, height: 60 }}
                                    mode="list-item"
                                    style={{
                                        aspectRatio: 1,
                                        marginLeft: 12,
                                        width: 50,
                                        height: 50,
                                        borderRadius: 4,
                                        backgroundColor: '#ccc',
                                    }} />
                            );
                        }} />
                ))}
            </List.Section>
        </View>
    )
}