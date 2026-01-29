import { VisualType, KPICardVisual, LineChartVisual, BarChartVisual, PieChartVisual, DataTableVisual, SlicerVisual, GaugeVisual, FunnelVisual, TreemapVisual, MatrixVisual } from '../types/visual.types';
import { CHART_COLORS } from './chartColors';

// Using specific types for each visual default to ensure type safety
export const VISUAL_DEFAULTS: {
  'kpi-card': Omit<KPICardVisual, 'id'>;
  'line-chart': Omit<LineChartVisual, 'id'>;
  'bar-chart': Omit<BarChartVisual, 'id'>;
  'pie-chart': Omit<PieChartVisual, 'id'>;
  'data-table': Omit<DataTableVisual, 'id'>;
  slicer: Omit<SlicerVisual, 'id'>;
  gauge: Omit<GaugeVisual, 'id'>;
  funnel: Omit<FunnelVisual, 'id'>;
  treemap: Omit<TreemapVisual, 'id'>;
  matrix: Omit<MatrixVisual, 'id'>;
} = {
  'kpi-card': {
    type: 'kpi-card',
    position: { x: 50, y: 50, width: 250, height: 150 },
    data: {
      field: null,
      aggregation: 'SUM',
      format: 'number',
      decimals: 0,
      prefix: '',
      suffix: '',
    },
    style: {
      title: 'KPI Card',
      showTrend: false,
      trendField: undefined,
      icon: undefined,
    },
    conditionalFormatting: [],
  },
  'line-chart': {
    type: 'line-chart',
    position: { x: 50, y: 50, width: 500, height: 300 },
    data: {
      xAxis: { field: null, type: 'category' },
      series: [],
    },
    style: {
      title: 'Line Chart',
      showGrid: true,
      showLegend: true,
      legendPosition: 'bottom',
      curved: true,
      showDataLabels: false,
    },
  },
  'bar-chart': {
    type: 'bar-chart',
    position: { x: 50, y: 50, width: 500, height: 300 },
    data: {
      category: { field: null },
      values: [],
    },
    style: {
      title: 'Bar Chart',
      orientation: 'vertical',
      stacked: false,
      showGrid: true,
      showLegend: true,
      showDataLabels: false,
    },
  },
  'pie-chart': {
    type: 'pie-chart',
    position: { x: 50, y: 50, width: 350, height: 350 },
    data: {
      category: { field: null },
      value: { field: null, aggregation: 'SUM' },
    },
    style: {
      title: 'Pie Chart',
      donut: false,
      innerRadius: 0,
      showLabels: true,
      showPercent: true,
      showLegend: true,
      colors: [...CHART_COLORS],
    },
  },
  'data-table': {
    type: 'data-table',
    position: { x: 50, y: 50, width: 600, height: 400 },
    data: {
      columns: [],
    },
    style: {
      title: 'Data Table',
      pageSize: 10,
      showPagination: true,
      striped: true,
      compact: false,
    },
  },
  slicer: {
    type: 'slicer',
    position: { x: 50, y: 50, width: 200, height: 250 },
    data: {
      field: null,
    },
    style: {
      title: 'Slicer',
      displayMode: 'list',
      multiSelect: true,
      searchable: true,
      showSelectAll: true,
    },
  },
  gauge: {
    type: 'gauge',
    position: { x: 50, y: 50, width: 300, height: 250 },
    data: {
      field: null,
      minValue: 0,
      maxValue: 100,
      aggregation: 'SUM',
    },
    style: {
      title: 'Gauge',
      showValue: true,
      showPercent: true,
      colorRanges: [
        { from: 0, to: 33, color: '#EF4444' },
        { from: 33, to: 66, color: '#F59E0B' },
        { from: 66, to: 100, color: '#52B788' },
      ],
    },
  },
  funnel: {
    type: 'funnel',
    position: { x: 50, y: 50, width: 400, height: 300 },
    data: {
      stageField: null,
      valueField: null,
    },
    style: {
      title: 'Funnel',
      showLabels: true,
      showPercent: true,
      showConversion: true,
    },
  },
  treemap: {
    type: 'treemap',
    position: { x: 50, y: 50, width: 450, height: 350 },
    data: {
      categoryField: null,
      valueField: null,
    },
    style: {
      title: 'Treemap',
      showLabels: true,
      showValues: true,
      labelPosition: 'center',
      valueFormat: 'number',
      colorPalette: [...CHART_COLORS],
    },
  },
  matrix: {
    type: 'matrix',
    position: { x: 50, y: 50, width: 500, height: 400 },
    data: {
      rowFields: [],
      columnFields: [],
      valueField: null,
      aggregation: 'SUM',
    },
    style: {
      title: 'Matrix',
      showRowTotals: true,
      showColumnTotals: true,
      showGrandTotal: true,
      heatmapEnabled: false,
      heatmapColors: { low: '#3B82F6', mid: '#8B5CF6', high: '#EC4899' },
      alternateRowColors: true,
      alternateRowColor: 'rgba(255,255,255,0.02)',
      compact: false,
    },
  },
};

export const VISUAL_LABELS: Record<VisualType, string> = {
  'kpi-card': 'KPI Card',
  'line-chart': 'Line Chart',
  'bar-chart': 'Bar Chart',
  'pie-chart': 'Pie/Donut Chart',
  'data-table': 'Data Table',
  slicer: 'Slicer',
  gauge: 'Gauge',
  funnel: 'Funnel',
  treemap: 'Treemap',
  matrix: 'Matrix',
};

export const VISUAL_ICONS: Record<VisualType, string> = {
  'kpi-card': 'SquareStack',
  'line-chart': 'TrendingUp',
  'bar-chart': 'BarChart3',
  'pie-chart': 'PieChart',
  'data-table': 'Table',
  slicer: 'Filter',
  gauge: 'Gauge',
  funnel: 'GitMerge',
  treemap: 'LayoutGrid',
  matrix: 'Grid3x3',
};
