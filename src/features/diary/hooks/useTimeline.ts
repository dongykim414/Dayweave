import { useCallback, useMemo, useRef, useState } from "react";
import { useFocusEffect } from "expo-router";

import { useDiaryRepository } from "@/database/DiaryRepositoryContext";
import {
  addMonths,
  createCalendarGrid,
  findRecordByDate,
  getFirstDateOfMonth,
  getMonthDateRange,
  toYearMonth,
  yearMonthFromDateKey,
} from "@/features/diary/model/calendar";
import type { DiaryRecord } from "@/features/diary/model/diaryPhoto.types";
import type { DiaryDateKey } from "@/features/diary/model/diary.types";
import { toLocalDateKey } from "@/features/diary/model/diaryDate";

export function useTimeline() {
  const repository = useDiaryRepository();
  const [today] = useState(() => new Date());
  const [todayKey] = useState(() => toLocalDateKey(today));
  const [visibleYearMonth, setVisibleYearMonth] = useState(() =>
    toYearMonth(today),
  );
  const [selectedDate, setSelectedDate] = useState<DiaryDateKey>(todayKey);
  const [monthlyRecords, setMonthlyRecords] = useState<DiaryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryRevision, setRetryRevision] = useState(0);
  const requestSequence = useRef(0);
  const loadRequest = useMemo(
    () => ({ retryRevision, yearMonth: visibleYearMonth }),
    [retryRevision, visibleYearMonth],
  );

  useFocusEffect(
    useCallback(() => {
      let active = true;
      const requestId = ++requestSequence.current;
      const { startInclusive, endExclusive } =
        getMonthDateRange(loadRequest.yearMonth);

      setLoading(true);
      setError(null);
      setMonthlyRecords([]);

      const loadMonth = async () => {
        try {
          const records = await repository.listRecordsByDateRange(
            startInclusive,
            endExclusive,
          );

          if (active && requestId === requestSequence.current) {
            setMonthlyRecords(records);
          }
        } catch (caughtError) {
          console.error("[Timeline] Failed to load monthly diaries", caughtError);
          if (active && requestId === requestSequence.current) {
            setError("기록을 불러오지 못했어요. 다시 시도해 주세요.");
          }
        } finally {
          if (active && requestId === requestSequence.current) {
            setLoading(false);
          }
        }
      };

      void loadMonth();

      return () => {
        active = false;
      };
    }, [loadRequest, repository]),
  );

  const calendarCells = useMemo(
    () => createCalendarGrid(visibleYearMonth, today),
    [today, visibleYearMonth],
  );
  const recordsByDate = useMemo(
    () =>
      new Map(
        monthlyRecords.map((record) => [record.entry.entryDate, record]),
      ),
    [monthlyRecords],
  );
  const selectedRecord = useMemo(
    () => findRecordByDate(monthlyRecords, selectedDate),
    [monthlyRecords, selectedDate],
  );

  const moveMonth = (amount: -1 | 1) => {
    const nextMonth = addMonths(visibleYearMonth, amount);
    setVisibleYearMonth(nextMonth);
    setSelectedDate(getFirstDateOfMonth(nextMonth));
  };

  const selectDate = (date: DiaryDateKey) => {
    const selectedYearMonth = yearMonthFromDateKey(date);
    setSelectedDate(date);
    if (selectedYearMonth !== visibleYearMonth) {
      setVisibleYearMonth(selectedYearMonth);
    }
  };

  return {
    calendarCells,
    error,
    loading,
    monthlyRecords,
    moveMonth,
    recordsByDate,
    retry: () => setRetryRevision((current) => current + 1),
    selectDate,
    selectedDate,
    selectedRecord,
    todayKey,
    visibleYearMonth,
  };
}
