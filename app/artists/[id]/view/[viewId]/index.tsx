import { Header } from "@/components/Header";
import { TrackList } from "@/components/TrackList";
import { ItemTypes } from "@/types/search";
import { v3 } from "@/utils/fetch";
import { useRoute } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ArtistViewPage() {
  const [items, setItems] = useState<ItemTypes[]>();
  const [title, setTitle] = useState<string>();

  const route = useRoute();
  const router = useRouter();

  const id = useMemo(() => {
    return (route.params as { id: string }).id;
  }, [route]);

  const viewId = useMemo(() => {
    return (route.params as { viewId: string }).viewId;
  }, [route]);

  const href = useMemo(() => {
    if (id.includes(".")) {
      return `/v1/me/library/artists/${id}/view/${viewId}`;
    }
    return `/v1/catalog/$STOREFRONT/artists/${id}/view/${viewId}`;
  }, [id, viewId]);


  const getData = async () => {
    const res = await v3<{
      data: {
        attributes: {
          title: string;
        };
        data: ItemTypes[];
        next?: string;
      };
    }>(href, {
      with: "attributes",
    });
    if (!res) {
      setTitle("Error");
      setItems([]);
      return;
    }
    setItems(res?.data.data);
    setTitle(res?.data.attributes?.title || viewId);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <SafeAreaView>
        <Header
          title={title}
          backButton
          backButtonHandler={() => router.back()}
        />
        <ScrollView>
          {items && <TrackList tracks={items} />}
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
