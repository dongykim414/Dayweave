import type { ComponentProps } from "react";
import { View } from "react-native";

import { useTheme } from "@/features/theme";

type AppCardVariant = "elevated" | "soft" | "outline";

interface AppCardProps extends ComponentProps<typeof View> {
  variant?: AppCardVariant;
}

export function AppCard({ style, variant = "elevated", ...props }: AppCardProps) {
  const { theme } = useTheme();
  const elevated = variant === "elevated";

  return (
    <View
      {...props}
      style={[
        {
          backgroundColor:
            variant === "soft"
              ? theme.colors.surfaceSoft
              : theme.colors.surfaceElevated,
          borderColor:
            variant === "outline" ? theme.colors.border : "transparent",
          borderRadius: theme.radius.lg,
          borderWidth: variant === "outline" ? 1 : 0,
          elevation: elevated ? theme.shadow.elevation : 0,
          padding: theme.layout.cardPadding,
          shadowColor: theme.colors.shadow,
          shadowOffset: { height: theme.shadow.offsetY, width: 0 },
          shadowOpacity: elevated ? theme.shadow.opacity : 0,
          shadowRadius: elevated ? theme.shadow.radius : 0,
        },
        style,
      ]}
    />
  );
}
