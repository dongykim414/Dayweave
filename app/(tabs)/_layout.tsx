import { Tabs } from "expo-router";
import { Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "@/features/theme";

const TAB_LABELS = {
  today: "오늘",
  timeline: "타임라인",
  avatar: "아바타",
  me: "내 정보",
} as const;

const TAB_ICONS = {
  today: "⌂",
  timeline: "▣",
  avatar: "◉",
  me: "●",
} as const;

const TAB_NAMES = ["today", "timeline", "avatar", "me"] as const;

export default function TabsLayout() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.navInactive,
        tabBarHideOnKeyboard: true,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: theme.typography.label.fontWeight,
          lineHeight: 16,
          marginTop: 2,
        },
        tabBarStyle: {
          backgroundColor: theme.colors.navBackground,
          borderTopColor: theme.colors.border,
          height: 58 + insets.bottom,
          paddingBottom: Math.max(insets.bottom, 8),
          paddingTop: 8,
          shadowColor: theme.colors.shadow,
          shadowOffset: { height: -3, width: 0 },
          shadowOpacity: theme.shadow.opacity,
          shadowRadius: theme.shadow.radius,
        },
      }}
    >
      {TAB_NAMES.map((name) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            tabBarIcon: ({ color }) => (
              <Text style={{ color, fontSize: 20, fontWeight: "700", lineHeight: 22 }}>
                {TAB_ICONS[name]}
              </Text>
            ),
            title: TAB_LABELS[name],
          }}
        />
      ))}
    </Tabs>
  );
}
