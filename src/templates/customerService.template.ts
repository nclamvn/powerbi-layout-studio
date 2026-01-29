import { DashboardTemplate } from '../types/template.types';
import { nanoid } from 'nanoid';

export const customerServiceTemplate: DashboardTemplate = {
  id: 'customer-service-dashboard',
  name: 'Customer Service Dashboard',
  description: 'Track support tickets, SLA compliance, CSAT scores, and agent performance. Essential for support managers.',
  category: 'operations',
  icon: 'Headphones',
  color: '#06B6D4',

  canvasSize: { width: 1920, height: 1080 },

  tags: ['support', 'tickets', 'SLA', 'CSAT', 'helpdesk', 'agents'],
  difficulty: 'beginner',
  estimatedSetupTime: '5 minutes',

  requiredFields: [
    { name: 'Date', type: 'time', description: 'Ticket date', example: '2024-01-15', required: true },
    { name: 'Tickets', type: 'metric', description: 'Number of tickets', example: '150', required: true },
    { name: 'Resolved', type: 'metric', description: 'Tickets resolved', example: '142', required: true },
    { name: 'Avg Response Time', type: 'metric', description: 'Average response time (hours)', example: '2.5', required: false },
    { name: 'CSAT Score', type: 'metric', description: 'Customer satisfaction (1-5)', example: '4.2', required: false },
    { name: 'Channel', type: 'dimension', description: 'Support channel', example: 'Email', required: true },
    { name: 'Priority', type: 'dimension', description: 'Ticket priority', example: 'High', required: false },
    { name: 'Agent', type: 'dimension', description: 'Support agent name', example: 'Sarah', required: false },
  ],

  sampleData: [
    { Date: '2024-01', Channel: 'Email', Priority: 'High', Agent: 'Sarah', Tickets: 320, Resolved: 305, 'Avg Response Time': 1.8, 'CSAT Score': 4.5, 'SLA Met': 95 },
    { Date: '2024-01', Channel: 'Chat', Priority: 'Medium', Agent: 'Mike', Tickets: 480, Resolved: 465, 'Avg Response Time': 0.5, 'CSAT Score': 4.7, 'SLA Met': 98 },
    { Date: '2024-01', Channel: 'Phone', Priority: 'High', Agent: 'Lisa', Tickets: 210, Resolved: 198, 'Avg Response Time': 0.2, 'CSAT Score': 4.3, 'SLA Met': 92 },
    { Date: '2024-01', Channel: 'Social', Priority: 'Low', Agent: 'Tom', Tickets: 95, Resolved: 90, 'Avg Response Time': 3.2, 'CSAT Score': 4.1, 'SLA Met': 88 },
    { Date: '2024-02', Channel: 'Email', Priority: 'High', Agent: 'Sarah', Tickets: 345, Resolved: 332, 'Avg Response Time': 1.6, 'CSAT Score': 4.6, 'SLA Met': 96 },
    { Date: '2024-02', Channel: 'Chat', Priority: 'Medium', Agent: 'Mike', Tickets: 520, Resolved: 508, 'Avg Response Time': 0.4, 'CSAT Score': 4.8, 'SLA Met': 99 },
    { Date: '2024-02', Channel: 'Phone', Priority: 'High', Agent: 'Lisa', Tickets: 235, Resolved: 225, 'Avg Response Time': 0.2, 'CSAT Score': 4.4, 'SLA Met': 94 },
    { Date: '2024-02', Channel: 'Social', Priority: 'Low', Agent: 'Tom', Tickets: 110, Resolved: 102, 'Avg Response Time': 2.8, 'CSAT Score': 4.2, 'SLA Met': 90 },
    { Date: '2024-03', Channel: 'Email', Priority: 'Medium', Agent: 'Sarah', Tickets: 380, Resolved: 368, 'Avg Response Time': 1.5, 'CSAT Score': 4.7, 'SLA Met': 97 },
    { Date: '2024-03', Channel: 'Chat', Priority: 'Low', Agent: 'Mike', Tickets: 560, Resolved: 552, 'Avg Response Time': 0.3, 'CSAT Score': 4.9, 'SLA Met': 99 },
    { Date: '2024-03', Channel: 'Phone', Priority: 'High', Agent: 'Lisa', Tickets: 260, Resolved: 252, 'Avg Response Time': 0.2, 'CSAT Score': 4.5, 'SLA Met': 95 },
    { Date: '2024-03', Channel: 'Social', Priority: 'Medium', Agent: 'Tom', Tickets: 125, Resolved: 118, 'Avg Response Time': 2.5, 'CSAT Score': 4.3, 'SLA Met': 91 },
  ],

  visuals: [
    // Row 1: KPI Cards
    {
      id: nanoid(),
      type: 'kpi-card',
      position: { x: 20, y: 20, width: 280, height: 130 },
      data: { field: 'Tickets', aggregation: 'SUM', format: 'number', decimals: 0 },
      style: { title: 'Total Tickets', showTrend: true },
      conditionalFormatting: [],
    },
    {
      id: nanoid(),
      type: 'kpi-card',
      position: { x: 320, y: 20, width: 280, height: 130 },
      data: { field: 'Resolved', aggregation: 'SUM', format: 'number', decimals: 0 },
      style: { title: 'Tickets Resolved', showTrend: true },
      conditionalFormatting: [],
    },
    {
      id: nanoid(),
      type: 'kpi-card',
      position: { x: 620, y: 20, width: 280, height: 130 },
      data: { field: 'Avg Response Time', aggregation: 'AVG', format: 'number', decimals: 1, suffix: ' hrs' },
      style: { title: 'Avg Response Time', showTrend: true },
      conditionalFormatting: [],
    },
    {
      id: nanoid(),
      type: 'gauge',
      position: { x: 920, y: 20, width: 280, height: 130 },
      data: { field: 'CSAT Score', minValue: 1, maxValue: 5, aggregation: 'AVG' },
      style: {
        title: 'CSAT Score',
        showValue: true,
        showPercent: false,
        colorRanges: [
          { from: 1, to: 3, color: '#EF4444' },
          { from: 3, to: 4, color: '#F59E0B' },
          { from: 4, to: 5, color: '#52B788' },
        ],
      },
    },

    // Row 2: Charts
    {
      id: nanoid(),
      type: 'line-chart',
      position: { x: 20, y: 170, width: 580, height: 300 },
      data: {
        xAxis: { field: 'Date', type: 'category' },
        series: [
          { field: 'Tickets', aggregation: 'SUM', color: '#06B6D4', label: 'Received' },
          { field: 'Resolved', aggregation: 'SUM', color: '#52B788', label: 'Resolved' },
        ],
      },
      style: { title: 'Ticket Volume Trend', showGrid: true, showLegend: true, legendPosition: 'bottom', curved: true, showDataLabels: false },
    },
    {
      id: nanoid(),
      type: 'bar-chart',
      position: { x: 620, y: 170, width: 580, height: 300 },
      data: {
        category: { field: 'Channel' },
        values: [{ field: 'Tickets', aggregation: 'SUM', color: '#06B6D4', label: 'Tickets' }],
      },
      style: { title: 'Tickets by Channel', orientation: 'horizontal', stacked: false, showGrid: true, showLegend: false, showDataLabels: true },
    },

    // Row 3
    {
      id: nanoid(),
      type: 'funnel',
      position: { x: 20, y: 490, width: 380, height: 300 },
      data: { stageField: 'Priority', valueField: 'Tickets' },
      style: {
        title: 'Resolution Funnel',
        showLabels: true,
        showPercent: true,
        showConversion: true,
      },
    },
    {
      id: nanoid(),
      type: 'pie-chart',
      position: { x: 420, y: 490, width: 380, height: 300 },
      data: {
        category: { field: 'Channel' },
        value: { field: 'Tickets', aggregation: 'SUM' },
      },
      style: {
        title: 'Channel Distribution',
        donut: true,
        innerRadius: 60,
        showLabels: true,
        showPercent: true,
        showLegend: true,
        colors: ['#06B6D4', '#3B82F6', '#8B5CF6', '#EC4899'],
      },
    },
    {
      id: nanoid(),
      type: 'data-table',
      position: { x: 820, y: 490, width: 580, height: 300 },
      data: {
        columns: [
          { field: 'Agent', label: 'Agent', align: 'left' },
          { field: 'Tickets', label: 'Tickets', align: 'right', format: 'number' },
          { field: 'Resolved', label: 'Resolved', align: 'right', format: 'number' },
          { field: 'CSAT Score', label: 'CSAT', align: 'right', format: 'number' },
          { field: 'SLA Met', label: 'SLA %', align: 'right', format: 'percent' },
        ],
      },
      style: { title: 'Agent Performance', pageSize: 5, showPagination: true, striped: true, compact: false },
    },

    // Slicers
    {
      id: nanoid(),
      type: 'slicer',
      position: { x: 1220, y: 20, width: 180, height: 130 },
      data: { field: 'Channel' },
      style: { title: 'Channel', displayMode: 'dropdown', multiSelect: true, searchable: true, showSelectAll: true },
    },
    {
      id: nanoid(),
      type: 'slicer',
      position: { x: 1420, y: 20, width: 180, height: 130 },
      data: { field: 'Priority' },
      style: { title: 'Priority', displayMode: 'dropdown', multiSelect: true, searchable: true, showSelectAll: true },
    },
  ],
};
