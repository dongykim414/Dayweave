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
              borderWidth: selected ? 2 : 0,
              gap: theme.spacing.sm,
              opacity: pressed ? 0.75 : 1,
              padding: theme.spacing.sm,
              shadowColor: theme.colors.shadow,
              shadowOffset: { height: 3, width: 0 },
              shadowOpacity: selected ? 0 : theme.shadow.opacity,
              shadowRadius: theme.shadow.radius,
              width: 112,
            })}
          >
            <View style={{ backgroundColor: preview.colors.background, borderColor: preview.colors.border, borderRadius: theme.radius.sm, borderWidth: 1, gap: 6, height: 82, justifyContent: "flex-end", padding: 10 }}>
              <View style={{ backgroundColor: preview.colors.surface, borderRadius: theme.radius.sm, height: 28 }} />
              <View style={{ backgroundColor: preview.colors.primary, borderRadius: theme.radius.full, height: 8, width: "58%" }} />
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
