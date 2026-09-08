import { View } from "react-native";

import { useTheme } from "@/features/theme";
import { AppCard, AppScreen, AppText } from "@/shared/components";

export default function TimelineScreen() {
  const { theme } = useTheme();

  return (
    <AppScreen contentStyle={{ gap: theme.spacing.xl }}>
      <View style={{ gap: theme.spacing.sm }}>
        <AppText variant="title">타임라인</AppText>
        <AppText color="textSecondary">
          쌓인 기록을 날짜별로 돌아보는 공간이에요.
        </AppText>
      </View>

      <AppCard style={{ gap: theme.spacing.sm }}>
        <AppText variant="heading">아직 기록이 없어요</AppText>
        <AppText color="textSecondary">
          달력과 기록 목록은 Diary Core 이후 연결됩니다.
        </AppText>
      </AppCard>
    </AppScreen>
  );
}
