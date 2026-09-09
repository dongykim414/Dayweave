import { Pressable, StyleSheet, View } from "react-native";

import { MoodVisual } from "@/features/mood/components/MoodVisual";
import { MOOD_IDS } from "@/features/mood/mood.types";
import type { MoodId } from "@/features/mood/mood.types";
import { useMoodPack } from "@/features/mood/MoodPackProvider";
import { useTheme } from "@/features/theme";
import { AppText } from "@/shared/components";

interface MoodSelectorProps {
  onChange: (moodId: MoodId | null) => void;
  value: MoodId | null;
}

export function MoodSelector({ onChange, value }: MoodSelectorProps) {
  const { resolveMood } = useMoodPack();
  const { theme } = useTheme();

  return (
    <View
      accessibilityLabel="감정 선택"
      style={[styles.grid, { gap: theme.spacing.xs }]}
    >
      {MOOD_IDS.map((moodId) => {
        const mood = resolveMood(moodId);
        const selected = value === moodId;

        return (
          <Pressable
            key={moodId}
            accessibilityLabel={`${mood.label}${selected ? ", 선택됨" : ""}`}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            onPress={() => onChange(selected ? null : moodId)}
            style={({ pressed }) => [
              styles.option,
              {
                backgroundColor: selected
                  ? theme.colors.primarySoft
                  : theme.colors.surfaceSoft,
                borderColor: selected
                  ? theme.colors.primary
                  : theme.colors.border,
                borderRadius: theme.radius.md,
                minHeight: 80,
                opacity: pressed ? 0.78 : 1,
                paddingHorizontal: theme.spacing.xs,
                paddingVertical: theme.spacing.sm,
              },
            ]}
          >
            <MoodVisual moodId={moodId} size={28} />
            <AppText
              color={selected ? "primary" : "textPrimary"}
              numberOfLines={1}
              variant="meta"
            >
              {mood.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
  },
  option: {
    alignItems: "center",
    borderWidth: 1,
    flex: 1,
    justifyContent: "center",
    minWidth: 0,
  },
});
