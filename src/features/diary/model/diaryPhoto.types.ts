import type {
  DiaryEntry,
  DiaryEntryId,
} from "@/features/diary/model/diary.types";

export type DiaryPhotoId = string;

export interface DiaryPhoto {
  id: DiaryPhotoId;
  diaryEntryId: DiaryEntryId;
  localUri: string;
  width: number;
  height: number;
  createdAt: string;
}

export interface PreparedDiaryPhoto {
  id: DiaryPhotoId;
  previewUri: string;
  width: number;
  height: number;
  createdAt: string;
}

export interface DiaryRecord {
  entry: DiaryEntry;
  photo: DiaryPhoto | null;
}

export type DiaryPhotoDraft =
  | { kind: "persisted"; photo: DiaryPhoto }
  | { kind: "prepared"; photo: PreparedDiaryPhoto };
