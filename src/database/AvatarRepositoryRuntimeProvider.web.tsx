import { useMemo } from "react";
import type { PropsWithChildren } from "react";

import { AvatarRepositoryProvider } from "@/database/AvatarRepositoryContext";
import { LocalStorageAvatarRepository } from "@/features/avatar/data/LocalStorageAvatarRepository";

export function AvatarRepositoryRuntimeProvider({ children }: PropsWithChildren) {
  const repository = useMemo(() => new LocalStorageAvatarRepository(), []);

  return (
    <AvatarRepositoryProvider value={repository}>
      {children}
    </AvatarRepositoryProvider>
  );
}
