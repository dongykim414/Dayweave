import { ActivityIndicator, ScrollView, View } from "react-native";
import { useRouter } from "expo-router";

import { CalendarGrid } from "@/features/diary/components/CalendarGrid";
import { DiaryPreviewCard } from "@/features/diary/components/DiaryPreviewCard";
import { TimelineHeader } from "@/features/diary/components/TimelineHeader";
import { useTimeline } from "@/features/diary/hooks/useTimeline";
import { useTheme } from "@/features/theme";
import { AppButton, AppCard, AppScreen, AppText, SectionHeader } from "@/shared/components";

export default function TimelineScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const {
    calendarCells,
    error,
    loading,
    monthlyRecords,
    moveMonth,
    recordsByDate,
    retry,
    selectDate,
    selectedDate,
    selectedRecord,
    todayKey,
    visibleYearMonth,
  } = useTimeline();

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
        <AppCard style={{ gap: theme.spacing.md }}>
          <TimelineHeader
            onNext={() => moveMonth(1)}
            onPrevious={() => moveMonth(-1)}
            yearMonth={visibleYearMonth}
          />
          <CalendarGrid
            cells={calendarCells}
            onSelect={selectDate}
            recordsByDate={recordsByDate}
            selectedDate={selectedDate}
          />

          {loading ? (
            <View
              accessibilityLabel="월간 기록을 불러오는 중"
              style={{
                alignItems: "center",
                flexDirection: "row",
                gap: theme.spacing.sm,
                justifyContent: "center",
                minHeight: 24,
              }}
            >
              <ActivityIndicator color={theme.colors.primary} size="small" />
              <AppText color="textSecondary" variant="caption">
                기록을 불러오고 있어요.
              </AppText>
            </View>
          ) : monthlyRecords.length === 0 && !error ? (
            <AppText
              color="textSecondary"
              style={{ textAlign: "center" }}
              variant="caption"
            >
              이번 달에는 아직 기록이 없어요.
            </AppText>
          ) : null}
        </AppCard>

        {error ? (
          <AppCard style={{ gap: theme.spacing.md }}>
            <AppText accessibilityRole="alert" color="danger">
              {error}
            </AppText>
            <AppButton label="다시 시도" onPress={retry} variant="secondary" />
          </AppCard>
        ) : loading ? null : (
          <View style={{ gap: theme.spacing.md }}>
            <SectionHeader
              description="날짜를 골라 그날의 마음과 이야기를 다시 만나보세요."
              title="나의 기록"
            />
            <DiaryPreviewCard
              onOpen={(id) =>
                router.push({ pathname: "/diary/[id]", params: { id } })
              }
              record={selectedRecord}
              selectedDate={selectedDate}
              todayDate={todayKey}
            />
          </View>
        )}
      </ScrollView>
    </AppScreen>
  );
}
