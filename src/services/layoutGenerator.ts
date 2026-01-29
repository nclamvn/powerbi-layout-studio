import { nanoid } from 'nanoid';
import {
  DataAnalysisResult,
  LayoutSuggestion,
  VisualSuggestion
} from '../types/autoLayout.types';

// ═══════════════════════════════════════════════════════════════════════
// LAYOUT GENERATOR - Tạo layout suggestions dựa trên data analysis
// ═══════════════════════════════════════════════════════════════════════

export function generateLayouts(analysis: DataAnalysisResult): LayoutSuggestion[] {
  const layouts: LayoutSuggestion[] = [];

  // Always generate these layout styles
  layouts.push(generateExecutiveLayout(analysis));
  layouts.push(generateDetailedLayout(analysis));
  layouts.push(generateCompactLayout(analysis));

  // Presentation layout if enough visuals
  if (analysis.metrics.length >= 2) {
    layouts.push(generatePresentationLayout(analysis));
  }

  return layouts;
}

// ═══════════════════════════════════════════════════════════════════════
// LAYOUT STYLE: EXECUTIVE (KPIs prominent, clean overview)
// ═══════════════════════════════════════════════════════════════════════
function generateExecutiveLayout(analysis: DataAnalysisResult): LayoutSuggestion {
  const visuals: VisualSuggestion[] = [];

  // Row 1: KPI Cards for top metrics (up to 4)
  const topMetrics = analysis.metrics.slice(0, 4);
  topMetrics.forEach((metric, index) => {
    visuals.push({
      id: nanoid(),
      type: 'kpi-card',
      title: formatTitle(metric.name),
      reason: `Key metric: ${metric.name} (${metric.statistics?.sum?.toLocaleString() || 'N/A'} total)`,
      confidence: 95,
      position: { row: 0, col: index, rowSpan: 1, colSpan: 1 },
      dataBinding: {
        field: metric.name,
        aggregation: 'SUM',
      },
      priority: 'primary',
    });
  });

  // Row 2: Main chart (Line if time series, Bar otherwise)
  if (analysis.timeColumns.length > 0 && analysis.metrics.length > 0) {
    visuals.push({
      id: nanoid(),
      type: 'line-chart',
      title: `${formatTitle(analysis.metrics[0].name)} Trend`,
      reason: `Time series detected: ${analysis.timeColumns[0].name}`,
      confidence: 90,
      position: { row: 1, col: 0, rowSpan: 2, colSpan: 2 },
      dataBinding: {
        xAxis: analysis.timeColumns[0].name,
        series: [analysis.metrics[0].name],
      },
      priority: 'primary',
    });
  } else if (analysis.dimensions.length > 0 && analysis.metrics.length > 0) {
    visuals.push({
      id: nanoid(),
      type: 'bar-chart',
      title: `${formatTitle(analysis.metrics[0].name)} by ${formatTitle(analysis.dimensions[0].name)}`,
      reason: `Compare ${analysis.metrics[0].name} across ${analysis.dimensions[0].name}`,
      confidence: 85,
      position: { row: 1, col: 0, rowSpan: 2, colSpan: 2 },
      dataBinding: {
        category: analysis.dimensions[0].name,
        value: analysis.metrics[0].name,
      },
      priority: 'primary',
    });
  }

  // Row 2 right: Secondary chart or Pie
  if (analysis.dimensions.length > 0 && analysis.metrics.length > 0) {
    const dimension = analysis.dimensions.find(d => d.cardinality === 'low') || analysis.dimensions[0];
    visuals.push({
      id: nanoid(),
      type: 'pie-chart',
      title: `${formatTitle(analysis.metrics[0].name)} Distribution`,
      reason: `Show proportion by ${dimension.name}`,
      confidence: 80,
      position: { row: 1, col: 2, rowSpan: 2, colSpan: 2 },
      dataBinding: {
        category: dimension.name,
        value: analysis.metrics[0].name,
      },
      priority: 'secondary',
    });
  }

  // Row 4: Slicer if filter columns exist
  if (analysis.filterColumns.length > 0) {
    visuals.push({
      id: nanoid(),
      type: 'slicer',
      title: formatTitle(analysis.filterColumns[0].name),
      reason: `Filter by ${analysis.filterColumns[0].name} (${analysis.filterColumns[0].uniqueCount} values)`,
      confidence: 85,
      position: { row: 0, col: 3, rowSpan: 1, colSpan: 1 },
      dataBinding: {
        field: analysis.filterColumns[0].name,
      },
      priority: 'supporting',
    });
  }

  return {
    id: 'executive',
    name: 'Executive Summary',
    description: 'Clean overview with KPIs and key charts. Best for management dashboards.',
    style: 'executive',
    gridColumns: 4,
    gridRows: 4,
    visuals,
    estimatedBuildTime: '30 seconds',
  };
}

// ═══════════════════════════════════════════════════════════════════════
// LAYOUT STYLE: DETAILED (More visuals, comprehensive analysis)
// ═══════════════════════════════════════════════════════════════════════
function generateDetailedLayout(analysis: DataAnalysisResult): LayoutSuggestion {
  const visuals: VisualSuggestion[] = [];

  // Row 1: KPI Cards (up to 5)
  const topMetrics = analysis.metrics.slice(0, 5);
  topMetrics.forEach((metric, index) => {
    visuals.push({
      id: nanoid(),
      type: 'kpi-card',
      title: formatTitle(metric.name),
      reason: `Metric summary for ${metric.name}`,
      confidence: 95,
      position: { row: 0, col: index, rowSpan: 1, colSpan: 1 },
      dataBinding: {
        field: metric.name,
        aggregation: 'SUM',
      },
      priority: index < 3 ? 'primary' : 'secondary',
    });
  });

  // Row 2: Line/Area chart for trends
  if (analysis.timeColumns.length > 0 && analysis.metrics.length > 0) {
    visuals.push({
      id: nanoid(),
      type: 'line-chart',
      title: `${formatTitle(analysis.metrics[0].name)} Over Time`,
      reason: `Trend analysis using ${analysis.timeColumns[0].name}`,
      confidence: 90,
      position: { row: 1, col: 0, rowSpan: 2, colSpan: 3 },
      dataBinding: {
        xAxis: analysis.timeColumns[0].name,
        series: analysis.metrics.slice(0, 2).map(m => m.name),
      },
      priority: 'primary',
    });
  }

  // Row 2 right: Bar chart
  if (analysis.dimensions.length > 0 && analysis.metrics.length > 0) {
    visuals.push({
      id: nanoid(),
      type: 'bar-chart',
      title: `${formatTitle(analysis.metrics[0].name)} by ${formatTitle(analysis.dimensions[0].name)}`,
      reason: `Comparison across ${analysis.dimensions[0].name}`,
      confidence: 85,
      position: { row: 1, col: 3, rowSpan: 2, colSpan: 2 },
      dataBinding: {
        category: analysis.dimensions[0].name,
        value: analysis.metrics[0].name,
      },
      priority: 'primary',
    });
  }

  // Row 4: Matrix if multiple dimensions
  if (analysis.dimensions.length >= 2 && analysis.metrics.length > 0) {
    visuals.push({
      id: nanoid(),
      type: 'matrix',
      title: `${formatTitle(analysis.metrics[0].name)} Matrix`,
      reason: `Cross-tabulation of ${analysis.dimensions[0].name} x ${analysis.dimensions[1].name}`,
      confidence: 75,
      position: { row: 3, col: 0, rowSpan: 2, colSpan: 3 },
      dataBinding: {
        rowFields: [analysis.dimensions[0].name],
        columnFields: [analysis.dimensions[1].name],
        valueField: analysis.metrics[0].name,
      },
      priority: 'secondary',
    });
  }

  // Row 4 right: Treemap
  if (analysis.dimensions.length > 0 && analysis.metrics.length > 0) {
    const dimension = analysis.dimensions.find(d => d.cardinality === 'medium') || analysis.dimensions[0];
    visuals.push({
      id: nanoid(),
      type: 'treemap',
      title: `${formatTitle(dimension.name)} Breakdown`,
      reason: `Hierarchical view of ${analysis.metrics[0].name} by ${dimension.name}`,
      confidence: 70,
      position: { row: 3, col: 3, rowSpan: 2, colSpan: 2 },
      dataBinding: {
        categoryField: dimension.name,
        valueField: analysis.metrics[0].name,
      },
      priority: 'secondary',
    });
  }

  // Slicers in sidebar
  analysis.filterColumns.slice(0, 2).forEach((filter, index) => {
    visuals.push({
      id: nanoid(),
      type: 'slicer',
      title: formatTitle(filter.name),
      reason: `Filter control for ${filter.name}`,
      confidence: 85,
      position: { row: index, col: 5, rowSpan: 1, colSpan: 1 },
      dataBinding: {
        field: filter.name,
      },
      priority: 'supporting',
    });
  });

  // Data table at bottom
  visuals.push({
    id: nanoid(),
    type: 'data-table',
    title: 'Detailed Data',
    reason: 'Full data access for drill-down analysis',
    confidence: 90,
    position: { row: 5, col: 0, rowSpan: 2, colSpan: 5 },
    dataBinding: {
      columns: [...analysis.dimensions.slice(0, 2), ...analysis.metrics.slice(0, 3)].map(c => c.name),
    },
    priority: 'supporting',
  });

  return {
    id: 'detailed',
    name: 'Detailed Analysis',
    description: 'Comprehensive view with multiple charts, matrix, and data table.',
    style: 'detailed',
    gridColumns: 6,
    gridRows: 7,
    visuals,
    estimatedBuildTime: '1 minute',
  };
}

// ═══════════════════════════════════════════════════════════════════════
// LAYOUT STYLE: COMPACT (Minimal, focused)
// ═══════════════════════════════════════════════════════════════════════
function generateCompactLayout(analysis: DataAnalysisResult): LayoutSuggestion {
  const visuals: VisualSuggestion[] = [];

  // Just 3 KPIs
  analysis.metrics.slice(0, 3).forEach((metric, index) => {
    visuals.push({
      id: nanoid(),
      type: 'kpi-card',
      title: formatTitle(metric.name),
      reason: `Top metric: ${metric.name}`,
      confidence: 95,
      position: { row: 0, col: index, rowSpan: 1, colSpan: 1 },
      dataBinding: {
        field: metric.name,
        aggregation: 'SUM',
      },
      priority: 'primary',
    });
  });

  // One main chart
  if (analysis.timeColumns.length > 0 && analysis.metrics.length > 0) {
    visuals.push({
      id: nanoid(),
      type: 'line-chart',
      title: `${formatTitle(analysis.metrics[0].name)} Trend`,
      reason: 'Primary trend visualization',
      confidence: 90,
      position: { row: 1, col: 0, rowSpan: 2, colSpan: 3 },
      dataBinding: {
        xAxis: analysis.timeColumns[0].name,
        series: [analysis.metrics[0].name],
      },
      priority: 'primary',
    });
  } else if (analysis.dimensions.length > 0 && analysis.metrics.length > 0) {
    visuals.push({
      id: nanoid(),
      type: 'bar-chart',
      title: `${formatTitle(analysis.metrics[0].name)} by ${formatTitle(analysis.dimensions[0].name)}`,
      reason: 'Primary comparison visualization',
      confidence: 85,
      position: { row: 1, col: 0, rowSpan: 2, colSpan: 3 },
      dataBinding: {
        category: analysis.dimensions[0].name,
        value: analysis.metrics[0].name,
      },
      priority: 'primary',
    });
  }

  return {
    id: 'compact',
    name: 'Compact View',
    description: 'Minimal dashboard with essential KPIs and one main chart.',
    style: 'compact',
    gridColumns: 3,
    gridRows: 3,
    visuals,
    estimatedBuildTime: '15 seconds',
  };
}

// ═══════════════════════════════════════════════════════════════════════
// LAYOUT STYLE: PRESENTATION (Big visuals for meetings)
// ═══════════════════════════════════════════════════════════════════════
function generatePresentationLayout(analysis: DataAnalysisResult): LayoutSuggestion {
  const visuals: VisualSuggestion[] = [];

  // Large KPIs
  analysis.metrics.slice(0, 2).forEach((metric, index) => {
    visuals.push({
      id: nanoid(),
      type: 'kpi-card',
      title: formatTitle(metric.name),
      reason: `Headline metric: ${metric.name}`,
      confidence: 95,
      position: { row: 0, col: index * 2, rowSpan: 1, colSpan: 2 },
      dataBinding: {
        field: metric.name,
        aggregation: 'SUM',
      },
      priority: 'primary',
    });
  });

  // Gauge for target tracking
  if (analysis.metrics.length >= 2) {
    visuals.push({
      id: nanoid(),
      type: 'gauge',
      title: `${formatTitle(analysis.metrics[0].name)} Progress`,
      reason: 'Visual progress indicator',
      confidence: 80,
      position: { row: 1, col: 0, rowSpan: 2, colSpan: 2 },
      dataBinding: {
        field: analysis.metrics[0].name,
        minValue: 0,
        maxValue: analysis.metrics[0].statistics?.max || 100,
      },
      priority: 'primary',
    });
  }

  // Large trend chart
  if (analysis.timeColumns.length > 0 && analysis.metrics.length > 0) {
    visuals.push({
      id: nanoid(),
      type: 'line-chart',
      title: `${formatTitle(analysis.metrics[0].name)} Performance`,
      reason: 'Main presentation visual',
      confidence: 90,
      position: { row: 1, col: 2, rowSpan: 2, colSpan: 2 },
      dataBinding: {
        xAxis: analysis.timeColumns[0].name,
        series: [analysis.metrics[0].name],
      },
      priority: 'primary',
    });
  }

  // Funnel if suitable
  if (analysis.dimensions.some(d => d.cardinality === 'low') && analysis.metrics.length > 0) {
    const stageDimension = analysis.dimensions.find(d => d.cardinality === 'low');
    if (stageDimension) {
      visuals.push({
        id: nanoid(),
        type: 'funnel',
        title: `${formatTitle(stageDimension.name)} Funnel`,
        reason: 'Conversion/flow visualization',
        confidence: 70,
        position: { row: 3, col: 0, rowSpan: 2, colSpan: 4 },
        dataBinding: {
          stageField: stageDimension.name,
          valueField: analysis.metrics[0].name,
        },
        priority: 'secondary',
      });
    }
  }

  return {
    id: 'presentation',
    name: 'Presentation Mode',
    description: 'Large visuals optimized for meetings and screen sharing.',
    style: 'presentation',
    gridColumns: 4,
    gridRows: 5,
    visuals,
    estimatedBuildTime: '45 seconds',
  };
}

// ═══════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════
function formatTitle(name: string): string {
  return name
    .replace(/_/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
    .trim();
}

// Convert grid position to pixel position
export function gridToPixels(
  gridPos: { row: number; col: number; rowSpan: number; colSpan: number },
  gridColumns: number,
  gridRows: number,
  canvasWidth: number = 1920,
  canvasHeight: number = 1080,
  padding: number = 20,
  gap: number = 16
): { x: number; y: number; width: number; height: number } {
  const cellWidth = (canvasWidth - padding * 2 - gap * (gridColumns - 1)) / gridColumns;
  const cellHeight = (canvasHeight - padding * 2 - gap * (gridRows - 1)) / gridRows;

  return {
    x: padding + gridPos.col * (cellWidth + gap),
    y: padding + gridPos.row * (cellHeight + gap),
    width: gridPos.colSpan * cellWidth + (gridPos.colSpan - 1) * gap,
    height: gridPos.rowSpan * cellHeight + (gridPos.rowSpan - 1) * gap,
  };
}
