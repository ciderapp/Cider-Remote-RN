import { playActionPromise } from '@/lib/interact';
import { router } from 'expo-router';
import { StyleSheet, View } from "react-native";
import { Button, Card, Text } from "react-native-paper";

export default function PlayAction() {
    const isPresented = router.canGoBack();

    const onAction = (actionType: "play" | "play-next" | "play-later") => {
        router.back();
        playActionPromise.resolve({
            actionType,
        });
    };

    const handleDismiss = () => {
        router.back();
        playActionPromise.resolve({
            actionType: 'cancel',
        });
    };

    return (
        <View style={styles.container}>
            <Card>
                <Card.Content>
                    <Text variant='displaySmall'>Select an action</Text>
                    <View style={{
                        display: 'flex',
                        gap: 12,
                        flexDirection: 'column',
                        width: '100%',
                        justifyContent: 'center',
                        marginTop: 24,
                    }}>
                        <Button
                            onPress={() => onAction('play')}
                            mode="contained"
                        >
                            Play
                        </Button>
                        <Button
                            onPress={() => onAction('play-next')}
                            mode="contained-tonal"
                        >
                            Play Next
                        </Button>
                        <Button
                            onPress={() => onAction('play-later')}
                            mode="contained-tonal"
                        >
                            Play Later
                        </Button>
                        <Button
                            onPress={handleDismiss}
                            mode="outlined"
                        >
                            Cancel
                        </Button>
                    </View>
                </Card.Content>
            </Card>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        width: '100%',
        padding: 32,
    },
});