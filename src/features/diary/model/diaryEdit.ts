import type {
  DiaryPhotoDraft,
  DiaryRecord,
} from "@/features/diary/model/diaryPhoto.types";
import type { DiaryDraft } from "@/features/diary/model/diary.types";

export function isDiaryEditDirty(
  record: DiaryRecord,
  draft: DiaryDraft,
  photoDraft: DiaryPhotoDraft | null,
): boolean {
  const photoChanged =
    photoDraft?.kind === "prepared" ||
    (photoDraft?.kind === "persisted" ? photoDraft.photo.id : null) !==
      record.photo?.id;

  return (
    draft.moodId !== record.entry.moodId ||
    draft.shortText !== record.entry.shortText ||
    draft.content !== record.entry.content ||
    photoChanged
  );
}
