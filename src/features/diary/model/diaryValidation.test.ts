import {
  hasDiaryContent,
  MAX_SHORT_TEXT_LENGTH,
  normalizeDiaryDraft,
  validateDiaryDraft,
} from "@/features/diary/model/diaryValidation";

describe("diary validation", () => {
  it("allows a mood without text", () => {
    expect(
      validateDiaryDraft({ moodId: "calm", shortText: "", content: "" }),
    ).toBeNull();
  });

  it("rejects whitespace-only content", () => {
    const draft = { moodId: null, shortText: "   ", content: "\n " };

    expect(hasDiaryContent(draft)).toBe(false);
    expect(validateDiaryDraft(draft)).toBe(
      "오늘의 기분이나 기록을 하나 남겨주세요.",
    );
  });

  it("trims text before persistence", () => {
    expect(
      normalizeDiaryDraft({
        moodId: null,
        shortText: "  좋은 하루  ",
        content: "  자세한 이야기\n",
      }),
    ).toEqual({
      moodId: null,
      shortText: "좋은 하루",
      content: "자세한 이야기",
    });
  });

  it("rejects a short entry longer than the product limit", () => {
    expect(
      validateDiaryDraft({
        moodId: null,
        shortText: "가".repeat(MAX_SHORT_TEXT_LENGTH + 1),
        content: "",
      }),
    ).toBe(`한 줄 기록은 ${MAX_SHORT_TEXT_LENGTH}자까지 작성할 수 있어요.`);
  });
});
