import { router } from "expo-router";
import { ScrollView, View } from "react-native";

import { AvatarRenderer } from "@/features/avatar/components/AvatarRenderer";
import { useAvatar } from "@/features/avatar/hooks/useAvatar";
import { getOwnedMoodPacks } from "@/features/mood/moodPackCatalog";
import { MoodPackSelector } from "@/features/personalization/components/MoodPackSelector";
import { ThemeSelector } from "@/features/personalization/components/ThemeSelector";
import { usePersonalization } from "@/features/personalization/PersonalizationProvider";
import { getOwnedThemes, resolveTheme, useTheme } from "@/features/theme";
import { AppButton, AppCard, AppScreen, AppText } from "@/shared/components";

export default function MeScreen() {
  const { theme } = useTheme();
  const personalization = usePersonalization();
  const avatar = useAvatar();
  const activeTheme = resolveTheme(personalization.settings.selectedThemeId);
  const activeMoodPack = getOwnedMoodPacks().find(
    (item) => item.id === personalization.settings.selectedMoodPackId,
  );

  return (
    <AppScreen contentStyle={{ paddingVertical: 0 }}>
      <ScrollView
        contentContainerStyle={{ gap: theme.spacing.xl, paddingBottom: theme.spacing.xl, paddingTop: theme.spacing.xl }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ gap: theme.spacing.sm }}>
          <AppText variant="title">내 정보</AppText>
          <AppText color="textSecondary">오늘의 기록 공간을 내 취향으로 꾸며보세요.</AppText>
        </View>

        <AppCard style={{ gap: theme.spacing.sm }}>
          <AppText color="textSecondary" variant="caption">PERSONALIZATION</AppText>
          <AppText variant="heading">{activeTheme.name} · {activeMoodPack?.displayName ?? "Default"}</AppText>
          <AppText color="textSecondary" variant="caption">
            {personalization.saving ? "선택을 저장하고 있어요..." : "선택하면 앱 전체에 바로 적용돼요."}
          </AppText>
        </AppCard>

        <AppCard style={{ alignItems: "center", gap: theme.spacing.md }}>
          <AppText variant="heading">나의 아바타</AppText>
          {avatar.loading ? (
            <AppText color="textSecondary">아바타를 불러오고 있어요.</AppText>
          ) : (
            <AvatarRenderer config={avatar.config} size={152} />
          )}
          <AppButton label="아바타 꾸미기" onPress={() => router.navigate("/avatar")} variant="secondary" />
        </AppCard>

        <View style={{ gap: theme.spacing.md }}>
          <AppText variant="heading">테마</AppText>
          <ThemeSelector items={getOwnedThemes()} onSelect={personalization.selectTheme} value={personalization.settings.selectedThemeId} />
        </View>

        <View style={{ gap: theme.spacing.md }}>
          <AppText variant="heading">감정 스타일</AppText>
          <MoodPackSelector items={getOwnedMoodPacks()} onSelect={personalization.selectMoodPack} value={personalization.settings.selectedMoodPackId} />
        </View>

        {personalization.error ? (
          <AppCard style={{ gap: theme.spacing.sm }}>
            <AppText accessibilityRole="alert" color="danger" variant="caption">{personalization.error}</AppText>
            <AppButton label="다시 불러오기" onPress={personalization.retry} variant="secondary" />
          </AppCard>
        ) : null}
      </ScrollView>
    </AppScreen>
  );
}
