import { ActivityIndicator, ScrollView, View } from "react-native";

import { LongDiaryInput } from "@/features/diary/components/LongDiaryInput";
import { PhotoPickerField } from "@/features/diary/components/PhotoPickerField";
import { QuickDiaryInput } from "@/features/diary/components/QuickDiaryInput";
import { useTodayDiary } from "@/features/diary/hooks/useTodayDiary";
import { MoodSelector } from "@/features/mood/components/MoodSelector";
import { useTheme } from "@/features/theme";
import { AppButton, AppCard, AppScreen, AppText } from "@/shared/components";

export default function TodayScreen() {
  const { theme } = useTheme();
  const {
    draft,
    error,
    feedback,
    isExpanded,
    loading,
    photoAvailable,
    photoUri,
    removePhoto,
    save,
    saving,
    selectPhoto,
    selectingPhoto,
    toggleExpanded,
    updateContent,
    updateMood,
    updateShortText,
  } = useTodayDiary();

  if (loading) {
    return (
      <AppScreen>
        <View
          style={{
            alignItems: "center",
            flex: 1,
            gap: theme.spacing.sm,
            justifyContent: "center",
          }}
        >
          <ActivityIndicator color={theme.colors.primary} />
          <AppText color="textSecondary">오늘의 기록을 불러오고 있어요.</AppText>
        </View>
      </AppScreen>
    );
  }

  return (
    <AppScreen contentStyle={{ paddingVertical: 0 }}>
      <ScrollView
        contentContainerStyle={{
          gap: theme.spacing.xl,
          paddingBottom: theme.spacing.xl,
          paddingTop: theme.spacing.xl,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={{ gap: theme.spacing.sm }}>
          <AppText color="primary" variant="label">
            TODAY
          </AppText>
          <AppText variant="title">오늘은 어땠나요?</AppText>
          <AppText color="textSecondary">
            기분과 한 줄만으로도 오늘을 가볍게 남길 수 있어요.
          </AppText>
        </View>

        <AppCard style={{ gap: theme.spacing.lg }}>
          <View style={{ gap: theme.spacing.sm }}>
            <AppText variant="heading">오늘의 감정</AppText>
            <MoodSelector onChange={updateMood} value={draft.moodId} />
          </View>

          <PhotoPickerField
            available={photoAvailable}
            busy={selectingPhoto || saving}
            onRemove={removePhoto}
            onSelect={() => void selectPhoto()}
            uri={photoUri}
          />

          <QuickDiaryInput
            onChange={updateShortText}
            value={draft.shortText}
          />

          <LongDiaryInput
            expanded={isExpanded}
            onChange={updateContent}
            onToggle={toggleExpanded}
            value={draft.content}
          />

          {error ? (
            <AppText accessibilityRole="alert" color="danger" variant="caption">
              {error}
            </AppText>
          ) : null}

          {feedback ? (
            <AppText accessibilityRole="alert" color="primary" variant="caption">
              {feedback}
            </AppText>
          ) : null}

          <AppButton
            disabled={saving}
            label={saving ? "저장 중..." : "저장하기"}
            onPress={() => void save()}
          />
        </AppCard>
      </ScrollView>
    </AppScreen>
  );
}
