import {
  createContext,
  type PropsWithChildren,
  useContext,
  useMemo,
} from "react";

import {
  DEFAULT_THEME_ID,
  resolveTheme,
} from "@/features/theme/themeRegistry";
import type { ThemeDefinition, ThemeId } from "@/features/theme/theme.types";

interface ThemeContextValue {
  theme: ThemeDefinition;
  themeId: ThemeId;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: PropsWithChildren) {
  const themeId = DEFAULT_THEME_ID;
  const value = useMemo(
    () => ({ theme: resolveTheme(themeId), themeId }),
    [themeId],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return context;
}
