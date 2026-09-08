import type {
  DiaryPhoto,
  PreparedDiaryPhoto,
} from "@/features/diary/model/diaryPhoto.types";
import type { DiaryEntryId } from "@/features/diary/model/diary.types";

export type DiaryPhotoSelectionResult =
  | { status: "cancelled" }
  | { status: "permission-denied" }
  | { status: "selected"; photo: PreparedDiaryPhoto }
  | { status: "unsupported" };

export async function selectDiaryPhoto(): Promise<DiaryPhotoSelectionResult> {
  return { status: "unsupported" };
}

export async function persistPreparedDiaryPhoto(
  _preparedPhoto: PreparedDiaryPhoto,
  _diaryEntryId: DiaryEntryId,
): Promise<DiaryPhoto> {
  throw new Error("Persistent diary photos are unavailable on Web preview");
}

export async function discardPreparedDiaryPhoto(
  _preparedPhoto: PreparedDiaryPhoto,
): Promise<void> {}

export async function deletePersistedDiaryPhoto(
  _photo: DiaryPhoto,
): Promise<void> {}

export async function isDiaryPhotoFileAvailable(
  _photo: DiaryPhoto,
): Promise<boolean> {
  return false;
}
