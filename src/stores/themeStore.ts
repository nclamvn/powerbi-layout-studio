import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { THEME_PRESETS, DEFAULT_THEME_ID, ThemePreset } from '../constants/themePresets';

interface ThemeState {
  currentThemeId: string;
  currentTheme: ThemePreset;

  // Actions
  setTheme: (themeId: string) => void;
  getChartColors: () => string[];
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      currentThemeId: DEFAULT_THEME_ID,
      currentTheme: THEME_PRESETS[DEFAULT_THEME_ID],

      setTheme: (themeId: string) => {
        const theme = THEME_PRESETS[themeId];
        if (theme) {
          set({ currentThemeId: themeId, currentTheme: theme });

          // Apply theme to document
          const root = document.documentElement;
          root.style.setProperty('--color-primary-500', theme.colors.primary);
          root.style.setProperty('--color-primary-400', theme.colors.primaryLight);
          root.style.setProperty('--color-primary-700', theme.colors.primaryDark);
        }
      },

      getChartColors: () => {
        return get().currentTheme.chart;
      },
    }),
    {
      name: 'pbi-layout-studio-theme',
    }
  )
);
