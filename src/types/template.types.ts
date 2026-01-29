import { Visual } from './visual.types';

// ═══════════════════════════════════════════════════════════════════════
// TEMPLATE TYPES
// ═══════════════════════════════════════════════════════════════════════

export type TemplateCategory =
  | 'sales'
  | 'finance'
  | 'hr'
  | 'operations'
  | 'marketing'
  | 'executive';

export interface TemplateDataField {
  name: string;                          // Field name in template
  type: 'metric' | 'dimension' | 'time'; // Field type
  description: string;                   // What this field represents
  example: string;                       // Example value
  required: boolean;                     // Is this field required?
}

export interface DashboardTemplate {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  icon: string;                          // Lucide icon name

  // Visual appearance
  thumbnail?: string;                    // Base64 or URL
  color: string;                         // Accent color for category

  // Template content
  visuals: Visual[];
  canvasSize: { width: number; height: number };

  // Data requirements
  requiredFields: TemplateDataField[];
  sampleData: any[];

  // Metadata
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedSetupTime: string;            // "5 minutes"

  // Usage stats (optional)
  usageCount?: number;
  rating?: number;
}

export interface TemplateState {
  templates: DashboardTemplate[];
  selectedTemplateId: string | null;
  previewTemplate: DashboardTemplate | null;
  isLoading: boolean;
  filter: {
    category: TemplateCategory | 'all';
    search: string;
  };

  // Actions
  setFilter: (filter: Partial<TemplateState['filter']>) => void;
  selectTemplate: (id: string | null) => void;
  setPreviewTemplate: (template: DashboardTemplate | null) => void;
  applyTemplate: (template: DashboardTemplate, withSampleData: boolean) => void;
  getFilteredTemplates: () => DashboardTemplate[];
}
