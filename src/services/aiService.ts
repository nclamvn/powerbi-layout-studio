/**
 * AI Service - Power BI Layout Studio
 * Call Claude API to generate dashboard from prompt
 */

import { Visual, VisualType } from '../types/visual.types';
import { VISUAL_DEFAULTS } from '../constants/visualDefaults';
import { nanoid } from 'nanoid';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface AIGeneratedDashboard {
  projectName: string;
  canvasSize: { width: number; height: number };
  visuals: AIVisualSpec[];
  requiredDataFields: DataFieldSpec[];
}

export interface AIVisualSpec {
  id: string;
  type: string;
  title: string;
  position: { x: number; y: number; width: number; height: number };
  data: Record<string, unknown>;
  style?: Record<string, unknown>;
}

export interface DataFieldSpec {
  name: string;
  type: 'metric' | 'dimension' | 'time';
  description: string;
}

export interface AIServiceConfig {
  apiKey: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// SYSTEM PROMPT - Optimized based on Anthropic Best Practices
// ═══════════════════════════════════════════════════════════════════════════

const DASHBOARD_GENERATOR_PROMPT = `You are a Power BI dashboard design expert. Transform natural language descriptions into precise dashboard specifications.

<output_rules>
- Respond ONLY with valid JSON
- No explanations, no markdown, no comments outside JSON
- JSON must be complete and parseable
- Follow the exact schema provided
</output_rules>

<visual_types>
| Type | Use For | Size Range |
|------|---------|------------|
| kpi-card | Single metrics (Revenue, Count, %) | 220-320w × 110-150h |
| line-chart | Time-series, trends | 450-900w × 300-400h |
| bar-chart | Category comparisons | 300-600w × 250-400h |
| pie-chart | Part-to-whole (max 6-8 segments) | 280-400w × 280-400h |
| data-table | Detailed exploration | 400-900w × 250-400h |
| slicer | Filtering | 150-200w × 100-150h |
| gauge | Progress towards target | 200-300w × 150-200h |
| funnel | Sequential processes | 300-500w × 300-400h |
| treemap | Hierarchical data | 400-600w × 300-400h |
| matrix | Cross-tabulated data | 500-900w × 300-450h |
</visual_types>

<layout_rules>
1. KPI cards at TOP row (y: 20, spacing: 20px between)
2. Main chart below KPIs (y: 170)
3. Secondary charts in middle section
4. Tables at bottom
5. Slicers in top-right corner
6. Canvas: 1920x1080, Grid: 20px snap
7. Safe margins: 20px from edges
8. Don't overlap visuals
</layout_rules>

<interpretation_map>
Vietnamese/English keywords to dashboard elements:
- "bán hàng/sales" → Revenue, Orders, AOV, Trend, Region
- "nhân sự/HR" → Headcount, Turnover, New Hires, Department
- "tài chính/financial" → Revenue, Expenses, Profit, Budget vs Actual
- "marketing" → Leads, Conversions, CAC, Campaign
- "vận hành/operations" → Efficiency, Throughput, Downtime, Quality
- "KPI/chỉ số" → kpi-card at top
- "trend/xu hướng/theo tháng" → line-chart
- "so sánh/comparison/theo vùng" → bar-chart
- "phân bố/breakdown/tỷ lệ" → pie-chart
- "chi tiết/details/bảng" → data-table
- "lọc/filter" → slicer
- "tiến độ/target/mục tiêu" → gauge
</interpretation_map>

<color_palette>
Use these colors for visual variety:
- Primary: #52B788 (green), #3B82F6 (blue)
- Secondary: #8B5CF6 (purple), #F59E0B (orange), #EC4899 (pink), #06B6D4 (cyan)
- Alert: #EF4444 (red for negative)
- Neutral: #64748B (gray)
</color_palette>

<output_schema>
{
  "projectName": "string - descriptive name",
  "canvasSize": { "width": 1920, "height": 1080 },
  "visuals": [
    {
      "id": "unique-kebab-case-id",
      "type": "kpi-card|line-chart|bar-chart|pie-chart|data-table|slicer|gauge|funnel|treemap|matrix",
      "title": "Display Title",
      "position": { "x": number, "y": number, "width": number, "height": number },
      "data": {
        "field": "string (for kpi-card)",
        "aggregation": "SUM|AVG|COUNT|MIN|MAX",
        "format": "number|currency|percent",
        "xAxis": { "field": "string", "type": "category|time" },
        "series": [{ "field": "string", "color": "#hex", "label": "string" }],
        "columns": [{ "field": "string", "label": "string" }]
      },
      "style": {
        "showTrend": boolean,
        "showLegend": boolean,
        "orientation": "vertical|horizontal"
      }
    }
  ],
  "requiredDataFields": [
    { "name": "FieldName", "type": "metric|dimension|time", "description": "what it represents" }
  ]
}
</output_schema>

<example>
User: "Tạo dashboard bán hàng với 4 KPI và trend theo tháng"

{
  "projectName": "Sales Performance Dashboard",
  "canvasSize": { "width": 1920, "height": 1080 },
  "visuals": [
    {
      "id": "kpi-revenue",
      "type": "kpi-card",
      "title": "Tổng Doanh Thu",
      "position": { "x": 20, "y": 20, "width": 280, "height": 130 },
      "data": { "field": "Revenue", "aggregation": "SUM", "format": "currency" },
      "style": { "showTrend": true }
    },
    {
      "id": "kpi-orders",
      "type": "kpi-card",
      "title": "Tổng Đơn Hàng",
      "position": { "x": 320, "y": 20, "width": 280, "height": 130 },
      "data": { "field": "Orders", "aggregation": "SUM", "format": "number" },
      "style": { "showTrend": true }
    },
    {
      "id": "kpi-aov",
      "type": "kpi-card",
      "title": "Giá Trị TB/Đơn",
      "position": { "x": 620, "y": 20, "width": 280, "height": 130 },
      "data": { "field": "Revenue", "aggregation": "AVG", "format": "currency" },
      "style": { "showTrend": true }
    },
    {
      "id": "kpi-conversion",
      "type": "gauge",
      "title": "Tỷ Lệ Chuyển Đổi",
      "position": { "x": 920, "y": 20, "width": 280, "height": 130 },
      "data": { "field": "ConversionRate", "format": "percent", "maxValue": 100 },
      "style": { "showValue": true }
    },
    {
      "id": "chart-trend",
      "type": "line-chart",
      "title": "Doanh Thu Theo Tháng",
      "position": { "x": 20, "y": 170, "width": 900, "height": 380 },
      "data": {
        "xAxis": { "field": "Month", "type": "time" },
        "series": [{ "field": "Revenue", "color": "#52B788", "label": "Doanh Thu" }]
      },
      "style": { "showLegend": true, "showGrid": true }
    },
    {
      "id": "chart-region",
      "type": "bar-chart",
      "title": "Doanh Thu Theo Vùng",
      "position": { "x": 940, "y": 170, "width": 480, "height": 380 },
      "data": {
        "xAxis": { "field": "Region", "type": "category" },
        "series": [{ "field": "Revenue", "color": "#3B82F6", "label": "Doanh Thu" }]
      },
      "style": { "orientation": "horizontal", "showDataLabels": true }
    },
    {
      "id": "slicer-time",
      "type": "slicer",
      "title": "Thời Gian",
      "position": { "x": 1440, "y": 20, "width": 180, "height": 130 },
      "data": { "field": "Month" },
      "style": { "displayMode": "dropdown" }
    },
    {
      "id": "slicer-region",
      "type": "slicer",
      "title": "Vùng Miền",
      "position": { "x": 1640, "y": 20, "width": 180, "height": 130 },
      "data": { "field": "Region" },
      "style": { "displayMode": "dropdown" }
    }
  ],
  "requiredDataFields": [
    { "name": "Month", "type": "time", "description": "Tháng/Ngày cho phân tích trend" },
    { "name": "Revenue", "type": "metric", "description": "Doanh thu bán hàng" },
    { "name": "Orders", "type": "metric", "description": "Số lượng đơn hàng" },
    { "name": "Region", "type": "dimension", "description": "Vùng miền địa lý" },
    { "name": "ConversionRate", "type": "metric", "description": "Tỷ lệ chuyển đổi %" }
  ]
}
</example>

Now generate a complete dashboard specification for the user's request. Respond with JSON only.`;

// ═══════════════════════════════════════════════════════════════════════════
// AI SERVICE CLASS
// ═══════════════════════════════════════════════════════════════════════════

class AIService {
  private apiKey: string = '';
  private model: string = 'claude-sonnet-4-20250514';
  private temperature: number = 0.2;
  private maxTokens: number = 4096;

  configure(config: AIServiceConfig) {
    this.apiKey = config.apiKey;
    if (config.model) this.model = config.model;
    if (config.temperature !== undefined) this.temperature = config.temperature;
    if (config.maxTokens) this.maxTokens = config.maxTokens;
  }

  isConfigured(): boolean {
    return this.apiKey.length > 0;
  }

  async generateDashboard(prompt: string): Promise<AIGeneratedDashboard> {
    if (!this.isConfigured()) {
      throw new Error('AI Service not configured. Please provide an API key.');
    }

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: this.model,
          max_tokens: this.maxTokens,
          temperature: this.temperature,
          system: DASHBOARD_GENERATOR_PROMPT,
          messages: [
            { role: 'user', content: prompt }
          ],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `API Error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`
        );
      }

      const data = await response.json();
      const content = data.content[0]?.text;

      if (!content) {
        throw new Error('Empty response from API');
      }

      // Parse JSON response
      const dashboard = JSON.parse(content) as AIGeneratedDashboard;

      // Validate basic structure
      if (!dashboard.visuals || !Array.isArray(dashboard.visuals)) {
        throw new Error('Invalid dashboard structure: missing visuals array');
      }

      return dashboard;
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new Error('Failed to parse AI response as JSON. Please try again.');
      }
      throw error;
    }
  }
}

// Export singleton instance
export const aiService = new AIService();

// ═══════════════════════════════════════════════════════════════════════════
// CONVERTER - Transform AI output to app Visual format
// ═══════════════════════════════════════════════════════════════════════════

export function convertAIVisualsToAppVisuals(aiVisuals: AIVisualSpec[]): Visual[] {
  return aiVisuals.map((aiVisual) => {
    const visualType = aiVisual.type as VisualType;
    const defaults = VISUAL_DEFAULTS[visualType];

    if (!defaults) {
      // Fallback to kpi-card if unknown type
      const fallbackDefaults = VISUAL_DEFAULTS['kpi-card'];
      return {
        ...fallbackDefaults,
        id: nanoid(),
        position: {
          x: aiVisual.position.x,
          y: aiVisual.position.y,
          width: aiVisual.position.width,
          height: aiVisual.position.height,
        },
        style: {
          ...fallbackDefaults.style,
          title: aiVisual.title,
        },
      } as Visual;
    }

    // Create visual based on type
    const visual = {
      ...defaults,
      id: nanoid(),
      position: {
        x: aiVisual.position.x,
        y: aiVisual.position.y,
        width: aiVisual.position.width,
        height: aiVisual.position.height,
      },
    } as Visual;

    // Update style with title
    if ('style' in visual && visual.style) {
      (visual.style as { title: string }).title = aiVisual.title;
    }

    // Merge AI data into visual data
    if (aiVisual.data && 'data' in visual) {
      Object.assign(visual.data, aiVisual.data);
    }

    // Merge AI style into visual style
    if (aiVisual.style && 'style' in visual) {
      Object.assign(visual.style, aiVisual.style);
    }

    return visual;
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// SAMPLE DATA GENERATOR
// ═══════════════════════════════════════════════════════════════════════════

export function generateSampleDataFromFields(fields: DataFieldSpec[]): Record<string, unknown>[] {
  const rows: Record<string, unknown>[] = [];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const regions = ['Miền Bắc', 'Miền Trung', 'Miền Nam', 'Hà Nội', 'TP.HCM'];
  const categories = ['Category A', 'Category B', 'Category C', 'Category D'];
  const statuses = ['Active', 'Pending', 'Completed', 'Cancelled'];

  // Generate 12 rows of sample data
  for (let i = 0; i < 12; i++) {
    const row: Record<string, unknown> = {};

    fields.forEach(field => {
      switch (field.type) {
        case 'time':
          row[field.name] = months[i % 12];
          break;
        case 'metric':
          // Generate realistic looking numbers
          if (field.name.toLowerCase().includes('rate') || field.name.toLowerCase().includes('percent')) {
            row[field.name] = Math.round(Math.random() * 50 + 30); // 30-80%
          } else if (field.name.toLowerCase().includes('count') || field.name.toLowerCase().includes('order')) {
            row[field.name] = Math.round(Math.random() * 500 + 100); // 100-600
          } else {
            row[field.name] = Math.round(Math.random() * 100000 + 50000); // 50k-150k
          }
          break;
        case 'dimension':
          if (field.name.toLowerCase().includes('region') || field.name.toLowerCase().includes('vùng')) {
            row[field.name] = regions[i % regions.length];
          } else if (field.name.toLowerCase().includes('category') || field.name.toLowerCase().includes('loại')) {
            row[field.name] = categories[i % categories.length];
          } else if (field.name.toLowerCase().includes('status') || field.name.toLowerCase().includes('trạng thái')) {
            row[field.name] = statuses[i % statuses.length];
          } else {
            row[field.name] = `Item ${i + 1}`;
          }
          break;
      }
    });

    rows.push(row);
  }

  return rows;
}
