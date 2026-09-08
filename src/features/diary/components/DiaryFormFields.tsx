import { View } from "react-native";

import { LongDiaryInput } from "@/features/diary/components/LongDiaryInput";
import { PhotoPickerField } from "@/features/diary/components/PhotoPickerField";
import { QuickDiaryInput } from "@/features/diary/components/QuickDiaryInput";
import type { DiaryDraft } from "@/features/diary/model/diary.types";
import { MoodSelector } from "@/features/mood/components/MoodSelector";
import type { MoodId } from "@/features/mood/mood.types";
import { useTheme } from "@/features/theme";
import { AppText } from "@/shared/components";

interface DiaryFormFieldsProps {
  draft: DiaryDraft;
  expanded: boolean;
  onChangeContent: (content: string) => void;
  onChangeMood: (moodId: MoodId | null) => void;
  onChangeShortText: (shortText: string) => void;
  onPhotoRemove: () => void;
  onPhotoSelect: () => void;
  onToggleExpanded: () => void;
  photoAvailable: boolean;
  photoBusy: boolean;
  photoUri: string | null;
}

export function DiaryFormFields({
  draft,
  expanded,
  onChangeContent,
  onChangeMood,
  onChangeShortText,
  onPhotoRemove,
  onPhotoSelect,
  onToggleExpanded,
  photoAvailable,
  photoBusy,
  photoUri,
}: DiaryFormFieldsProps) {
  const { theme } = useTheme();

  return (
    <>
      <View style={{ gap: theme.spacing.sm }}>
        <AppText variant="heading">감정</AppText>
        <MoodSelector onChange={onChangeMood} value={draft.moodId} />
      </View>

      <PhotoPickerField
        available={photoAvailable}
        busy={photoBusy}
        onRemove={onPhotoRemove}
        onSelect={onPhotoSelect}
        uri={photoUri}
      />

      <QuickDiaryInput onChange={onChangeShortText} value={draft.shortText} />

      <LongDiaryInput
        expanded={expanded}
        onChange={onChangeContent}
        onToggle={onToggleExpanded}
        value={draft.content}
      />
    </>
  );
}
