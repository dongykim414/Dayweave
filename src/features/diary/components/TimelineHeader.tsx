import { View } from "react-native";

import { formatYearMonth } from "@/features/diary/model/calendar";
import type { YearMonth } from "@/features/diary/model/calendar.types";
import { AppIconButton, AppText } from "@/shared/components";

interface TimelineHeaderProps {
  onNext: () => void;
  onPrevious: () => void;
  yearMonth: YearMonth;
}

export function TimelineHeader({
  onNext,
  onPrevious,
  yearMonth,
}: TimelineHeaderProps) {
  return (
    <View
      style={{
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <AppIconButton
        accessibilityLabel="이전 달 보기"
        icon={<AppText variant="heading">‹</AppText>}
        onPress={onPrevious}
      />
      <AppText accessibilityRole="header" variant="title">
        {formatYearMonth(yearMonth)}
      </AppText>
      <AppIconButton
        accessibilityLabel="다음 달 보기"
        icon={<AppText variant="heading">›</AppText>}
        onPress={onNext}
      />
    </View>
  );
}
