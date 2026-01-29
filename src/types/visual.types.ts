export type VisualType =
  | 'kpi-card'
  | 'line-chart'
  | 'bar-chart'
  | 'pie-chart'
  | 'data-table'
  | 'slicer'
  | 'gauge'
  | 'funnel'
  | 'treemap'
  | 'matrix';

export interface Position {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ConditionalFormat {
  condition: 'greater' | 'less' | 'equal';
  value: number;
  color: string;
}

export interface KPICardData {
  field: string | null;
  aggregation: 'SUM' | 'AVG' | 'COUNT' | 'MIN' | 'MAX';
  format: 'number' | 'currency' | 'percent';
  decimals: number;
  prefix?: string;
  suffix?: string;
}

export interface KPICardStyle {
  title: string;
  showTrend: boolean;
  trendField?: string;
  icon?: string;
}

export interface ChartSeries {
  field: string;
  aggregation: 'SUM' | 'AVG' | 'COUNT';
  color: string;
  label: string;
}

export interface LineChartData {
  xAxis: { field: string | null; type: 'category' | 'time' };
  series: ChartSeries[];
}

export interface LineChartStyle {
  title: string;
  showGrid: boolean;
  showLegend: boolean;
  legendPosition: 'top' | 'bottom' | 'left' | 'right';
  curved: boolean;
  showDataLabels: boolean;
}

export interface BarChartData {
  category: { field: string | null };
  values: ChartSeries[];
}

export interface BarChartStyle {
  title: string;
  orientation: 'vertical' | 'horizontal';
  stacked: boolean;
  showGrid: boolean;
  showLegend: boolean;
  showDataLabels: boolean;
}

export interface PieChartData {
  category: { field: string | null };
  value: { field: string | null; aggregation: 'SUM' | 'COUNT' };
}

export interface PieChartStyle {
  title: string;
  donut: boolean;
  innerRadius: number;
  showLabels: boolean;
  showPercent: boolean;
  showLegend: boolean;
  colors: string[];
}

export interface TableColumn {
  field: string;
  label: string;
  width?: number;
  align: 'left' | 'center' | 'right';
  format?: 'text' | 'number' | 'currency' | 'percent' | 'date';
}

export interface DataTableData {
  columns: TableColumn[];
}

export interface DataTableStyle {
  title: string;
  pageSize: number;
  showPagination: boolean;
  striped: boolean;
  compact: boolean;
}

export interface SlicerData {
  field: string | null;
}

export interface SlicerStyle {
  title: string;
  displayMode: 'dropdown' | 'list' | 'chips';
  multiSelect: boolean;
  searchable: boolean;
  showSelectAll: boolean;
}

export interface KPICardVisual {
  type: 'kpi-card';
  id: string;
  position: Position;
  data: KPICardData;
  style: KPICardStyle;
  conditionalFormatting: ConditionalFormat[];
}

export interface LineChartVisual {
  type: 'line-chart';
  id: string;
  position: Position;
  data: LineChartData;
  style: LineChartStyle;
}

export interface BarChartVisual {
  type: 'bar-chart';
  id: string;
  position: Position;
  data: BarChartData;
  style: BarChartStyle;
}

export interface PieChartVisual {
  type: 'pie-chart';
  id: string;
  position: Position;
  data: PieChartData;
  style: PieChartStyle;
}

export interface DataTableVisual {
  type: 'data-table';
  id: string;
  position: Position;
  data: DataTableData;
  style: DataTableStyle;
}

export interface SlicerVisual {
  type: 'slicer';
  id: string;
  position: Position;
  data: SlicerData;
  style: SlicerStyle;
}

// Gauge Visual
export interface GaugeData {
  field: string | null;
  minValue: number;
  maxValue: number;
  aggregation: 'SUM' | 'AVG' | 'COUNT' | 'MIN' | 'MAX';
}

export interface GaugeStyle {
  title: string;
  showValue: boolean;
  showPercent: boolean;
  colorRanges: Array<{ from: number; to: number; color: string }>;
}

export interface GaugeVisual {
  type: 'gauge';
  id: string;
  position: Position;
  data: GaugeData;
  style: GaugeStyle;
}

// Funnel Visual
export interface FunnelData {
  stageField: string | null;
  valueField: string | null;
}

export interface FunnelStyle {
  title: string;
  showLabels: boolean;
  showPercent: boolean;
  showConversion: boolean;
}

export interface FunnelVisual {
  type: 'funnel';
  id: string;
  position: Position;
  data: FunnelData;
  style: FunnelStyle;
}

// Treemap Visual
export interface TreemapData {
  categoryField: string | null;
  valueField: string | null;
}

export interface TreemapStyle {
  title: string;
  showLabels: boolean;
  showValues: boolean;
  labelPosition: 'center' | 'top-left';
  valueFormat: 'number' | 'currency' | 'percent';
  colorPalette: string[];
}

export interface TreemapVisual {
  type: 'treemap';
  id: string;
  position: Position;
  data: TreemapData;
  style: TreemapStyle;
}

// Matrix Visual
export interface MatrixData {
  rowFields: string[];
  columnFields: string[];
  valueField: string | null;
  aggregation: 'SUM' | 'AVG' | 'COUNT' | 'MIN' | 'MAX';
}

export interface MatrixStyle {
  title: string;
  showRowTotals: boolean;
  showColumnTotals: boolean;
  showGrandTotal: boolean;
  heatmapEnabled: boolean;
  heatmapColors: { low: string; mid: string; high: string };
  alternateRowColors: boolean;
  alternateRowColor: string;
  compact: boolean;
}

export interface MatrixVisual {
  type: 'matrix';
  id: string;
  position: Position;
  data: MatrixData;
  style: MatrixStyle;
}

export type Visual =
  | KPICardVisual
  | LineChartVisual
  | BarChartVisual
  | PieChartVisual
  | DataTableVisual
  | SlicerVisual
  | GaugeVisual
  | FunnelVisual
  | TreemapVisual
  | MatrixVisual;
