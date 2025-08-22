import { interact } from "@/lib/interact";
import { searchCatalog } from "@/lib/search";
import { ItemTypes, SearchResponse } from "@/types/search";
import { useMemo, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Card, List, Text, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SearchPage() {

    const [results, setResults] = useState<SearchResponse['results'] | undefined>();
    const [meta, setMeta] = useState<SearchResponse['meta'] | undefined>();

    const [searchQuery, setSearchQuery] = useState<string>("");

    function formatArtworkUrl(url: string | undefined) {
        if (!url) return undefined;
        return url.replace("{w}", "60").replace("{h}", "60").replace('{f}', 'webp').replace('{c}', 'bb');
    }

    const sortOrder = useMemo(() => {
        return meta?.results.order ?? [];
    }, [meta])

    async function handleSearch() {
        const data = await searchCatalog(searchQuery);
        if (!data) return;
        setResults(data.results);
        setMeta(data.meta);
    }


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
        <ScrollView>
            <SafeAreaView>
                <Text style={{
                    padding: 16,
                    fontWeight: 'bold'
                }} variant="displayMedium">Search</Text>
            </SafeAreaView>
            <View style={{
                paddingHorizontal: 16,
            }}>
                <TextInput
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    onEndEditing={handleSearch}
                    mode="outlined" label="Albums, Songs, Lyrics, and More"></TextInput>

                <Card style={{marginTop: 16}}>
                    <Card.Content>
                        <List.Section>
                            {sortOrder
                                .filter(type => (results ?? {})[type as keyof SearchResponse['results']])
                                .map(type => (
                                    <View key={type}>
                                        <List.Subheader>{type.charAt(0).toUpperCase() + type.slice(1)} Results</List.Subheader>
                                        {results?.[type as keyof SearchResponse['results']]?.data?.map((item, idx) => (
                                            <View key={item.id ?? idx}>
                                                <ResultListItem
                                                    item={item as ItemTypes}
                                                    formatArtworkUrl={formatArtworkUrl}
                                                    styles={styles}
                                                />
                                            </View>
                                        ))}
                                    </View>
                                ))}
                        </List.Section>
                    </Card.Content>
                </Card>
            </View >
        </ScrollView >
    )
}



const styles = StyleSheet.create({

    artwork: {
        borderRadius: 8,
        width: 60,
        height: 60,
    },

});