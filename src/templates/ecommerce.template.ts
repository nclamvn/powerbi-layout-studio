import { DashboardTemplate } from '../types/template.types';
import { nanoid } from 'nanoid';

export const ecommerceTemplate: DashboardTemplate = {
  id: 'ecommerce-dashboard',
  name: 'E-Commerce Dashboard',
  description: 'Track online sales, orders, conversion rates, cart abandonment, and product performance. Built for e-commerce managers.',
  category: 'sales',
  icon: 'ShoppingCart',
  color: '#F97316',

  canvasSize: { width: 1920, height: 1080 },

  tags: ['e-commerce', 'orders', 'conversion', 'cart', 'products', 'online'],
  difficulty: 'beginner',
  estimatedSetupTime: '5 minutes',

  requiredFields: [
    { name: 'Date', type: 'time', description: 'Order date', example: '2024-01-15', required: true },
    { name: 'Revenue', type: 'metric', description: 'Sales revenue', example: '45000', required: true },
    { name: 'Orders', type: 'metric', description: 'Number of orders', example: '320', required: true },
    { name: 'Visitors', type: 'metric', description: 'Website visitors', example: '15000', required: false },
    { name: 'Cart Abandonment', type: 'metric', description: 'Abandonment rate %', example: '68', required: false },
    { name: 'Product Category', type: 'dimension', description: 'Product category', example: 'Electronics', required: true },
    { name: 'Payment Method', type: 'dimension', description: 'Payment type', example: 'Credit Card', required: false },
  ],

  sampleData: [
    { Date: '2024-01', 'Product Category': 'Electronics', 'Payment Method': 'Credit Card', Revenue: 125000, Orders: 420, Visitors: 28000, 'Cart Abandonment': 65, 'AOV': 297 },
    { Date: '2024-01', 'Product Category': 'Clothing', 'Payment Method': 'PayPal', Revenue: 85000, Orders: 680, Visitors: 22000, 'Cart Abandonment': 72, 'AOV': 125 },
    { Date: '2024-01', 'Product Category': 'Home & Garden', 'Payment Method': 'Credit Card', Revenue: 62000, Orders: 310, Visitors: 15000, 'Cart Abandonment': 58, 'AOV': 200 },
    { Date: '2024-01', 'Product Category': 'Beauty', 'Payment Method': 'Apple Pay', Revenue: 48000, Orders: 520, Visitors: 18000, 'Cart Abandonment': 68, 'AOV': 92 },
    { Date: '2024-02', 'Product Category': 'Electronics', 'Payment Method': 'Credit Card', Revenue: 142000, Orders: 465, Visitors: 31000, 'Cart Abandonment': 62, 'AOV': 305 },
    { Date: '2024-02', 'Product Category': 'Clothing', 'Payment Method': 'PayPal', Revenue: 98000, Orders: 750, Visitors: 25000, 'Cart Abandonment': 70, 'AOV': 131 },
    { Date: '2024-02', 'Product Category': 'Home & Garden', 'Payment Method': 'Credit Card', Revenue: 71000, Orders: 345, Visitors: 16500, 'Cart Abandonment': 55, 'AOV': 206 },
    { Date: '2024-02', 'Product Category': 'Beauty', 'Payment Method': 'Apple Pay', Revenue: 55000, Orders: 580, Visitors: 20000, 'Cart Abandonment': 66, 'AOV': 95 },
    { Date: '2024-03', 'Product Category': 'Electronics', 'Payment Method': 'Credit Card', Revenue: 158000, Orders: 510, Visitors: 34000, 'Cart Abandonment': 60, 'AOV': 310 },
    { Date: '2024-03', 'Product Category': 'Clothing', 'Payment Method': 'PayPal', Revenue: 112000, Orders: 820, Visitors: 28000, 'Cart Abandonment': 68, 'AOV': 137 },
    { Date: '2024-03', 'Product Category': 'Home & Garden', 'Payment Method': 'Credit Card', Revenue: 82000, Orders: 390, Visitors: 18000, 'Cart Abandonment': 52, 'AOV': 210 },
    { Date: '2024-03', 'Product Category': 'Beauty', 'Payment Method': 'Apple Pay', Revenue: 63000, Orders: 650, Visitors: 22000, 'Cart Abandonment': 64, 'AOV': 97 },
  ],

  visuals: [
    // Row 1: KPI Cards
    {
      id: nanoid(),
      type: 'kpi-card',
      position: { x: 20, y: 20, width: 280, height: 130 },
      data: { field: 'Revenue', aggregation: 'SUM', format: 'currency', decimals: 0, prefix: '$' },
      style: { title: 'Total Revenue', showTrend: true },
      conditionalFormatting: [],
    },
    {
      id: nanoid(),
      type: 'kpi-card',
      position: { x: 320, y: 20, width: 280, height: 130 },
      data: { field: 'Orders', aggregation: 'SUM', format: 'number', decimals: 0 },
      style: { title: 'Total Orders', showTrend: true },
      conditionalFormatting: [],
    },
    {
      id: nanoid(),
      type: 'kpi-card',
      position: { x: 620, y: 20, width: 280, height: 130 },
      data: { field: 'AOV', aggregation: 'AVG', format: 'currency', decimals: 0, prefix: '$' },
      style: { title: 'Avg Order Value', showTrend: true },
      conditionalFormatting: [],
    },
    {
      id: nanoid(),
      type: 'gauge',
      position: { x: 920, y: 20, width: 280, height: 130 },
      data: { field: 'Cart Abandonment', minValue: 0, maxValue: 100, aggregation: 'AVG' },
      style: {
        title: 'Cart Abandonment',
        showValue: true,
        showPercent: true,
        colorRanges: [
          { from: 0, to: 50, color: '#52B788' },
          { from: 50, to: 70, color: '#F59E0B' },
          { from: 70, to: 100, color: '#EF4444' },
        ],
      },
    },

    // Row 2: Charts
    {
      id: nanoid(),
      type: 'line-chart',
      position: { x: 20, y: 170, width: 580, height: 320 },
      data: {
        xAxis: { field: 'Date', type: 'category' },
        series: [
          { field: 'Revenue', aggregation: 'SUM', color: '#F97316', label: 'Revenue' },
        ],
      },
      style: { title: 'Revenue Trend', showGrid: true, showLegend: false, legendPosition: 'bottom', curved: true, showDataLabels: false },
    },
    {
      id: nanoid(),
      type: 'bar-chart',
      position: { x: 620, y: 170, width: 580, height: 320 },
      data: {
        category: { field: 'Product Category' },
        values: [{ field: 'Revenue', aggregation: 'SUM', color: '#F97316', label: 'Revenue' }],
      },
      style: { title: 'Revenue by Category', orientation: 'vertical', stacked: false, showGrid: true, showLegend: false, showDataLabels: true },
    },

    // Row 3
    {
      id: nanoid(),
      type: 'funnel',
      position: { x: 20, y: 510, width: 380, height: 280 },
      data: { stageField: 'Product Category', valueField: 'Visitors' },
      style: {
        title: 'Sales Funnel',
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
        category: { field: 'Payment Method' },
        value: { field: 'Orders', aggregation: 'SUM' },
      },
      style: {
        title: 'Payment Methods',
        donut: true,
        innerRadius: 60,
        showLabels: true,
        showPercent: true,
        showLegend: true,
        colors: ['#F97316', '#3B82F6', '#10B981', '#8B5CF6'],
      },
    },
    {
      id: nanoid(),
      type: 'data-table',
      position: { x: 820, y: 510, width: 580, height: 280 },
      data: {
        columns: [
          { field: 'Product Category', label: 'Category', align: 'left' },
          { field: 'Revenue', label: 'Revenue', align: 'right', format: 'currency' },
          { field: 'Orders', label: 'Orders', align: 'right', format: 'number' },
          { field: 'AOV', label: 'AOV', align: 'right', format: 'currency' },
          { field: 'Cart Abandonment', label: 'Abandon %', align: 'right', format: 'percent' },
        ],
      },
      style: { title: 'Category Performance', pageSize: 5, showPagination: true, striped: true, compact: false },
    },

    // Slicers
    {
      id: nanoid(),
      type: 'slicer',
      position: { x: 1220, y: 20, width: 180, height: 130 },
      data: { field: 'Product Category' },
      style: { title: 'Category', displayMode: 'dropdown', multiSelect: true, searchable: true, showSelectAll: true },
    },
    {
      id: nanoid(),
      type: 'slicer',
      position: { x: 1420, y: 20, width: 180, height: 130 },
      data: { field: 'Payment Method' },
      style: { title: 'Payment', displayMode: 'dropdown', multiSelect: true, searchable: true, showSelectAll: true },
    },
  ],
};
