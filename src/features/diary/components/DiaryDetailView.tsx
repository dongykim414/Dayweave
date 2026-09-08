import { useState } from "react";
import { Image, View } from "react-native";

import type { DiaryRecord } from "@/features/diary/model/diaryPhoto.types";
import { MoodVisual } from "@/features/mood/components/MoodVisual";
import { resolveMood } from "@/features/mood/moodPackRegistry";
import { useTheme } from "@/features/theme";
import { AppCard, AppText } from "@/shared/components";

interface DiaryDetailViewProps {
  record: DiaryRecord;
}

export function DiaryDetailView({ record }: DiaryDetailViewProps) {
  const { theme } = useTheme();
  const [failedPhotoUri, setFailedPhotoUri] = useState<string | null>(null);
  const mood = record.entry.moodId
    ? resolveMood(record.entry.moodId)
    : null;

  return (
    <View style={{ gap: theme.spacing.lg }}>
      {record.photo && record.photo.localUri !== failedPhotoUri ? (
        <Image
          accessibilityLabel="일기 사진"
          onError={() => setFailedPhotoUri(record.photo?.localUri ?? null)}
          resizeMode="cover"
          source={{ uri: record.photo.localUri }}
          style={{
            aspectRatio: record.photo.width / record.photo.height,
            borderRadius: theme.radius.lg,
            maxHeight: 480,
            width: "100%",
          }}
        />
      ) : record.photo ? (
        <AppCard style={{ backgroundColor: theme.colors.surfaceSoft }}>
          <AppText color="textSecondary">사진을 불러올 수 없어요.</AppText>
        </AppCard>
      ) : null}

      {mood && record.entry.moodId ? (
        <View
          style={{
            alignItems: "center",
            flexDirection: "row",
            gap: theme.spacing.sm,
          }}
        >
          <MoodVisual moodId={record.entry.moodId} size={32} />
          <AppText variant="heading">{mood.label}</AppText>
        </View>
      ) : null}

      {record.entry.shortText ? (
        <AppText variant="title">{record.entry.shortText}</AppText>
      ) : null}

      {record.entry.content ? (
        <AppText style={{ lineHeight: 28 }}>{record.entry.content}</AppText>
      ) : null}
    </View>
  );
}
