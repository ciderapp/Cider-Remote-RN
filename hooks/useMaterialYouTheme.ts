import { deviceSupportsMaterialYou, useMaterialYouPalette } from "@assembless/react-native-material-you";
import { DarkTheme as NavigationDarkTheme, DefaultTheme as NavigationDefaultTheme, Theme as NavigationTheme } from "@react-navigation/native";
import { useMemo } from "react";
import { Platform } from "react-native";
import { MD3DarkTheme, MD3LightTheme, MD3Theme, configureFonts } from "react-native-paper";

import { useColorScheme } from "@/hooks/useColorScheme";

type Themes = {
  paperTheme: MD3Theme;
  navTheme: NavigationTheme;
};

// Do this so that it won't crash on older Android versions but still fallback on some weird Android 
// devices that might not support Material You on Android 12+ (and Expo Go)
export function safeMaterialYouChecker(): boolean {
  const isNewerThan30 = Platform.OS === "android" && Number(Platform.Version) >= 31;
  if (isNewerThan30) {
    return deviceSupportsMaterialYou();
  }
  return false; 
}

export function useMaterialYouTheme(): Themes {
  const colorScheme = useColorScheme() ?? "light";
  console.log('SDK Version:', Platform.Version);
  const palette = safeMaterialYouChecker() ? useMaterialYouPalette() : null;

  const isAndroid = Platform.OS === "android";
  const isDark = colorScheme === "dark";

  return useMemo(() => {
    // Choose base themes
    const basePaper = isDark ? MD3DarkTheme : MD3LightTheme;
    const baseNav = isDark ? NavigationDarkTheme : NavigationDefaultTheme;

    // If Android and palette is available, derive colors from Material You
    const accent1 = palette?.system_accent1;
    const accent2 = palette?.system_accent2;
    const neutral1 = palette?.system_neutral1;
    const neutral2 = palette?.system_neutral2;

    const primary = isAndroid && accent1?.[6]
      ? accent1[6]
      : basePaper.colors.primary;
    const secondary = isAndroid && accent2?.[6]
      ? accent2[6]
      : basePaper.colors.secondary;

    const background = isAndroid && (isDark ? neutral1?.[10] : neutral1?.[0])
      ? (isDark ? neutral1![10] : neutral1![0])
      : basePaper.colors.background;

    const surface = isAndroid && (isDark ? neutral1?.[9] : neutral1?.[0])
      ? (isDark ? neutral1![9] : neutral1![0])
      : basePaper.colors.surface;

    const onSurface = isAndroid && (isDark ? neutral1?.[0] : neutral1?.[10])
      ? (isDark ? neutral1![0] : neutral1![10])
      : basePaper.colors.onSurface;

    const outline = isAndroid && (isDark ? neutral2?.[6] : neutral2?.[4])
      ? (isDark ? neutral2![6] : neutral2![4])
      : basePaper.colors.outline;

    const secondaryContainer = isAndroid && (isDark ? accent2?.[7] : accent2?.[3])
      ? (isDark ? accent2![7] : accent2![3])
      : basePaper.colors.secondaryContainer;

    const onSecondaryContainer = isAndroid && (isDark ? accent2?.[1] : accent2?.[9])
      ? (isDark ? accent2![1] : accent2![9])
      : basePaper.colors.onSecondaryContainer;

    const surfaceVariant = isAndroid && (isDark ? neutral2?.[9] : neutral2?.[2])
      ? (isDark ? neutral2![9] : neutral2![2])
      : basePaper.colors.surfaceVariant;

    const onSurfaceVariant = isAndroid && (isDark ? neutral2?.[6] : neutral2?.[4])
      ? (isDark ? neutral2![6] : neutral2![4])
      : basePaper.colors.onSurfaceVariant;

    const baseFonts = configureFonts({
      config: {
        fontFamily: Platform.select({
          ios: 'RobotoFlex',
          android: 'RobotoFlex',
          web: 'RobotoFlex, Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif',
          default: 'RobotoFlex',
        }) as string,
      },
    });

    const expressiveFonts = {
      ...baseFonts,
      displaySmall: {
        ...baseFonts.displaySmall,
        letterSpacing: -0.25,
      },
      titleLarge: {
        ...baseFonts.titleLarge,
        letterSpacing: 0.15,
        fontFamily: Platform.select({ ios: 'Roboto', android: 'Roboto', default: baseFonts.titleLarge.fontFamily }) as string,
        fontWeight: '700',
      },
      labelLarge: {
        ...baseFonts.labelLarge,
        letterSpacing: 0.2,
      },
      labelSmall: {
        ...baseFonts.labelSmall,
        letterSpacing: 0.5,
      },
      bodyLarge: {
        ...baseFonts.bodyLarge,
        fontFamily: Platform.select({ ios: 'Roboto', android: 'Roboto', default: baseFonts.bodyLarge.fontFamily }) as string,
        fontWeight: '500',
      },
    } as MD3Theme['fonts'];

    const paperTheme: MD3Theme = {
      ...basePaper,
      fonts: expressiveFonts,
      colors: {
        ...basePaper.colors,
        primary,
        secondary,
        background,
        surface,
        onSurface,
        outline,
        secondaryContainer,
        onSecondaryContainer,
        surfaceVariant,
        onSurfaceVariant,
      },
    };

    const navTheme: NavigationTheme = {
      ...baseNav,
      colors: {
        ...baseNav.colors,
        primary,
        background,
        card: surface,
        text: onSurface,
        border: outline,
        notification: primary,
      },
    };

    return { paperTheme, navTheme };
  }, [isAndroid, isDark, palette]);
}


