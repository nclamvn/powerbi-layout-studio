import { DashboardTemplate, TemplateCategory } from '../types/template.types';

// Existing templates
import { salesTemplate } from './sales.template';
import { financeTemplate } from './finance.template';
import { hrTemplate } from './hr.template';
import { operationsTemplate } from './operations.template';
import { marketingTemplate } from './marketing.template';
import { executiveTemplate } from './executive.template';

// NEW templates
import { customerServiceTemplate } from './customerService.template';
import { projectManagementTemplate } from './projectManagement.template';
import { ecommerceTemplate } from './ecommerce.template';
import { healthcareTemplate } from './healthcare.template';
import { retailTemplate } from './retail.template';
import { manufacturingTemplate } from './manufacturing.template';

export const allTemplates: DashboardTemplate[] = [
  // Core Business
  salesTemplate,
  financeTemplate,
  hrTemplate,
  operationsTemplate,
  marketingTemplate,
  executiveTemplate,

  // Industry-Specific (NEW)
  customerServiceTemplate,
  projectManagementTemplate,
  ecommerceTemplate,
  healthcareTemplate,
  retailTemplate,
  manufacturingTemplate,
];

export {
  // Existing
  salesTemplate,
  financeTemplate,
  hrTemplate,
  operationsTemplate,
  marketingTemplate,
  executiveTemplate,

  // New
  customerServiceTemplate,
  projectManagementTemplate,
  ecommerceTemplate,
  healthcareTemplate,
  retailTemplate,
  manufacturingTemplate,
};

// Category metadata
export const templateCategories: Record<TemplateCategory, { name: string; icon: string; color: string }> = {
  sales: { name: 'Sales', icon: 'TrendingUp', color: '#52B788' },
  finance: { name: 'Finance', icon: 'DollarSign', color: '#3B82F6' },
  hr: { name: 'HR', icon: 'Users', color: '#8B5CF6' },
  operations: { name: 'Operations', icon: 'Settings', color: '#F59E0B' },
  marketing: { name: 'Marketing', icon: 'Megaphone', color: '#EC4899' },
  executive: { name: 'Executive', icon: 'LayoutDashboard', color: '#6366F1' },
};
