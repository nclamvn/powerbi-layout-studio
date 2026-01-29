import { DashboardTemplate } from '../types/template.types';
import { nanoid } from 'nanoid';

export const healthcareTemplate: DashboardTemplate = {
  id: 'healthcare-dashboard',
  name: 'Healthcare Dashboard',
  description: 'Track patient visits, appointments, wait times, and clinical outcomes. Designed for healthcare administrators.',
  category: 'operations',
  icon: 'Heart',
  color: '#EF4444',

  canvasSize: { width: 1920, height: 1080 },

  tags: ['healthcare', 'patients', 'appointments', 'clinical', 'hospital', 'medical'],
  difficulty: 'intermediate',
  estimatedSetupTime: '6 minutes',

  requiredFields: [
    { name: 'Month', type: 'time', description: 'Reporting period', example: '2024-01', required: true },
    { name: 'Patients', type: 'metric', description: 'Number of patients', example: '1250', required: true },
    { name: 'Appointments', type: 'metric', description: 'Total appointments', example: '1800', required: true },
    { name: 'Avg Wait Time', type: 'metric', description: 'Average wait time (mins)', example: '18', required: false },
    { name: 'Satisfaction', type: 'metric', description: 'Patient satisfaction score', example: '4.3', required: false },
    { name: 'Department', type: 'dimension', description: 'Medical department', example: 'Cardiology', required: true },
    { name: 'Visit Type', type: 'dimension', description: 'Type of visit', example: 'Outpatient', required: false },
  ],

  sampleData: [
    { Month: '2024-01', Department: 'Cardiology', 'Visit Type': 'Outpatient', Patients: 420, Appointments: 580, 'Avg Wait Time': 15, Satisfaction: 4.5, 'No-Show Rate': 8 },
    { Month: '2024-01', Department: 'Orthopedics', 'Visit Type': 'Outpatient', Patients: 380, Appointments: 520, 'Avg Wait Time': 22, Satisfaction: 4.2, 'No-Show Rate': 12 },
    { Month: '2024-01', Department: 'Pediatrics', 'Visit Type': 'Outpatient', Patients: 650, Appointments: 820, 'Avg Wait Time': 18, Satisfaction: 4.6, 'No-Show Rate': 6 },
    { Month: '2024-01', Department: 'Emergency', 'Visit Type': 'Emergency', Patients: 890, Appointments: 890, 'Avg Wait Time': 35, Satisfaction: 3.8, 'No-Show Rate': 2 },
    { Month: '2024-01', Department: 'Internal Med', 'Visit Type': 'Outpatient', Patients: 520, Appointments: 680, 'Avg Wait Time': 20, Satisfaction: 4.3, 'No-Show Rate': 10 },
    { Month: '2024-02', Department: 'Cardiology', 'Visit Type': 'Outpatient', Patients: 445, Appointments: 610, 'Avg Wait Time': 14, Satisfaction: 4.6, 'No-Show Rate': 7 },
    { Month: '2024-02', Department: 'Orthopedics', 'Visit Type': 'Outpatient', Patients: 395, Appointments: 545, 'Avg Wait Time': 20, Satisfaction: 4.3, 'No-Show Rate': 11 },
    { Month: '2024-02', Department: 'Pediatrics', 'Visit Type': 'Outpatient', Patients: 680, Appointments: 860, 'Avg Wait Time': 16, Satisfaction: 4.7, 'No-Show Rate': 5 },
    { Month: '2024-02', Department: 'Emergency', 'Visit Type': 'Emergency', Patients: 920, Appointments: 920, 'Avg Wait Time': 32, Satisfaction: 3.9, 'No-Show Rate': 1 },
    { Month: '2024-02', Department: 'Internal Med', 'Visit Type': 'Outpatient', Patients: 548, Appointments: 715, 'Avg Wait Time': 18, Satisfaction: 4.4, 'No-Show Rate': 9 },
    { Month: '2024-03', Department: 'Cardiology', 'Visit Type': 'Outpatient', Patients: 468, Appointments: 640, 'Avg Wait Time': 13, Satisfaction: 4.7, 'No-Show Rate': 6 },
    { Month: '2024-03', Department: 'Orthopedics', 'Visit Type': 'Outpatient', Patients: 410, Appointments: 565, 'Avg Wait Time': 19, Satisfaction: 4.4, 'No-Show Rate': 10 },
    { Month: '2024-03', Department: 'Pediatrics', 'Visit Type': 'Outpatient', Patients: 710, Appointments: 900, 'Avg Wait Time': 15, Satisfaction: 4.8, 'No-Show Rate': 4 },
    { Month: '2024-03', Department: 'Emergency', 'Visit Type': 'Emergency', Patients: 950, Appointments: 950, 'Avg Wait Time': 30, Satisfaction: 4.0, 'No-Show Rate': 1 },
    { Month: '2024-03', Department: 'Internal Med', 'Visit Type': 'Outpatient', Patients: 575, Appointments: 750, 'Avg Wait Time': 17, Satisfaction: 4.5, 'No-Show Rate': 8 },
  ],

  visuals: [
    // Row 1: KPI Cards
    {
      id: nanoid(),
      type: 'kpi-card',
      position: { x: 20, y: 20, width: 280, height: 130 },
      data: { field: 'Patients', aggregation: 'SUM', format: 'number', decimals: 0 },
      style: { title: 'Total Patients', showTrend: true },
      conditionalFormatting: [],
    },
    {
      id: nanoid(),
      type: 'kpi-card',
      position: { x: 320, y: 20, width: 280, height: 130 },
      data: { field: 'Appointments', aggregation: 'SUM', format: 'number', decimals: 0 },
      style: { title: 'Total Appointments', showTrend: true },
      conditionalFormatting: [],
    },
    {
      id: nanoid(),
      type: 'kpi-card',
      position: { x: 620, y: 20, width: 280, height: 130 },
      data: { field: 'Avg Wait Time', aggregation: 'AVG', format: 'number', decimals: 0, suffix: ' min' },
      style: { title: 'Avg Wait Time', showTrend: true },
      conditionalFormatting: [],
    },
    {
      id: nanoid(),
      type: 'gauge',
      position: { x: 920, y: 20, width: 280, height: 130 },
      data: { field: 'Satisfaction', minValue: 1, maxValue: 5, aggregation: 'AVG' },
      style: {
        title: 'Patient Satisfaction',
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
      position: { x: 20, y: 170, width: 580, height: 320 },
      data: {
        xAxis: { field: 'Month', type: 'category' },
        series: [
          { field: 'Patients', aggregation: 'SUM', color: '#EF4444', label: 'Patients' },
          { field: 'Appointments', aggregation: 'SUM', color: '#3B82F6', label: 'Appointments' },
        ],
      },
      style: { title: 'Patient & Appointment Trends', showGrid: true, showLegend: true, legendPosition: 'bottom', curved: true, showDataLabels: false },
    },
    {
      id: nanoid(),
      type: 'bar-chart',
      position: { x: 620, y: 170, width: 580, height: 320 },
      data: {
        category: { field: 'Department' },
        values: [{ field: 'Patients', aggregation: 'SUM', color: '#EF4444', label: 'Patients' }],
      },
      style: { title: 'Patients by Department', orientation: 'horizontal', stacked: false, showGrid: true, showLegend: false, showDataLabels: true },
    },

    // Row 3
    {
      id: nanoid(),
      type: 'treemap',
      position: { x: 20, y: 510, width: 480, height: 280 },
      data: { categoryField: 'Department', valueField: 'Appointments' },
      style: {
        title: 'Department Workload',
        showLabels: true,
        showValues: true,
        labelPosition: 'center',
        valueFormat: 'number',
        colorPalette: ['#EF4444', '#F87171', '#FCA5A5', '#FECACA'],
      },
    },
    {
      id: nanoid(),
      type: 'matrix',
      position: { x: 520, y: 510, width: 680, height: 280 },
      data: {
        rowFields: ['Department'],
        columnFields: ['Month'],
        valueField: 'Avg Wait Time',
        aggregation: 'AVG',
      },
      style: {
        title: 'Wait Times by Dept & Month',
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
      style: { title: 'Department', displayMode: 'dropdown', multiSelect: true, searchable: true, showSelectAll: true },
    },
    {
      id: nanoid(),
      type: 'slicer',
      position: { x: 1420, y: 20, width: 180, height: 130 },
      data: { field: 'Visit Type' },
      style: { title: 'Visit Type', displayMode: 'dropdown', multiSelect: true, searchable: true, showSelectAll: true },
    },
  ],
};
