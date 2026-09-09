import { useState } from "react";
import { Image, View } from "react-native";

import type { DiaryRecord } from "@/features/diary/model/diaryPhoto.types";
import type { DiaryDateKey } from "@/features/diary/model/diary.types";
import { MoodVisual } from "@/features/mood/components/MoodVisual";
import { useMoodPack } from "@/features/mood/MoodPackProvider";
import { useTheme } from "@/features/theme";
import { AppButton, AppCard, AppChip, AppText } from "@/shared/components";

interface DiaryPreviewCardProps {
  onOpen?: (id: string) => void;
  record: DiaryRecord | null;
  selectedDate: DiaryDateKey;
  todayDate: DiaryDateKey;
}

function formatSelectedDate(date: DiaryDateKey): string {
  const [year, month, day] = date.split("-");
  return `${year}년 ${Number(month)}월 ${Number(day)}일`;
}

export function DiaryPreviewCard({
  onOpen,
  record,
  selectedDate,
  todayDate,
}: DiaryPreviewCardProps) {
  const { theme } = useTheme();
  const { resolveMood } = useMoodPack();
  const [failedPhotoUri, setFailedPhotoUri] = useState<string | null>(null);

  if (!record) {
    return (
      <AppCard style={{ alignItems: "center", gap: theme.spacing.sm, paddingVertical: theme.spacing.xl }} variant="soft">
        <AppText variant="heading">아직 기록이 없어요</AppText>
        <AppText color="textSecondary" style={{ textAlign: "center" }}>
          {selectedDate === todayDate
            ? "오늘의 기록을 남겨보세요."
            : `${formatSelectedDate(selectedDate)}의 마음을 기다리고 있어요.`}
        </AppText>
      </AppCard>
    );
  }

  const mood = record.entry.moodId
    ? resolveMood(record.entry.moodId)
    : null;

  return (
    <AppCard style={{ gap: theme.spacing.md }}>
      <View style={{ alignItems: "center", flexDirection: "row", flexWrap: "wrap", gap: theme.spacing.sm }}>
        <AppText variant="label">{formatSelectedDate(selectedDate)}</AppText>
        {mood && record.entry.moodId ? (
          <AppChip
            label={mood.label}
            leading={<MoodVisual moodId={record.entry.moodId} size={18} />}
          />
        ) : null}
      </View>

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

      {onOpen ? (
        <AppButton
          label="상세 보기"
          onPress={() => onOpen(record.entry.id)}
          size="compact"
          variant="secondary"
        />
      ) : null}
    </AppCard>
  );
}
