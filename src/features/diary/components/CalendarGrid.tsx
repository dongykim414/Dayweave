import { Image, Pressable, StyleSheet, View } from "react-native";

import type { CalendarCell } from "@/features/diary/model/calendar.types";
import type { DiaryRecord } from "@/features/diary/model/diaryPhoto.types";
import type { DiaryDateKey } from "@/features/diary/model/diary.types";
import { MoodVisual } from "@/features/mood/components/MoodVisual";
import { resolveMood } from "@/features/mood/moodPackRegistry";
import { useTheme } from "@/features/theme";
import { AppText } from "@/shared/components";

const WEEKDAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

interface CalendarGridProps {
  cells: readonly CalendarCell[];
  onSelect: (date: DiaryDateKey) => void;
  recordsByDate: ReadonlyMap<DiaryDateKey, DiaryRecord>;
  selectedDate: DiaryDateKey;
}

function getAccessibilityLabel(
  cell: CalendarCell,
  record: DiaryRecord | undefined,
  selected: boolean,
): string {
  const [year, month, day] = cell.date.split("-");
  const parts = [`${Number(year)}년 ${Number(month)}월 ${Number(day)}일`];

  if (cell.isToday) parts.push("오늘");
  if (selected) parts.push("선택됨");
  if (record?.entry.moodId) parts.push(resolveMood(record.entry.moodId).label);
  if (record) parts.push("기록 있음");
  if (record?.photo) parts.push("사진 있음");

  return parts.join(", ");
}

export function CalendarGrid({
  cells,
  onSelect,
  recordsByDate,
  selectedDate,
}: CalendarGridProps) {
  const { theme } = useTheme();

  return (
    <View>
      <View style={styles.row}>
        {WEEKDAY_LABELS.map((label) => (
          <View key={label} style={styles.weekdayCell}>
            <AppText color="textSecondary" variant="caption">
              {label}
            </AppText>
          </View>
        ))}
      </View>

      <View style={styles.grid}>
        {cells.map((cell) => {
          const record = recordsByDate.get(cell.date);
          const selected = selectedDate === cell.date;
          const moodId = record?.entry.moodId;

          return (
            <View key={cell.date} style={styles.cellWrapper}>
              <Pressable
                accessibilityLabel={getAccessibilityLabel(
                  cell,
                  record,
                  selected,
                )}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => onSelect(cell.date)}
                style={({ pressed }) => [
                  styles.dayCell,
                  {
                    backgroundColor: selected
                      ? theme.colors.primarySoft
                      : theme.colors.surface,
                    borderColor:
                      cell.isToday || selected
                        ? theme.colors.primary
                        : theme.colors.border,
                    borderRadius: theme.radius.sm,
                    opacity: pressed ? 0.7 : cell.isCurrentMonth ? 1 : 0.42,
                  },
                ]}
              >
                <AppText
                  color={selected ? "primary" : "textPrimary"}
                  variant="caption"
                >
                  {cell.day}
                </AppText>

                <View style={styles.marker}>
                  {record?.photo ? (
                    <Image
                      accessible={false}
                      resizeMode="cover"
                      source={{ uri: record.photo.localUri }}
                      style={{
                        borderRadius: theme.radius.sm,
                        height: 24,
                        width: 24,
                      }}
                    />
                  ) : moodId ? (
                    <MoodVisual moodId={moodId} size={18} />
                  ) : record ? (
                    <View
                      style={{
                        backgroundColor: theme.colors.primary,
                        borderRadius: theme.radius.full,
                        height: 6,
                        width: 6,
                      }}
                    />
                  ) : null}
                </View>
              </Pressable>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cellWrapper: {
    padding: 2,
    width: `${100 / 7}%`,
  },
  dayCell: {
    alignItems: "center",
    borderWidth: 1,
    height: 58,
    paddingVertical: 4,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  marker: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
  },
  weekdayCell: {
    alignItems: "center",
    paddingVertical: 6,
    width: `${100 / 7}%`,
  },
});
