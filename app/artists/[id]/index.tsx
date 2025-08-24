import { Artwork } from "@/components/Artwork";
import { v3 } from "@/lib/am-api";
import { Artist } from "@/types/search";
import { useRoute } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ScrollView, View } from "react-native";
import { IconButton, List, Text, useTheme } from "react-native-paper";
import {
    SafeAreaView,
    useSafeAreaInsets,
} from "react-native-safe-area-context";

export default function ArtistPage() {
  const theme = useTheme();
  const [item, setItem] = useState<Artist>();

  const route = useRoute();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const id = useMemo(() => {
    return (route.params as { id: string }).id;
  }, [route]);

  const href = useMemo(() => {
    if (id.includes(".")) {
      return `/v1/me/library/artists/${id}`;
    }
    return `/v1/catalog/us/artists/${id}`;
  }, [id]);

  const views = useMemo(() => {
    return item?.views;
  }, [item]);

  const viewsOrder = useMemo(() => {
    return item?.meta.views.order || [];
  }, [item]);

  function goToView(view: string) {
    router.push(`/artists/${id}/view/${view}`);
  }

  const getData = async () => {
    const res = await v3<{
      data: {
        data: Artist[];
      };
    }>(href, {
      views:
        "featured-release,full-albums,appears-on-albums,featured-albums,featured-on-albums,singles,compilation-albums,live-albums,latest-release,top-music-videos,similar-artists,top-songs,playlists,more-to-see",
    });
    setItem(res?.data.data[0]);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          position: "absolute",
          top: insets.top,
          height: 64,
        }}
      >
        <IconButton
          icon="arrow-left"
          onPress={() => router.back()}
          style={{ position: "absolute", left: 0, zIndex: 1 }}
        />
      </View>
      {item && (
        <>
          <ScrollView style={{
                marginTop: -insets.top,
          }}>
            <Artwork
              style={{
                width: "100%",
                aspectRatio: 1,
            }}
              artwork={item.attributes.artwork}
              options={{
                width: 600,
                height: 600,
              }}
            />
            <Text
              variant="headlineLarge"
              style={{
                textAlign: "center",
                fontWeight: "bold",
                marginTop: 16,
              }}
            >
              {item.attributes.name}
            </Text>

            <List.Section>
              {viewsOrder.map((key) => {
                const view = views?.[key];
                if (!view) return null;
                return (
                  <List.Item
                    key={key}
                    title={view.attributes.title || key}
                    left={(props) => <List.Icon {...props} icon="folder" />}
                    onPress={() => goToView(key)}
                  />
                );
              })}
            </List.Section>
          </ScrollView>
        </>
      )}
    </SafeAreaView>
  );
}
