import { resolveMood } from "@/features/mood/moodPackRegistry";
import { selectOwnedMoodPack } from "@/features/mood/moodPackCatalog";
import {
  DEFAULT_PERSONALIZATION_SETTINGS,
  resolvePersonalizationSettings,
  selectMoodPack,
  selectTheme,
} from "@/features/personalization/personalizationSelection";
import { selectOwnedTheme } from "@/features/theme";
import type { MoodPackId } from "@/features/mood/mood.types";
import type { ThemeId } from "@/features/theme";

describe("personalization selection", () => {
  it("falls back invalid persisted IDs independently", () => {
    expect(resolvePersonalizationSettings({ selectedThemeId: "removed", selectedMoodPackId: "cat" }))
      .toEqual({ selectedThemeId: "sky", selectedMoodPackId: "cat" });
  });

  it("updates Theme and Mood Pack without coupling them", () => {
    const themed = selectTheme(DEFAULT_PERSONALIZATION_SETTINGS, "night");
    expect(selectMoodPack(themed, "cat")).toEqual({
      selectedThemeId: "night",
      selectedMoodPackId: "cat",
    });
  });

  it("rejects selections outside Ownership", () => {
    expect(() => selectOwnedTheme("night", new Set<ThemeId>(["sky"]))).toThrow();
    expect(() => selectOwnedMoodPack("cat", new Set<MoodPackId>(["default"]))).toThrow();
  });

  it("keeps built-in packs complete and falls back invalid pack IDs", () => {
    expect(resolveMood("stressed", "cat")).toMatchObject({
      id: "stressed",
      label: "지친 고양이",
    });
    expect(resolveMood("happy", "removed")).toEqual(resolveMood("happy", "default"));
  });
});
