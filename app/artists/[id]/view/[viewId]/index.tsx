import { v3 } from "@/lib/am-api";
import { ItemTypes } from "@/types/search";
import { useRoute } from "@react-navigation/native";
import { useMemo, useState } from "react";
import { Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ArtistViewPage() {
  const [items, setItems] = useState<ItemTypes[]>();

  const route = useRoute();

  const id = useMemo(() => {
    return (route.params as { id: string }).id;
  }, [route]);

  const viewId = useMemo(() => {
    return JSON.stringify(route.params)
  }, [route]);

  const href = useMemo(() => {
    if (id.includes(".")) {
      return `/v1/me/library/artists/${id}/view/${viewId}`;
    }
    return `/v1/catalog/us/artists/${id}/view/${viewId}`;
  }, [id, viewId]);

  const getData = async () => {
    const res = await v3<{
      data: {
        data: ItemTypes[];
      };
    }>(href, {
      views:
        "featured-release,full-albums,appears-on-albums,featured-albums,featured-on-albums,singles,compilation-albums,live-albums,latest-release,top-music-videos,similar-artists,top-songs,playlists,more-to-see",
    });
    setItems(res?.data.data);
  };

  return (
    <>
      <SafeAreaView>
        <Text>Artist View! {id} q{viewId}</Text>
      </SafeAreaView>
    </>
  );
}
