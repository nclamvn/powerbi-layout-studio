import { DashboardTemplate, TemplateCategory } from '../types/template.types';
import { salesTemplate } from './sales.template';
import { financeTemplate } from './finance.template';
import { hrTemplate } from './hr.template';
import { operationsTemplate } from './operations.template';
import { marketingTemplate } from './marketing.template';
import { executiveTemplate } from './executive.template';

export const allTemplates: DashboardTemplate[] = [
  salesTemplate,
  financeTemplate,
  hrTemplate,
  operationsTemplate,
  marketingTemplate,
  executiveTemplate,
];

export {
  salesTemplate,
  financeTemplate,
  hrTemplate,
  operationsTemplate,
  marketingTemplate,
  executiveTemplate,
};

// Category metadata
export const templateCategories: Record<TemplateCategory, { name: string; icon: string; color: string }> = {
  sales: { name: 'Sales', icon: 'TrendingUp', color: '#52B788' },
  finance: { name: 'Finance', icon: 'DollarSign', color: '#3B82F6' },
  hr: { name: 'HR', icon: 'Users', color: '#8B5CF6' },
  operations: { name: 'Operations', icon: 'Package', color: '#F59E0B' },
  marketing: { name: 'Marketing', icon: 'Megaphone', color: '#EC4899' },
  executive: { name: 'Executive', icon: 'LayoutDashboard', color: '#6366F1' },
};
