import { View } from "react-native";

import { useTheme } from "@/features/theme";
import { AppCard, AppScreen, AppText } from "@/shared/components";

export default function AvatarScreen() {
  const { theme } = useTheme();

  return (
    <AppScreen contentStyle={{ gap: theme.spacing.xl }}>
      <View style={{ gap: theme.spacing.sm }}>
        <AppText variant="title">아바타</AppText>
        <AppText color="textSecondary">
          기록을 함께할 나만의 캐릭터를 꾸미는 공간이에요.
        </AppText>
      </View>

      <AppCard style={{ gap: theme.spacing.sm }}>
        <AppText variant="heading">기본 아바타 준비 중</AppText>
        <AppText color="textSecondary">
          body, hair, top, bottom, accessory 파츠 구조부터 준비했습니다.
        </AppText>
      </AppCard>
    </AppScreen>
  );
}
