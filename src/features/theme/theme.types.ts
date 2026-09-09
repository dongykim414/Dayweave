import type { TextStyle } from "react-native";

export type ThemeId = "sky" | "warm-paper" | "night" | "mint";

export interface ThemeColors {
  background: string;
  surface: string;
  surfaceElevated: string;
  surfaceSoft: string;
  surfaceMuted: string;
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  primary: string;
  primarySoft: string;
  border: string;
  danger: string;
  onPrimary: string;
  chip: string;
  input: string;
  inputBorder: string;
  navBackground: string;
  navInactive: string;
  shadow: string;
}

export interface ThemeSpacing {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
}

export interface ThemeRadius {
  sm: number;
  md: number;
  lg: number;
  xl: number;
  full: number;
}

export interface ThemeLayout {
  cardPadding: number;
  screenHorizontal: number;
  screenTop: number;
  sectionGap: number;
  tabBarHeight: number;
}

export interface ThemeShadow {
  elevation: number;
  offsetY: number;
  opacity: number;
  radius: number;
}

export interface ThemeTextStyle {
  fontSize: number;
  lineHeight: number;
  fontWeight: TextStyle["fontWeight"];
  letterSpacing?: number;
}

export interface ThemeTypography {
  display: ThemeTextStyle;
  title: ThemeTextStyle;
  heading: ThemeTextStyle;
  body: ThemeTextStyle;
  label: ThemeTextStyle;
  caption: ThemeTextStyle;
  meta: ThemeTextStyle;
}

export interface ThemeDefinition {
  id: ThemeId;
  name: string;
  statusBarStyle: "dark" | "light";
  colors: ThemeColors;
  layout: ThemeLayout;
  spacing: ThemeSpacing;
  radius: ThemeRadius;
  shadow: ThemeShadow;
  typography: ThemeTypography;
}
