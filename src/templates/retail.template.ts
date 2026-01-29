import { DashboardTemplate } from '../types/template.types';
import { nanoid } from 'nanoid';

export const retailTemplate: DashboardTemplate = {
  id: 'retail-dashboard',
  name: 'Retail Dashboard',
  description: 'Track store performance, foot traffic, sales per sqft, and inventory turnover. Built for retail managers.',
  category: 'sales',
  icon: 'Store',
  color: '#10B981',

  canvasSize: { width: 1920, height: 1080 },

  tags: ['retail', 'stores', 'foot traffic', 'inventory', 'sales', 'locations'],
  difficulty: 'beginner',
  estimatedSetupTime: '5 minutes',

  requiredFields: [
    { name: 'Month', type: 'time', description: 'Reporting period', example: '2024-01', required: true },
    { name: 'Sales', type: 'metric', description: 'Total sales', example: '125000', required: true },
    { name: 'Transactions', type: 'metric', description: 'Number of transactions', example: '2500', required: true },
    { name: 'Foot Traffic', type: 'metric', description: 'Store visitors', example: '8500', required: false },
    { name: 'Store', type: 'dimension', description: 'Store location', example: 'Downtown', required: true },
    { name: 'Region', type: 'dimension', description: 'Geographic region', example: 'West', required: false },
  ],

  sampleData: [
    { Month: '2024-01', Store: 'Downtown', Region: 'West', Sales: 185000, Transactions: 3200, 'Foot Traffic': 12500, 'Avg Basket': 58, 'Conversion Rate': 25.6 },
    { Month: '2024-01', Store: 'Mall Central', Region: 'West', Sales: 142000, Transactions: 2800, 'Foot Traffic': 18000, 'Avg Basket': 51, 'Conversion Rate': 15.6 },
    { Month: '2024-01', Store: 'Suburban', Region: 'East', Sales: 98000, Transactions: 1950, 'Foot Traffic': 6500, 'Avg Basket': 50, 'Conversion Rate': 30.0 },
    { Month: '2024-01', Store: 'Airport', Region: 'South', Sales: 78000, Transactions: 1200, 'Foot Traffic': 22000, 'Avg Basket': 65, 'Conversion Rate': 5.5 },
    { Month: '2024-02', Store: 'Downtown', Region: 'West', Sales: 195000, Transactions: 3400, 'Foot Traffic': 13200, 'Avg Basket': 57, 'Conversion Rate': 25.8 },
    { Month: '2024-02', Store: 'Mall Central', Region: 'West', Sales: 158000, Transactions: 3100, 'Foot Traffic': 19500, 'Avg Basket': 51, 'Conversion Rate': 15.9 },
    { Month: '2024-02', Store: 'Suburban', Region: 'East', Sales: 108000, Transactions: 2100, 'Foot Traffic': 7000, 'Avg Basket': 51, 'Conversion Rate': 30.0 },
    { Month: '2024-02', Store: 'Airport', Region: 'South', Sales: 85000, Transactions: 1350, 'Foot Traffic': 24000, 'Avg Basket': 63, 'Conversion Rate': 5.6 },
    { Month: '2024-03', Store: 'Downtown', Region: 'West', Sales: 210000, Transactions: 3650, 'Foot Traffic': 14000, 'Avg Basket': 58, 'Conversion Rate': 26.1 },
    { Month: '2024-03', Store: 'Mall Central', Region: 'West', Sales: 172000, Transactions: 3350, 'Foot Traffic': 21000, 'Avg Basket': 51, 'Conversion Rate': 16.0 },
    { Month: '2024-03', Store: 'Suburban', Region: 'East', Sales: 118000, Transactions: 2280, 'Foot Traffic': 7500, 'Avg Basket': 52, 'Conversion Rate': 30.4 },
    { Month: '2024-03', Store: 'Airport', Region: 'South', Sales: 92000, Transactions: 1480, 'Foot Traffic': 26000, 'Avg Basket': 62, 'Conversion Rate': 5.7 },
  ],

  visuals: [
    // Row 1: KPI Cards
    {
      id: nanoid(),
      type: 'kpi-card',
      position: { x: 20, y: 20, width: 280, height: 130 },
      data: { field: 'Sales', aggregation: 'SUM', format: 'currency', decimals: 0, prefix: '$' },
      style: { title: 'Total Sales', showTrend: true },
      conditionalFormatting: [],
    },
    {
      id: nanoid(),
      type: 'kpi-card',
      position: { x: 320, y: 20, width: 280, height: 130 },
      data: { field: 'Transactions', aggregation: 'SUM', format: 'number', decimals: 0 },
      style: { title: 'Total Transactions', showTrend: true },
      conditionalFormatting: [],
    },
    {
      id: nanoid(),
      type: 'kpi-card',
      position: { x: 620, y: 20, width: 280, height: 130 },
      data: { field: 'Foot Traffic', aggregation: 'SUM', format: 'number', decimals: 0 },
      style: { title: 'Total Visitors', showTrend: true },
      conditionalFormatting: [],
    },
    {
      id: nanoid(),
      type: 'kpi-card',
      position: { x: 920, y: 20, width: 280, height: 130 },
      data: { field: 'Avg Basket', aggregation: 'AVG', format: 'currency', decimals: 0, prefix: '$' },
      style: { title: 'Avg Basket Size', showTrend: true },
      conditionalFormatting: [],
    },

    // Row 2: Charts
    {
      id: nanoid(),
      type: 'line-chart',
      position: { x: 20, y: 170, width: 580, height: 320 },
      data: {
        xAxis: { field: 'Month', type: 'category' },
        series: [
          { field: 'Sales', aggregation: 'SUM', color: '#10B981', label: 'Sales' },
        ],
      },
      style: { title: 'Monthly Sales Trend', showGrid: true, showLegend: false, legendPosition: 'bottom', curved: true, showDataLabels: false },
    },
    {
      id: nanoid(),
      type: 'bar-chart',
      position: { x: 620, y: 170, width: 580, height: 320 },
      data: {
        category: { field: 'Store' },
        values: [
          { field: 'Sales', aggregation: 'SUM', color: '#10B981', label: 'Sales' },
        ],
      },
      style: { title: 'Sales by Store', orientation: 'horizontal', stacked: false, showGrid: true, showLegend: false, showDataLabels: true },
    },

    // Row 3
    {
      id: nanoid(),
      type: 'gauge',
      position: { x: 20, y: 510, width: 280, height: 280 },
      data: { field: 'Conversion Rate', minValue: 0, maxValue: 50, aggregation: 'AVG' },
      style: {
        title: 'Conversion Rate',
        showValue: true,
        showPercent: true,
        colorRanges: [
          { from: 0, to: 15, color: '#EF4444' },
          { from: 15, to: 25, color: '#F59E0B' },
          { from: 25, to: 50, color: '#10B981' },
        ],
      },
    },
    {
      id: nanoid(),
      type: 'pie-chart',
      position: { x: 320, y: 510, width: 380, height: 280 },
      data: {
        category: { field: 'Region' },
        value: { field: 'Sales', aggregation: 'SUM' },
      },
      style: {
        title: 'Sales by Region',
        donut: true,
        innerRadius: 60,
        showLabels: true,
        showPercent: true,
        showLegend: true,
        colors: ['#10B981', '#3B82F6', '#F59E0B', '#8B5CF6'],
      },
    },
    {
      id: nanoid(),
      type: 'data-table',
      position: { x: 720, y: 510, width: 680, height: 280 },
      data: {
        columns: [
          { field: 'Store', label: 'Store', align: 'left' },
          { field: 'Sales', label: 'Sales', align: 'right', format: 'currency' },
          { field: 'Transactions', label: 'Trans.', align: 'right', format: 'number' },
          { field: 'Foot Traffic', label: 'Traffic', align: 'right', format: 'number' },
          { field: 'Conversion Rate', label: 'Conv. %', align: 'right', format: 'percent' },
        ],
      },
      style: { title: 'Store Details', pageSize: 5, showPagination: true, striped: true, compact: false },
    },

    // Slicers
    {
      id: nanoid(),
      type: 'slicer',
      position: { x: 1220, y: 20, width: 180, height: 130 },
      data: { field: 'Store' },
      style: { title: 'Store', displayMode: 'dropdown', multiSelect: true, searchable: true, showSelectAll: true },
    },
    {
      id: nanoid(),
      type: 'slicer',
      position: { x: 1420, y: 20, width: 180, height: 130 },
      data: { field: 'Region' },
      style: { title: 'Region', displayMode: 'dropdown', multiSelect: true, searchable: true, showSelectAll: true },
    },
  ],
};
