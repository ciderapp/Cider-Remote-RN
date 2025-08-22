import { NowPlayingInfo } from "@/types";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

type Props = {
    nowPlaying: NowPlayingInfo;
}

export function NowPlayingMetadata({ nowPlaying }: Props) {
    return (
        <View style={styles.container}>
            <Text variant="headlineSmall" style={styles.songTitle} numberOfLines={2}>
                {nowPlaying.name}
            </Text>
            <Text variant="titleMedium" style={styles.artistName} numberOfLines={1}>
                {nowPlaying.artistName}
            </Text>
            <Text variant="bodyMedium" style={styles.albumName} numberOfLines={1}>
                {nowPlaying.albumName}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 0,
    },
    songTitle: {
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 8,
        lineHeight: 28,
    },
    artistName: {
        textAlign: 'center',
        marginBottom: 4,
        opacity: 0.8,
    },
    albumName: {
        textAlign: 'center',
        opacity: 0.6,
        fontSize: 14,
    },
});