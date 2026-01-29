// ═══════════════════════════════════════════════════════════════════════
// DATA ANALYSIS TYPES
// ═══════════════════════════════════════════════════════════════════════

export type ColumnDataType = 'number' | 'text' | 'date' | 'boolean' | 'category';

export type ColumnRole =
  | 'metric'        // Numeric values to aggregate (Revenue, Sales, Count)
  | 'dimension'     // Categorical grouping (Region, Product, Category)
  | 'time'          // Date/time for trends (Date, Month, Year)
  | 'identifier'    // Unique IDs (not useful for viz)
  | 'filter';       // Low cardinality, good for slicers

export interface ColumnAnalysis {
  name: string;
  dataType: ColumnDataType;
  role: ColumnRole;
  uniqueCount: number;
  totalCount: number;
  cardinality: 'low' | 'medium' | 'high';  // low < 10, medium < 50, high >= 50
  sampleValues: any[];
  statistics?: {
    min: number;
    max: number;
    avg: number;
    sum: number;
  };
  isTimeSeries?: boolean;
  dateGranularity?: 'year' | 'quarter' | 'month' | 'week' | 'day';
}

export interface DataAnalysisResult {
  totalRows: number;
  totalColumns: number;
  columns: ColumnAnalysis[];
  metrics: ColumnAnalysis[];
  dimensions: ColumnAnalysis[];
  timeColumns: ColumnAnalysis[];
  filterColumns: ColumnAnalysis[];
  suggestedTitle: string;
  dataQuality: 'good' | 'medium' | 'poor';
  warnings: string[];
}

// ═══════════════════════════════════════════════════════════════════════
// LAYOUT SUGGESTION TYPES
// ═══════════════════════════════════════════════════════════════════════

export interface VisualSuggestion {
  id: string;
  type: import('./visual.types').VisualType;
  title: string;
  reason: string;                    // Why this visual was suggested
  confidence: number;                // 0-100
  position: {
    row: number;
    col: number;
    rowSpan: number;
    colSpan: number;
  };
  dataBinding: {
    [key: string]: string | string[] | number | null;  // field mappings
  };
  priority: 'primary' | 'secondary' | 'supporting';
}

export interface LayoutSuggestion {
  id: string;
  name: string;
  description: string;
  style: 'executive' | 'detailed' | 'compact' | 'presentation';
  gridColumns: number;
  gridRows: number;
  visuals: VisualSuggestion[];
  estimatedBuildTime: string;        // "2 minutes"
  thumbnail?: string;
}

export interface AutoLayoutState {
  // Analysis
  analysisResult: DataAnalysisResult | null;
  isAnalyzing: boolean;

  // Suggestions
  layoutSuggestions: LayoutSuggestion[];
  selectedLayoutId: string | null;
  isGenerating: boolean;

  // Actions
  analyzeData: (data: any[]) => Promise<DataAnalysisResult>;
  generateLayouts: (analysis: DataAnalysisResult) => LayoutSuggestion[];
  selectLayout: (layoutId: string) => void;
  applyLayout: () => void;
  reset: () => void;
}
