import { toPersonalizationSettings } from "@/features/personalization/data/personalizationMapper";

describe("personalization mapper", () => {
  it("maps a row and repairs invalid selections", () => {
    expect(toPersonalizationSettings({
      selected_theme_id: "night",
      selected_mood_pack_id: "removed",
      updated_at: "2026-09-09T00:00:00.000Z",
    })).toEqual({ selectedThemeId: "night", selectedMoodPackId: "default" });
  });
});
