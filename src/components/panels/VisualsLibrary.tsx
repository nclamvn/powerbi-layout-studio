import { SquareStack, TrendingUp, BarChart3, PieChart, Table, Filter, Gauge, GitMerge, LayoutGrid, Grid3x3 } from 'lucide-react';
import { useProjectStore } from '../../stores/projectStore';
import { VisualType } from '../../types/visual.types';
import { VISUAL_LABELS } from '../../constants/visualDefaults';

const visualIcons: Record<VisualType, typeof SquareStack> = {
  'kpi-card': SquareStack,
  'line-chart': TrendingUp,
  'bar-chart': BarChart3,
  'pie-chart': PieChart,
  'data-table': Table,
  'slicer': Filter,
  'gauge': Gauge,
  'funnel': GitMerge,
  'treemap': LayoutGrid,
  'matrix': Grid3x3,
};

const visualDescriptions: Record<VisualType, string> = {
  'kpi-card': 'Display a single metric with optional trend',
  'line-chart': 'Show trends over time or categories',
  'bar-chart': 'Compare values across categories',
  'pie-chart': 'Show proportions of a whole',
  'data-table': 'Display detailed data in rows',
  'slicer': 'Filter other visuals interactively',
  'gauge': 'Show progress toward a goal',
  'funnel': 'Visualize stage-based conversions',
  'treemap': 'Hierarchical data as nested rectangles',
  'matrix': 'Pivot table with rows, columns & values',
};

export function VisualsLibrary() {
  const { addVisual } = useProjectStore();

  const visualTypes: VisualType[] = [
    'kpi-card',
    'line-chart',
    'bar-chart',
    'pie-chart',
    'data-table',
    'slicer',
    'gauge',
    'funnel',
    'treemap',
    'matrix',
  ];

  const handleAddVisual = (type: VisualType) => {
    addVisual(type);
  };

  return (
    <div className="space-y-2 sm:space-y-4">
      <p className="text-[10px] sm:text-xs text-white/50 mb-2 sm:mb-4">
        Click or drag visuals to add them to the canvas
      </p>

      <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
        {visualTypes.map((type) => {
          const IconComponent = visualIcons[type];
          return (
            <button
              key={type}
              onClick={() => handleAddVisual(type)}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('visualType', type);
              }}
              className="group flex flex-col items-center gap-1 sm:gap-2 p-2 sm:p-4 bg-dark-surface/50 rounded-lg sm:rounded-xl border border-white/5 hover:bg-dark-surface hover:border-primary-500/30 transition-all cursor-pointer"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary-500/10 flex items-center justify-center group-hover:bg-primary-500/20 transition-colors">
                <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 text-primary-400" />
              </div>
              <span className="text-[10px] sm:text-xs text-white/70 group-hover:text-white text-center leading-tight">
                {VISUAL_LABELS[type]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Visual descriptions - Hidden on mobile */}
      <div className="hidden sm:block mt-6 pt-4 border-t border-white/5">
        <h4 className="text-xs font-medium text-white/50 mb-3 uppercase tracking-wider">
          Visual Guide
        </h4>
        <div className="space-y-2">
          {visualTypes.map((type) => {
            const IconComponent = visualIcons[type];
            return (
              <div key={type} className="flex items-start gap-2 text-xs">
                <IconComponent className="w-3.5 h-3.5 text-primary-400 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-white/70">{VISUAL_LABELS[type]}: </span>
                  <span className="text-white/40">{visualDescriptions[type]}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
