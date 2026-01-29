import { Visual } from '../types/visual.types';
import { ExportSpecs, VisualSpec } from '../types/project.types';
import { DEFAULT_THEME } from '../constants/themeTokens';

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

export function generateSpecs(
  projectName: string,
  visuals: Visual[],
  canvasSize: { width: number; height: number }
): ExportSpecs {
  const divisor = gcd(canvasSize.width, canvasSize.height);

  return {
    projectName,
    exportedAt: new Date().toISOString(),
    canvasSize: {
      ...canvasSize,
      aspectRatio: `${canvasSize.width / divisor}:${canvasSize.height / divisor}`,
    },
    theme: DEFAULT_THEME,
    visuals: visuals.map((v) => generateVisualSpec(v, canvasSize)),
  };
}

function generateVisualSpec(
  visual: Visual,
  canvasSize: { width: number; height: number }
): VisualSpec {
  const posPercent = {
    x: `${((visual.position.x / canvasSize.width) * 100).toFixed(1)}%`,
    y: `${((visual.position.y / canvasSize.height) * 100).toFixed(1)}%`,
    width: `${((visual.position.width / canvasSize.width) * 100).toFixed(1)}%`,
    height: `${((visual.position.height / canvasSize.height) * 100).toFixed(1)}%`,
  };

  return {
    id: visual.id,
    type: visual.type,
    position: posPercent,
    data: visual.data as unknown as Record<string, unknown>,
    style: visual.style as unknown as Record<string, unknown>,
    conditionalFormatting: 'conditionalFormatting' in visual ? visual.conditionalFormatting : undefined,
    powerBIInstructions: generatePowerBISteps(visual),
  };
}

function generatePowerBISteps(visual: Visual): { visualType: string; steps: string[] } {
  switch (visual.type) {
    case 'kpi-card':
      return {
        visualType: 'Card',
        steps: [
          'Insert → Card',
          `Drag [${visual.data.field || 'your_field'}] to Fields`,
          `Format → Callout value → Display units: Auto`,
          `Format → Category label → Font size: 13`,
          `Format → Background → Color: #262626`,
          `Format → Border → Rounded corners: 14px`,
          ...(visual.conditionalFormatting.length > 0
            ? ['Format → Conditional formatting → Rules: (see specs)']
            : []),
        ],
      };

    case 'line-chart':
      return {
        visualType: 'Line chart',
        steps: [
          'Insert → Line chart',
          `Drag [${visual.data.xAxis?.field || 'category_field'}] to X-axis`,
          ...(visual.data.series || []).map(
            (s) => `Drag [${s.field}] to Y-axis (Color: ${s.color})`
          ),
          visual.style.showGrid
            ? 'Format → Gridlines → On, Color: rgba(255,255,255,0.1)'
            : 'Format → Gridlines → Off',
          visual.style.showLegend
            ? `Format → Legend → Position: ${visual.style.legendPosition}`
            : 'Format → Legend → Off',
        ],
      };

    case 'bar-chart':
      return {
        visualType: visual.style.orientation === 'horizontal' ? 'Clustered bar chart' : 'Clustered column chart',
        steps: [
          `Insert → ${visual.style.orientation === 'horizontal' ? 'Clustered bar chart' : 'Clustered column chart'}`,
          `Drag [${visual.data.category?.field || 'category_field'}] to Axis`,
          ...(visual.data.values || []).map(
            (v) => `Drag [${v.field}] to Values (Color: ${v.color})`
          ),
          visual.style.stacked ? 'Change to Stacked variant' : '',
          visual.style.showGrid
            ? 'Format → Gridlines → On'
            : 'Format → Gridlines → Off',
        ].filter(Boolean),
      };

    case 'pie-chart':
      return {
        visualType: visual.style.donut ? 'Donut chart' : 'Pie chart',
        steps: [
          `Insert → ${visual.style.donut ? 'Donut chart' : 'Pie chart'}`,
          `Drag [${visual.data.category?.field || 'category_field'}] to Legend`,
          `Drag [${visual.data.value?.field || 'value_field'}] to Values`,
          visual.style.showLabels
            ? 'Format → Detail labels → On'
            : 'Format → Detail labels → Off',
          visual.style.showPercent
            ? 'Format → Detail labels → Label style: Percent of total'
            : '',
        ].filter(Boolean),
      };

    case 'data-table':
      return {
        visualType: 'Table',
        steps: [
          'Insert → Table',
          ...(visual.data.columns || []).map(
            (col) => `Add column [${col.field}] (Align: ${col.align})`
          ),
          `Format → Grid → Row padding: ${visual.style.compact ? 'Minimal' : 'Default'}`,
          visual.style.striped
            ? 'Format → Style → Alternating rows: On'
            : 'Format → Style → Alternating rows: Off',
        ],
      };

    case 'slicer':
      return {
        visualType: 'Slicer',
        steps: [
          'Insert → Slicer',
          `Drag [${visual.data.field || 'filter_field'}] to Field`,
          `Format → Slicer settings → Style: ${visual.style.displayMode === 'dropdown' ? 'Dropdown' : 'List'}`,
          visual.style.multiSelect
            ? 'Format → Selection → Multi-select with Ctrl: On'
            : 'Format → Selection → Single select: On',
          visual.style.searchable
            ? 'Format → Slicer header → Search: On'
            : 'Format → Slicer header → Search: Off',
        ],
      };

    case 'gauge':
      return {
        visualType: 'Gauge',
        steps: [
          'Insert → Gauge',
          `Drag [${visual.data.field || 'value_field'}] to Value`,
          `Format → Gauge axis → Min: ${visual.data.minValue}`,
          `Format → Gauge axis → Max: ${visual.data.maxValue}`,
          `Format → Data colors → Configure color ranges`,
          visual.style.showValue
            ? 'Format → Callout value → On'
            : 'Format → Callout value → Off',
        ],
      };

    case 'funnel':
      return {
        visualType: 'Funnel chart',
        steps: [
          'Insert → Funnel chart',
          `Drag [${visual.data.stageField || 'stage_field'}] to Category`,
          `Drag [${visual.data.valueField || 'value_field'}] to Values`,
          visual.style.showLabels
            ? 'Format → Data labels → On'
            : 'Format → Data labels → Off',
          visual.style.showPercent
            ? 'Format → Data labels → Show percent: On'
            : '',
        ].filter(Boolean),
      };

    case 'treemap':
      return {
        visualType: 'Treemap',
        steps: [
          'Insert → Treemap',
          `Drag [${visual.data.categoryField || 'category_field'}] to Category`,
          `Drag [${visual.data.valueField || 'value_field'}] to Values`,
          visual.style.showLabels
            ? 'Format → Data labels → On'
            : 'Format → Data labels → Off',
          visual.style.showValues
            ? 'Format → Data labels → Show values: On'
            : '',
          `Format → Data labels → Position: ${visual.style.labelPosition === 'center' ? 'Center' : 'Top left'}`,
        ].filter(Boolean),
      };

    case 'matrix':
      return {
        visualType: 'Matrix',
        steps: [
          'Insert → Matrix',
          ...(visual.data.rowFields || []).map(
            (f) => `Drag [${f}] to Rows`
          ),
          ...(visual.data.columnFields || []).map(
            (f) => `Drag [${f}] to Columns`
          ),
          `Drag [${visual.data.valueField || 'value_field'}] to Values (Aggregation: ${visual.data.aggregation})`,
          visual.style.showRowTotals
            ? 'Format → Row subtotals → On'
            : 'Format → Row subtotals → Off',
          visual.style.showColumnTotals
            ? 'Format → Column subtotals → On'
            : 'Format → Column subtotals → Off',
          visual.style.heatmapEnabled
            ? 'Format → Conditional formatting → Background color scale'
            : '',
          visual.style.alternateRowColors
            ? 'Format → Grid → Styled header: On, Row banding: On'
            : '',
        ].filter(Boolean),
      };

    default:
      return { visualType: 'Unknown', steps: [] };
  }
}

export function exportToJSON(specs: ExportSpecs): string {
  return JSON.stringify(specs, null, 2);
}
