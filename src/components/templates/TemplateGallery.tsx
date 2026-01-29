import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  TrendingUp,
  DollarSign,
  Users,
  Package,
  Megaphone,
  LayoutDashboard,
  X,
  Sparkles,
} from 'lucide-react';
import { useTemplateStore } from '../../stores/templateStore';
import { templateCategories } from '../../templates';
import { TemplateCategory, DashboardTemplate } from '../../types/template.types';

const categoryIcons: Record<TemplateCategory, React.ElementType> = {
  sales: TrendingUp,
  finance: DollarSign,
  hr: Users,
  operations: Package,
  marketing: Megaphone,
  executive: LayoutDashboard,
};

interface TemplateGalleryProps {
  onSelectTemplate: (template: DashboardTemplate) => void;
}

export const TemplateGallery: React.FC<TemplateGalleryProps> = ({ onSelectTemplate }) => {
  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    getFilteredTemplates,
    openPreview,
  } = useTemplateStore();

  const filteredTemplates = useMemo(() => getFilteredTemplates(), [
    searchQuery,
    selectedCategory,
    getFilteredTemplates,
  ]);

  const handleTemplateClick = (template: DashboardTemplate) => {
    openPreview(template);
  };

  const handleQuickApply = (e: React.MouseEvent, template: DashboardTemplate) => {
    e.stopPropagation();
    onSelectTemplate(template);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Search */}
      <div className="p-3 border-b border-gray-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-800 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Category Filters */}
      <div className="p-3 border-b border-gray-700">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              selectedCategory === null
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            All
          </button>
          {(Object.keys(templateCategories) as TemplateCategory[]).map((category) => {
            const Icon = categoryIcons[category];
            const meta = templateCategories[category];
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  selectedCategory === category
                    ? 'text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
                style={{
                  backgroundColor: selectedCategory === category ? meta.color : undefined,
                }}
              >
                <Icon className="w-3 h-3" />
                {meta.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Template Grid */}
      <div className="flex-1 overflow-y-auto p-3">
        <AnimatePresence mode="popLayout">
          {filteredTemplates.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-40 text-gray-400"
            >
              <Search className="w-8 h-8 mb-2 opacity-50" />
              <p className="text-sm">No templates found</p>
              <p className="text-xs mt-1">Try adjusting your search or filters</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {filteredTemplates.map((template, index) => {
                const Icon = categoryIcons[template.category];
                const categoryMeta = templateCategories[template.category];

                return (
                  <motion.div
                    key={template.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleTemplateClick(template)}
                    className="group relative bg-gray-800 rounded-lg border border-gray-700 overflow-hidden cursor-pointer hover:border-gray-500 transition-all hover:shadow-lg"
                  >
                    {/* Preview Thumbnail */}
                    <div
                      className="h-24 relative overflow-hidden"
                      style={{
                        background: `linear-gradient(135deg, ${template.color}15, ${template.color}05)`,
                      }}
                    >
                      {/* Mini visual preview */}
                      <div className="absolute inset-2 opacity-40">
                        <div className="grid grid-cols-4 gap-1 h-full">
                          {template.visuals.slice(0, 8).map((visual, i) => (
                            <div
                              key={i}
                              className="rounded"
                              style={{
                                backgroundColor: template.color,
                                opacity: 0.3 + (i * 0.1),
                                gridColumn: visual.type === 'line-chart' || visual.type === 'bar-chart' ? 'span 2' : 'span 1',
                              }}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Category badge */}
                      <div
                        className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-white"
                        style={{ backgroundColor: categoryMeta.color }}
                      >
                        <Icon className="w-3 h-3" />
                        {categoryMeta.name}
                      </div>

                      {/* Difficulty badge */}
                      <div className="absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium bg-gray-900/80 text-gray-300">
                        {template.difficulty}
                      </div>

                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          onClick={(e) => handleQuickApply(e, template)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors"
                        >
                          <Sparkles className="w-3 h-3" />
                          Apply
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTemplateClick(template);
                          }}
                          className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-xs font-medium rounded-lg transition-colors"
                        >
                          Preview
                        </button>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-3">
                      <h3 className="font-medium text-white text-sm mb-1">{template.name}</h3>
                      <p className="text-xs text-gray-400 line-clamp-2">{template.description}</p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {template.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-1.5 py-0.5 bg-gray-700 rounded text-[10px] text-gray-400"
                          >
                            {tag}
                          </span>
                        ))}
                        {template.tags.length > 3 && (
                          <span className="px-1.5 py-0.5 text-[10px] text-gray-500">
                            +{template.tags.length - 3}
                          </span>
                        )}
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-500">
                        <span>{template.visuals.length} visuals</span>
                        <span>{template.requiredFields.filter(f => f.required).length} required fields</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
