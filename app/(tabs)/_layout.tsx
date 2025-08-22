import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Icon } from "react-native-paper";


export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        freezeOnBlur: true,
        animation: 'shift',
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: "absolute",
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Now Playing",
          tabBarIcon: ({ color }) => (
            <Icon size={28} source="play-circle-outline" color={color} />
          ),
          animation: "shift",
        }}
      />

      <Tabs.Screen
        name="lyrics"
        options={{
          title: "Lyrics",
          tabBarIcon: ({ color }) => (
            <Icon size={28} source="comment-processing-outline" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="queue"
        options={{
          title: "Queue",
          tabBarIcon: ({ color }) => (
            <Icon size={28} source="format-list-bulleted" color={color} />
          ),
          animation: "shift",
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => (
            <Icon size={28} source="cog-outline" color={color} />
          ),
          animation: "shift",
        }}
      />

      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ color }) => (
            <Icon size={28} source="magnify" color={color} />
          ),
          animation: "shift",
        }}
      />

      <Tabs.Screen
        name="library"
        options={{
          title: "Library",
          tabBarIcon: ({ color }) => (
            <Icon size={28} source="music-circle" color={color} />
          ),
          animation: "shift",
        }}
      />
    </Tabs>
  );
}
