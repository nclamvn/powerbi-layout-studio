export interface ThemePreset {
  id: string;
  name: string;
  mode: 'dark' | 'light';
  colors: {
    primary: string;
    primaryLight: string;
    primaryDark: string;
    background: string;
    backgroundElevated: string;
    surface: string;
    surfaceHover: string;
    border: string;
    text: string;
    textSecondary: string;
    textTertiary: string;
    success: string;
    warning: string;
    error: string;
    info: string;
  };
  chart: string[];
}

export const THEME_PRESETS: Record<string, ThemePreset> = {
  darkForest: {
    id: 'darkForest',
    name: 'Dark Forest',
    mode: 'dark',
    colors: {
      primary: '#52B788',
      primaryLight: '#74C69D',
      primaryDark: '#2D6A4F',
      background: '#0A0A0A',
      backgroundElevated: '#0D0D0D',
      surface: '#1A1A1A',
      surfaceHover: '#262626',
      border: 'rgba(255,255,255,0.1)',
      text: '#FFFFFF',
      textSecondary: '#A3A3A3',
      textTertiary: '#737373',
      success: '#52B788',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6',
    },
    chart: ['#52B788', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#EC4899', '#84CC16'],
  },

  midnightBlue: {
    id: 'midnightBlue',
    name: 'Midnight Blue',
    mode: 'dark',
    colors: {
      primary: '#3B82F6',
      primaryLight: '#60A5FA',
      primaryDark: '#2563EB',
      background: '#0F172A',
      backgroundElevated: '#1E293B',
      surface: '#334155',
      surfaceHover: '#475569',
      border: 'rgba(255,255,255,0.1)',
      text: '#F8FAFC',
      textSecondary: '#94A3B8',
      textTertiary: '#64748B',
      success: '#22C55E',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6',
    },
    chart: ['#3B82F6', '#22C55E', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#EC4899', '#84CC16'],
  },

  purpleHaze: {
    id: 'purpleHaze',
    name: 'Purple Haze',
    mode: 'dark',
    colors: {
      primary: '#8B5CF6',
      primaryLight: '#A78BFA',
      primaryDark: '#7C3AED',
      background: '#0D0B14',
      backgroundElevated: '#1A1625',
      surface: '#2D2640',
      surfaceHover: '#3D3555',
      border: 'rgba(255,255,255,0.1)',
      text: '#F5F3FF',
      textSecondary: '#A5A0B8',
      textTertiary: '#6B6580',
      success: '#22C55E',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6',
    },
    chart: ['#8B5CF6', '#EC4899', '#3B82F6', '#22C55E', '#F59E0B', '#06B6D4', '#EF4444', '#84CC16'],
  },

  warmSunset: {
    id: 'warmSunset',
    name: 'Warm Sunset',
    mode: 'dark',
    colors: {
      primary: '#F59E0B',
      primaryLight: '#FBBF24',
      primaryDark: '#D97706',
      background: '#1C1410',
      backgroundElevated: '#2D2420',
      surface: '#3D3530',
      surfaceHover: '#4D4540',
      border: 'rgba(255,255,255,0.1)',
      text: '#FEF3C7',
      textSecondary: '#D4C4A8',
      textTertiary: '#9A8A70',
      success: '#22C55E',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6',
    },
    chart: ['#F59E0B', '#EF4444', '#EC4899', '#8B5CF6', '#3B82F6', '#22C55E', '#06B6D4', '#84CC16'],
  },

  oceanBreeze: {
    id: 'oceanBreeze',
    name: 'Ocean Breeze',
    mode: 'dark',
    colors: {
      primary: '#06B6D4',
      primaryLight: '#22D3EE',
      primaryDark: '#0891B2',
      background: '#0A1419',
      backgroundElevated: '#0F1D24',
      surface: '#1A2E38',
      surfaceHover: '#253D49',
      border: 'rgba(255,255,255,0.1)',
      text: '#ECFEFF',
      textSecondary: '#A5C9D2',
      textTertiary: '#6B9AA8',
      success: '#22C55E',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#06B6D4',
    },
    chart: ['#06B6D4', '#3B82F6', '#22C55E', '#F59E0B', '#8B5CF6', '#EC4899', '#EF4444', '#84CC16'],
  },
};

export const DEFAULT_THEME_ID = 'darkForest';

export function getTheme(themeId: string): ThemePreset {
  return THEME_PRESETS[themeId] || THEME_PRESETS[DEFAULT_THEME_ID];
}

// Generate CSS variables from theme
export function generateThemeCSS(theme: ThemePreset): string {
  return `
    --color-primary: ${theme.colors.primary};
    --color-primary-light: ${theme.colors.primaryLight};
    --color-primary-dark: ${theme.colors.primaryDark};
    --color-bg: ${theme.colors.background};
    --color-bg-elevated: ${theme.colors.backgroundElevated};
    --color-surface: ${theme.colors.surface};
    --color-surface-hover: ${theme.colors.surfaceHover};
    --color-border: ${theme.colors.border};
    --color-text: ${theme.colors.text};
    --color-text-secondary: ${theme.colors.textSecondary};
    --color-text-tertiary: ${theme.colors.textTertiary};
  `;
}
