import { View } from "react-native";

import { MAX_SHORT_TEXT_LENGTH } from "@/features/diary/model/diaryValidation";
import { useTheme } from "@/features/theme";
import { AppText, AppTextInput, SectionHeader } from "@/shared/components";

interface QuickDiaryInputProps {
  onChange: (value: string) => void;
  value: string;
}

export function QuickDiaryInput({ onChange, value }: QuickDiaryInputProps) {
  const { theme } = useTheme();

  return (
    <View style={{ gap: theme.spacing.sm }}>
      <SectionHeader title="한 줄 일기" />
      <AppTextInput
        accessibilityLabel="한 줄 기록"
        maxLength={MAX_SHORT_TEXT_LENGTH}
        onChangeText={onChange}
        placeholder="오늘을 한 문장으로 남겨보세요."
        returnKeyType="done"
        value={value}
      />
      <AppText color="textTertiary" style={{ textAlign: "right" }} variant="meta">
        {value.length}/{MAX_SHORT_TEXT_LENGTH}
      </AppText>
    </View>
  );
}
