import {
  toDiaryPhoto,
  toDiaryPhotoRow,
} from "@/features/diary/data/diaryPhotoMapper";

const row = {
  id: "photo-1",
  diary_entry_id: "entry-1",
  local_uri: "file:///diary/photos/photo-1.jpg",
  width: 1200,
  height: 900,
  created_at: "2026-09-09T00:00:00.000Z",
};

describe("diary photo mapper", () => {
  it("maps a database row to the photo domain and back", () => {
    const photo = toDiaryPhoto(row);

    expect(photo).toEqual({
      id: "photo-1",
      diaryEntryId: "entry-1",
      localUri: "file:///diary/photos/photo-1.jpg",
      width: 1200,
      height: 900,
      createdAt: "2026-09-09T00:00:00.000Z",
    });
    expect(toDiaryPhotoRow(photo)).toEqual(row);
  });

  it("rejects invalid persisted dimensions", () => {
    expect(() => toDiaryPhoto({ ...row, width: 0 })).toThrow(
      "Invalid diary photo metadata in database",
    );
  });
});
