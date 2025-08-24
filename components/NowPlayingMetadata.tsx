import { NowPlayingInfo } from "@/types";
import { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";

type Props = {
    nowPlaying: NowPlayingInfo;
}

export function NowPlayingMetadata({ nowPlaying }: Props) {
    const theme = useTheme();

    const { titleStyle, artistStyle, albumStyle } = useMemo(() => {
        const name = nowPlaying.name ?? "";
        const durationMs = nowPlaying.durationInMillis ?? 0;
        const minutes = Math.max(1, Math.round(durationMs / 60000));

        // base sizes from theme (fallbacks keep behavior stable across platforms)
        const baseTitle = (theme.fonts.displaySmall as any)?.fontSize ?? 36;
        const baseArtist = (theme.fonts.titleLarge as any)?.fontSize ?? 22;
        const baseAlbum = (theme.fonts.labelLarge as any)?.fontSize ?? 14;

        // scale title by name length and duration to keep it real frfr ong
        const nameLen = Math.max(1, name.length);
        const nameFactor = Math.min(1, 24 / nameLen); // shorter names -> closer to 1, long names shrink
        const durationFactor = Math.max(0.9, Math.min(1.1, 3.5 / minutes)); // shorter songs a bit bolder/larger
        const titleScale = Math.max(0.78, Math.min(1.18, nameFactor * durationFactor));

        // artist and album are more restrained but still adaptive
        const artistScale = Math.max(0.9, Math.min(1.08, titleScale * 0.92));
        const albumScale = Math.max(0.9, Math.min(1.05, titleScale * 0.85));

        const variantLetter = -0.2;
        const variantTitleWeight: any = '800';
        const variantArtistWeight: any = '600';
        const variantAlbumWeight: any = '600';

        const titleFontSize = Math.round(baseTitle * titleScale);
        const artistFontSize = Math.round(baseArtist * artistScale);
        const albumFontSize = Math.round(baseAlbum * albumScale);

        return {
            titleStyle: {
                fontFamily: 'RobotoFlex',
                fontWeight: variantTitleWeight,
                letterSpacing: variantLetter,
                textAlign: 'center' as const,
                marginBottom: 8,
                fontSize: titleFontSize,
                lineHeight: Math.round(titleFontSize * 1.08),
            },
            artistStyle: {
                fontFamily: 'RobotoFlex',
                textAlign: 'center' as const,
                marginBottom: 4,
                opacity: 0.8,
                fontWeight: variantArtistWeight,
                fontSize: artistFontSize,
                lineHeight: Math.round(artistFontSize * 1.12),
                letterSpacing: -0.05,
            },
            albumStyle: {
                fontFamily: 'RobotoFlex',
                textAlign: 'center' as const,
                opacity: 0.6,
                fontWeight: variantAlbumWeight,
                fontSize: albumFontSize,
                lineHeight: Math.round(albumFontSize * 1.2),
                letterSpacing: 0.05,
            },
        };
    }, [nowPlaying.name, nowPlaying.durationInMillis, theme.fonts]);

    return (
        <View style={styles.container}>
            <Text variant="displaySmall" style={titleStyle} numberOfLines={1} ellipsizeMode="tail">
                {nowPlaying.name}
            </Text>
            <Text variant="titleLarge" style={artistStyle} numberOfLines={1} ellipsizeMode="tail">
                {nowPlaying.artistName}
            </Text>
            <Text variant="labelLarge" style={albumStyle} numberOfLines={1} ellipsizeMode="tail">
                {nowPlaying.albumName}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'flex-start',
        paddingHorizontal: 0,
        paddingVertical: 0,
    },
    songTitle: {},
    artistName: {},
    albumName: {},
});