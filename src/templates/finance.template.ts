import { DashboardTemplate } from '../types/template.types';
import { nanoid } from 'nanoid';

export const financeTemplate: DashboardTemplate = {
  id: 'finance-dashboard',
  name: 'Finance Dashboard',
  description: 'Monitor P&L, cash flow, budget vs actual, and key financial metrics. Essential for CFOs and finance teams.',
  category: 'finance',
  icon: 'DollarSign',
  color: '#3B82F6',

  canvasSize: { width: 1920, height: 1080 },

  tags: ['P&L', 'budget', 'cash flow', 'expenses', 'profit'],
  difficulty: 'intermediate',
  estimatedSetupTime: '7 minutes',

  requiredFields: [
    { name: 'Month', type: 'time', description: 'Accounting period', example: '2024-01', required: true },
    { name: 'Revenue', type: 'metric', description: 'Total revenue', example: '500000', required: true },
    { name: 'Expenses', type: 'metric', description: 'Total expenses', example: '350000', required: true },
    { name: 'Budget', type: 'metric', description: 'Budgeted amount', example: '480000', required: false },
    { name: 'Category', type: 'dimension', description: 'Expense/revenue category', example: 'Operating', required: true },
    { name: 'Department', type: 'dimension', description: 'Department name', example: 'Engineering', required: false },
  ],

  sampleData: [
    { Month: '2024-01', Category: 'Revenue', Department: 'Sales', Revenue: 520000, Expenses: 0, Budget: 500000 },
    { Month: '2024-01', Category: 'COGS', Department: 'Operations', Revenue: 0, Expenses: 180000, Budget: 175000 },
    { Month: '2024-01', Category: 'Operating', Department: 'Engineering', Revenue: 0, Expenses: 120000, Budget: 125000 },
    { Month: '2024-01', Category: 'Operating', Department: 'Marketing', Revenue: 0, Expenses: 45000, Budget: 50000 },
    { Month: '2024-01', Category: 'Operating', Department: 'G&A', Revenue: 0, Expenses: 35000, Budget: 35000 },
    { Month: '2024-02', Category: 'Revenue', Department: 'Sales', Revenue: 548000, Expenses: 0, Budget: 520000 },
    { Month: '2024-02', Category: 'COGS', Department: 'Operations', Revenue: 0, Expenses: 188000, Budget: 180000 },
    { Month: '2024-02', Category: 'Operating', Department: 'Engineering', Revenue: 0, Expenses: 125000, Budget: 125000 },
    { Month: '2024-02', Category: 'Operating', Department: 'Marketing', Revenue: 0, Expenses: 52000, Budget: 50000 },
    { Month: '2024-02', Category: 'Operating', Department: 'G&A', Revenue: 0, Expenses: 36000, Budget: 35000 },
    { Month: '2024-03', Category: 'Revenue', Department: 'Sales', Revenue: 575000, Expenses: 0, Budget: 540000 },
    { Month: '2024-03', Category: 'COGS', Department: 'Operations', Revenue: 0, Expenses: 195000, Budget: 185000 },
    { Month: '2024-03', Category: 'Operating', Department: 'Engineering', Revenue: 0, Expenses: 128000, Budget: 130000 },
    { Month: '2024-03', Category: 'Operating', Department: 'Marketing', Revenue: 0, Expenses: 48000, Budget: 55000 },
    { Month: '2024-03', Category: 'Operating', Department: 'G&A', Revenue: 0, Expenses: 38000, Budget: 36000 },
  ],

  visuals: [
    // Row 1: KPI Cards
    {
      id: nanoid(),
      type: 'kpi-card',
      position: { x: 20, y: 20, width: 280, height: 130 },
      data: {
        field: 'Revenue',
        aggregation: 'SUM',
        format: 'currency',
        decimals: 0,
        prefix: '$',
      },
      style: { title: 'Total Revenue', showTrend: true },
      conditionalFormatting: [],
    },
    {
      id: nanoid(),
      type: 'kpi-card',
      position: { x: 320, y: 20, width: 280, height: 130 },
      data: {
        field: 'Expenses',
        aggregation: 'SUM',
        format: 'currency',
        decimals: 0,
        prefix: '$',
      },
      style: { title: 'Total Expenses', showTrend: true },
      conditionalFormatting: [],
    },
    {
      id: nanoid(),
      type: 'kpi-card',
      position: { x: 620, y: 20, width: 280, height: 130 },
      data: {
        field: 'Budget',
        aggregation: 'SUM',
        format: 'currency',
        decimals: 0,
        prefix: '$',
      },
      style: { title: 'Total Budget', showTrend: false },
      conditionalFormatting: [],
    },
    {
      id: nanoid(),
      type: 'gauge',
      position: { x: 920, y: 20, width: 280, height: 130 },
      data: {
        field: 'Expenses',
        minValue: 0,
        maxValue: 500000,
        aggregation: 'SUM',
      },
      style: {
        title: 'Budget Utilization',
        showValue: true,
        showPercent: true,
        colorRanges: [
          { from: 0, to: 80, color: '#52B788' },
          { from: 80, to: 95, color: '#F59E0B' },
          { from: 95, to: 100, color: '#EF4444' },
        ],
      },
    },

    // Row 2: Charts
    {
      id: nanoid(),
      type: 'line-chart',
      position: { x: 20, y: 170, width: 600, height: 320 },
      data: {
        xAxis: { field: 'Month', type: 'category' },
        series: [
          { field: 'Revenue', aggregation: 'SUM', color: '#52B788', label: 'Revenue' },
          { field: 'Expenses', aggregation: 'SUM', color: '#EF4444', label: 'Expenses' },
        ],
      },
      style: {
        title: 'Revenue & Expenses Trend',
        showGrid: true,
        showLegend: true,
        legendPosition: 'bottom',
        curved: true,
        showDataLabels: false,
      },
    },
    {
      id: nanoid(),
      type: 'bar-chart',
      position: { x: 640, y: 170, width: 560, height: 320 },
      data: {
        category: { field: 'Department' },
        values: [
          { field: 'Expenses', aggregation: 'SUM', color: '#3B82F6', label: 'Actual' },
          { field: 'Budget', aggregation: 'SUM', color: '#94A3B8', label: 'Budget' },
        ],
      },
      style: {
        title: 'Budget vs Actual',
        orientation: 'vertical',
        stacked: false,
        showGrid: true,
        showLegend: true,
        showDataLabels: false,
      },
    },

    // Row 3
    {
      id: nanoid(),
      type: 'treemap',
      position: { x: 20, y: 510, width: 480, height: 280 },
      data: {
        categoryField: 'Category',
        valueField: 'Expenses',
      },
      style: {
        title: 'Expenses Breakdown',
        showLabels: true,
        showValues: true,
        labelPosition: 'center',
        valueFormat: 'currency',
        colorPalette: ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B'],
      },
    },
    {
      id: nanoid(),
      type: 'matrix',
      position: { x: 520, y: 510, width: 680, height: 280 },
      data: {
        rowFields: ['Department'],
        columnFields: ['Month'],
        valueField: 'Expenses',
        aggregation: 'SUM',
      },
      style: {
        title: 'P&L by Department & Month',
        showRowTotals: true,
        showColumnTotals: true,
        showGrandTotal: true,
        heatmapEnabled: true,
        heatmapColors: { low: '#52B788', mid: '#F59E0B', high: '#EF4444' },
        alternateRowColors: true,
        alternateRowColor: 'rgba(255,255,255,0.02)',
        compact: false,
      },
    },

    // Slicers
    {
      id: nanoid(),
      type: 'slicer',
      position: { x: 1220, y: 20, width: 180, height: 130 },
      data: { field: 'Department' },
      style: {
        title: 'Department',
        displayMode: 'dropdown',
        multiSelect: true,
        searchable: true,
        showSelectAll: true,
      },
    },
    {
      id: nanoid(),
      type: 'slicer',
      position: { x: 1420, y: 20, width: 180, height: 130 },
      data: { field: 'Category' },
      style: {
        title: 'Category',
        displayMode: 'dropdown',
        multiSelect: true,
        searchable: true,
        showSelectAll: true,
      },
    },
  ],
};
