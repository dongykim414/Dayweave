import { ActivityIndicator, ScrollView, View } from "react-native";

import { AvatarCategoryTabs } from "@/features/avatar/components/AvatarCategoryTabs";
import { AvatarItemSelector } from "@/features/avatar/components/AvatarItemSelector";
import { AvatarRenderer } from "@/features/avatar/components/AvatarRenderer";
import { useAvatar } from "@/features/avatar/hooks/useAvatar";
import { useTheme } from "@/features/theme";
import { AppButton, AppCard, AppScreen, AppText } from "@/shared/components";

export default function AvatarScreen() {
  const { theme } = useTheme();
  const avatar = useAvatar();

  if (avatar.loading) {
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
          <AppText color="textSecondary">아바타를 준비하고 있어요.</AppText>
        </View>
      </AppScreen>
    );
  }

  return (
    <AppScreen contentStyle={{ paddingVertical: 0 }}>
      <ScrollView
        contentContainerStyle={{
          gap: theme.spacing.lg,
          paddingBottom: theme.spacing.xl,
          paddingTop: theme.spacing.xl,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ gap: theme.spacing.sm }}>
          <AppText color="primary" variant="label">
            MY AVATAR
          </AppText>
          <AppText variant="title">오늘의 나를 꾸며요</AppText>
          <AppText color="textSecondary">
            보유한 파츠를 골라 기록을 함께할 캐릭터를 만들어보세요.
          </AppText>
        </View>

        <AppCard
          style={{ alignItems: "center", gap: theme.spacing.md, padding: theme.spacing.md }}
        >
          <AvatarRenderer config={avatar.config} />
          <AppText color="textSecondary" variant="caption">
            {avatar.saving ? "선택을 저장하고 있어요..." : "선택하면 바로 저장돼요."}
          </AppText>
        </AppCard>

        <View style={{ gap: theme.spacing.md }}>
          <AvatarCategoryTabs
            onChange={avatar.setSelectedCategory}
            value={avatar.selectedCategory}
          />
          <AvatarItemSelector
            category={avatar.selectedCategory}
            items={avatar.items}
            onSelect={(itemId) =>
              avatar.selectPart(avatar.selectedCategory, itemId)
            }
            selectedItemId={avatar.selectedItemId}
          />
        </View>

        {avatar.error ? (
          <AppCard style={{ gap: theme.spacing.sm }}>
            <AppText accessibilityRole="alert" color="danger" variant="caption">
              {avatar.error}
            </AppText>
            <AppButton label="다시 불러오기" onPress={avatar.retry} variant="secondary" />
          </AppCard>
        ) : null}
        {avatar.feedback ? (
          <AppText accessibilityRole="alert" color="primary" variant="caption">
            {avatar.feedback}
          </AppText>
        ) : null}
      </ScrollView>
    </AppScreen>
  );
}
