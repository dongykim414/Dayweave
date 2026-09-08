import {
  isDiaryDateKey,
  toLocalDateKey,
} from "@/features/diary/model/diaryDate";

describe("diary date", () => {
  it("uses the device local calendar date", () => {
    const localDate = new Date(2026, 8, 8, 23, 59, 59);

    expect(toLocalDateKey(localDate)).toBe("2026-09-08");
  });

  it("rejects impossible or malformed date keys", () => {
    expect(isDiaryDateKey("2026-02-29")).toBe(false);
    expect(isDiaryDateKey("2026-9-8")).toBe(false);
    expect(isDiaryDateKey("2026-09-08")).toBe(true);
  });
});
