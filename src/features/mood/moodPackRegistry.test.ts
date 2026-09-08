import { MOOD_IDS } from "@/features/mood/mood.types";
import {
  ACTIVE_MOOD_PACK_ID,
  resolveMood,
  resolveMoodPack,
} from "@/features/mood/moodPackRegistry";

describe("moodPackRegistry", () => {
  it("resolves all semantic moods from the active pack", () => {
    const pack = resolveMoodPack(ACTIVE_MOOD_PACK_ID);

    expect(Object.keys(pack.moods)).toEqual(MOOD_IDS);
    for (const moodId of MOOD_IDS) {
      expect(resolveMood(moodId).id).toBe(moodId);
      expect(resolveMood(moodId).label.length).toBeGreaterThan(0);
    }
  });

  it("keeps the visual representation outside the semantic mood id", () => {
    const happy = resolveMood("happy");

    expect(happy.id).toBe("happy");
    expect(happy.visual).toEqual({ type: "text", value: "😊" });
  });
});
