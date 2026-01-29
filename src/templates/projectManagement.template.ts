import { DashboardTemplate } from '../types/template.types';
import { nanoid } from 'nanoid';

export const projectManagementTemplate: DashboardTemplate = {
  id: 'project-management-dashboard',
  name: 'Project Management Dashboard',
  description: 'Track project progress, milestones, budget, resources, and tasks. Perfect for PMOs and project managers.',
  category: 'operations',
  icon: 'FolderKanban',
  color: '#8B5CF6',

  canvasSize: { width: 1920, height: 1080 },

  tags: ['projects', 'tasks', 'milestones', 'budget', 'resources', 'PMO'],
  difficulty: 'intermediate',
  estimatedSetupTime: '7 minutes',

  requiredFields: [
    { name: 'Month', type: 'time', description: 'Reporting period', example: '2024-01', required: true },
    { name: 'Tasks Completed', type: 'metric', description: 'Completed tasks', example: '45', required: true },
    { name: 'Tasks Total', type: 'metric', description: 'Total tasks', example: '120', required: true },
    { name: 'Budget Spent', type: 'metric', description: 'Actual spend', example: '85000', required: true },
    { name: 'Budget Planned', type: 'metric', description: 'Planned budget', example: '100000', required: true },
    { name: 'Project', type: 'dimension', description: 'Project name', example: 'Project Alpha', required: true },
    { name: 'Status', type: 'dimension', description: 'Project status', example: 'On Track', required: true },
    { name: 'Team', type: 'dimension', description: 'Team name', example: 'Engineering', required: false },
  ],

  sampleData: [
    { Month: '2024-01', Project: 'Website Redesign', Status: 'On Track', Team: 'Design', 'Tasks Completed': 28, 'Tasks Total': 45, 'Budget Spent': 32000, 'Budget Planned': 35000, 'Resources': 5 },
    { Month: '2024-01', Project: 'Mobile App v2', Status: 'At Risk', Team: 'Engineering', 'Tasks Completed': 15, 'Tasks Total': 60, 'Budget Spent': 48000, 'Budget Planned': 45000, 'Resources': 8 },
    { Month: '2024-01', Project: 'CRM Integration', Status: 'On Track', Team: 'Engineering', 'Tasks Completed': 22, 'Tasks Total': 35, 'Budget Spent': 18000, 'Budget Planned': 20000, 'Resources': 4 },
    { Month: '2024-01', Project: 'Data Migration', Status: 'Delayed', Team: 'Data', 'Tasks Completed': 8, 'Tasks Total': 40, 'Budget Spent': 25000, 'Budget Planned': 22000, 'Resources': 3 },
    { Month: '2024-02', Project: 'Website Redesign', Status: 'On Track', Team: 'Design', 'Tasks Completed': 38, 'Tasks Total': 45, 'Budget Spent': 42000, 'Budget Planned': 45000, 'Resources': 5 },
    { Month: '2024-02', Project: 'Mobile App v2', Status: 'On Track', Team: 'Engineering', 'Tasks Completed': 32, 'Tasks Total': 60, 'Budget Spent': 65000, 'Budget Planned': 68000, 'Resources': 8 },
    { Month: '2024-02', Project: 'CRM Integration', Status: 'Complete', Team: 'Engineering', 'Tasks Completed': 35, 'Tasks Total': 35, 'Budget Spent': 28000, 'Budget Planned': 30000, 'Resources': 4 },
    { Month: '2024-02', Project: 'Data Migration', Status: 'At Risk', Team: 'Data', 'Tasks Completed': 18, 'Tasks Total': 40, 'Budget Spent': 38000, 'Budget Planned': 35000, 'Resources': 4 },
    { Month: '2024-03', Project: 'Website Redesign', Status: 'Complete', Team: 'Design', 'Tasks Completed': 45, 'Tasks Total': 45, 'Budget Spent': 52000, 'Budget Planned': 55000, 'Resources': 5 },
    { Month: '2024-03', Project: 'Mobile App v2', Status: 'On Track', Team: 'Engineering', 'Tasks Completed': 48, 'Tasks Total': 60, 'Budget Spent': 82000, 'Budget Planned': 85000, 'Resources': 7 },
    { Month: '2024-03', Project: 'Data Migration', Status: 'On Track', Team: 'Data', 'Tasks Completed': 32, 'Tasks Total': 40, 'Budget Spent': 48000, 'Budget Planned': 50000, 'Resources': 4 },
  ],

  visuals: [
    // Row 1: KPI Cards
    {
      id: nanoid(),
      type: 'kpi-card',
      position: { x: 20, y: 20, width: 280, height: 130 },
      data: { field: 'Project', aggregation: 'COUNT', format: 'number', decimals: 0 },
      style: { title: 'Active Projects', showTrend: false },
      conditionalFormatting: [],
    },
    {
      id: nanoid(),
      type: 'kpi-card',
      position: { x: 320, y: 20, width: 280, height: 130 },
      data: { field: 'Tasks Completed', aggregation: 'SUM', format: 'number', decimals: 0 },
      style: { title: 'Tasks Completed', showTrend: true },
      conditionalFormatting: [],
    },
    {
      id: nanoid(),
      type: 'kpi-card',
      position: { x: 620, y: 20, width: 280, height: 130 },
      data: { field: 'Budget Spent', aggregation: 'SUM', format: 'currency', decimals: 0, prefix: '$' },
      style: { title: 'Budget Spent', showTrend: true },
      conditionalFormatting: [],
    },
    {
      id: nanoid(),
      type: 'gauge',
      position: { x: 920, y: 20, width: 280, height: 130 },
      data: { field: 'Tasks Completed', minValue: 0, maxValue: 100, aggregation: 'AVG' },
      style: {
        title: 'Overall Progress',
        showValue: true,
        showPercent: true,
        colorRanges: [
          { from: 0, to: 50, color: '#EF4444' },
          { from: 50, to: 80, color: '#F59E0B' },
          { from: 80, to: 100, color: '#52B788' },
        ],
      },
    },

    // Row 2: Charts
    {
      id: nanoid(),
      type: 'bar-chart',
      position: { x: 20, y: 170, width: 580, height: 320 },
      data: {
        category: { field: 'Project' },
        values: [
          { field: 'Tasks Completed', aggregation: 'SUM', color: '#8B5CF6', label: 'Completed' },
          { field: 'Tasks Total', aggregation: 'SUM', color: '#E2E8F0', label: 'Total' },
        ],
      },
      style: { title: 'Project Task Progress', orientation: 'horizontal', stacked: false, showGrid: true, showLegend: true, showDataLabels: false },
    },
    {
      id: nanoid(),
      type: 'line-chart',
      position: { x: 620, y: 170, width: 580, height: 320 },
      data: {
        xAxis: { field: 'Month', type: 'category' },
        series: [
          { field: 'Budget Spent', aggregation: 'SUM', color: '#8B5CF6', label: 'Actual' },
          { field: 'Budget Planned', aggregation: 'SUM', color: '#94A3B8', label: 'Planned' },
        ],
      },
      style: { title: 'Budget: Actual vs Planned', showGrid: true, showLegend: true, legendPosition: 'bottom', curved: true, showDataLabels: false },
    },

    // Row 3
    {
      id: nanoid(),
      type: 'pie-chart',
      position: { x: 20, y: 510, width: 380, height: 280 },
      data: {
        category: { field: 'Status' },
        value: { field: 'Project', aggregation: 'COUNT' },
      },
      style: {
        title: 'Projects by Status',
        donut: true,
        innerRadius: 60,
        showLabels: true,
        showPercent: true,
        showLegend: true,
        colors: ['#52B788', '#F59E0B', '#EF4444', '#3B82F6'],
      },
    },
    {
      id: nanoid(),
      type: 'treemap',
      position: { x: 420, y: 510, width: 380, height: 280 },
      data: { categoryField: 'Project', valueField: 'Budget Planned' },
      style: {
        title: 'Budget Allocation',
        showLabels: true,
        showValues: true,
        labelPosition: 'center',
        valueFormat: 'currency',
        colorPalette: ['#8B5CF6', '#A78BFA', '#C4B5FD', '#DDD6FE'],
      },
    },
    {
      id: nanoid(),
      type: 'data-table',
      position: { x: 820, y: 510, width: 580, height: 280 },
      data: {
        columns: [
          { field: 'Project', label: 'Project', align: 'left' },
          { field: 'Status', label: 'Status', align: 'left' },
          { field: 'Tasks Completed', label: 'Done', align: 'right', format: 'number' },
          { field: 'Tasks Total', label: 'Total', align: 'right', format: 'number' },
          { field: 'Budget Spent', label: 'Spent', align: 'right', format: 'currency' },
        ],
      },
      style: { title: 'Project Details', pageSize: 5, showPagination: true, striped: true, compact: false },
    },

    // Slicers
    {
      id: nanoid(),
      type: 'slicer',
      position: { x: 1220, y: 20, width: 180, height: 130 },
      data: { field: 'Status' },
      style: { title: 'Status', displayMode: 'dropdown', multiSelect: true, searchable: true, showSelectAll: true },
    },
    {
      id: nanoid(),
      type: 'slicer',
      position: { x: 1420, y: 20, width: 180, height: 130 },
      data: { field: 'Team' },
      style: { title: 'Team', displayMode: 'dropdown', multiSelect: true, searchable: true, showSelectAll: true },
    },
  ],
};
