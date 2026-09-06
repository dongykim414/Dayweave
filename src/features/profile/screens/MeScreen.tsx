import { View } from "react-native";

import { useTheme } from "@/features/theme";
import { AppCard, AppScreen, AppText } from "@/shared/components";

export default function MeScreen() {
  const { theme } = useTheme();

  return (
    <AppScreen contentStyle={{ gap: theme.spacing.xl }}>
      <View style={{ gap: theme.spacing.sm }}>
        <AppText variant="title">내 정보</AppText>
        <AppText color="textSecondary">
          기록 경험과 개인화 설정을 관리하는 공간이에요.
        </AppText>
      </View>

      <AppCard style={{ gap: theme.spacing.sm }}>
        <AppText color="textSecondary" variant="label">
          현재 테마
        </AppText>
        <AppText variant="heading">{theme.name}</AppText>
      </AppCard>
    </AppScreen>
  );
}
