import { create } from 'zustand';
import { DashboardTemplate, TemplateCategory } from '../types/template.types';
import { allTemplates } from '../templates';

interface TemplateStoreState {
  templates: DashboardTemplate[];
  selectedTemplate: DashboardTemplate | null;
  searchQuery: string;
  selectedCategory: TemplateCategory | null;
  isPreviewOpen: boolean;
}

interface TemplateStoreActions {
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: TemplateCategory | null) => void;
  setSelectedTemplate: (template: DashboardTemplate | null) => void;
  setPreviewOpen: (open: boolean) => void;
  openPreview: (template: DashboardTemplate) => void;
  closePreview: () => void;
  getFilteredTemplates: () => DashboardTemplate[];
  getTemplatesByCategory: (category: TemplateCategory) => DashboardTemplate[];
  getTemplateById: (id: string) => DashboardTemplate | undefined;
}

type TemplateStore = TemplateStoreState & TemplateStoreActions;

export const useTemplateStore = create<TemplateStore>((set, get) => ({
  // State
  templates: allTemplates,
  selectedTemplate: null,
  searchQuery: '',
  selectedCategory: null,
  isPreviewOpen: false,

  // Actions
  setSearchQuery: (query) => set({ searchQuery: query }),

  setSelectedCategory: (category) => set({ selectedCategory: category }),

  setSelectedTemplate: (template) => set({ selectedTemplate: template }),

  setPreviewOpen: (open) => set({ isPreviewOpen: open }),

  openPreview: (template) => set({
    selectedTemplate: template,
    isPreviewOpen: true
  }),

  closePreview: () => set({
    isPreviewOpen: false,
    selectedTemplate: null
  }),

  getFilteredTemplates: () => {
    const { templates, searchQuery, selectedCategory } = get();

    return templates.filter((template) => {
      // Filter by category
      if (selectedCategory && template.category !== selectedCategory) {
        return false;
      }

      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = template.name.toLowerCase().includes(query);
        const matchesDescription = template.description.toLowerCase().includes(query);
        const matchesTags = template.tags.some(tag => tag.toLowerCase().includes(query));
        const matchesCategory = template.category.toLowerCase().includes(query);

        if (!matchesName && !matchesDescription && !matchesTags && !matchesCategory) {
          return false;
        }
      }

      return true;
    });
  },

  getTemplatesByCategory: (category) => {
    const { templates } = get();
    return templates.filter((t) => t.category === category);
  },

  getTemplateById: (id) => {
    const { templates } = get();
    return templates.find((t) => t.id === id);
  },
}));
