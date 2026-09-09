import { router } from "expo-router";
import { Image, ScrollView, StyleSheet, View } from "react-native";

import { useAvatar } from "@/features/avatar/hooks/useAvatar";
import { getOwnedMoodPacks } from "@/features/mood/moodPackCatalog";
import { MoodPackSelector } from "@/features/personalization/components/MoodPackSelector";
import { ThemeSelector } from "@/features/personalization/components/ThemeSelector";
import { usePersonalization } from "@/features/personalization/PersonalizationProvider";
import { getOwnedThemes, resolveTheme, useTheme } from "@/features/theme";
import { AppButton, AppCard, AppScreen, AppText, SectionHeader } from "@/shared/components";

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
        contentContainerStyle={{
          gap: theme.layout.sectionGap,
          paddingBottom: theme.layout.tabBarHeight + theme.spacing.lg,
          paddingTop: theme.layout.screenTop,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ gap: theme.spacing.xs }}>
          <AppText variant="display">나의 공간</AppText>
          <AppText color="textSecondary">나만의 캐릭터와 테마로, 더 특별하게</AppText>
        </View>

        <AppCard style={[styles.profileCard, { minHeight: 242 }]} variant="soft">
          {avatar.loading ? (
            <AppText color="textSecondary">아바타를 불러오고 있어요.</AppText>
          ) : (
            <Image
              accessibilityLabel="나의 작은 친구 하루"
              resizeMode="contain"
              source={require("../../../../docs/reference/mypage.png")}
              style={styles.profileImage}
            />
          )}
          <View style={[styles.profileCopy, { gap: theme.spacing.sm }]}>
            <AppText color="textSecondary" variant="caption">나의 작은 친구</AppText>
            <AppText variant="title">하루</AppText>
            <AppText color="textSecondary" variant="caption">
              {activeTheme.name} · {activeMoodPack?.displayName ?? "Default"}
            </AppText>
            <AppButton
              label="꾸미기"
              onPress={() => router.navigate("/avatar")}
              size="compact"
              style={{ alignSelf: "flex-start" }}
              variant="ghost"
            />
          </View>
        </AppCard>

        <View style={{ gap: theme.spacing.md }}>
          <SectionHeader description="선택하면 앱 전체에 바로 적용돼요." title="테마" />
          <ThemeSelector items={getOwnedThemes()} onSelect={personalization.selectTheme} value={personalization.settings.selectedThemeId} />
        </View>

        <View style={{ gap: theme.spacing.md }}>
          <SectionHeader title="감정 스타일" />
          <MoodPackSelector items={getOwnedMoodPacks()} onSelect={personalization.selectMoodPack} value={personalization.settings.selectedMoodPackId} />
        </View>

        <AppCard variant="soft">
          <AppText color="textSecondary" style={{ textAlign: "center" }} variant="caption">
            {personalization.saving
              ? "취향을 저장하고 있어요..."
              : "기록하면 특별한 이야기가 됩니다."}
          </AppText>
        </AppCard>

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

const styles = StyleSheet.create({
  profileCard: {
    justifyContent: "center",
    overflow: "hidden",
    position: "relative",
  },
  profileCopy: {
    marginLeft: "55%",
    zIndex: 1,
  },
  profileImage: {
    bottom: -22,
    height: 250,
    left: -18,
    position: "absolute",
    width: "66%",
  },
});
