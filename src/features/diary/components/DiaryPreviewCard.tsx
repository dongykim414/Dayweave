import { useState } from "react";
import { Image, View } from "react-native";

import type { DiaryRecord } from "@/features/diary/model/diaryPhoto.types";
import type { DiaryDateKey } from "@/features/diary/model/diary.types";
import { MoodVisual } from "@/features/mood/components/MoodVisual";
import { resolveMood } from "@/features/mood/moodPackRegistry";
import { useTheme } from "@/features/theme";
import { AppCard, AppText } from "@/shared/components";

interface DiaryPreviewCardProps {
  record: DiaryRecord | null;
  selectedDate: DiaryDateKey;
  todayDate: DiaryDateKey;
}

function formatSelectedDate(date: DiaryDateKey): string {
  const [year, month, day] = date.split("-");
  return `${year}년 ${Number(month)}월 ${Number(day)}일`;
}

export function DiaryPreviewCard({
  record,
  selectedDate,
  todayDate,
}: DiaryPreviewCardProps) {
  const { theme } = useTheme();
  const [failedPhotoUri, setFailedPhotoUri] = useState<string | null>(null);

  if (!record) {
    return (
      <AppCard style={{ gap: theme.spacing.sm }}>
        <AppText variant="heading">{formatSelectedDate(selectedDate)}</AppText>
        <AppText color="textSecondary">
          {selectedDate === todayDate
            ? "오늘의 기록을 남겨보세요."
            : "이날은 아직 기록이 없어요."}
        </AppText>
      </AppCard>
    );
  }

  const mood = record.entry.moodId
    ? resolveMood(record.entry.moodId)
    : null;

  return (
    <AppCard style={{ gap: theme.spacing.md }}>
      <AppText color="textSecondary" variant="caption">
        {formatSelectedDate(selectedDate)}
      </AppText>

      {mood && record.entry.moodId ? (
        <View
          style={{
            alignItems: "center",
            flexDirection: "row",
            gap: theme.spacing.sm,
          }}
        >
          <MoodVisual moodId={record.entry.moodId} size={28} />
          <AppText variant="label">{mood.label}</AppText>
        </View>
      ) : null}

      {record.photo && record.photo.localUri !== failedPhotoUri ? (
        <Image
          accessibilityLabel="선택한 날짜의 일기 사진"
          onError={() => setFailedPhotoUri(record.photo?.localUri ?? null)}
          resizeMode="cover"
          source={{ uri: record.photo.localUri }}
          style={{
            aspectRatio: 4 / 3,
            borderRadius: theme.radius.md,
            width: "100%",
          }}
        />
      ) : record.photo ? (
        <View
          style={{
            backgroundColor: theme.colors.surfaceSoft,
            borderRadius: theme.radius.md,
            padding: theme.spacing.lg,
          }}
        >
          <AppText color="textSecondary">
            저장된 사진을 불러올 수 없어요.
          </AppText>
        </View>
      ) : null}

      {record.entry.shortText ? (
        <AppText variant="heading">{record.entry.shortText}</AppText>
      ) : null}
      {record.entry.content ? (
        <AppText color="textSecondary" numberOfLines={3}>
          {record.entry.content}
        </AppText>
      ) : null}
    </AppCard>
  );
}
