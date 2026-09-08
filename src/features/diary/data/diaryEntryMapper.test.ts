import {
  toDiaryEntry,
  toDiaryEntryRow,
} from "@/features/diary/data/diaryEntryMapper";
import type { DiaryEntry } from "@/features/diary/model/diary.types";

const entry: DiaryEntry = {
  id: "entry-id",
  entryDate: "2026-09-08",
  moodId: "calm",
  shortText: "오늘의 한 줄",
  content: "자세한 이야기",
  createdAt: "2026-09-08T01:00:00.000Z",
  updatedAt: "2026-09-08T02:00:00.000Z",
};

describe("diary entry mapper", () => {
  it("maps camelCase domain data to snake_case database data and back", () => {
    expect(toDiaryEntry(toDiaryEntryRow(entry))).toEqual(entry);
  });

  it("rejects an unknown persisted mood id", () => {
    const row = { ...toDiaryEntryRow(entry), mood_id: "excited" };

    expect(() => toDiaryEntry(row)).toThrow("Invalid mood id in database");
  });

  it("rejects an invalid persisted local date", () => {
    const row = { ...toDiaryEntryRow(entry), entry_date: "2026-02-29" };

    expect(() => toDiaryEntry(row)).toThrow("Invalid diary entry date in database");
  });
});
