import { Visual } from './visual.types';

export interface CanvasSize {
  width: number;
  height: number;
}

export interface ThemeColors {
  primary: string;
  background: string;
  surface: string;
  text: string;
}

export interface ThemeConfig {
  name: string;
  colors: ThemeColors;
  fonts: {
    heading: string;
    body: string;
  };
}

export interface Project {
  id: string;
  name: string;
  visuals: Visual[];
  canvasSize: CanvasSize;
  theme: ThemeConfig;
  createdAt: string;
  updatedAt: string;
}

export interface ExportSpecs {
  projectName: string;
  exportedAt: string;
  canvasSize: {
    width: number;
    height: number;
    aspectRatio: string;
  };
  theme: ThemeConfig;
  visuals: VisualSpec[];
}

export interface VisualSpec {
  id: string;
  type: string;
  position: {
    x: string;
    y: string;
    width: string;
    height: string;
  };
  data: Record<string, unknown>;
  style: Record<string, unknown>;
  conditionalFormatting?: unknown[];
  powerBIInstructions: {
    visualType: string;
    steps: string[];
  };
}
