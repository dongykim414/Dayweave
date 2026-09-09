import { Pressable, ScrollView, View } from "react-native";

import { getAvatarItemPreviewColor } from "@/features/avatar/avatarVisualRegistry";
import type {
  AvatarItemDefinition,
  AvatarItemId,
  AvatarSelectableCategory,
} from "@/features/avatar/avatar.types";
import { useTheme } from "@/features/theme";
import { AppText } from "@/shared/components";

interface AvatarItemSelectorProps {
  category: AvatarSelectableCategory;
  items: readonly AvatarItemDefinition[];
  onSelect: (itemId: AvatarItemId | null) => void;
  selectedItemId: AvatarItemId | null;
}

export function AvatarItemSelector({
  category,
  items,
  onSelect,
  selectedItemId,
}: AvatarItemSelectorProps) {
  const { theme } = useTheme();
  const options: readonly (AvatarItemDefinition | null)[] =
    category === "accessory" ? [null, ...items] : items;

  return (
    <ScrollView
      contentContainerStyle={{ gap: theme.spacing.sm }}
      horizontal
      showsHorizontalScrollIndicator={false}
    >
      {options.map((option) => {
        const item = option;
        const id = item?.id ?? null;
        const selected = selectedItemId === id;
        const label = item?.displayName ?? "착용 안 함";

        return (
          <Pressable
            key={id ?? "accessory-none"}
            accessibilityLabel={`${label}${selected ? ", 선택됨" : ""}`}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            onPress={() => onSelect(id)}
            style={({ pressed }) => ({
              alignItems: "center",
              backgroundColor: selected
                ? theme.colors.primarySoft
                : theme.colors.surfaceElevated,
              borderColor: selected ? theme.colors.primary : theme.colors.border,
              borderRadius: theme.radius.md,
              borderWidth: selected ? 2 : 0,
              gap: theme.spacing.sm,
              minHeight: 104,
              opacity: pressed ? 0.75 : 1,
              padding: theme.spacing.md,
              shadowColor: theme.colors.shadow,
              shadowOffset: { height: 3, width: 0 },
              shadowOpacity: selected ? 0 : theme.shadow.opacity,
              shadowRadius: theme.shadow.radius,
              width: 104,
            })}
          >
            <View
              style={{
                alignItems: "center",
                backgroundColor: item
                  ? getAvatarItemPreviewColor(item.id)
                  : theme.colors.surfaceSoft,
                borderRadius: theme.radius.full,
                height: 44,
                justifyContent: "center",
                width: 44,
              }}
            >
              <AppText color={item ? "onPrimary" : "textSecondary"} variant="label">
                {item ? (selected ? "✓" : "") : "없음"}
              </AppText>
            </View>
            <AppText
              color={selected ? "primary" : "textPrimary"}
              numberOfLines={2}
              style={{ textAlign: "center" }}
              variant="caption"
            >
              {label}
            </AppText>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
