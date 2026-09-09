import { ActivityIndicator, ScrollView, View } from "react-native";

import { AvatarCategoryTabs } from "@/features/avatar/components/AvatarCategoryTabs";
import { AvatarItemSelector } from "@/features/avatar/components/AvatarItemSelector";
import { AvatarRenderer } from "@/features/avatar/components/AvatarRenderer";
import { useAvatar } from "@/features/avatar/hooks/useAvatar";
import { useTheme } from "@/features/theme";
import { AppButton, AppCard, AppScreen, AppText, SectionHeader } from "@/shared/components";

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
          gap: theme.layout.sectionGap,
          paddingBottom: theme.layout.tabBarHeight + theme.spacing.lg,
          paddingTop: theme.layout.screenTop,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ gap: theme.spacing.xs }}>
          <AppText variant="display">나의 아바타</AppText>
          <AppText color="textSecondary">
            기록을 함께할 작은 친구를 내 취향으로 꾸며보세요.
          </AppText>
        </View>

        <AppCard
          style={{ alignItems: "center", gap: theme.spacing.md }}
          variant="soft"
        >
          <AvatarRenderer config={avatar.config} size={260} />
          <AppText color="textSecondary" variant="caption">
            {avatar.saving ? "선택을 저장하고 있어요..." : "선택하면 바로 저장돼요."}
          </AppText>
        </AppCard>

        <View style={{ gap: theme.spacing.md }}>
          <SectionHeader title="꾸미기" />
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
