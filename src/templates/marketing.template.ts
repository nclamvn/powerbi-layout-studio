import { DashboardTemplate } from '../types/template.types';
import { nanoid } from 'nanoid';

export const marketingTemplate: DashboardTemplate = {
  id: 'marketing-dashboard',
  name: 'Marketing Dashboard',
  description: 'Track leads, conversions, campaign performance, and marketing ROI. Essential for marketing teams.',
  category: 'marketing',
  icon: 'Megaphone',
  color: '#EC4899',

  canvasSize: { width: 1920, height: 1080 },

  tags: ['leads', 'conversions', 'campaigns', 'ROI', 'funnel'],
  difficulty: 'beginner',
  estimatedSetupTime: '5 minutes',

  requiredFields: [
    { name: 'Date', type: 'time', description: 'Campaign/activity date', example: '2024-01', required: true },
    { name: 'Leads', type: 'metric', description: 'Number of leads', example: '250', required: true },
    { name: 'Conversions', type: 'metric', description: 'Number of conversions', example: '45', required: true },
    { name: 'Spend', type: 'metric', description: 'Marketing spend', example: '15000', required: true },
    { name: 'Channel', type: 'dimension', description: 'Marketing channel', example: 'Google Ads', required: true },
    { name: 'Campaign', type: 'dimension', description: 'Campaign name', example: 'Summer Sale', required: false },
  ],

  sampleData: [
    { Date: '2024-01', Channel: 'Google Ads', Campaign: 'Brand', Leads: 320, Conversions: 48, Spend: 12000, Revenue: 96000 },
    { Date: '2024-01', Channel: 'Facebook', Campaign: 'Retargeting', Leads: 180, Conversions: 32, Spend: 8000, Revenue: 64000 },
    { Date: '2024-01', Channel: 'LinkedIn', Campaign: 'B2B Lead Gen', Leads: 95, Conversions: 18, Spend: 6000, Revenue: 54000 },
    { Date: '2024-01', Channel: 'Email', Campaign: 'Newsletter', Leads: 150, Conversions: 45, Spend: 1000, Revenue: 67500 },
    { Date: '2024-02', Channel: 'Google Ads', Campaign: 'Brand', Leads: 380, Conversions: 55, Spend: 14000, Revenue: 110000 },
    { Date: '2024-02', Channel: 'Facebook', Campaign: 'Retargeting', Leads: 210, Conversions: 38, Spend: 9500, Revenue: 76000 },
    { Date: '2024-02', Channel: 'LinkedIn', Campaign: 'B2B Lead Gen', Leads: 110, Conversions: 22, Spend: 7000, Revenue: 66000 },
    { Date: '2024-02', Channel: 'Email', Campaign: 'Newsletter', Leads: 175, Conversions: 52, Spend: 1200, Revenue: 78000 },
    { Date: '2024-03', Channel: 'Google Ads', Campaign: 'Brand', Leads: 420, Conversions: 62, Spend: 15500, Revenue: 124000 },
    { Date: '2024-03', Channel: 'Facebook', Campaign: 'Retargeting', Leads: 245, Conversions: 44, Spend: 11000, Revenue: 88000 },
    { Date: '2024-03', Channel: 'LinkedIn', Campaign: 'B2B Lead Gen', Leads: 125, Conversions: 25, Spend: 8000, Revenue: 75000 },
    { Date: '2024-03', Channel: 'Email', Campaign: 'Newsletter', Leads: 195, Conversions: 58, Spend: 1400, Revenue: 87000 },
  ],

  visuals: [
    // KPIs
    {
      id: nanoid(),
      type: 'kpi-card',
      position: { x: 20, y: 20, width: 280, height: 130 },
      data: { field: 'Leads', aggregation: 'SUM', format: 'number', decimals: 0 },
      style: { title: 'Total Leads', showTrend: true },
      conditionalFormatting: [],
    },
    {
      id: nanoid(),
      type: 'kpi-card',
      position: { x: 320, y: 20, width: 280, height: 130 },
      data: { field: 'Conversions', aggregation: 'SUM', format: 'number', decimals: 0 },
      style: { title: 'Conversions', showTrend: true },
      conditionalFormatting: [],
    },
    {
      id: nanoid(),
      type: 'kpi-card',
      position: { x: 620, y: 20, width: 280, height: 130 },
      data: { field: 'Spend', aggregation: 'SUM', format: 'currency', decimals: 0, prefix: '$' },
      style: { title: 'Total Spend', showTrend: true },
      conditionalFormatting: [],
    },
    {
      id: nanoid(),
      type: 'kpi-card',
      position: { x: 920, y: 20, width: 280, height: 130 },
      data: { field: 'Revenue', aggregation: 'SUM', format: 'currency', decimals: 0, prefix: '$' },
      style: { title: 'Revenue Generated', showTrend: true },
      conditionalFormatting: [],
    },

    // Charts
    {
      id: nanoid(),
      type: 'funnel',
      position: { x: 20, y: 170, width: 380, height: 320 },
      data: { stageField: 'Channel', valueField: 'Leads' },
      style: {
        title: 'Conversion Funnel',
        showLabels: true,
        showPercent: true,
        showConversion: true,
      },
    },
    {
      id: nanoid(),
      type: 'line-chart',
      position: { x: 420, y: 170, width: 560, height: 320 },
      data: {
        xAxis: { field: 'Date', type: 'category' },
        series: [
          { field: 'Leads', aggregation: 'SUM', color: '#EC4899', label: 'Leads' },
          { field: 'Conversions', aggregation: 'SUM', color: '#8B5CF6', label: 'Conversions' },
        ],
      },
      style: { title: 'Leads & Conversions Trend', showGrid: true, showLegend: true, legendPosition: 'bottom', curved: true, showDataLabels: false },
    },
    {
      id: nanoid(),
      type: 'bar-chart',
      position: { x: 1000, y: 170, width: 400, height: 320 },
      data: {
        category: { field: 'Channel' },
        values: [{ field: 'Spend', aggregation: 'SUM', color: '#EC4899', label: 'Spend' }],
      },
      style: { title: 'Spend by Channel', orientation: 'horizontal', stacked: false, showGrid: true, showLegend: false, showDataLabels: true },
    },

    // Row 3
    {
      id: nanoid(),
      type: 'pie-chart',
      position: { x: 20, y: 510, width: 380, height: 280 },
      data: {
        category: { field: 'Channel' },
        value: { field: 'Leads', aggregation: 'SUM' },
      },
      style: {
        title: 'Leads by Channel',
        donut: true,
        innerRadius: 60,
        showLabels: true,
        showPercent: true,
        showLegend: true,
        colors: ['#EC4899', '#8B5CF6', '#3B82F6', '#52B788'],
      },
    },
    {
      id: nanoid(),
      type: 'data-table',
      position: { x: 420, y: 510, width: 780, height: 280 },
      data: {
        columns: [
          { field: 'Channel', label: 'Channel', align: 'left' },
          { field: 'Leads', label: 'Leads', align: 'right', format: 'number' },
          { field: 'Conversions', label: 'Conversions', align: 'right', format: 'number' },
          { field: 'Spend', label: 'Spend', align: 'right', format: 'currency' },
          { field: 'Revenue', label: 'Revenue', align: 'right', format: 'currency' },
        ],
      },
      style: { title: 'Channel Performance', pageSize: 5, showPagination: true, striped: true, compact: false },
    },

    // Slicer
    {
      id: nanoid(),
      type: 'slicer',
      position: { x: 1220, y: 20, width: 180, height: 130 },
      data: { field: 'Channel' },
      style: { title: 'Channel', displayMode: 'dropdown', multiSelect: true, searchable: true, showSelectAll: true },
    },
  ],
};
