import { View } from "react-native";

import {
  AVATAR_CANVAS_SIZE,
  AVATAR_LAYER_ORDER,
  resolveAvatarLayers,
} from "@/features/avatar/avatarVisualRegistry";
import type { AvatarConfig } from "@/features/avatar/avatar.types";
import { useTheme } from "@/features/theme";

interface AvatarRendererProps {
  config: AvatarConfig;
  size?: number;
}

export function AvatarRenderer({ config, size = 280 }: AvatarRendererProps) {
  const { theme } = useTheme();
  const layers = resolveAvatarLayers(config);
  const scale = size / AVATAR_CANVAS_SIZE;

  return (
    <View
      accessibilityLabel="현재 선택한 파츠로 조합된 아바타"
      accessibilityRole="image"
      style={{
        backgroundColor: theme.colors.primarySoft,
        borderRadius: theme.radius.lg,
        height: size,
        overflow: "hidden",
        width: size,
      }}
    >
      {AVATAR_LAYER_ORDER.flatMap((slot) =>
        layers[slot].map((primitive, index) => (
          <View
            key={`${slot}-${index}`}
            style={{
              backgroundColor: primitive.backgroundColor,
              borderColor: primitive.borderColor,
              borderRadius: primitive.borderRadius
                ? primitive.borderRadius * scale
                : undefined,
              borderWidth: primitive.borderWidth
                ? primitive.borderWidth * scale
                : undefined,
              height: primitive.height * scale,
              left: primitive.left * scale,
              position: "absolute",
              top: primitive.top * scale,
              transform: primitive.rotate
                ? [{ rotate: primitive.rotate }]
                : undefined,
              width: primitive.width * scale,
            }}
          />
        )),
      )}
    </View>
  );
}
