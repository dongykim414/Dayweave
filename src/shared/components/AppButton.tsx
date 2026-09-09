import type { StyleProp, ViewStyle } from "react-native";
import { Pressable, StyleSheet } from "react-native";

import { useTheme } from "@/features/theme";
import type { ThemeColors } from "@/features/theme";
import { AppText } from "@/shared/components/AppText";

type AppButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type AppButtonSize = "large" | "compact";

interface AppButtonProps {
  disabled?: boolean;
  label: string;
  onPress: () => void;
  size?: AppButtonSize;
  style?: StyleProp<ViewStyle>;
  variant?: AppButtonVariant;
}

interface ButtonPalette {
  backgroundColor: string;
  borderColor: string;
  labelColor: keyof ThemeColors;
}

export function AppButton({
  disabled = false,
  label,
  onPress,
  size = "large",
  style,
  variant = "primary",
}: AppButtonProps) {
  const { theme } = useTheme();

  const palettes: Record<AppButtonVariant, ButtonPalette> = {
    primary: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
      labelColor: "onPrimary",
    },
    secondary: {
      backgroundColor: theme.colors.surfaceElevated,
      borderColor: theme.colors.border,
      labelColor: "textPrimary",
    },
    ghost: {
      backgroundColor: theme.colors.chip,
      borderColor: theme.colors.chip,
      labelColor: "primary",
    },
    danger: {
      backgroundColor: theme.colors.surfaceElevated,
      borderColor: theme.colors.danger,
      labelColor: "danger",
    },
  };
  const palette = palettes[variant];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: palette.backgroundColor,
          borderColor: palette.borderColor,
          borderRadius: theme.radius.full,
          minHeight: size === "compact" ? 44 : 54,
          opacity: disabled ? 0.45 : pressed ? 0.78 : 1,
          paddingHorizontal:
            size === "compact" ? theme.spacing.md : theme.spacing.lg,
          paddingVertical:
            size === "compact" ? theme.spacing.sm : theme.spacing.md,
        },
        style,
      ]}
    >
      <AppText color={palette.labelColor} variant="label">
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    borderWidth: 1,
    justifyContent: "center",
  },
});
