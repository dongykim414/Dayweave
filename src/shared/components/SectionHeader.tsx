import { Pressable, View } from "react-native";

import { useTheme } from "@/features/theme";
import { AppText } from "@/shared/components/AppText";

interface SectionHeaderProps {
  actionLabel?: string;
  description?: string;
  onAction?: () => void;
  title: string;
}

export function SectionHeader({
  actionLabel,
  description,
  onAction,
  title,
}: SectionHeaderProps) {
  const { theme } = useTheme();
  return (
    <View style={{ gap: theme.spacing.xs }}>
      <View
        style={{
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <AppText accessibilityRole="header" variant="heading">
          {title}
        </AppText>
        {actionLabel && onAction ? (
          <Pressable
            accessibilityRole="button"
            onPress={onAction}
            style={({ pressed }) => ({ opacity: pressed ? 0.65 : 1, padding: theme.spacing.xs })}
          >
            <AppText color="textSecondary" variant="caption">
              {actionLabel} ›
            </AppText>
          </Pressable>
        ) : null}
      </View>
      {description ? (
        <AppText color="textSecondary" variant="caption">
          {description}
        </AppText>
      ) : null}
    </View>
  );
}
