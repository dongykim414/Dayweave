import type { ComponentProps } from "react";
import { View } from "react-native";

import { useTheme } from "@/features/theme";

type AppCardProps = ComponentProps<typeof View>;

export function AppCard({ style, ...props }: AppCardProps) {
  const { theme } = useTheme();

  return (
    <View
      {...props}
      style={[
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
          borderRadius: theme.radius.lg,
          borderWidth: 1,
          padding: theme.spacing.lg,
        },
        style,
      ]}
    />
  );
}
