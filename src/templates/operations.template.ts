import { DashboardTemplate } from '../types/template.types';
import { nanoid } from 'nanoid';

export const operationsTemplate: DashboardTemplate = {
  id: 'operations-dashboard',
  name: 'Operations Dashboard',
  description: 'Monitor inventory, orders, fulfillment rates, and supply chain metrics. Built for operations managers.',
  category: 'operations',
  icon: 'Package',
  color: '#F59E0B',

  canvasSize: { width: 1920, height: 1080 },

  tags: ['inventory', 'orders', 'fulfillment', 'supply chain', 'logistics'],
  difficulty: 'intermediate',
  estimatedSetupTime: '6 minutes',

  requiredFields: [
    { name: 'Date', type: 'time', description: 'Order/transaction date', example: '2024-01-15', required: true },
    { name: 'Orders', type: 'metric', description: 'Number of orders', example: '150', required: true },
    { name: 'Units Shipped', type: 'metric', description: 'Units fulfilled', example: '1200', required: true },
    { name: 'Inventory', type: 'metric', description: 'Current inventory level', example: '5000', required: false },
    { name: 'Warehouse', type: 'dimension', description: 'Warehouse location', example: 'West Coast', required: true },
    { name: 'Status', type: 'dimension', description: 'Order status', example: 'Shipped', required: false },
  ],

  sampleData: [
    { Date: '2024-01', Warehouse: 'West Coast', Status: 'Shipped', Orders: 450, 'Units Shipped': 3200, Inventory: 12000, 'On-Time Rate': 94.5 },
    { Date: '2024-01', Warehouse: 'East Coast', Status: 'Shipped', Orders: 380, 'Units Shipped': 2800, Inventory: 9500, 'On-Time Rate': 92.1 },
    { Date: '2024-01', Warehouse: 'Central', Status: 'Shipped', Orders: 290, 'Units Shipped': 2100, Inventory: 7800, 'On-Time Rate': 95.8 },
    { Date: '2024-02', Warehouse: 'West Coast', Status: 'Shipped', Orders: 520, 'Units Shipped': 3800, Inventory: 11200, 'On-Time Rate': 93.2 },
    { Date: '2024-02', Warehouse: 'East Coast', Status: 'Shipped', Orders: 410, 'Units Shipped': 3100, Inventory: 8900, 'On-Time Rate': 94.5 },
    { Date: '2024-02', Warehouse: 'Central', Status: 'Shipped', Orders: 320, 'Units Shipped': 2400, Inventory: 7200, 'On-Time Rate': 96.1 },
    { Date: '2024-03', Warehouse: 'West Coast', Status: 'Shipped', Orders: 580, 'Units Shipped': 4200, Inventory: 10500, 'On-Time Rate': 91.8 },
    { Date: '2024-03', Warehouse: 'East Coast', Status: 'Shipped', Orders: 450, 'Units Shipped': 3400, Inventory: 8200, 'On-Time Rate': 93.7 },
    { Date: '2024-03', Warehouse: 'Central', Status: 'Shipped', Orders: 350, 'Units Shipped': 2600, Inventory: 6800, 'On-Time Rate': 95.2 },
  ],

  visuals: [
    // KPIs
    {
      id: nanoid(),
      type: 'kpi-card',
      position: { x: 20, y: 20, width: 280, height: 130 },
      data: { field: 'Orders', aggregation: 'SUM', format: 'number', decimals: 0 },
      style: { title: 'Total Orders', showTrend: true },
      conditionalFormatting: [],
    },
    {
      id: nanoid(),
      type: 'kpi-card',
      position: { x: 320, y: 20, width: 280, height: 130 },
      data: { field: 'Units Shipped', aggregation: 'SUM', format: 'number', decimals: 0 },
      style: { title: 'Units Shipped', showTrend: true },
      conditionalFormatting: [],
    },
    {
      id: nanoid(),
      type: 'kpi-card',
      position: { x: 620, y: 20, width: 280, height: 130 },
      data: { field: 'Inventory', aggregation: 'SUM', format: 'number', decimals: 0 },
      style: { title: 'Inventory Level', showTrend: true },
      conditionalFormatting: [],
    },
    {
      id: nanoid(),
      type: 'gauge',
      position: { x: 920, y: 20, width: 280, height: 130 },
      data: { field: 'On-Time Rate', minValue: 0, maxValue: 100, aggregation: 'AVG' },
      style: {
        title: 'On-Time Delivery',
        showValue: true,
        showPercent: true,
        colorRanges: [
          { from: 0, to: 85, color: '#EF4444' },
          { from: 85, to: 95, color: '#F59E0B' },
          { from: 95, to: 100, color: '#52B788' },
        ],
      },
    },

    // Charts
    {
      id: nanoid(),
      type: 'line-chart',
      position: { x: 20, y: 170, width: 600, height: 300 },
      data: {
        xAxis: { field: 'Date', type: 'category' },
        series: [
          { field: 'Orders', aggregation: 'SUM', color: '#F59E0B', label: 'Orders' },
          { field: 'Units Shipped', aggregation: 'SUM', color: '#3B82F6', label: 'Units Shipped' },
        ],
      },
      style: { title: 'Orders & Shipments Trend', showGrid: true, showLegend: true, legendPosition: 'bottom', curved: true, showDataLabels: false },
    },
    {
      id: nanoid(),
      type: 'bar-chart',
      position: { x: 640, y: 170, width: 560, height: 300 },
      data: {
        category: { field: 'Warehouse' },
        values: [
          { field: 'Orders', aggregation: 'SUM', color: '#F59E0B', label: 'Orders' },
          { field: 'Units Shipped', aggregation: 'SUM', color: '#3B82F6', label: 'Shipped' },
        ],
      },
      style: { title: 'Warehouse Performance', orientation: 'vertical', stacked: false, showGrid: true, showLegend: true, showDataLabels: false },
    },
    {
      id: nanoid(),
      type: 'treemap',
      position: { x: 20, y: 490, width: 480, height: 280 },
      data: { categoryField: 'Warehouse', valueField: 'Inventory' },
      style: {
        title: 'Inventory Distribution',
        showLabels: true,
        showValues: true,
        labelPosition: 'center',
        valueFormat: 'number',
        colorPalette: ['#F59E0B', '#FB923C', '#FDBA74', '#FED7AA'],
      },
    },
    {
      id: nanoid(),
      type: 'data-table',
      position: { x: 520, y: 490, width: 680, height: 280 },
      data: {
        columns: [
          { field: 'Warehouse', label: 'Warehouse', align: 'left' },
          { field: 'Orders', label: 'Orders', align: 'right', format: 'number' },
          { field: 'Units Shipped', label: 'Shipped', align: 'right', format: 'number' },
          { field: 'Inventory', label: 'Inventory', align: 'right', format: 'number' },
          { field: 'On-Time Rate', label: 'On-Time %', align: 'right', format: 'percent' },
        ],
      },
      style: { title: 'Warehouse Details', pageSize: 5, showPagination: true, striped: true, compact: false },
    },

    // Slicer
    {
      id: nanoid(),
      type: 'slicer',
      position: { x: 1220, y: 20, width: 180, height: 130 },
      data: { field: 'Warehouse' },
      style: { title: 'Warehouse', displayMode: 'dropdown', multiSelect: true, searchable: true, showSelectAll: true },
    },
  ],
};
