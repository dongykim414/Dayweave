import { createContext, useContext } from "react";
import type { PropsWithChildren } from "react";

import type { PersonalizationRepository } from "@/features/personalization/repository/PersonalizationRepository";

const Context = createContext<PersonalizationRepository | null>(null);

export function PersonalizationRepositoryProvider({
  children,
  value,
}: PropsWithChildren<{ value: PersonalizationRepository }>) {
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function usePersonalizationRepository(): PersonalizationRepository {
  const repository = useContext(Context);
  if (!repository) {
    throw new Error("usePersonalizationRepository must be used within its provider");
  }
  return repository;
}
