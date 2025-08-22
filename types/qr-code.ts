
export type QRCodeResult = {
    address: string;
    token: string;
    method: 'tunnel' | 'lan';
    initialData: {
        version: string;
        platform: string;
        os: string;
    }
}