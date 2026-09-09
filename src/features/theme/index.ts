export { ThemeProvider, useTheme } from "@/features/theme/ThemeProvider";
export {
  DEFAULT_THEME_ID,
  resolveTheme,
  themeRegistry,
} from "@/features/theme/themeRegistry";
export {
  DEFAULT_OWNED_THEME_IDS,
  getOwnedThemes,
  resolveThemeId,
  selectOwnedTheme,
  THEME_CATALOG,
} from "@/features/theme/themeCatalog";
export type { ThemeCatalogItem } from "@/features/theme/themeCatalog";
export type {
  ThemeColors,
  ThemeDefinition,
  ThemeId,
  ThemeRadius,
  ThemeSpacing,
  ThemeTextStyle,
  ThemeTypography,
} from "@/features/theme/theme.types";
