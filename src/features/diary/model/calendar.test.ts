import {
  addMonths,
  createCalendarGrid,
  findRecordByDate,
  getMonthDateRange,
} from "@/features/diary/model/calendar";
import type { DiaryRecord } from "@/features/diary/model/diaryPhoto.types";

describe("calendar domain", () => {
  it("moves across year boundaries", () => {
    expect(addMonths("2026-01", -1)).toBe("2025-12");
    expect(addMonths("2026-12", 1)).toBe("2027-01");
  });

  it("uses an inclusive start and exclusive next-month boundary", () => {
    expect(getMonthDateRange("2026-09")).toEqual({
      startInclusive: "2026-09-01",
      endExclusive: "2026-10-01",
    });
  });

  it("includes leap day in February 2028", () => {
    const grid = createCalendarGrid("2028-02", new Date(2028, 1, 10));

    expect(grid.some((cell) => cell.date === "2028-02-29")).toBe(true);
    expect(
      grid.filter((cell) => cell.isCurrentMonth).map((cell) => cell.day),
    ).toHaveLength(29);
  });

  it("creates a five-week grid for a Sunday-start February", () => {
    const grid = createCalendarGrid("2026-02", new Date(2026, 1, 1));

    expect(grid).toHaveLength(35);
    expect(grid[0]).toMatchObject({ date: "2026-02-01", day: 1 });
    expect(grid.some((cell) => cell.date === "2026-02-28")).toBe(true);
  });

  it("creates a six-week grid for a Saturday-start month", () => {
    const grid = createCalendarGrid("2026-08", new Date(2026, 7, 1));

    expect(grid).toHaveLength(42);
    expect(grid[0]).toMatchObject({
      date: "2026-07-26",
      isCurrentMonth: false,
    });
    expect(grid[6]).toMatchObject({ date: "2026-08-01", day: 1 });
  });

  it("finds the selected date from already-loaded monthly records", () => {
    const record = {
      entry: {
        id: "entry-1",
        entryDate: "2026-09-09",
        moodId: "calm",
        shortText: "평온한 하루",
        content: "",
        createdAt: "2026-09-09T00:00:00.000Z",
        updatedAt: "2026-09-09T00:00:00.000Z",
      },
      photo: null,
    } satisfies DiaryRecord;

    expect(findRecordByDate([record], "2026-09-09")).toBe(record);
    expect(findRecordByDate([record], "2026-09-10")).toBeNull();
  });
});
