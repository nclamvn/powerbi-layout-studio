import { DashboardTemplate } from '../types/template.types';
import { nanoid } from 'nanoid';

export const hrTemplate: DashboardTemplate = {
  id: 'hr-dashboard',
  name: 'HR Dashboard',
  description: 'Track headcount, turnover, hiring pipeline, and employee engagement. Built for HR managers and executives.',
  category: 'hr',
  icon: 'Users',
  color: '#8B5CF6',

  canvasSize: { width: 1920, height: 1080 },

  tags: ['headcount', 'turnover', 'hiring', 'engagement', 'retention'],
  difficulty: 'beginner',
  estimatedSetupTime: '5 minutes',

  requiredFields: [
    { name: 'Month', type: 'time', description: 'Reporting period', example: '2024-01', required: true },
    { name: 'Headcount', type: 'metric', description: 'Total employees', example: '245', required: true },
    { name: 'New Hires', type: 'metric', description: 'New employees', example: '12', required: true },
    { name: 'Terminations', type: 'metric', description: 'Employees left', example: '5', required: true },
    { name: 'Department', type: 'dimension', description: 'Department name', example: 'Engineering', required: true },
    { name: 'Location', type: 'dimension', description: 'Office location', example: 'New York', required: false },
  ],

  sampleData: [
    { Month: '2024-01', Department: 'Engineering', Location: 'New York', Headcount: 85, 'New Hires': 5, Terminations: 2, 'Engagement Score': 4.2 },
    { Month: '2024-01', Department: 'Sales', Location: 'San Francisco', Headcount: 45, 'New Hires': 3, Terminations: 1, 'Engagement Score': 4.0 },
    { Month: '2024-01', Department: 'Marketing', Location: 'New York', Headcount: 25, 'New Hires': 2, Terminations: 0, 'Engagement Score': 4.3 },
    { Month: '2024-01', Department: 'Operations', Location: 'Austin', Headcount: 35, 'New Hires': 1, Terminations: 2, 'Engagement Score': 3.9 },
    { Month: '2024-01', Department: 'HR', Location: 'New York', Headcount: 12, 'New Hires': 1, Terminations: 0, 'Engagement Score': 4.5 },
    { Month: '2024-02', Department: 'Engineering', Location: 'New York', Headcount: 88, 'New Hires': 4, Terminations: 1, 'Engagement Score': 4.3 },
    { Month: '2024-02', Department: 'Sales', Location: 'San Francisco', Headcount: 47, 'New Hires': 4, Terminations: 2, 'Engagement Score': 4.1 },
    { Month: '2024-02', Department: 'Marketing', Location: 'New York', Headcount: 27, 'New Hires': 3, Terminations: 1, 'Engagement Score': 4.2 },
    { Month: '2024-02', Department: 'Operations', Location: 'Austin', Headcount: 34, 'New Hires': 0, Terminations: 1, 'Engagement Score': 4.0 },
    { Month: '2024-02', Department: 'HR', Location: 'New York', Headcount: 13, 'New Hires': 1, Terminations: 0, 'Engagement Score': 4.6 },
    { Month: '2024-03', Department: 'Engineering', Location: 'New York', Headcount: 91, 'New Hires': 5, Terminations: 2, 'Engagement Score': 4.2 },
    { Month: '2024-03', Department: 'Sales', Location: 'San Francisco', Headcount: 49, 'New Hires': 3, Terminations: 1, 'Engagement Score': 4.2 },
    { Month: '2024-03', Department: 'Marketing', Location: 'New York', Headcount: 29, 'New Hires': 2, Terminations: 0, 'Engagement Score': 4.4 },
    { Month: '2024-03', Department: 'Operations', Location: 'Austin', Headcount: 35, 'New Hires': 2, Terminations: 1, 'Engagement Score': 4.1 },
    { Month: '2024-03', Department: 'HR', Location: 'New York', Headcount: 14, 'New Hires': 1, Terminations: 0, 'Engagement Score': 4.5 },
  ],

  visuals: [
    // Row 1: KPI Cards
    {
      id: nanoid(),
      type: 'kpi-card',
      position: { x: 20, y: 20, width: 280, height: 130 },
      data: {
        field: 'Headcount',
        aggregation: 'SUM',
        format: 'number',
        decimals: 0,
      },
      style: { title: 'Total Headcount', showTrend: true },
      conditionalFormatting: [],
    },
    {
      id: nanoid(),
      type: 'kpi-card',
      position: { x: 320, y: 20, width: 280, height: 130 },
      data: {
        field: 'New Hires',
        aggregation: 'SUM',
        format: 'number',
        decimals: 0,
      },
      style: { title: 'New Hires (YTD)', showTrend: true },
      conditionalFormatting: [],
    },
    {
      id: nanoid(),
      type: 'kpi-card',
      position: { x: 620, y: 20, width: 280, height: 130 },
      data: {
        field: 'Terminations',
        aggregation: 'SUM',
        format: 'number',
        decimals: 0,
      },
      style: { title: 'Terminations (YTD)', showTrend: true },
      conditionalFormatting: [],
    },
    {
      id: nanoid(),
      type: 'kpi-card',
      position: { x: 920, y: 20, width: 280, height: 130 },
      data: {
        field: 'Engagement Score',
        aggregation: 'AVG',
        format: 'number',
        decimals: 1,
        suffix: '/5.0',
      },
      style: { title: 'Engagement Score', showTrend: true },
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
          { field: 'Headcount', aggregation: 'SUM', color: '#8B5CF6', label: 'Headcount' },
        ],
      },
      style: {
        title: 'Headcount Trend',
        showGrid: true,
        showLegend: false,
        legendPosition: 'bottom',
        curved: true,
        showDataLabels: true,
      },
    },
    {
      id: nanoid(),
      type: 'bar-chart',
      position: { x: 620, y: 170, width: 580, height: 320 },
      data: {
        category: { field: 'Department' },
        values: [
          { field: 'Headcount', aggregation: 'SUM', color: '#8B5CF6', label: 'Headcount' },
        ],
      },
      style: {
        title: 'Headcount by Department',
        orientation: 'horizontal',
        stacked: false,
        showGrid: true,
        showLegend: false,
        showDataLabels: true,
      },
    },

    // Row 3
    {
      id: nanoid(),
      type: 'funnel',
      position: { x: 20, y: 510, width: 380, height: 280 },
      data: {
        stageField: 'Department',
        valueField: 'New Hires',
      },
      style: {
        title: 'Hiring Pipeline',
        showLabels: true,
        showPercent: true,
        showConversion: true,
      },
    },
    {
      id: nanoid(),
      type: 'pie-chart',
      position: { x: 420, y: 510, width: 380, height: 280 },
      data: {
        category: { field: 'Location' },
        value: { field: 'Headcount', aggregation: 'SUM' },
      },
      style: {
        title: 'Headcount by Location',
        donut: true,
        innerRadius: 60,
        showLabels: true,
        showPercent: true,
        showLegend: true,
        colors: ['#8B5CF6', '#3B82F6', '#52B788', '#F59E0B'],
      },
    },
    {
      id: nanoid(),
      type: 'data-table',
      position: { x: 820, y: 510, width: 580, height: 280 },
      data: {
        columns: [
          { field: 'Department', label: 'Department', align: 'left' },
          { field: 'Headcount', label: 'Headcount', align: 'right', format: 'number' },
          { field: 'New Hires', label: 'Hired', align: 'right', format: 'number' },
          { field: 'Terminations', label: 'Left', align: 'right', format: 'number' },
          { field: 'Engagement Score', label: 'Engagement', align: 'right', format: 'number' },
        ],
      },
      style: {
        title: 'Department Summary',
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
      data: { field: 'Location' },
      style: {
        title: 'Location',
        displayMode: 'dropdown',
        multiSelect: true,
        searchable: true,
        showSelectAll: true,
      },
    },
  ],
};
