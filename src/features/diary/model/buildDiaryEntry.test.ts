import { buildDiaryEntry } from "@/features/diary/model/buildDiaryEntry";
import type { DiaryEntry } from "@/features/diary/model/diary.types";

const existingEntry: DiaryEntry = {
  id: "existing-id",
  entryDate: "2026-09-08",
  moodId: "happy",
  shortText: "좋은 하루",
  content: "",
  createdAt: "2026-09-08T01:00:00.000Z",
  updatedAt: "2026-09-08T01:00:00.000Z",
};

describe("buildDiaryEntry", () => {
  it("builds a photo-only entry when photo presence is explicit", () => {
    expect(
      buildDiaryEntry({
        createId: () => "entry-photo",
        draft: { moodId: null, shortText: "", content: "" },
        entryDate: "2026-09-09",
        existingEntry: null,
        hasPhoto: true,
        now: new Date("2026-09-09T01:00:00.000Z"),
      }),
    ).toMatchObject({ id: "entry-photo", entryDate: "2026-09-09" });
  });

  it("creates a new entry with a stable id and UTC timestamps", () => {
    const entry = buildDiaryEntry({
      createId: () => "new-id",
      draft: { moodId: "calm", shortText: " 오늘 ", content: "" },
      entryDate: "2026-09-08",
      existingEntry: null,
      now: new Date("2026-09-08T02:00:00.000Z"),
    });

    expect(entry).toEqual({
      id: "new-id",
      entryDate: "2026-09-08",
      moodId: "calm",
      shortText: "오늘",
      content: "",
      createdAt: "2026-09-08T02:00:00.000Z",
      updatedAt: "2026-09-08T02:00:00.000Z",
    });
  });

  it("updates the same date without replacing identity or creation time", () => {
    const createId = jest.fn(() => "unused-id");
    const entry = buildDiaryEntry({
      createId,
      draft: { moodId: "sad", shortText: "수정", content: "긴 글" },
      entryDate: "2026-09-08",
      existingEntry,
      now: new Date("2026-09-08T03:00:00.000Z"),
    });

    expect(createId).not.toHaveBeenCalled();
    expect(entry.id).toBe("existing-id");
    expect(entry.createdAt).toBe("2026-09-08T01:00:00.000Z");
    expect(entry.updatedAt).toBe("2026-09-08T03:00:00.000Z");
    expect(entry.moodId).toBe("sad");
  });
});
