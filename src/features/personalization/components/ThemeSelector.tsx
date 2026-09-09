import { Pressable, ScrollView, View } from "react-native";

import { resolveTheme, useTheme } from "@/features/theme";
import type { ThemeCatalogItem, ThemeId } from "@/features/theme";
import { AppText } from "@/shared/components";

interface ThemeSelectorProps {
  items: readonly ThemeCatalogItem[];
  onSelect: (themeId: ThemeId) => void;
  value: ThemeId;
}

export function ThemeSelector({ items, onSelect, value }: ThemeSelectorProps) {
  const { theme } = useTheme();
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: theme.spacing.sm }}>
      {items.map((item) => {
        const preview = resolveTheme(item.id);
        const selected = value === item.id;
        return (
          <Pressable
            key={item.id}
            accessibilityLabel={`${item.displayName} 테마${selected ? ", 현재 사용 중" : ""}`}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            onPress={() => onSelect(item.id)}
            style={({ pressed }) => ({
              backgroundColor: selected ? theme.colors.primarySoft : theme.colors.surface,
              borderColor: selected ? theme.colors.primary : theme.colors.border,
              borderRadius: theme.radius.md,
              borderWidth: 1,
              gap: theme.spacing.sm,
              opacity: pressed ? 0.75 : 1,
              padding: theme.spacing.md,
              width: 168,
            })}
          >
            <View style={{ backgroundColor: preview.colors.background, borderColor: preview.colors.border, borderRadius: theme.radius.sm, borderWidth: 1, gap: 6, padding: 10 }}>
              <View style={{ backgroundColor: preview.colors.surface, borderRadius: 6, height: 24 }} />
              <View style={{ backgroundColor: preview.colors.primary, borderRadius: 6, height: 10, width: "58%" }} />
            </View>
            <AppText color={selected ? "primary" : "textPrimary"} variant="label">
              {selected ? `✓ ${item.displayName}` : item.displayName}
            </AppText>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
