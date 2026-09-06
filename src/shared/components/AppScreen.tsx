import type { PropsWithChildren } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useTheme } from "@/features/theme";

interface AppScreenProps extends PropsWithChildren {
  contentStyle?: StyleProp<ViewStyle>;
}

export function AppScreen({ children, contentStyle }: AppScreenProps) {
  const { theme } = useTheme();

  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      style={{ flex: 1, backgroundColor: theme.colors.background }}
    >
      <View
        style={[
          {
            flex: 1,
            paddingHorizontal: theme.spacing.lg,
            paddingVertical: theme.spacing.xl,
          },
          contentStyle,
        ]}
      >
        {children}
      </View>
    </SafeAreaView>
  );
}
