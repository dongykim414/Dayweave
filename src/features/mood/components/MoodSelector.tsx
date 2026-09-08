import { Image, Pressable, StyleSheet, View } from "react-native";

import { MOOD_IDS } from "@/features/mood/mood.types";
import type { MoodId } from "@/features/mood/mood.types";
import { resolveMood } from "@/features/mood/moodPackRegistry";
import { useTheme } from "@/features/theme";
import { AppText } from "@/shared/components";

interface MoodSelectorProps {
  onChange: (moodId: MoodId) => void;
  value: MoodId | null;
}

export function MoodSelector({ onChange, value }: MoodSelectorProps) {
  const { theme } = useTheme();

  return (
    <View
      accessibilityLabel="오늘의 감정 선택"
      style={[styles.grid, { gap: theme.spacing.sm }]}
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
            onPress={() => onChange(moodId)}
            style={({ pressed }) => [
              styles.option,
              {
                backgroundColor: selected
                  ? theme.colors.primarySoft
                  : theme.colors.surface,
                borderColor: selected
                  ? theme.colors.primary
                  : theme.colors.border,
                borderRadius: theme.radius.md,
                minHeight: theme.spacing.xl + theme.spacing.xl,
                opacity: pressed ? 0.78 : 1,
                padding: theme.spacing.sm,
              },
            ]}
          >
            {mood.visual.type === "text" ? (
              <AppText style={styles.visualText}>{mood.visual.value}</AppText>
            ) : (
              <Image
                accessibilityIgnoresInvertColors
                accessible={false}
                source={mood.visual.source}
                style={styles.visualImage}
              />
            )}
            <AppText
              color={selected ? "primary" : "textPrimary"}
              variant="caption"
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
    flexWrap: "wrap",
  },
  option: {
    alignItems: "center",
    borderWidth: 1,
    flexBasis: "30%",
    flexGrow: 1,
    justifyContent: "center",
    minWidth: 96,
  },
  visualImage: {
    height: 28,
    width: 28,
  },
  visualText: {
    fontSize: 24,
    lineHeight: 32,
  },
});
