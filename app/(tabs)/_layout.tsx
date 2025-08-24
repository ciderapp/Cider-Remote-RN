import { NowPlayingBar } from "@/components/NowPlayingBar";
import { CommonActions } from "@react-navigation/native";
import { Tabs } from "expo-router";
import React from "react";
import { Platform, View } from "react-native";
import { BottomNavigation, Icon, useTheme } from "react-native-paper";


export default function TabLayout() {
  const theme = useTheme();

  return (
    <Tabs
      tabBar={({ navigation, state, descriptors, insets }) => (
        <View>
          <View style={{
            display: state.routes[state.index]?.name !== 'index' ? 'flex' : 'none'
          }}>
            <NowPlayingBar />
          </View>
          <BottomNavigation.Bar
            navigationState={state}
            safeAreaInsets={insets}
            inactiveColor={theme.colors.onSurface}
            style={{ backgroundColor: theme.colors.surface }}
            onTabPress={({ route, preventDefault }) => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (event.defaultPrevented) {
                preventDefault();
              } else {
                navigation.dispatch({
                  ...CommonActions.navigate(route.name, route.params),
                  target: state.key,
                });
              }
            }}
            renderIcon={({ route, focused, color }) =>
              descriptors[route.key].options.tabBarIcon?.({
                focused,
                color,
                size: 24,
              }) || null
            }
            getLabelText={({ route }) => {
              const { options } = descriptors[route.key];
              const label =
                typeof options.tabBarLabel === 'string'
                  ? options.tabBarLabel
                  : typeof options.title === 'string'
                    ? options.title
                    : route.name;

              return label;
            }}
          />
        </View>
      )}
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        headerShown: false,
        freezeOnBlur: true,
        animation: 'shift',
        transitionSpec: {
          animation: 'spring',
          config: {
            stiffness: 1000,
            damping: 500,
            mass: 3,
            overshootClamping: true,
            restDisplacementThreshold: 0.01,
            restSpeedThreshold: 0.01,
          },
        },
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
            <Icon size={24} source="play-circle-outline" color={color} />
          ),
          animation: "shift",
        }}
      />

      <Tabs.Screen
        name="lyrics"
        options={{
          title: "Lyrics",
          tabBarIcon: ({ color }) => (
            <Icon size={24} source="comment-processing-outline" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="queue"
        options={{
          title: "Queue",
          tabBarIcon: ({ color }) => (
            <Icon size={24} source="format-list-bulleted" color={color} />
          ),
          animation: "shift",
        }}
      />

      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ color }) => (
            <Icon size={24} source="magnify" color={color} />
          ),
          animation: "shift",
        }}
      />

      <Tabs.Screen
        name="library"
        options={{
          title: "Library",
          tabBarIcon: ({ color }) => (
            <Icon size={24} source="music-circle" color={color} />
          ),
          animation: "shift",
        }}
      />
    </Tabs>
  );
}
