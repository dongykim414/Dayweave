import { isDiaryEditDirty } from "@/features/diary/model/diaryEdit";
import type { DiaryRecord } from "@/features/diary/model/diaryPhoto.types";

const record = {
  entry: {
    id: "entry-1",
    entryDate: "2026-09-09",
    moodId: "happy",
    shortText: "좋은 하루",
    content: "긴 기록",
    createdAt: "2026-09-09T00:00:00.000Z",
    updatedAt: "2026-09-09T00:00:00.000Z",
  },
  photo: {
    id: "photo-1",
    diaryEntryId: "entry-1",
    localUri: "file:///photo-1.jpg",
    width: 1200,
    height: 900,
    createdAt: "2026-09-09T00:00:00.000Z",
  },
} satisfies DiaryRecord;

const draft = {
  moodId: record.entry.moodId,
  shortText: record.entry.shortText,
  content: record.entry.content,
};

const persistedPhoto = record.photo;

describe("diary edit state", () => {
  it("recognizes an unchanged persisted record", () => {
    expect(
      isDiaryEditDirty(record, draft, {
        kind: "persisted",
        photo: persistedPhoto,
      }),
    ).toBe(false);
  });

  it("recognizes text, replacement, and removal changes", () => {
    expect(
      isDiaryEditDirty(record, { ...draft, shortText: "바뀐 하루" }, {
        kind: "persisted",
        photo: persistedPhoto,
      }),
    ).toBe(true);
    expect(
      isDiaryEditDirty(record, draft, {
        kind: "prepared",
        photo: {
          id: "photo-2",
          previewUri: "file:///cache/photo-2.jpg",
          width: 100,
          height: 100,
          createdAt: record.entry.updatedAt,
        },
      }),
    ).toBe(true);
    expect(isDiaryEditDirty(record, draft, null)).toBe(true);
  });
});
