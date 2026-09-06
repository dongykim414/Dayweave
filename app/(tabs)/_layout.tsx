import { Tabs } from "expo-router";

import { useTheme } from "@/features/theme";

const TAB_LABELS = {
  today: "오늘",
  timeline: "타임라인",
  avatar: "아바타",
  me: "내 정보",
} as const;

export default function TabsLayout() {
  const { theme } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarLabelStyle: {
          fontSize: theme.typography.caption.fontSize,
          fontWeight: theme.typography.label.fontWeight,
        },
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          paddingBottom: theme.spacing.sm,
          paddingTop: theme.spacing.xs,
        },
      }}
    >
      <Tabs.Screen name="today" options={{ title: TAB_LABELS.today }} />
      <Tabs.Screen name="timeline" options={{ title: TAB_LABELS.timeline }} />
      <Tabs.Screen name="avatar" options={{ title: TAB_LABELS.avatar }} />
      <Tabs.Screen name="me" options={{ title: TAB_LABELS.me }} />
    </Tabs>
  );
}
