import { ActivityIndicator, Image, ScrollView, StyleSheet, View } from "react-native";

import { DiaryFormFields } from "@/features/diary/components/DiaryFormFields";
import { useTodayDiary } from "@/features/diary/hooks/useTodayDiary";
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
          paddingBottom: theme.layout.tabBarHeight + theme.spacing.lg,
          paddingTop: theme.spacing.sm,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.hero, { minHeight: 206 }]}>
          <View style={[styles.heroCopy, { gap: theme.spacing.xs }]}>
            <AppText color="textSecondary" variant="label">
              좋은 하루예요! ☀️
            </AppText>
            <AppText variant="display">오늘은 어땠나요?</AppText>
            <AppText color="textSecondary">
              오늘의 마음을 기록해보세요.{"\n"}작은 기록이, 특별한 하루를 만들어요.
            </AppText>
          </View>
          <Image
            accessibilityLabel="오늘의 기록을 반기는 캐릭터"
            resizeMode="contain"
            source={require("../../../../docs/reference/today.png")}
            style={styles.heroImage}
          />
        </View>

        <AppCard style={[styles.formCard, { gap: theme.layout.sectionGap }]}>
          <DiaryFormFields
            draft={draft}
            expanded={isExpanded}
            onChangeContent={updateContent}
            onChangeMood={updateMood}
            onChangeShortText={updateShortText}
            onPhotoRemove={removePhoto}
            onPhotoSelect={() => void selectPhoto()}
            onToggleExpanded={toggleExpanded}
            photoAvailable={photoAvailable}
            photoBusy={selectingPhoto || saving}
            photoUri={photoUri}
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

const styles = StyleSheet.create({
  formCard: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginHorizontal: -20,
    marginTop: -12,
    paddingHorizontal: 20,
    paddingTop: 26,
  },
  hero: {
    justifyContent: "center",
    overflow: "hidden",
    position: "relative",
  },
  heroCopy: {
    maxWidth: "64%",
    zIndex: 1,
  },
  heroImage: {
    bottom: -4,
    height: 198,
    position: "absolute",
    right: -38,
    width: 204,
  },
});
