import { toLocalDateKey } from "@/features/diary/model/diaryDate";
import type {
  CalendarCell,
  DateRange,
  YearMonth,
} from "@/features/diary/model/calendar.types";
import type { DiaryRecord } from "@/features/diary/model/diaryPhoto.types";
import type { DiaryDateKey } from "@/features/diary/model/diary.types";

const YEAR_MONTH_PATTERN = /^(\d{4})-(\d{2})$/;

function parseYearMonth(yearMonth: YearMonth): {
  monthIndex: number;
  year: number;
} {
  const match = YEAR_MONTH_PATTERN.exec(yearMonth);
  const year = Number(match?.[1]);
  const month = Number(match?.[2]);

  if (!match || year < 1000 || month < 1 || month > 12) {
    throw new Error(`Invalid year-month: ${yearMonth}`);
  }

  return { monthIndex: month - 1, year };
}

export function toYearMonth(date: Date): YearMonth {
  if (Number.isNaN(date.getTime())) {
    throw new Error("Cannot create a year-month from an invalid date");
  }

  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export function yearMonthFromDateKey(date: DiaryDateKey): YearMonth {
  return date.slice(0, 7);
}

export function addMonths(yearMonth: YearMonth, amount: number): YearMonth {
  if (!Number.isInteger(amount)) {
    throw new Error("Month offset must be an integer");
  }

  const { monthIndex, year } = parseYearMonth(yearMonth);
  return toYearMonth(new Date(year, monthIndex + amount, 1));
}

export function getMonthDateRange(yearMonth: YearMonth): DateRange {
  const { monthIndex, year } = parseYearMonth(yearMonth);

  return {
    startInclusive: toLocalDateKey(new Date(year, monthIndex, 1)),
    endExclusive: toLocalDateKey(new Date(year, monthIndex + 1, 1)),
  };
}

export function getFirstDateOfMonth(yearMonth: YearMonth): DiaryDateKey {
  return getMonthDateRange(yearMonth).startInclusive;
}

export function formatYearMonth(yearMonth: YearMonth): string {
  const { monthIndex, year } = parseYearMonth(yearMonth);
  return `${year}년 ${monthIndex + 1}월`;
}

export function createCalendarGrid(
  yearMonth: YearMonth,
  today: Date = new Date(),
): CalendarCell[] {
  const { monthIndex, year } = parseYearMonth(yearMonth);
  const firstDay = new Date(year, monthIndex, 1);
  const leadingDayCount = firstDay.getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const cellCount = leadingDayCount + daysInMonth <= 35 ? 35 : 42;
  const gridStart = new Date(year, monthIndex, 1 - leadingDayCount);
  const todayKey = toLocalDateKey(today);

  return Array.from({ length: cellCount }, (_, index) => {
    const cellDate = new Date(
      gridStart.getFullYear(),
      gridStart.getMonth(),
      gridStart.getDate() + index,
    );
    const date = toLocalDateKey(cellDate);

    return {
      date,
      day: cellDate.getDate(),
      isCurrentMonth: cellDate.getMonth() === monthIndex,
      isToday: date === todayKey,
    };
  });
}

export function findRecordByDate(
  records: readonly DiaryRecord[],
  date: DiaryDateKey,
): DiaryRecord | null {
  return records.find((record) => record.entry.entryDate === date) ?? null;
}
