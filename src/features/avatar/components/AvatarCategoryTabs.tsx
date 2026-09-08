import { Pressable, ScrollView } from "react-native";

import type { AvatarSelectableCategory } from "@/features/avatar/avatar.types";
import { useTheme } from "@/features/theme";
import { AppText } from "@/shared/components";

const CATEGORIES: readonly {
  id: AvatarSelectableCategory;
  label: string;
}[] = [
  { id: "hair", label: "헤어" },
  { id: "top", label: "상의" },
  { id: "bottom", label: "하의" },
  { id: "accessory", label: "액세서리" },
];

interface AvatarCategoryTabsProps {
  onChange: (category: AvatarSelectableCategory) => void;
  value: AvatarSelectableCategory;
}

export function AvatarCategoryTabs({ onChange, value }: AvatarCategoryTabsProps) {
  const { theme } = useTheme();

  return (
    <ScrollView
      contentContainerStyle={{ gap: theme.spacing.sm }}
      horizontal
      showsHorizontalScrollIndicator={false}
    >
      {CATEGORIES.map((category) => {
        const selected = value === category.id;
        return (
          <Pressable
            key={category.id}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            onPress={() => onChange(category.id)}
            style={({ pressed }) => ({
              backgroundColor: selected
                ? theme.colors.primarySoft
                : theme.colors.surface,
              borderColor: selected ? theme.colors.primary : theme.colors.border,
              borderRadius: theme.radius.full,
              borderWidth: 1,
              minHeight: 44,
              opacity: pressed ? 0.75 : 1,
              paddingHorizontal: theme.spacing.lg,
              paddingVertical: theme.spacing.sm,
            })}
          >
            <AppText color={selected ? "primary" : "textPrimary"} variant="label">
              {category.label}
            </AppText>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
