import { skyTheme } from "@/features/theme/themes/sky";
import { nightTheme } from "@/features/theme/themes/night";
import { warmPaperTheme } from "@/features/theme/themes/warmPaper";
import type { ThemeDefinition, ThemeId } from "@/features/theme/theme.types";

export const DEFAULT_THEME_ID: ThemeId = "sky";

export const themeRegistry: Readonly<Partial<Record<ThemeId, ThemeDefinition>>> = {
  sky: skyTheme,
  "warm-paper": warmPaperTheme,
  night: nightTheme,
};

export function resolveTheme(themeId: string | null | undefined): ThemeDefinition {
  return Object.values(themeRegistry).find((theme) => theme?.id === themeId) ?? skyTheme;
}
