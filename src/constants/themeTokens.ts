export const THEME_TOKENS = {
  colors: {
    primary: {
      900: '#0D1F17',
      800: '#1B4332',
      700: '#2D6A4F',
      600: '#40916C',
      500: '#52B788',
      400: '#74C69D',
      300: '#95D5B2',
    },
    dark: {
      deepest: '#0A0A0A',
      base: '#0D0D0D',
      elevated: '#1A1A1A',
      surface: '#262626',
      hover: '#333333',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#A3A3A3',
      tertiary: '#737373',
      disabled: '#525252',
    },
    glass: {
      bg: 'rgba(255, 255, 255, 0.05)',
      bgHover: 'rgba(255, 255, 255, 0.08)',
      border: 'rgba(255, 255, 255, 0.10)',
      borderFocus: 'rgba(82, 183, 136, 0.30)',
    },
    semantic: {
      success: '#52B788',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6',
    },
  },
  spacing: {
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    5: '20px',
    6: '24px',
    8: '32px',
    10: '40px',
    12: '48px',
    16: '64px',
  },
  radius: {
    sm: '6px',
    md: '10px',
    lg: '14px',
    xl: '20px',
    '2xl': '28px',
  },
  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    base: '250ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '350ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const;

export const DEFAULT_THEME = {
  name: 'Dark Forest',
  colors: {
    primary: '#52B788',
    background: '#0D0D0D',
    surface: '#262626',
    text: '#FFFFFF',
  },
  fonts: {
    heading: 'Inter',
    body: 'Inter',
  },
} as const;
