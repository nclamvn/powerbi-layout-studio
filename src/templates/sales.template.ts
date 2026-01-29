import { DashboardTemplate } from '../types/template.types';
import { nanoid } from 'nanoid';

export const salesTemplate: DashboardTemplate = {
  id: 'sales-dashboard',
  name: 'Sales Dashboard',
  description: 'Track revenue, pipeline, win rates, and sales team performance. Perfect for sales managers and executives.',
  category: 'sales',
  icon: 'TrendingUp',
  color: '#52B788',

  canvasSize: { width: 1920, height: 1080 },

  tags: ['revenue', 'pipeline', 'quota', 'sales team', 'deals'],
  difficulty: 'beginner',
  estimatedSetupTime: '5 minutes',

  requiredFields: [
    { name: 'Date', type: 'time', description: 'Transaction or period date', example: '2024-01-15', required: true },
    { name: 'Revenue', type: 'metric', description: 'Sales revenue amount', example: '125000', required: true },
    { name: 'Target', type: 'metric', description: 'Sales target/quota', example: '120000', required: false },
    { name: 'Deals', type: 'metric', description: 'Number of deals closed', example: '45', required: false },
    { name: 'Region', type: 'dimension', description: 'Sales region or territory', example: 'North', required: true },
    { name: 'Product', type: 'dimension', description: 'Product or service name', example: 'Enterprise Plan', required: false },
    { name: 'Sales Rep', type: 'dimension', description: 'Salesperson name', example: 'John Smith', required: false },
  ],

  sampleData: [
    { Date: '2024-01', Region: 'North', Product: 'Enterprise', 'Sales Rep': 'Alice', Revenue: 125000, Target: 120000, Deals: 12 },
    { Date: '2024-01', Region: 'South', Product: 'Professional', 'Sales Rep': 'Bob', Revenue: 98000, Target: 100000, Deals: 18 },
    { Date: '2024-01', Region: 'East', Product: 'Enterprise', 'Sales Rep': 'Carol', Revenue: 145000, Target: 130000, Deals: 10 },
    { Date: '2024-01', Region: 'West', Product: 'Starter', 'Sales Rep': 'Dave', Revenue: 72000, Target: 80000, Deals: 25 },
    { Date: '2024-02', Region: 'North', Product: 'Enterprise', 'Sales Rep': 'Alice', Revenue: 138000, Target: 125000, Deals: 14 },
    { Date: '2024-02', Region: 'South', Product: 'Professional', 'Sales Rep': 'Bob', Revenue: 112000, Target: 105000, Deals: 20 },
    { Date: '2024-02', Region: 'East', Product: 'Enterprise', 'Sales Rep': 'Carol', Revenue: 156000, Target: 140000, Deals: 11 },
    { Date: '2024-02', Region: 'West', Product: 'Starter', 'Sales Rep': 'Dave', Revenue: 85000, Target: 85000, Deals: 28 },
    { Date: '2024-03', Region: 'North', Product: 'Professional', 'Sales Rep': 'Alice', Revenue: 152000, Target: 130000, Deals: 16 },
    { Date: '2024-03', Region: 'South', Product: 'Enterprise', 'Sales Rep': 'Bob', Revenue: 128000, Target: 115000, Deals: 15 },
    { Date: '2024-03', Region: 'East', Product: 'Professional', 'Sales Rep': 'Carol', Revenue: 168000, Target: 150000, Deals: 13 },
    { Date: '2024-03', Region: 'West', Product: 'Enterprise', 'Sales Rep': 'Dave', Revenue: 95000, Target: 90000, Deals: 22 },
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
      style: {
        title: 'Total Revenue',
        showTrend: true,
      },
      conditionalFormatting: [],
    },
    {
      id: nanoid(),
      type: 'kpi-card',
      position: { x: 320, y: 20, width: 280, height: 130 },
      data: {
        field: 'Target',
        aggregation: 'SUM',
        format: 'currency',
        decimals: 0,
        prefix: '$',
      },
      style: {
        title: 'Target',
        showTrend: false,
      },
      conditionalFormatting: [],
    },
    {
      id: nanoid(),
      type: 'kpi-card',
      position: { x: 620, y: 20, width: 280, height: 130 },
      data: {
        field: 'Deals',
        aggregation: 'SUM',
        format: 'number',
        decimals: 0,
      },
      style: {
        title: 'Total Deals',
        showTrend: true,
      },
      conditionalFormatting: [],
    },
    {
      id: nanoid(),
      type: 'kpi-card',
      position: { x: 920, y: 20, width: 280, height: 130 },
      data: {
        field: 'Revenue',
        aggregation: 'AVG',
        format: 'currency',
        decimals: 0,
        prefix: '$',
      },
      style: {
        title: 'Avg Deal Size',
        showTrend: true,
      },
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
          { field: 'Revenue', aggregation: 'SUM', color: '#52B788', label: 'Revenue' },
          { field: 'Target', aggregation: 'SUM', color: '#3B82F6', label: 'Target' },
        ],
      },
      style: {
        title: 'Revenue vs Target Trend',
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
      position: { x: 620, y: 170, width: 580, height: 320 },
      data: {
        category: { field: 'Region' },
        values: [
          { field: 'Revenue', aggregation: 'SUM', color: '#52B788', label: 'Revenue' },
        ],
      },
      style: {
        title: 'Revenue by Region',
        orientation: 'vertical',
        stacked: false,
        showGrid: true,
        showLegend: false,
        showDataLabels: true,
      },
    },

    // Row 3: More visuals
    {
      id: nanoid(),
      type: 'pie-chart',
      position: { x: 20, y: 510, width: 380, height: 300 },
      data: {
        category: { field: 'Product' },
        value: { field: 'Revenue', aggregation: 'SUM' },
      },
      style: {
        title: 'Revenue by Product',
        donut: true,
        innerRadius: 60,
        showLabels: true,
        showPercent: true,
        showLegend: true,
        colors: ['#52B788', '#3B82F6', '#F59E0B', '#EF4444'],
      },
    },
    {
      id: nanoid(),
      type: 'data-table',
      position: { x: 420, y: 510, width: 580, height: 300 },
      data: {
        columns: [
          { field: 'Sales Rep', label: 'Sales Rep', align: 'left' },
          { field: 'Revenue', label: 'Revenue', align: 'right', format: 'currency' },
          { field: 'Deals', label: 'Deals', align: 'right', format: 'number' },
          { field: 'Region', label: 'Region', align: 'left' },
        ],
      },
      style: {
        title: 'Sales Rep Performance',
        pageSize: 5,
        showPagination: true,
        striped: true,
        compact: false,
      },
    },

    // Slicers
    {
      id: nanoid(),
      type: 'slicer',
      position: { x: 1220, y: 20, width: 180, height: 130 },
      data: { field: 'Region' },
      style: {
        title: 'Region',
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
      data: { field: 'Product' },
      style: {
        title: 'Product',
        displayMode: 'dropdown',
        multiSelect: true,
        searchable: true,
        showSelectAll: true,
      },
    },
  ],
};
