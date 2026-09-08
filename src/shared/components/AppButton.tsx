import type { StyleProp, ViewStyle } from "react-native";
import { Pressable, StyleSheet } from "react-native";

import { useTheme } from "@/features/theme";
import type { ThemeColors } from "@/features/theme";
import { AppText } from "@/shared/components/AppText";

type AppButtonVariant = "primary" | "secondary" | "ghost";

interface AppButtonProps {
  disabled?: boolean;
  label: string;
  onPress: () => void;
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
  style,
  variant = "primary",
}: AppButtonProps) {
  const { theme } = useTheme();

  const palettes: Record<AppButtonVariant, ButtonPalette> = {
    primary: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
      labelColor: "surface",
    },
    secondary: {
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
      labelColor: "textPrimary",
    },
    ghost: {
      backgroundColor: theme.colors.surfaceSoft,
      borderColor: theme.colors.surfaceSoft,
      labelColor: "primary",
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
          borderRadius: theme.radius.md,
          minHeight: theme.spacing.xl + theme.spacing.lg,
          opacity: disabled ? 0.45 : pressed ? 0.78 : 1,
          paddingHorizontal: theme.spacing.lg,
          paddingVertical: theme.spacing.md,
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
