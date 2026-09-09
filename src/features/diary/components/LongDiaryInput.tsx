import { Pressable, View } from "react-native";

import { useTheme } from "@/features/theme";
import { AppText, AppTextInput } from "@/shared/components";

interface LongDiaryInputProps {
  expanded: boolean;
  onChange: (value: string) => void;
  onToggle: () => void;
  value: string;
}

export function LongDiaryInput({
  expanded,
  onChange,
  onToggle,
  value,
}: LongDiaryInputProps) {
  const { theme } = useTheme();

  return (
    <View style={{ gap: theme.spacing.sm }}>
      <Pressable
        accessibilityLabel={expanded ? "자세히 쓰기 접기" : "자세히 쓰기 펼치기"}
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        onPress={onToggle}
        style={({ pressed }) => ({
          alignItems: "center",
          alignSelf: "flex-start",
          flexDirection: "row",
          gap: theme.spacing.xs,
          minHeight: 44,
          opacity: pressed ? 0.7 : 1,
        })}
      >
        <AppText color="textPrimary" variant="label">
          자세히 쓰기
        </AppText>
        <AppText color="textSecondary">{expanded ? "⌃" : "⌄"}</AppText>
      </Pressable>

      {expanded ? (
        <AppTextInput
          accessibilityLabel="자세한 기록"
          multiline
          onChangeText={onChange}
          placeholder="오늘의 이야기를 조금 더 남겨보세요..."
          style={{ minHeight: 152 }}
          value={value}
        />
      ) : null}
    </View>
  );
}
