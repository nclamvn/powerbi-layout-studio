export const CHART_COLORS = [
  '#52B788', // Green (Primary)
  '#3B82F6', // Blue
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#06B6D4', // Cyan
  '#EC4899', // Pink
  '#84CC16', // Lime
] as const;

export const CHART_COLOR_MAP = {
  green: '#52B788',
  blue: '#3B82F6',
  amber: '#F59E0B',
  red: '#EF4444',
  purple: '#8B5CF6',
  cyan: '#06B6D4',
  pink: '#EC4899',
  lime: '#84CC16',
} as const;

export function getChartColor(index: number): string {
  return CHART_COLORS[index % CHART_COLORS.length];
}
