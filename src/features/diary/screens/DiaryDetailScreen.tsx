import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from "react-native";
import { useRouter } from "expo-router";

import { DiaryDetailView } from "@/features/diary/components/DiaryDetailView";
import { DiaryFormFields } from "@/features/diary/components/DiaryFormFields";
import { useDiaryDetail } from "@/features/diary/hooks/useDiaryDetail";
import { useTheme } from "@/features/theme";
import {
  AppButton,
  AppCard,
  AppIconButton,
  AppScreen,
  AppText,
} from "@/shared/components";

interface DiaryDetailScreenProps {
  id: string | null;
}

function formatDiaryDate(date: string): string {
  const [year, month, day] = date.split("-");
  return `${year}년 ${Number(month)}월 ${Number(day)}일`;
}

export default function DiaryDetailScreen({ id }: DiaryDetailScreenProps) {
  const router = useRouter();
  const { theme } = useTheme();
  const detail = useDiaryDetail(id);

  if (detail.loading) {
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
          <AppText color="textSecondary">기록을 불러오고 있어요.</AppText>
        </View>
      </AppScreen>
    );
  }

  if (!detail.record) {
    return (
      <AppScreen
        contentStyle={{ gap: theme.spacing.lg, justifyContent: "center" }}
      >
        <AppCard style={{ gap: theme.spacing.md }} variant="soft">
          <AppText variant="heading">기록을 찾을 수 없어요.</AppText>
          <AppText color="textSecondary">
            삭제되었거나 올바르지 않은 기록이에요.
          </AppText>
          {detail.error ? (
            <AppText accessibilityRole="alert" color="danger">
              {detail.error}
            </AppText>
          ) : null}
          {detail.error ? (
            <AppButton
              label="다시 시도"
              onPress={detail.retry}
              variant="secondary"
            />
          ) : null}
          <AppButton
            label="타임라인으로 돌아가기"
            onPress={() => router.replace("/timeline")}
          />
        </AppCard>
      </AppScreen>
    );
  }

  return (
    <AppScreen contentStyle={{ paddingVertical: 0 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            gap: theme.spacing.lg,
            paddingBottom: theme.layout.tabBarHeight + theme.spacing.lg,
            paddingTop: theme.spacing.sm,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View
            style={{
              alignItems: "center",
              flexDirection: "row",
              gap: theme.spacing.sm,
            }}
          >
            <AppIconButton
              accessibilityLabel="타임라인으로 돌아가기"
              icon={<AppText variant="heading">‹</AppText>}
              onPress={() => router.back()}
            />
            <View style={{ flex: 1 }}>
              <AppText color="textSecondary" variant="meta">
                {detail.editing ? "기록 수정" : "나의 기록"}
              </AppText>
              <AppText variant="title">
                {formatDiaryDate(detail.record.entry.entryDate)}
              </AppText>
            </View>
          </View>

          {detail.editing ? (
            <AppCard style={{ gap: theme.spacing.lg }}>
              <DiaryFormFields
                draft={detail.draft}
                expanded={detail.expanded}
                onChangeContent={detail.setContent}
                onChangeMood={detail.setMood}
                onChangeShortText={detail.setShortText}
                onPhotoRemove={detail.removePhoto}
                onPhotoSelect={() => void detail.selectPhoto()}
                onToggleExpanded={detail.toggleExpanded}
                photoAvailable={detail.photoAvailable}
                photoBusy={detail.selectingPhoto || detail.saving}
                photoUri={detail.photoUri}
              />

              {detail.error ? (
                <AppText
                  accessibilityRole="alert"
                  color="danger"
                  variant="caption"
                >
                  {detail.error}
                </AppText>
              ) : null}

              <View style={{ gap: theme.spacing.sm }}>
                <AppButton
                  disabled={detail.saving}
                  label={detail.saving ? "저장 중..." : "수정 저장"}
                  onPress={() => void detail.save()}
                />
                <AppButton
                  disabled={detail.saving}
                  label="수정 취소"
                  onPress={detail.cancelEdit}
                  size="compact"
                  variant="secondary"
                />
              </View>
            </AppCard>
          ) : (
            <>
              <DiaryDetailView record={detail.record} />

              {detail.feedback ? (
                <AppText
                  accessibilityRole="alert"
                  color="primary"
                  variant="caption"
                >
                  {detail.feedback}
                </AppText>
              ) : null}
              {detail.error ? (
                <AppText
                  accessibilityRole="alert"
                  color="danger"
                  variant="caption"
                >
                  {detail.error}
                </AppText>
              ) : null}

              <View style={{ flexDirection: "row", gap: theme.spacing.sm }}>
                <AppButton
                  disabled={detail.deleting}
                  label="기록 수정"
                  onPress={detail.beginEdit}
                  size="compact"
                  style={{ flex: 1 }}
                  variant="secondary"
                />
                <AppButton
                  disabled={detail.deleting}
                  label={detail.deleting ? "삭제 중..." : "기록 삭제"}
                  onPress={detail.confirmDelete}
                  size="compact"
                  style={{ flex: 1 }}
                  variant="danger"
                />
              </View>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </AppScreen>
  );
}
