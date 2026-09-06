import type { ThemeDefinition } from "@/features/theme/theme.types";

export const skyTheme: ThemeDefinition = {
  id: "sky",
  name: "Sky",
  colors: {
    background: "#F5F8FC",
    surface: "#FFFFFF",
    surfaceSoft: "#EAF3FB",
    textPrimary: "#1D2A3A",
    textSecondary: "#657283",
    primary: "#3F79A8",
    primarySoft: "#DCECF8",
    border: "#DCE5EE",
    danger: "#C94F5B",
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  radius: {
    sm: 8,
    md: 14,
    lg: 22,
    full: 999,
  },
  typography: {
    title: {
      fontSize: 32,
      lineHeight: 40,
      fontWeight: "700",
      letterSpacing: -0.8,
    },
    heading: {
      fontSize: 22,
      lineHeight: 30,
      fontWeight: "700",
      letterSpacing: -0.3,
    },
    body: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: "400",
    },
    label: {
      fontSize: 15,
      lineHeight: 20,
      fontWeight: "600",
    },
    caption: {
      fontSize: 12,
      lineHeight: 18,
      fontWeight: "500",
    },
  },
};
