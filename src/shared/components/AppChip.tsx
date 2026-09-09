import type { ReactNode } from "react";
import { Pressable, View } from "react-native";

import { useTheme } from "@/features/theme";
import { AppText } from "@/shared/components/AppText";

interface AppChipProps {
  accessibilityLabel?: string;
  label: string;
  leading?: ReactNode;
  onPress?: () => void;
  selected?: boolean;
}

export function AppChip({
  accessibilityLabel,
  label,
  leading,
  onPress,
  selected = false,
}: AppChipProps) {
  const { theme } = useTheme();
  return (
    <Pressable
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityRole={onPress ? "button" : undefined}
      accessibilityState={onPress ? { selected } : undefined}
      disabled={!onPress}
      onPress={onPress}
      style={({ pressed }) => ({
        alignItems: "center",
        alignSelf: "flex-start",
        backgroundColor: selected ? theme.colors.primarySoft : theme.colors.chip,
        borderColor: selected ? theme.colors.primary : "transparent",
        borderRadius: theme.radius.full,
        borderWidth: 1,
        flexDirection: "row",
        gap: theme.spacing.xs,
        minHeight: 34,
        opacity: pressed ? 0.72 : 1,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.xs,
      })}
    >
      {leading ? <View>{leading}</View> : null}
      <AppText color={selected ? "primary" : "textSecondary"} variant="caption">
        {label}
      </AppText>
    </Pressable>
  );
}
