import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useDataStore } from '../../stores/dataStore';
import { VisualWrapper } from './VisualWrapper';

interface MatrixVisualProps {
  visual: {
    id: string;
    type: 'matrix';
    position: { x: number; y: number; width: number; height: number };
    data: {
      rowFields: string[];
      columnFields: string[];
      valueField: string | null;
      aggregation: 'SUM' | 'AVG' | 'COUNT' | 'MIN' | 'MAX';
    };
    style: {
      title: string;
      showRowTotals: boolean;
      showColumnTotals: boolean;
      showGrandTotal: boolean;
      heatmapEnabled: boolean;
      heatmapColors: { low: string; mid: string; high: string };
      alternateRowColors: boolean;
      alternateRowColor: string;
      compact: boolean;
    };
  };
}

// Sample data for preview
const sampleMatrix = {
  rowHeaders: ['Region A', 'Region B', 'Region C'],
  columnHeaders: ['Q1', 'Q2', 'Q3', 'Q4'],
  cells: [
    [125, 138, 152, 145],
    [98, 112, 125, 118],
    [85, 92, 105, 98],
  ],
  rowTotals: [560, 453, 380],
  columnTotals: [308, 342, 382, 361],
  grandTotal: 1393,
};

export function MatrixVisual({ visual }: MatrixVisualProps) {
  const { getFilteredData } = useDataStore();
  const data = getFilteredData();

  const matrixData = useMemo(() => {
    const rowField = visual.data.rowFields[0];
    const colField = visual.data.columnFields[0];

    if (!rowField || !colField || !visual.data.valueField || data.length === 0) {
      return sampleMatrix;
    }

    // Get unique values
    const rowValues = [...new Set(data.map((row) => String(row[rowField] || 'Unknown')))].sort();
    const colValues = [...new Set(data.map((row) => String(row[colField] || 'Unknown')))].sort();

    // Build aggregation map
    const aggMap: Record<string, Record<string, number[]>> = {};
    data.forEach((row) => {
      const rKey = String(row[rowField] || 'Unknown');
      const cKey = String(row[colField] || 'Unknown');
      const value = Number(row[visual.data.valueField!]) || 0;

      if (!aggMap[rKey]) aggMap[rKey] = {};
      if (!aggMap[rKey][cKey]) aggMap[rKey][cKey] = [];
      aggMap[rKey][cKey].push(value);
    });

    // Aggregate function
    const aggregate = (values: number[]): number => {
      if (values.length === 0) return 0;
      switch (visual.data.aggregation) {
        case 'SUM':
          return values.reduce((a, b) => a + b, 0);
        case 'AVG':
          return values.reduce((a, b) => a + b, 0) / values.length;
        case 'COUNT':
          return values.length;
        case 'MIN':
          return Math.min(...values);
        case 'MAX':
          return Math.max(...values);
        default:
          return values.reduce((a, b) => a + b, 0);
      }
    };

    // Build cells
    const cells = rowValues.map((rKey) =>
      colValues.map((cKey) => aggregate(aggMap[rKey]?.[cKey] || []))
    );

    // Calculate totals
    const rowTotals = cells.map((row) => row.reduce((a, b) => a + b, 0));
    const columnTotals = colValues.map((_, ci) => cells.reduce((sum, row) => sum + row[ci], 0));
    const grandTotal = rowTotals.reduce((a, b) => a + b, 0);

    return {
      rowHeaders: rowValues,
      columnHeaders: colValues,
      cells,
      rowTotals,
      columnTotals,
      grandTotal,
    };
  }, [data, visual.data]);

  const formatValue = (value: number): string => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
    return value.toFixed(0);
  };

  // Get heatmap color
  const getHeatmapColor = (value: number): string | undefined => {
    if (!visual.style.heatmapEnabled) return undefined;

    const allValues = matrixData.cells.flat();
    const minVal = Math.min(...allValues);
    const maxVal = Math.max(...allValues);
    const range = maxVal - minVal || 1;
    const ratio = (value - minVal) / range;

    return interpolateColor(
      visual.style.heatmapColors.low,
      visual.style.heatmapColors.mid,
      visual.style.heatmapColors.high,
      ratio
    );
  };

  const hasData =
    visual.data.rowFields.length > 0 &&
    visual.data.columnFields.length > 0 &&
    visual.data.valueField &&
    data.length > 0;

  const cellPadding = visual.style.compact ? 6 : 10;

  return (
    <VisualWrapper id={visual.id} position={visual.position}>
      <div className="flex flex-col h-full p-4">
        <h3 className="text-sm font-medium text-white/80 mb-2">{visual.style.title}</h3>

        <div className="flex-1 overflow-auto">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr>
                <th
                  className="sticky top-0 left-0 z-20 bg-dark-surface border-b border-r border-white/10"
                  style={{ padding: cellPadding }}
                />
                {matrixData.columnHeaders.map((header) => (
                  <th
                    key={header}
                    className="sticky top-0 z-10 bg-dark-surface border-b border-white/10 text-left font-semibold text-white/80"
                    style={{ padding: cellPadding }}
                  >
                    {header}
                  </th>
                ))}
                {visual.style.showRowTotals && (
                  <th
                    className="sticky top-0 z-10 bg-dark-surface/80 border-b border-l border-white/10 text-left font-semibold text-primary-400"
                    style={{ padding: cellPadding }}
                  >
                    Total
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {matrixData.rowHeaders.map((rowHeader, ri) => (
                <motion.tr
                  key={rowHeader}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: ri * 0.03 }}
                  style={{
                    backgroundColor:
                      visual.style.alternateRowColors && ri % 2 === 1
                        ? visual.style.alternateRowColor
                        : 'transparent',
                  }}
                >
                  <td
                    className="sticky left-0 z-10 bg-dark-surface border-r border-white/10 font-medium text-white/80"
                    style={{ padding: cellPadding }}
                  >
                    {rowHeader}
                  </td>
                  {matrixData.cells[ri].map((cell, ci) => {
                    const heatColor = getHeatmapColor(cell);
                    return (
                      <td
                        key={ci}
                        className="text-right text-white/70 border-b border-white/5 tabular-nums"
                        style={{
                          padding: cellPadding,
                          backgroundColor: heatColor ? `${heatColor}25` : undefined,
                          color: heatColor || undefined,
                        }}
                      >
                        {formatValue(cell)}
                      </td>
                    );
                  })}
                  {visual.style.showRowTotals && (
                    <td
                      className="text-right font-semibold text-primary-400 border-l border-b border-white/10 bg-primary-500/5"
                      style={{ padding: cellPadding }}
                    >
                      {formatValue(matrixData.rowTotals[ri])}
                    </td>
                  )}
                </motion.tr>
              ))}

              {visual.style.showColumnTotals && (
                <tr className="bg-dark-surface/50">
                  <td
                    className="sticky left-0 z-10 bg-dark-surface border-t border-r border-white/10 font-semibold text-primary-400"
                    style={{ padding: cellPadding }}
                  >
                    Total
                  </td>
                  {matrixData.columnTotals.map((total, i) => (
                    <td
                      key={i}
                      className="text-right font-semibold text-primary-400 border-t border-white/10"
                      style={{ padding: cellPadding }}
                    >
                      {formatValue(total)}
                    </td>
                  ))}
                  {visual.style.showRowTotals && visual.style.showGrandTotal && (
                    <td
                      className="text-right font-bold text-primary-300 border-t border-l border-white/10 bg-primary-500/10"
                      style={{ padding: cellPadding }}
                    >
                      {formatValue(matrixData.grandTotal)}
                    </td>
                  )}
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {!hasData && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-dark-surface/80 px-4 py-2 rounded-lg backdrop-blur-sm">
              <p className="text-xs text-white/50">Configure row, column & value fields</p>
            </div>
          </div>
        )}
      </div>
    </VisualWrapper>
  );
}

// Helper: Interpolate between colors for heatmap
function interpolateColor(low: string, mid: string, high: string, ratio: number): string {
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
      : { r: 0, g: 0, b: 0 };
  };

  const rgbToHex = (r: number, g: number, b: number) =>
    `#${[r, g, b].map((x) => Math.round(x).toString(16).padStart(2, '0')).join('')}`;

  const lowRgb = hexToRgb(low);
  const midRgb = hexToRgb(mid);
  const highRgb = hexToRgb(high);

  let r, g, b;
  if (ratio < 0.5) {
    const lr = ratio * 2;
    r = lowRgb.r + (midRgb.r - lowRgb.r) * lr;
    g = lowRgb.g + (midRgb.g - lowRgb.g) * lr;
    b = lowRgb.b + (midRgb.b - lowRgb.b) * lr;
  } else {
    const lr = (ratio - 0.5) * 2;
    r = midRgb.r + (highRgb.r - midRgb.r) * lr;
    g = midRgb.g + (highRgb.g - midRgb.g) * lr;
    b = midRgb.b + (highRgb.b - midRgb.b) * lr;
  }

  return rgbToHex(r, g, b);
}
