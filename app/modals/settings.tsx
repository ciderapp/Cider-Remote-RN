import { IOState } from "@/lib/io";
import { useRouter } from "expo-router";
import { ScrollView, View } from "react-native";
import { IconButton, List, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsModal() {
    const router = useRouter();

    return (
        <SafeAreaView>
            <View>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                        height: 64,
                    }}
                >
                    <IconButton
                        icon="arrow-left"
                        onPress={() => router.back()}
                        style={{ position: "absolute", left: 0, zIndex: 1 }}
                    />
                    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                        <Text
                            style={{
                                fontWeight: "bold",
                                textAlign: "center",
                            }}
                            variant="titleLarge"
                        >
                            Settings
                        </Text>
                    </View>
                </View>

                <ScrollView>
                    <List.Section>
                        <List.Item title="Disconnect" 
                        onPress={() => { 
                            IOState.disconnect();
                        }} 
                        left={props => <List.Icon {...props} icon="logout" />} 
                        />
                    </List.Section>
                </ScrollView>
            </View>
        </SafeAreaView>
    )
}