import { DashboardTemplate } from '../types/template.types';
import { nanoid } from 'nanoid';

export const manufacturingTemplate: DashboardTemplate = {
  id: 'manufacturing-dashboard',
  name: 'Manufacturing Dashboard',
  description: 'Track production output, OEE, quality metrics, and downtime. Designed for plant managers and operations.',
  category: 'operations',
  icon: 'Factory',
  color: '#64748B',

  canvasSize: { width: 1920, height: 1080 },

  tags: ['manufacturing', 'production', 'OEE', 'quality', 'downtime', 'plant'],
  difficulty: 'intermediate',
  estimatedSetupTime: '6 minutes',

  requiredFields: [
    { name: 'Date', type: 'time', description: 'Production date', example: '2024-01', required: true },
    { name: 'Units Produced', type: 'metric', description: 'Total units produced', example: '15000', required: true },
    { name: 'Defects', type: 'metric', description: 'Defective units', example: '120', required: true },
    { name: 'Downtime Hours', type: 'metric', description: 'Equipment downtime', example: '8.5', required: false },
    { name: 'OEE', type: 'metric', description: 'Overall Equipment Effectiveness %', example: '82', required: false },
    { name: 'Production Line', type: 'dimension', description: 'Production line name', example: 'Line A', required: true },
    { name: 'Shift', type: 'dimension', description: 'Work shift', example: 'Day', required: false },
  ],

  sampleData: [
    { Date: '2024-01', 'Production Line': 'Line A', Shift: 'Day', 'Units Produced': 18500, Defects: 95, 'Downtime Hours': 4.2, OEE: 88, 'Scrap Rate': 0.51 },
    { Date: '2024-01', 'Production Line': 'Line A', Shift: 'Night', 'Units Produced': 16200, Defects: 105, 'Downtime Hours': 6.8, OEE: 82, 'Scrap Rate': 0.65 },
    { Date: '2024-01', 'Production Line': 'Line B', Shift: 'Day', 'Units Produced': 14800, Defects: 78, 'Downtime Hours': 3.5, OEE: 85, 'Scrap Rate': 0.53 },
    { Date: '2024-01', 'Production Line': 'Line B', Shift: 'Night', 'Units Produced': 13500, Defects: 92, 'Downtime Hours': 7.2, OEE: 78, 'Scrap Rate': 0.68 },
    { Date: '2024-01', 'Production Line': 'Line C', Shift: 'Day', 'Units Produced': 12200, Defects: 65, 'Downtime Hours': 2.8, OEE: 90, 'Scrap Rate': 0.53 },
    { Date: '2024-02', 'Production Line': 'Line A', Shift: 'Day', 'Units Produced': 19200, Defects: 88, 'Downtime Hours': 3.8, OEE: 89, 'Scrap Rate': 0.46 },
    { Date: '2024-02', 'Production Line': 'Line A', Shift: 'Night', 'Units Produced': 17100, Defects: 98, 'Downtime Hours': 5.5, OEE: 84, 'Scrap Rate': 0.57 },
    { Date: '2024-02', 'Production Line': 'Line B', Shift: 'Day', 'Units Produced': 15500, Defects: 72, 'Downtime Hours': 3.2, OEE: 86, 'Scrap Rate': 0.46 },
    { Date: '2024-02', 'Production Line': 'Line B', Shift: 'Night', 'Units Produced': 14200, Defects: 85, 'Downtime Hours': 6.5, OEE: 80, 'Scrap Rate': 0.60 },
    { Date: '2024-02', 'Production Line': 'Line C', Shift: 'Day', 'Units Produced': 12800, Defects: 58, 'Downtime Hours': 2.5, OEE: 91, 'Scrap Rate': 0.45 },
    { Date: '2024-03', 'Production Line': 'Line A', Shift: 'Day', 'Units Produced': 19800, Defects: 82, 'Downtime Hours': 3.5, OEE: 90, 'Scrap Rate': 0.41 },
    { Date: '2024-03', 'Production Line': 'Line A', Shift: 'Night', 'Units Produced': 17800, Defects: 92, 'Downtime Hours': 5.0, OEE: 85, 'Scrap Rate': 0.52 },
    { Date: '2024-03', 'Production Line': 'Line B', Shift: 'Day', 'Units Produced': 16200, Defects: 68, 'Downtime Hours': 2.8, OEE: 88, 'Scrap Rate': 0.42 },
    { Date: '2024-03', 'Production Line': 'Line B', Shift: 'Night', 'Units Produced': 14900, Defects: 78, 'Downtime Hours': 5.8, OEE: 82, 'Scrap Rate': 0.52 },
    { Date: '2024-03', 'Production Line': 'Line C', Shift: 'Day', 'Units Produced': 13500, Defects: 52, 'Downtime Hours': 2.2, OEE: 92, 'Scrap Rate': 0.39 },
  ],

  visuals: [
    // Row 1: KPI Cards
    {
      id: nanoid(),
      type: 'kpi-card',
      position: { x: 20, y: 20, width: 280, height: 130 },
      data: { field: 'Units Produced', aggregation: 'SUM', format: 'number', decimals: 0 },
      style: { title: 'Units Produced', showTrend: true },
      conditionalFormatting: [],
    },
    {
      id: nanoid(),
      type: 'kpi-card',
      position: { x: 320, y: 20, width: 280, height: 130 },
      data: { field: 'Defects', aggregation: 'SUM', format: 'number', decimals: 0 },
      style: { title: 'Defects', showTrend: true },
      conditionalFormatting: [],
    },
    {
      id: nanoid(),
      type: 'gauge',
      position: { x: 620, y: 20, width: 280, height: 130 },
      data: { field: 'OEE', minValue: 0, maxValue: 100, aggregation: 'AVG' },
      style: {
        title: 'OEE',
        showValue: true,
        showPercent: true,
        colorRanges: [
          { from: 0, to: 65, color: '#EF4444' },
          { from: 65, to: 85, color: '#F59E0B' },
          { from: 85, to: 100, color: '#52B788' },
        ],
      },
    },
    {
      id: nanoid(),
      type: 'kpi-card',
      position: { x: 920, y: 20, width: 280, height: 130 },
      data: { field: 'Downtime Hours', aggregation: 'SUM', format: 'number', decimals: 1, suffix: ' hrs' },
      style: { title: 'Total Downtime', showTrend: true },
      conditionalFormatting: [],
    },

    // Row 2: Charts
    {
      id: nanoid(),
      type: 'line-chart',
      position: { x: 20, y: 170, width: 580, height: 320 },
      data: {
        xAxis: { field: 'Date', type: 'category' },
        series: [
          { field: 'Units Produced', aggregation: 'SUM', color: '#64748B', label: 'Output' },
          { field: 'Defects', aggregation: 'SUM', color: '#EF4444', label: 'Defects' },
        ],
      },
      style: { title: 'Production Output & Defects', showGrid: true, showLegend: true, legendPosition: 'bottom', curved: true, showDataLabels: false },
    },
    {
      id: nanoid(),
      type: 'bar-chart',
      position: { x: 620, y: 170, width: 580, height: 320 },
      data: {
        category: { field: 'Production Line' },
        values: [
          { field: 'Units Produced', aggregation: 'SUM', color: '#64748B', label: 'Output' },
        ],
      },
      style: { title: 'Output by Production Line', orientation: 'vertical', stacked: false, showGrid: true, showLegend: false, showDataLabels: true },
    },

    // Row 3
    {
      id: nanoid(),
      type: 'matrix',
      position: { x: 20, y: 510, width: 580, height: 280 },
      data: {
        rowFields: ['Production Line'],
        columnFields: ['Shift'],
        valueField: 'OEE',
        aggregation: 'AVG',
      },
      style: {
        title: 'OEE by Line & Shift',
        showRowTotals: true,
        showColumnTotals: true,
        showGrandTotal: true,
        heatmapEnabled: true,
        heatmapColors: { low: '#EF4444', mid: '#F59E0B', high: '#52B788' },
        alternateRowColors: true,
        alternateRowColor: 'rgba(255,255,255,0.02)',
        compact: false,
      },
    },
    {
      id: nanoid(),
      type: 'pie-chart',
      position: { x: 620, y: 510, width: 380, height: 280 },
      data: {
        category: { field: 'Production Line' },
        value: { field: 'Downtime Hours', aggregation: 'SUM' },
      },
      style: {
        title: 'Downtime by Line',
        donut: true,
        innerRadius: 60,
        showLabels: true,
        showPercent: true,
        showLegend: true,
        colors: ['#64748B', '#94A3B8', '#CBD5E1', '#E2E8F0'],
      },
    },
    {
      id: nanoid(),
      type: 'data-table',
      position: { x: 1020, y: 510, width: 480, height: 280 },
      data: {
        columns: [
          { field: 'Production Line', label: 'Line', align: 'left' },
          { field: 'Units Produced', label: 'Output', align: 'right', format: 'number' },
          { field: 'Defects', label: 'Defects', align: 'right', format: 'number' },
          { field: 'OEE', label: 'OEE %', align: 'right', format: 'percent' },
          { field: 'Scrap Rate', label: 'Scrap %', align: 'right', format: 'percent' },
        ],
      },
      style: { title: 'Line Performance', pageSize: 5, showPagination: true, striped: true, compact: false },
    },

    // Slicers
    {
      id: nanoid(),
      type: 'slicer',
      position: { x: 1220, y: 20, width: 180, height: 130 },
      data: { field: 'Production Line' },
      style: { title: 'Line', displayMode: 'dropdown', multiSelect: true, searchable: true, showSelectAll: true },
    },
    {
      id: nanoid(),
      type: 'slicer',
      position: { x: 1420, y: 20, width: 180, height: 130 },
      data: { field: 'Shift' },
      style: { title: 'Shift', displayMode: 'dropdown', multiSelect: true, searchable: true, showSelectAll: true },
    },
  ],
};
