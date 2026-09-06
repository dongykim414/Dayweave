import type { ComponentProps } from "react";
import { StyleSheet, Text } from "react-native";

import { useTheme } from "@/features/theme";
import type {
  ThemeColors,
  ThemeTextStyle,
  ThemeTypography,
} from "@/features/theme";

type AppTextVariant = keyof ThemeTypography;

interface AppTextProps extends ComponentProps<typeof Text> {
  color?: keyof ThemeColors;
  variant?: AppTextVariant;
}

function getTypography(
  variant: AppTextVariant,
  typography: ThemeTypography,
): ThemeTextStyle {
  return typography[variant];
}

export function AppText({
  color = "textPrimary",
  style,
  variant = "body",
  ...props
}: AppTextProps) {
  const { theme } = useTheme();
  const typography = getTypography(variant, theme.typography);

  return (
    <Text
      {...props}
      style={[
        styles.base,
        typography,
        { color: theme.colors[color] },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    includeFontPadding: false,
  },
});
