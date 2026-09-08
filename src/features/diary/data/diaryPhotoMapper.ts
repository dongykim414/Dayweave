import type { DiaryPhoto } from "@/features/diary/model/diaryPhoto.types";

export interface DiaryPhotoRow {
  id: string;
  diary_entry_id: string;
  local_uri: string;
  width: number;
  height: number;
  created_at: string;
}

export function toDiaryPhoto(row: DiaryPhotoRow): DiaryPhoto {
  if (
    !row.id ||
    !row.diary_entry_id ||
    !row.local_uri ||
    !Number.isInteger(row.width) ||
    row.width <= 0 ||
    !Number.isInteger(row.height) ||
    row.height <= 0 ||
    Number.isNaN(Date.parse(row.created_at))
  ) {
    throw new Error("Invalid diary photo metadata in database");
  }

  return {
    id: row.id,
    diaryEntryId: row.diary_entry_id,
    localUri: row.local_uri,
    width: row.width,
    height: row.height,
    createdAt: row.created_at,
  };
}

export function toDiaryPhotoRow(photo: DiaryPhoto): DiaryPhotoRow {
  return {
    id: photo.id,
    diary_entry_id: photo.diaryEntryId,
    local_uri: photo.localUri,
    width: photo.width,
    height: photo.height,
    created_at: photo.createdAt,
  };
}
