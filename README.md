# Cider Remote

This project is the Cider Remote application for Android, built using React Native and Expo.

## Get started

1. Install dependencies

   ```bash
   corepack enable
   yarn install
   ```

2. Start the app

   ```bash
   yarn start
   ```


## Development Dependencies

- Node 22
- Yarn
- Android SDK

## Build Troubleshooting

### Android SDK not found

If Expo cannot find the Android SDK, you can define `sdk.dir=<path-to-android-sdk>` in your `android/local.properties` file.

### Gradle Build Errors

Some Gradle build errors can be resolved by rebuilding caches with: 
```bash
cd android
./gradlew bundleRelease --build-cache
```