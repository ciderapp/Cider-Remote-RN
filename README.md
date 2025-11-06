# Cider Remote

---
Still in very early development
---

This project is the Cider Remote application for Android 12 and later, built using React Native and Expo.

## Get started

1. Install dependencies

   ```bash
   corepack enable
   yarn install
   ```

2. Start the app

   ```bash
   yarn android
   ```

## Development Dependencies

- Node 22
- Yarn
- Android SDK

## Minimum Target Android Version
Officially our target Android version is Android 12 or later. 
Expo as of Expo 53 technically supports Android 7+. However, **we do not guarentee support for Android versions that old**.

## Troubleshooting
[Troubleshooting guides can be found on the Wiki](https://github.com/ciderapp/Cider-Remote-RN/wiki/Support)

## Build Troubleshooting

### Android SDK not found

If Expo cannot find the Android SDK, you can define `sdk.dir=<path-to-android-sdk>` in your `android/local.properties` file.

### Gradle Build Errors

Some Gradle build errors can be resolved by rebuilding caches with: 
```bash
cd android
./gradlew bundleRelease --build-cache
```

## License
This project is licensed under the Apache License 2.0 with Commons Clause license. See the LICENSE file for details.

© Cider Collective 2025