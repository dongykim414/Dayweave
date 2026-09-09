import type { ComponentProps } from "react";
import { TextInput } from "react-native";

import { useTheme } from "@/features/theme";

type AppTextInputProps = ComponentProps<typeof TextInput>;

export function AppTextInput({ multiline, style, ...props }: AppTextInputProps) {
  const { theme } = useTheme();
  return (
    <TextInput
      multiline={multiline}
      placeholderTextColor={theme.colors.textTertiary}
      {...props}
      style={[
        {
          backgroundColor: theme.colors.input,
          borderColor: theme.colors.inputBorder,
          borderRadius: theme.radius.md,
          borderWidth: 1,
          color: theme.colors.textPrimary,
          fontSize: theme.typography.body.fontSize,
          lineHeight: theme.typography.body.lineHeight,
          minHeight: multiline ? 144 : 52,
          paddingHorizontal: theme.spacing.md,
          paddingVertical: theme.spacing.sm,
          textAlignVertical: multiline ? "top" : "center",
        },
        style,
      ]}
    />
  );
}
