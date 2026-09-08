import { skyTheme } from "@/features/theme/themes/sky";
import type { ThemeDefinition, ThemeId } from "@/features/theme/theme.types";

export const DEFAULT_THEME_ID: ThemeId = "sky";

export const themeRegistry: Readonly<
  Partial<Record<ThemeId, ThemeDefinition>>
> = {
  sky: skyTheme,
};

export function resolveTheme(themeId: ThemeId): ThemeDefinition {
  return themeRegistry[themeId] ?? skyTheme;
}
