import { DashboardTemplate } from '../types/template.types';
import { nanoid } from 'nanoid';

export const executiveTemplate: DashboardTemplate = {
  id: 'executive-dashboard',
  name: 'Executive Summary',
  description: 'High-level company overview with key metrics across all departments. Perfect for C-suite and board meetings.',
  category: 'executive',
  icon: 'LayoutDashboard',
  color: '#6366F1',

  canvasSize: { width: 1920, height: 1080 },

  tags: ['overview', 'C-suite', 'board', 'summary', 'company-wide'],
  difficulty: 'beginner',
  estimatedSetupTime: '5 minutes',

  requiredFields: [
    { name: 'Month', type: 'time', description: 'Reporting period', example: '2024-01', required: true },
    { name: 'Revenue', type: 'metric', description: 'Total revenue', example: '2500000', required: true },
    { name: 'Profit', type: 'metric', description: 'Net profit', example: '450000', required: true },
    { name: 'Customers', type: 'metric', description: 'Total customers', example: '1250', required: false },
    { name: 'Employees', type: 'metric', description: 'Total headcount', example: '185', required: false },
    { name: 'Department', type: 'dimension', description: 'Business unit', example: 'Product', required: false },
  ],

  sampleData: [
    { Month: '2024-01', Department: 'Product', Revenue: 850000, Profit: 180000, Customers: 420, Employees: 65, NPS: 72 },
    { Month: '2024-01', Department: 'Services', Revenue: 620000, Profit: 140000, Customers: 180, Employees: 45, NPS: 68 },
    { Month: '2024-01', Department: 'Enterprise', Revenue: 1200000, Profit: 320000, Customers: 85, Employees: 75, NPS: 75 },
    { Month: '2024-02', Department: 'Product', Revenue: 920000, Profit: 195000, Customers: 445, Employees: 68, NPS: 74 },
    { Month: '2024-02', Department: 'Services', Revenue: 680000, Profit: 155000, Customers: 195, Employees: 47, NPS: 70 },
    { Month: '2024-02', Department: 'Enterprise', Revenue: 1350000, Profit: 365000, Customers: 92, Employees: 78, NPS: 76 },
    { Month: '2024-03', Department: 'Product', Revenue: 985000, Profit: 210000, Customers: 478, Employees: 70, NPS: 73 },
    { Month: '2024-03', Department: 'Services', Revenue: 745000, Profit: 170000, Customers: 210, Employees: 48, NPS: 71 },
    { Month: '2024-03', Department: 'Enterprise', Revenue: 1480000, Profit: 402000, Customers: 98, Employees: 82, NPS: 78 },
  ],

  visuals: [
    // Big KPIs
    {
      id: nanoid(),
      type: 'kpi-card',
      position: { x: 20, y: 20, width: 350, height: 150 },
      data: { field: 'Revenue', aggregation: 'SUM', format: 'currency', decimals: 0, prefix: '$' },
      style: { title: 'Total Revenue', showTrend: true },
      conditionalFormatting: [],
    },
    {
      id: nanoid(),
      type: 'kpi-card',
      position: { x: 390, y: 20, width: 350, height: 150 },
      data: { field: 'Profit', aggregation: 'SUM', format: 'currency', decimals: 0, prefix: '$' },
      style: { title: 'Net Profit', showTrend: true },
      conditionalFormatting: [],
    },
    {
      id: nanoid(),
      type: 'kpi-card',
      position: { x: 760, y: 20, width: 350, height: 150 },
      data: { field: 'Customers', aggregation: 'SUM', format: 'number', decimals: 0 },
      style: { title: 'Total Customers', showTrend: true },
      conditionalFormatting: [],
    },
    {
      id: nanoid(),
      type: 'gauge',
      position: { x: 1130, y: 20, width: 270, height: 150 },
      data: { field: 'NPS', minValue: 0, maxValue: 100, aggregation: 'AVG' },
      style: {
        title: 'NPS Score',
        showValue: true,
        showPercent: false,
        colorRanges: [
          { from: 0, to: 50, color: '#EF4444' },
          { from: 50, to: 70, color: '#F59E0B' },
          { from: 70, to: 100, color: '#52B788' },
        ],
      },
    },

    // Charts
    {
      id: nanoid(),
      type: 'line-chart',
      position: { x: 20, y: 190, width: 720, height: 340 },
      data: {
        xAxis: { field: 'Month', type: 'category' },
        series: [
          { field: 'Revenue', aggregation: 'SUM', color: '#6366F1', label: 'Revenue' },
          { field: 'Profit', aggregation: 'SUM', color: '#52B788', label: 'Profit' },
        ],
      },
      style: { title: 'Revenue & Profit Trend', showGrid: true, showLegend: true, legendPosition: 'bottom', curved: true, showDataLabels: false },
    },
    {
      id: nanoid(),
      type: 'bar-chart',
      position: { x: 760, y: 190, width: 640, height: 340 },
      data: {
        category: { field: 'Department' },
        values: [{ field: 'Revenue', aggregation: 'SUM', color: '#6366F1', label: 'Revenue' }],
      },
      style: { title: 'Revenue by Department', orientation: 'horizontal', stacked: false, showGrid: true, showLegend: false, showDataLabels: true },
    },

    // Bottom row
    {
      id: nanoid(),
      type: 'treemap',
      position: { x: 20, y: 550, width: 450, height: 280 },
      data: { categoryField: 'Department', valueField: 'Profit' },
      style: {
        title: 'Profit Distribution',
        showLabels: true,
        showValues: true,
        labelPosition: 'center',
        valueFormat: 'currency',
        colorPalette: ['#6366F1', '#8B5CF6', '#A78BFA', '#C4B5FD'],
      },
    },
    {
      id: nanoid(),
      type: 'matrix',
      position: { x: 490, y: 550, width: 710, height: 280 },
      data: {
        rowFields: ['Department'],
        columnFields: ['Month'],
        valueField: 'Revenue',
        aggregation: 'SUM',
      },
      style: {
        title: 'Department Performance Matrix',
        showRowTotals: true,
        showColumnTotals: true,
        showGrandTotal: true,
        heatmapEnabled: true,
        heatmapColors: { low: '#6366F1', mid: '#A78BFA', high: '#52B788' },
        alternateRowColors: true,
        alternateRowColor: 'rgba(255,255,255,0.02)',
        compact: false,
      },
    },
    {
      id: nanoid(),
      type: 'pie-chart',
      position: { x: 1220, y: 550, width: 280, height: 280 },
      data: {
        category: { field: 'Department' },
        value: { field: 'Customers', aggregation: 'SUM' },
      },
      style: {
        title: 'Customers',
        donut: true,
        innerRadius: 50,
        showLabels: false,
        showPercent: true,
        showLegend: true,
        colors: ['#6366F1', '#EC4899', '#52B788'],
      },
    },
  ],
};
