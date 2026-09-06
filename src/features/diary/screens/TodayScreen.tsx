import { View } from "react-native";

import { useTheme } from "@/features/theme";
import { AppButton, AppCard, AppScreen, AppText } from "@/shared/components";

export default function TodayScreen() {
  const { theme } = useTheme();

  return (
    <AppScreen contentStyle={{ gap: theme.spacing.xl }}>
      <View style={{ gap: theme.spacing.sm }}>
        <AppText color="primary" variant="label">
          TODAY
        </AppText>
        <AppText variant="title">오늘을 가볍게 남겨요</AppText>
        <AppText color="textSecondary">
          감정과 한 줄, 원하는 사진으로 하루의 순간을 빠르게 기록할 수 있어요.
        </AppText>
      </View>

      <AppCard style={{ gap: theme.spacing.lg }}>
        <View style={{ gap: theme.spacing.xs }}>
          <AppText variant="heading">오늘의 기록</AppText>
          <AppText color="textSecondary">
            기록 기능은 다음 마일스톤에서 연결됩니다.
          </AppText>
        </View>
        <AppButton
          disabled
          label="기록 시작하기"
          onPress={() => undefined}
        />
      </AppCard>
    </AppScreen>
  );
}
