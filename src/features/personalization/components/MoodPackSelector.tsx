import { Image, Pressable, ScrollView, View } from "react-native";

import type { MoodPackCatalogItem } from "@/features/mood/moodPackCatalog";
import { resolveMood } from "@/features/mood/moodPackRegistry";
import { MOOD_IDS } from "@/features/mood/mood.types";
import type { MoodPackId } from "@/features/mood/mood.types";
import { useTheme } from "@/features/theme";
import { AppText } from "@/shared/components";

interface MoodPackSelectorProps {
  items: readonly MoodPackCatalogItem[];
  onSelect: (moodPackId: MoodPackId) => void;
  value: MoodPackId;
}

export function MoodPackSelector({ items, onSelect, value }: MoodPackSelectorProps) {
  const { theme } = useTheme();
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: theme.spacing.sm }}>
      {items.map((item) => {
        const selected = value === item.id;
        return (
          <Pressable
            key={item.id}
            accessibilityLabel={`${item.displayName} 감정팩${selected ? ", 현재 사용 중" : ""}`}
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
              width: 192,
            })}
          >
            <View style={{ flexDirection: "row", gap: theme.spacing.xs }}>
              {MOOD_IDS.slice(0, 4).map((moodId) => {
                const visual = resolveMood(moodId, item.id).visual;
                return visual.type === "image" ? (
                  <Image key={moodId} source={visual.source} style={{ height: 26, width: 26 }} />
                ) : (
                  <AppText key={moodId} accessible={false} style={{ fontSize: 22 }}>
                    {visual.value}
                  </AppText>
                );
              })}
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
