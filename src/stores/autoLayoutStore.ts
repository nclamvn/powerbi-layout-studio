import { create } from 'zustand';
import {
  AutoLayoutState,
  DataAnalysisResult
} from '../types/autoLayout.types';
import { analyzeData } from '../services/dataAnalyzer';
import { generateLayouts, gridToPixels } from '../services/layoutGenerator';
import { useProjectStore } from './projectStore';
import { VISUAL_DEFAULTS } from '../constants/visualDefaults';
import { Visual, VisualType } from '../types/visual.types';
import { nanoid } from 'nanoid';

export const useAutoLayoutStore = create<AutoLayoutState>((set, get) => ({
  analysisResult: null,
  isAnalyzing: false,
  layoutSuggestions: [],
  selectedLayoutId: null,
  isGenerating: false,

  analyzeData: async (data: any[]) => {
    set({ isAnalyzing: true });

    // Simulate async for UX
    await new Promise(resolve => setTimeout(resolve, 500));

    const result = analyzeData(data);
    const layouts = generateLayouts(result);

    set({
      analysisResult: result,
      layoutSuggestions: layouts,
      selectedLayoutId: layouts[0]?.id || null,
      isAnalyzing: false,
    });

    return result;
  },

  generateLayouts: (analysis: DataAnalysisResult) => {
    const layouts = generateLayouts(analysis);
    set({ layoutSuggestions: layouts });
    return layouts;
  },

  selectLayout: (layoutId: string) => {
    set({ selectedLayoutId: layoutId });
  },

  applyLayout: () => {
    const { layoutSuggestions, selectedLayoutId } = get();
    const layout = layoutSuggestions.find(l => l.id === selectedLayoutId);

    if (!layout) return;

    set({ isGenerating: true });

    const { canvasSize, setVisuals, setProjectName } = useProjectStore.getState();
    const { analysisResult } = get();

    // Convert suggestions to actual visuals
    const visuals: Visual[] = layout.visuals.map(suggestion => {
      const position = gridToPixels(
        suggestion.position,
        layout.gridColumns,
        layout.gridRows,
        canvasSize.width,
        canvasSize.height
      );

      // Get default config for this visual type
      const defaults = VISUAL_DEFAULTS[suggestion.type];

      // Merge defaults with suggestion
      const visual: Visual = {
        ...defaults,
        id: nanoid(),
        position,
        style: {
          ...defaults.style,
          title: suggestion.title,
        },
        data: {
          ...defaults.data,
          ...mapDataBinding(suggestion.type, suggestion.dataBinding),
        },
      } as Visual;

      return visual;
    });

    // Apply to project
    setVisuals(visuals);

    if (analysisResult?.suggestedTitle) {
      setProjectName(analysisResult.suggestedTitle);
    }

    set({ isGenerating: false });
  },

  reset: () => {
    set({
      analysisResult: null,
      layoutSuggestions: [],
      selectedLayoutId: null,
      isAnalyzing: false,
      isGenerating: false,
    });
  },
}));

// Helper to map data binding from suggestion to visual config
function mapDataBinding(type: VisualType, binding: Record<string, any>): any {
  switch (type) {
    case 'kpi-card':
      return {
        field: binding.field || null,
        aggregation: binding.aggregation || 'SUM',
        format: 'number',
        decimals: 0,
      };

    case 'line-chart':
      return {
        xAxis: { field: binding.xAxis || null, type: 'category' },
        series: (Array.isArray(binding.series) ? binding.series : []).map((field: string, i: number) => ({
          field,
          aggregation: 'SUM',
          color: ['#52B788', '#3B82F6', '#F59E0B', '#EF4444'][i % 4],
          label: field,
        })),
      };

    case 'bar-chart':
      return {
        category: { field: binding.category || null },
        values: [{
          field: binding.value || null,
          aggregation: 'SUM',
          color: '#52B788',
          label: binding.value || 'Value',
        }],
      };

    case 'pie-chart':
      return {
        category: { field: binding.category || null },
        value: { field: binding.value || null, aggregation: 'SUM' },
      };

    case 'slicer':
      return {
        field: binding.field || null,
      };

    case 'data-table':
      return {
        columns: (Array.isArray(binding.columns) ? binding.columns : []).map((field: string) => ({
          field,
          label: field,
          align: 'left',
        })),
      };

    case 'gauge':
      return {
        field: binding.field || null,
        minValue: binding.minValue || 0,
        maxValue: binding.maxValue || 100,
        aggregation: 'SUM',
      };

    case 'funnel':
      return {
        stageField: binding.stageField || null,
        valueField: binding.valueField || null,
      };

    case 'treemap':
      return {
        categoryField: binding.categoryField || null,
        valueField: binding.valueField || null,
      };

    case 'matrix':
      return {
        rowFields: Array.isArray(binding.rowFields) ? binding.rowFields : [],
        columnFields: Array.isArray(binding.columnFields) ? binding.columnFields : [],
        valueField: binding.valueField || null,
        aggregation: 'SUM',
      };

    default:
      return binding;
  }
}
