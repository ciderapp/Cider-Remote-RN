import { IOState } from '@/lib/io';
import { QRCodeResult } from '@/types/qr-code';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ConnectQRModal() {
    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);

    //   useEffect(() => {
    //     // Request camera permission on mount
    //     if (!permission?.granted && !permission?.canAskAgain) {
    //       Alert.alert(
    //         'Camera Permission Required',
    //         'Please enable camera permission in your device settings to scan QR codes.',
    //         [{ text: 'OK', onPress: () => router.back() }]
    //       );
    //     }
    //   }, [permission]);

    const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
        if (scanned) return;

        setScanned(true);
        console.log(`Bar code with type ${type} and data ${data} has been scanned!`);

        try {
            const result: QRCodeResult = JSON.parse(data);
            console.log('Parsed QR code result:', result);
            if (result.address && result.token && result.method && result.initialData) {
                Alert.alert(
                    'Cider Instance Found',
                    `
                        Method: ${result.method}\n
                        OS: ${result.initialData.os}\n
                        Platform: ${result.initialData.platform}
                    `,
                    [
                        {
                            text: 'Connect', onPress: () => {
                                setScanned(false);
                                IOState.hostAddress = `http://${result.address}:10767`;
                                IOState.store.set(IOState.apiToken, result.token);
                                router.back();
                            }
                        },
                        { text: 'Close', onPress: () => router.back() }
                    ]
                );
                return;
            }
            throw new Error('Invalid QR code data');
        } catch (error) {
            console.error('Failed to parse QR code data:', error);
            Alert.alert('Error', 'Failed to parse QR code data');
            return;
        }
    };

    if (!permission) {
        // Camera permissions are still loading
        return (
            <SafeAreaView style={styles.container}>
                <Text>Loading camera permissions...</Text>
            </SafeAreaView>
        );
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.permissionContainer}>
                    <Text style={styles.message}>
                        We need your permission to show the camera for QR code scanning
                    </Text>
                    <Button mode="contained" onPress={requestPermission}>
                        Grant Permission
                    </Button>
                    <Button mode="outlined" onPress={() => router.back()}>
                        Cancel
                    </Button>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <CameraView
                style={styles.camera}
                facing={facing}
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                barcodeScannerSettings={{
                    barcodeTypes: ["qr", "pdf417"],
                }}
            >
                <View style={styles.overlay}>
                    <View style={styles.topOverlay} />
                    <View style={styles.middleRow}>
                        <View style={styles.sideOverlay} />
                        <View style={styles.scanArea} />
                        <View style={styles.sideOverlay} />
                    </View>
                    <View style={styles.bottomOverlay}>
                        <Text style={styles.instructions}>
                            Position the QR code within the frame to scan
                        </Text>
                        <View style={styles.buttonContainer}>
                            <Button
                                mode="contained-tonal"
                                onPress={() => setFacing(current => (current === 'back' ? 'front' : 'back'))}
                            >
                                Flip Camera
                            </Button>
                            <Button mode="outlined" onPress={() => router.back()}>
                                Cancel
                            </Button>
                        </View>
                    </View>
                </View>
            </CameraView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    permissionContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        gap: 16,
    },
    message: {
        textAlign: 'center',
        marginBottom: 16,
    },
    camera: {
        flex: 1,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    topOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    middleRow: {
        flexDirection: 'row',
        height: 250,
    },
    sideOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    scanArea: {
        width: 250,
        borderWidth: 2,
        borderColor: '#fff',
        backgroundColor: 'transparent',
    },
    bottomOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    instructions: {
        color: '#fff',
        textAlign: 'center',
        marginBottom: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 16,
    },
});