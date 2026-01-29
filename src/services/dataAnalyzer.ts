import {
  ColumnAnalysis,
  ColumnDataType,
  ColumnRole,
  DataAnalysisResult
} from '../types/autoLayout.types';

// ═══════════════════════════════════════════════════════════════════════
// DATA ANALYZER - Phân tích cấu trúc data để suggest visuals
// ═══════════════════════════════════════════════════════════════════════

export function analyzeData(data: any[]): DataAnalysisResult {
  if (!data || data.length === 0) {
    return {
      totalRows: 0,
      totalColumns: 0,
      columns: [],
      metrics: [],
      dimensions: [],
      timeColumns: [],
      filterColumns: [],
      suggestedTitle: 'Empty Dashboard',
      dataQuality: 'poor',
      warnings: ['No data provided'],
    };
  }

  const columns = Object.keys(data[0]);
  const analyzedColumns: ColumnAnalysis[] = columns.map(colName =>
    analyzeColumn(colName, data)
  );

  // Categorize columns by role
  const metrics = analyzedColumns.filter(c => c.role === 'metric');
  const dimensions = analyzedColumns.filter(c => c.role === 'dimension');
  const timeColumns = analyzedColumns.filter(c => c.role === 'time');
  const filterColumns = analyzedColumns.filter(c => c.role === 'filter');

  // Generate suggested title
  const suggestedTitle = generateTitle(metrics, dimensions);

  // Assess data quality
  const dataQuality = assessDataQuality(data, analyzedColumns);

  // Generate warnings
  const warnings = generateWarnings(analyzedColumns, data);

  return {
    totalRows: data.length,
    totalColumns: columns.length,
    columns: analyzedColumns,
    metrics,
    dimensions,
    timeColumns,
    filterColumns,
    suggestedTitle,
    dataQuality,
    warnings,
  };
}

function analyzeColumn(name: string, data: any[]): ColumnAnalysis {
  const values = data.map(row => row[name]).filter(v => v !== null && v !== undefined);
  const uniqueValues = [...new Set(values)];

  // Detect data type
  const dataType = detectDataType(values);

  // Calculate cardinality
  const cardinality: 'low' | 'medium' | 'high' =
    uniqueValues.length < 10 ? 'low' :
    uniqueValues.length < 50 ? 'medium' : 'high';

  // Detect role
  const role = detectColumnRole(name, dataType, uniqueValues, values, cardinality);

  // Calculate statistics for numeric columns
  const statistics = dataType === 'number' ? calculateStatistics(values as number[]) : undefined;

  // Detect time series properties
  const isTimeSeries = dataType === 'date' || isTimeSeriesColumn(name, values);
  const dateGranularity = isTimeSeries ? detectDateGranularity(values) : undefined;

  return {
    name,
    dataType,
    role,
    uniqueCount: uniqueValues.length,
    totalCount: values.length,
    cardinality,
    sampleValues: uniqueValues.slice(0, 5),
    statistics,
    isTimeSeries,
    dateGranularity,
  };
}

function detectDataType(values: any[]): ColumnDataType {
  if (values.length === 0) return 'text';

  const sample = values.slice(0, 100);

  // Check for numbers
  const numericCount = sample.filter(v => !isNaN(Number(v)) && v !== '').length;
  if (numericCount / sample.length > 0.9) return 'number';

  // Check for dates
  const dateCount = sample.filter(v => isValidDate(v)).length;
  if (dateCount / sample.length > 0.9) return 'date';

  // Check for booleans
  const boolValues = sample.filter(v =>
    typeof v === 'boolean' ||
    ['true', 'false', 'yes', 'no', '0', '1'].includes(String(v).toLowerCase())
  );
  if (boolValues.length / sample.length > 0.9) return 'boolean';

  return 'text';
}

function isValidDate(value: any): boolean {
  if (!value) return false;
  const date = new Date(value);
  return !isNaN(date.getTime()) &&
         date.getFullYear() > 1900 &&
         date.getFullYear() < 2100;
}

function detectColumnRole(
  name: string,
  dataType: ColumnDataType,
  _uniqueValues: any[],
  _allValues: any[],
  cardinality: 'low' | 'medium' | 'high'
): ColumnRole {
  const nameLower = name.toLowerCase();

  // Identifier patterns
  const idPatterns = ['id', '_id', 'key', 'code', 'uuid', 'guid'];
  if (idPatterns.some(p => nameLower.includes(p)) && cardinality === 'high') {
    return 'identifier';
  }

  // Time patterns
  const timePatterns = ['date', 'time', 'month', 'year', 'quarter', 'week', 'day', 'period'];
  if (timePatterns.some(p => nameLower.includes(p)) || dataType === 'date') {
    return 'time';
  }

  // Metric patterns (numeric columns with aggregation-friendly names)
  const metricPatterns = [
    'revenue', 'sales', 'amount', 'total', 'sum', 'count', 'quantity',
    'price', 'cost', 'profit', 'margin', 'value', 'budget', 'actual',
    'target', 'rate', 'percent', 'ratio', 'score', 'units', 'volume'
  ];
  if (dataType === 'number' && metricPatterns.some(p => nameLower.includes(p))) {
    return 'metric';
  }

  // If numeric with high cardinality, likely a metric
  if (dataType === 'number' && cardinality === 'high') {
    return 'metric';
  }

  // Filter candidates (low cardinality text/category)
  if (cardinality === 'low' && dataType === 'text') {
    return 'filter';
  }

  // Dimension patterns
  const dimensionPatterns = [
    'region', 'country', 'city', 'state', 'category', 'type', 'status',
    'product', 'customer', 'segment', 'channel', 'department', 'team',
    'name', 'group', 'class', 'brand', 'vendor', 'supplier'
  ];
  if (dimensionPatterns.some(p => nameLower.includes(p))) {
    return 'dimension';
  }

  // Default based on data type
  if (dataType === 'number') return 'metric';
  if (cardinality === 'low' || cardinality === 'medium') return 'dimension';

  return 'dimension';
}

function isTimeSeriesColumn(name: string, values: any[]): boolean {
  const nameLower = name.toLowerCase();
  const timeKeywords = ['date', 'time', 'month', 'year', 'quarter', 'week', 'period'];

  if (timeKeywords.some(k => nameLower.includes(k))) return true;

  // Check if values look like time periods
  const sample = values.slice(0, 10).map(String);
  const timePatterns = [
    /^\d{4}$/,                           // 2024
    /^Q[1-4]\s*\d{4}$/i,                 // Q1 2024
    /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/i,  // Jan, Feb...
    /^\d{1,2}\/\d{1,2}\/\d{2,4}$/,      // 1/1/2024
    /^\d{4}-\d{2}-\d{2}$/,              // 2024-01-01
  ];

  return sample.some(v => timePatterns.some(p => p.test(v)));
}

function detectDateGranularity(values: any[]): 'year' | 'quarter' | 'month' | 'week' | 'day' {
  const sample = values.slice(0, 10).map(String);

  if (sample.some(v => /^Q[1-4]/i.test(v))) return 'quarter';
  if (sample.some(v => /^\d{4}$/.test(v))) return 'year';
  if (sample.some(v => /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/i.test(v))) return 'month';

  // Check date range
  const dates = values.map(v => new Date(v)).filter(d => !isNaN(d.getTime()));
  if (dates.length >= 2) {
    const range = Math.max(...dates.map(d => d.getTime())) - Math.min(...dates.map(d => d.getTime()));
    const days = range / (1000 * 60 * 60 * 24);

    if (days > 365 * 2) return 'year';
    if (days > 180) return 'quarter';
    if (days > 60) return 'month';
    if (days > 14) return 'week';
  }

  return 'day';
}

function calculateStatistics(values: number[]): { min: number; max: number; avg: number; sum: number } {
  const nums = values.map(Number).filter(n => !isNaN(n));
  if (nums.length === 0) return { min: 0, max: 0, avg: 0, sum: 0 };

  return {
    min: Math.min(...nums),
    max: Math.max(...nums),
    avg: nums.reduce((a, b) => a + b, 0) / nums.length,
    sum: nums.reduce((a, b) => a + b, 0),
  };
}

function generateTitle(metrics: ColumnAnalysis[], dimensions: ColumnAnalysis[]): string {
  if (metrics.length === 0 && dimensions.length === 0) {
    return 'Data Dashboard';
  }

  const mainMetric = metrics[0]?.name || '';
  const mainDimension = dimensions[0]?.name || '';

  if (mainMetric && mainDimension) {
    return `${formatColumnName(mainMetric)} by ${formatColumnName(mainDimension)}`;
  }

  if (mainMetric) {
    return `${formatColumnName(mainMetric)} Analysis`;
  }

  return `${formatColumnName(mainDimension)} Dashboard`;
}

function formatColumnName(name: string): string {
  return name
    .replace(/_/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
    .trim();
}

function assessDataQuality(data: any[], columns: ColumnAnalysis[]): 'good' | 'medium' | 'poor' {
  let score = 100;

  // Check for null values
  const nullPercentage = columns.reduce((acc, col) => {
    const nullCount = data.filter(row => row[col.name] === null || row[col.name] === undefined).length;
    return acc + (nullCount / data.length);
  }, 0) / columns.length;

  score -= nullPercentage * 50;

  // Check for enough data
  if (data.length < 10) score -= 30;
  else if (data.length < 50) score -= 15;

  // Check for useful columns
  const usefulColumns = columns.filter(c => c.role !== 'identifier').length;
  if (usefulColumns < 2) score -= 30;

  if (score >= 70) return 'good';
  if (score >= 40) return 'medium';
  return 'poor';
}

function generateWarnings(columns: ColumnAnalysis[], data: any[]): string[] {
  const warnings: string[] = [];

  // No metrics
  if (!columns.some(c => c.role === 'metric')) {
    warnings.push('No numeric columns found for metrics. Consider adding value columns.');
  }

  // No dimensions
  if (!columns.some(c => c.role === 'dimension')) {
    warnings.push('No categorical columns found. Charts may be limited.');
  }

  // Too few rows
  if (data.length < 10) {
    warnings.push('Very few data rows. Dashboard may look sparse.');
  }

  // High cardinality dimensions
  const highCardDimensions = columns.filter(c => c.role === 'dimension' && c.cardinality === 'high');
  if (highCardDimensions.length > 0) {
    warnings.push(`High cardinality in: ${highCardDimensions.map(c => c.name).join(', ')}. Consider filtering.`);
  }

  return warnings;
}
