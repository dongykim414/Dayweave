import { createContext, useContext } from "react";
import type { PropsWithChildren } from "react";

import type { AvatarRepository } from "@/features/avatar/repository/AvatarRepository";

const AvatarRepositoryContext = createContext<AvatarRepository | null>(null);

export function AvatarRepositoryProvider({
  children,
  value,
}: PropsWithChildren<{ value: AvatarRepository }>) {
  return (
    <AvatarRepositoryContext.Provider value={value}>
      {children}
    </AvatarRepositoryContext.Provider>
  );
}

export function useAvatarRepository(): AvatarRepository {
  const repository = useContext(AvatarRepositoryContext);
  if (!repository) {
    throw new Error("useAvatarRepository must be used within AvatarRepositoryProvider");
  }
  return repository;
}
