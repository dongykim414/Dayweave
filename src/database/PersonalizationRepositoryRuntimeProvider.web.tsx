import { useMemo } from "react";
import type { PropsWithChildren } from "react";

import { PersonalizationRepositoryProvider } from "@/database/PersonalizationRepositoryContext";
import { LocalStoragePersonalizationRepository } from "@/features/personalization/data/LocalStoragePersonalizationRepository";

export function PersonalizationRepositoryRuntimeProvider({ children }: PropsWithChildren) {
  const repository = useMemo(() => new LocalStoragePersonalizationRepository(), []);
  return (
    <PersonalizationRepositoryProvider value={repository}>
      {children}
    </PersonalizationRepositoryProvider>
  );
}
