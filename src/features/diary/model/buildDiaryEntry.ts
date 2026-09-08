import { isDiaryDateKey } from "@/features/diary/model/diaryDate";
import type {
  DiaryDraft,
  DiaryEntry,
  DiaryEntryId,
} from "@/features/diary/model/diary.types";
import {
  normalizeDiaryDraft,
  validateDiaryDraft,
} from "@/features/diary/model/diaryValidation";

interface BuildDiaryEntryInput {
  createId: () => DiaryEntryId;
  draft: DiaryDraft;
  entryDate: string;
  existingEntry: DiaryEntry | null;
  hasPhoto?: boolean;
  now: Date;
}

export class DiaryValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DiaryValidationError";
  }
}

export function buildDiaryEntry({
  createId,
  draft,
  entryDate,
  existingEntry,
  hasPhoto = false,
  now,
}: BuildDiaryEntryInput): DiaryEntry {
  const validationError = validateDiaryDraft(draft, hasPhoto);

  if (validationError) {
    throw new DiaryValidationError(validationError);
  }

  if (!isDiaryDateKey(entryDate)) {
    throw new Error(`Invalid diary date key: ${entryDate}`);
  }

  if (Number.isNaN(now.getTime())) {
    throw new Error("Cannot build a diary entry with an invalid timestamp");
  }

  const normalized = normalizeDiaryDraft(draft);
  const nowIso = now.toISOString();
  const isUpdatingSameDate = existingEntry?.entryDate === entryDate;

  return {
    id: isUpdatingSameDate ? existingEntry.id : createId(),
    entryDate,
    moodId: normalized.moodId,
    shortText: normalized.shortText,
    content: normalized.content,
    createdAt: isUpdatingSameDate ? existingEntry.createdAt : nowIso,
    updatedAt: nowIso,
  };
}
