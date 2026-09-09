import { createContext, useContext, useMemo } from "react";
import type { PropsWithChildren } from "react";

import { resolveMood, resolveMoodPack } from "@/features/mood/moodPackRegistry";
import type { MoodDefinition, MoodId, MoodPackDefinition, MoodPackId } from "@/features/mood/mood.types";

interface MoodPackContextValue {
  moodPack: MoodPackDefinition;
  moodPackId: MoodPackId;
  resolveMood: (moodId: MoodId) => MoodDefinition;
}

const MoodPackContext = createContext<MoodPackContextValue | null>(null);

export function MoodPackProvider({ children, moodPackId }: PropsWithChildren<{ moodPackId: MoodPackId }>) {
  const value = useMemo(
    () => ({
      moodPack: resolveMoodPack(moodPackId),
      moodPackId,
      resolveMood: (moodId: MoodId) => resolveMood(moodId, moodPackId),
    }),
    [moodPackId],
  );
  return <MoodPackContext.Provider value={value}>{children}</MoodPackContext.Provider>;
}

export function useMoodPack(): MoodPackContextValue {
  const context = useContext(MoodPackContext);
  if (!context) throw new Error("useMoodPack must be used within MoodPackProvider");
  return context;
}
