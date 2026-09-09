import { ScrollView } from "react-native";

import type { AvatarSelectableCategory } from "@/features/avatar/avatar.types";
import { useTheme } from "@/features/theme";
import { AppChip } from "@/shared/components";

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
          <AppChip
            accessibilityLabel={`${category.label}${selected ? ", 선택됨" : ""}`}
            key={category.id}
            label={category.label}
            onPress={() => onChange(category.id)}
            selected={selected}
          />
        );
      })}
    </ScrollView>
  );
}
