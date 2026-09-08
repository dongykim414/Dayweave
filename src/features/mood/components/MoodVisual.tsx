import { Image } from "react-native";

import type { MoodId } from "@/features/mood/mood.types";
import { resolveMood } from "@/features/mood/moodPackRegistry";
import { AppText } from "@/shared/components";

interface MoodVisualProps {
  moodId: MoodId;
  size?: number;
}

export function MoodVisual({ moodId, size = 24 }: MoodVisualProps) {
  const mood = resolveMood(moodId);

  if (mood.visual.type === "image") {
    return (
      <Image
        accessibilityIgnoresInvertColors
        accessible={false}
        source={mood.visual.source}
        style={{ height: size, width: size }}
      />
    );
  }

  return (
    <AppText
      accessible={false}
      style={{ fontSize: size, lineHeight: size + 4 }}
    >
      {mood.visual.value}
    </AppText>
  );
}
