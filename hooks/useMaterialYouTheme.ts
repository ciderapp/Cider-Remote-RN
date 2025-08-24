import { useMaterialYouPalette } from "@assembless/react-native-material-you";
import { DarkTheme as NavigationDarkTheme, DefaultTheme as NavigationDefaultTheme, Theme as NavigationTheme } from "@react-navigation/native";
import { useMemo } from "react";
import { Platform } from "react-native";
import { MD3DarkTheme, MD3LightTheme, MD3Theme } from "react-native-paper";

import { useColorScheme } from "@/hooks/useColorScheme";

type Themes = {
  paperTheme: MD3Theme;
  navTheme: NavigationTheme;
};

export function useMaterialYouTheme(): Themes {
  const colorScheme = useColorScheme() ?? "light";
  const palette = useMaterialYouPalette();

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

    const primary = isAndroid && accent1 ? accent1[6] : basePaper.colors.primary;
    const secondary = isAndroid && accent2 ? accent2[6] : basePaper.colors.secondary;

    const background = isAndroid && neutral1
      ? (isDark ? neutral1[10] : neutral1[0])
      : basePaper.colors.background;

    const surface = isAndroid && neutral1
      ? (isDark ? neutral1[9] : neutral1[0])
      : basePaper.colors.surface;

    const onSurface = isAndroid && neutral1
      ? (isDark ? neutral1[0] : neutral1[10])
      : basePaper.colors.onSurface;

    const outline = isAndroid && neutral2
      ? (isDark ? neutral2[6] : neutral2[4])
      : basePaper.colors.outline;

    const secondaryContainer = isAndroid && accent2
      ? (isDark ? accent2[7] : accent2[3])
      : basePaper.colors.secondaryContainer;

    const onSecondaryContainer = isAndroid && accent2
      ? (isDark ? accent2[1] : accent2[9])
      : basePaper.colors.onSecondaryContainer;

    const surfaceVariant = isAndroid && neutral2
      ? (isDark ? neutral2[9] : neutral2[2])
      : basePaper.colors.surfaceVariant;

    const onSurfaceVariant = isAndroid && neutral2
      ? (isDark ? neutral2[6] : neutral2[4])
      : basePaper.colors.onSurfaceVariant;

    const paperTheme: MD3Theme = {
      ...basePaper,
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


