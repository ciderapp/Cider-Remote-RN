import { interact } from "@/lib/interact";
import { searchCatalog } from "@/lib/search";
import { ItemTypes, SearchResponse } from "@/types/search";
import { formatArtworkUrl } from "@/utils/artwork";
import { useMemo, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Card, List, Text, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SearchPage() {

    const [results, setResults] = useState<SearchResponse['results'] | undefined>();
    const [meta, setMeta] = useState<SearchResponse['meta'] | undefined>();

    const [searchQuery, setSearchQuery] = useState<string>("");

    const sortOrder = useMemo(() => {
        return meta?.results.order ?? [];
    }, [meta])

    async function handleSearch() {
        const data = await searchCatalog(searchQuery);
        if (!data) return;
        setResults(data.results);
        setMeta(data.meta);
    }

    // Flatten results for FlatList: each entry is either a section header or an item
    const flatResults = useMemo(() => {
        if (!results || !sortOrder.length) return [];
        const items: Array<{ type: "header" | "item", key: string, label?: string, item?: ItemTypes }> = [];
        sortOrder.forEach(type => {
            const section = results[type as keyof SearchResponse['results']];
            if (section?.data?.length) {
                items.push({ type: "header", key: `header-${type}`, label: type.charAt(0).toUpperCase() + type.slice(1) + " Results" });
                section.data.forEach((item, idx) => {
                    items.push({ type: "item", key: `${type}-${idx}`, item: item as ItemTypes });
                });
            }
        });
        return items;
    }, [results, sortOrder]);

    function ResultListItem({
        item,
        formatArtworkUrl,
        styles,
    }: {
        item: ItemTypes,
        formatArtworkUrl: (url: string | undefined) => string | undefined,
        styles: any,
    }) {
        return (
            <List.Item
                left={(props) =>
                    item.attributes.artwork?.url ? (
                        <List.Image
                            {...props}
                            source={{ uri: formatArtworkUrl(item.attributes.artwork?.url) }}
                            style={styles.artwork}
                        />
                    ) : (
                        <List.Icon {...props} icon="music" style={styles.artwork} />
                    )
                }
                title={item.attributes.name}
                description={item.type}
                onPress={() => { interact({ item }) }}
            />
        );
    }

    return (
        <SafeAreaView>
            <View style={{
                paddingHorizontal: 16,
            }}>
                <TextInput
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    onEndEditing={handleSearch}
                    onKeyPress={({ nativeEvent }) => {
                        if (nativeEvent.key === "Enter") {
                            handleSearch();
                        }
                    }}
                    mode="outlined" label="Albums, Songs, Lyrics, and More"></TextInput>

                <Card style={{ marginTop: 16 }}>
                    <Card.Content>
                        <FlatList
                            data={flatResults}
                            keyExtractor={item => item.key}
                            renderItem={({ item }) => {
                                if (item.type === "header") {
                                    return <List.Subheader>{item.label}</List.Subheader>;
                                }
                                if (item.type === "item" && item.item) {
                                    return (
                                        <ResultListItem
                                            item={item.item}
                                            formatArtworkUrl={formatArtworkUrl}
                                            styles={styles}
                                        />
                                    );
                                }
                                return null;
                            }}
                            ListEmptyComponent={<Text>No results</Text>}
                        />
                    </Card.Content>
                </Card>
            </View>
        </SafeAreaView>
    )
}



const styles = StyleSheet.create({

    artwork: {
        borderRadius: 8,
        width: 60,
        height: 60,
    },

});