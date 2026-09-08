import type { DiaryDraft } from "@/features/diary/model/diary.types";

export const MAX_SHORT_TEXT_LENGTH = 50;

export function normalizeDiaryDraft(draft: DiaryDraft): DiaryDraft {
  return {
    moodId: draft.moodId,
    shortText: draft.shortText.trim(),
    content: draft.content.trim(),
  };
}

export function hasDiaryContent(draft: DiaryDraft): boolean {
  const normalized = normalizeDiaryDraft(draft);

  return Boolean(
    normalized.moodId || normalized.shortText || normalized.content,
  );
}

export function validateDiaryDraft(draft: DiaryDraft): string | null {
  const normalized = normalizeDiaryDraft(draft);

  if (normalized.shortText.length > MAX_SHORT_TEXT_LENGTH) {
    return `한 줄 기록은 ${MAX_SHORT_TEXT_LENGTH}자까지 작성할 수 있어요.`;
  }

  if (!hasDiaryContent(normalized)) {
    return "오늘의 기분이나 기록을 하나 남겨주세요.";
  }

  return null;
}
