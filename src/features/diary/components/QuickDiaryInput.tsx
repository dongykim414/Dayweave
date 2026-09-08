import { TextInput, View } from "react-native";

import { MAX_SHORT_TEXT_LENGTH } from "@/features/diary/model/diaryValidation";
import { useTheme } from "@/features/theme";
import { AppText } from "@/shared/components";

interface QuickDiaryInputProps {
  onChange: (value: string) => void;
  value: string;
}

export function QuickDiaryInput({ onChange, value }: QuickDiaryInputProps) {
  const { theme } = useTheme();

  return (
    <View style={{ gap: theme.spacing.sm }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <AppText variant="heading">한 줄 기록</AppText>
        <AppText color="textSecondary" variant="caption">
          {value.length} / {MAX_SHORT_TEXT_LENGTH}
        </AppText>
      </View>
      <TextInput
        accessibilityLabel="오늘의 한 줄 기록"
        maxLength={MAX_SHORT_TEXT_LENGTH}
        onChangeText={onChange}
        placeholder="오늘을 한 문장으로 남겨보세요."
        placeholderTextColor={theme.colors.textSecondary}
        returnKeyType="done"
        style={{
          backgroundColor: theme.colors.surfaceSoft,
          borderColor: theme.colors.border,
          borderRadius: theme.radius.md,
          borderWidth: 1,
          color: theme.colors.textPrimary,
          fontSize: theme.typography.body.fontSize,
          minHeight: 52,
          paddingHorizontal: theme.spacing.md,
          paddingVertical: theme.spacing.sm,
        }}
        value={value}
      />
    </View>
  );
}
