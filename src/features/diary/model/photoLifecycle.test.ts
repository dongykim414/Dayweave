import type { DiaryPhoto } from "@/features/diary/model/diaryPhoto.types";
import { shouldDeletePreviousPhoto } from "@/features/diary/model/photoLifecycle";

const photo: DiaryPhoto = {
  id: "photo-a",
  diaryEntryId: "entry-1",
  localUri: "file:///diary/photos/photo-a.jpg",
  width: 1200,
  height: 900,
  createdAt: "2026-09-09T00:00:00.000Z",
};

describe("photo lifecycle", () => {
  it("keeps the existing file when its photo is unchanged", () => {
    expect(shouldDeletePreviousPhoto(photo, photo)).toBe(false);
  });

  it("deletes the existing file after a replacement", () => {
    expect(
      shouldDeletePreviousPhoto(photo, { ...photo, id: "photo-b" }),
    ).toBe(true);
  });

  it("deletes the existing file after removal", () => {
    expect(shouldDeletePreviousPhoto(photo, null)).toBe(true);
  });
});
