import type { DiaryPhoto } from "@/features/diary/model/diaryPhoto.types";

export function shouldDeletePreviousPhoto(
  previousPhoto: DiaryPhoto | null,
  nextPhoto: DiaryPhoto | null,
): boolean {
  return Boolean(previousPhoto && previousPhoto.id !== nextPhoto?.id);
}
