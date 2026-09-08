import type { DiaryDateKey } from "@/features/diary/model/diary.types";

export type YearMonth = string;

export interface CalendarCell {
  date: DiaryDateKey;
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
}

export interface DateRange {
  startInclusive: DiaryDateKey;
  endExclusive: DiaryDateKey;
}
