import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Sparkles,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  DollarSign,
  Users,
  Package,
  Megaphone,
  LayoutDashboard,
  BarChart3,
  PieChart,
  LineChart,
  Table,
  Gauge,
  Filter,
  GitBranch,
  Grid3X3,
  TreeDeciduous,
} from 'lucide-react';
import { useTemplateStore } from '../../stores/templateStore';
import { templateCategories } from '../../templates';
import { DashboardTemplate, TemplateCategory, TemplateDataField } from '../../types/template.types';
import { Visual } from '../../types/visual.types';

const categoryIcons: Record<TemplateCategory, React.ElementType> = {
  sales: TrendingUp,
  finance: DollarSign,
  hr: Users,
  operations: Package,
  marketing: Megaphone,
  executive: LayoutDashboard,
};

const visualTypeIcons: Record<string, React.ElementType> = {
  'kpi-card': BarChart3,
  'bar-chart': BarChart3,
  'line-chart': LineChart,
  'pie-chart': PieChart,
  'data-table': Table,
  gauge: Gauge,
  slicer: Filter,
  funnel: GitBranch,
  matrix: Grid3X3,
  treemap: TreeDeciduous,
};

const visualTypeLabels: Record<string, string> = {
  'kpi-card': 'KPI Card',
  'bar-chart': 'Bar Chart',
  'line-chart': 'Line Chart',
  'pie-chart': 'Pie/Donut Chart',
  'data-table': 'Data Table',
  gauge: 'Gauge',
  slicer: 'Slicer',
  funnel: 'Funnel',
  matrix: 'Matrix',
  treemap: 'Treemap',
};

interface TemplatePreviewModalProps {
  onApply: (template: DashboardTemplate) => void;
}

export const TemplatePreviewModal: React.FC<TemplatePreviewModalProps> = ({ onApply }) => {
  const { selectedTemplate, isPreviewOpen, closePreview } = useTemplateStore();

  if (!selectedTemplate) return null;

  const CategoryIcon = categoryIcons[selectedTemplate.category];
  const categoryMeta = templateCategories[selectedTemplate.category];

  // Count visual types
  const visualCounts = selectedTemplate.visuals.reduce<Record<string, number>>((acc, v: Visual) => {
    acc[v.type] = (acc[v.type] || 0) + 1;
    return acc;
  }, {});

  const handleApply = () => {
    onApply(selectedTemplate);
    closePreview();
  };

  const modalContent = (
    <AnimatePresence>
      {isPreviewOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={closePreview}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-gray-900 rounded-xl shadow-2xl border border-gray-700 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-start justify-between p-6 border-b border-gray-700">
              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${selectedTemplate.color}20` }}
                >
                  <CategoryIcon
                    className="w-6 h-6"
                    style={{ color: selectedTemplate.color }}
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-xl font-semibold text-white">
                      {selectedTemplate.name}
                    </h2>
                    <span
                      className="px-2 py-0.5 rounded-full text-xs font-medium text-white"
                      style={{ backgroundColor: categoryMeta.color }}
                    >
                      {categoryMeta.name}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm max-w-xl">
                    {selectedTemplate.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedTemplate.tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 bg-gray-800 rounded text-xs text-gray-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <button
                onClick={closePreview}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Preview */}
                <div>
                  <h3 className="text-sm font-medium text-white mb-3">Layout Preview</h3>
                  <div
                    className="relative rounded-lg overflow-hidden border border-gray-700"
                    style={{
                      aspectRatio: `${selectedTemplate.canvasSize.width} / ${selectedTemplate.canvasSize.height}`,
                      background: `linear-gradient(135deg, ${selectedTemplate.color}10, transparent)`,
                    }}
                  >
                    {/* Render mini visuals */}
                    <div className="absolute inset-0">
                      {selectedTemplate.visuals.map((visual: Visual) => {
                        const scaleX = 100 / selectedTemplate.canvasSize.width;
                        const scaleY = 100 / selectedTemplate.canvasSize.height;
                        const VisualIcon = visualTypeIcons[visual.type] || BarChart3;

                        return (
                          <div
                            key={visual.id}
                            className="absolute rounded border border-gray-600 bg-gray-800/80 flex items-center justify-center group"
                            style={{
                              left: `${visual.position.x * scaleX}%`,
                              top: `${visual.position.y * scaleY}%`,
                              width: `${visual.position.width * scaleX}%`,
                              height: `${visual.position.height * scaleY}%`,
                            }}
                            title={(visual.style as { title?: string })?.title || visualTypeLabels[visual.type]}
                          >
                            <VisualIcon
                              className="w-3 h-3 text-gray-500 group-hover:text-gray-300 transition-colors"
                              style={{ color: `${selectedTemplate.color}80` }}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Visual types */}
                  <div className="mt-4">
                    <h4 className="text-xs font-medium text-gray-400 mb-2">Included Visuals</h4>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(visualCounts).map(([type, count]) => {
                        const Icon = visualTypeIcons[type] || BarChart3;
                        return (
                          <div
                            key={type}
                            className="flex items-center gap-1.5 px-2 py-1 bg-gray-800 rounded text-xs text-gray-300"
                          >
                            <Icon className="w-3 h-3" />
                            <span>{visualTypeLabels[type] || type}</span>
                            {count > 1 && (
                              <span className="text-gray-500">x{count}</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Data Requirements */}
                <div>
                  <h3 className="text-sm font-medium text-white mb-3">Data Requirements</h3>
                  <div className="space-y-2">
                    {selectedTemplate.requiredFields.map((field: TemplateDataField) => (
                      <div
                        key={field.name}
                        className="flex items-start gap-3 p-3 bg-gray-800 rounded-lg"
                      >
                        <div className="mt-0.5">
                          {field.required ? (
                            <AlertCircle className="w-4 h-4 text-amber-500" />
                          ) : (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-white text-sm">
                              {field.name}
                            </span>
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                                field.type === 'metric'
                                  ? 'bg-blue-500/20 text-blue-400'
                                  : field.type === 'dimension'
                                  ? 'bg-purple-500/20 text-purple-400'
                                  : 'bg-green-500/20 text-green-400'
                              }`}
                            >
                              {field.type}
                            </span>
                            {field.required && (
                              <span className="px-1.5 py-0.5 bg-amber-500/20 text-amber-400 rounded text-[10px] font-medium">
                                required
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {field.description}
                          </p>
                          {field.example && (
                            <p className="text-xs text-gray-500 mt-0.5">
                              Example: <code className="text-gray-400">{field.example}</code>
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Sample data preview */}
                  <div className="mt-4">
                    <h4 className="text-xs font-medium text-gray-400 mb-2">
                      Sample Data Preview
                    </h4>
                    <div className="overflow-x-auto rounded-lg border border-gray-700">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="bg-gray-800">
                            {Object.keys(selectedTemplate.sampleData[0] || {}).map((key: string) => (
                              <th
                                key={key}
                                className="px-2 py-1.5 text-left font-medium text-gray-300 border-b border-gray-700"
                              >
                                {key}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {selectedTemplate.sampleData.slice(0, 3).map((row: Record<string, unknown>, i: number) => (
                            <tr
                              key={i}
                              className={i % 2 === 0 ? 'bg-gray-900' : 'bg-gray-800/50'}
                            >
                              {Object.values(row).map((val, j: number) => (
                                <td
                                  key={j}
                                  className="px-2 py-1.5 text-gray-400 border-b border-gray-700/50"
                                >
                                  {String(val)}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {selectedTemplate.sampleData.length > 3 && (
                      <p className="text-[10px] text-gray-500 mt-1">
                        +{selectedTemplate.sampleData.length - 3} more rows
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-6 border-t border-gray-700 bg-gray-800/50">
              <div className="text-sm text-gray-400">
                <span className="font-medium text-white">{selectedTemplate.visuals.length}</span> visuals
                <span className="mx-2">•</span>
                <span className="font-medium text-white">
                  {selectedTemplate.canvasSize.width}x{selectedTemplate.canvasSize.height}
                </span> canvas
                <span className="mx-2">•</span>
                Setup: {selectedTemplate.estimatedSetupTime}
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={closePreview}
                  className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApply}
                  className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                  <Sparkles className="w-4 h-4" />
                  Apply Template
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
};
