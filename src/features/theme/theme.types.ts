import type { TextStyle } from "react-native";

export type ThemeId = "sky" | "warm-paper" | "night" | "mint";

export interface ThemeColors {
  background: string;
  surface: string;
  surfaceSoft: string;
  textPrimary: string;
  textSecondary: string;
  primary: string;
  primarySoft: string;
  border: string;
  danger: string;
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
  full: number;
}

export interface ThemeTextStyle {
  fontSize: number;
  lineHeight: number;
  fontWeight: TextStyle["fontWeight"];
  letterSpacing?: number;
}

export interface ThemeTypography {
  title: ThemeTextStyle;
  heading: ThemeTextStyle;
  body: ThemeTextStyle;
  label: ThemeTextStyle;
  caption: ThemeTextStyle;
}

export interface ThemeDefinition {
  id: ThemeId;
  name: string;
  statusBarStyle: "dark" | "light";
  colors: ThemeColors;
  spacing: ThemeSpacing;
  radius: ThemeRadius;
  typography: ThemeTypography;
}
