/**
 * GeneratedPreview Component
 * Preview AI generated dashboard before applying
 */

import {
  Check,
  X,
  LayoutGrid,
  Database,
  ChevronRight,
  BarChart3,
  LineChart,
  PieChart,
  Table2,
  Gauge,
  Filter,
  GitBranch,
  Grid3X3,
  TreeDeciduous,
  Columns
} from 'lucide-react';
import { AIGeneratedDashboard, AIVisualSpec, DataFieldSpec } from '../../services/aiService';

interface GeneratedPreviewProps {
  dashboard: AIGeneratedDashboard;
  onApply: () => void;
  onCancel: () => void;
  isApplying?: boolean;
}

// Icon mapping for visual types
const VISUAL_ICONS: Record<string, React.ElementType> = {
  'kpi-card': Columns,
  'line-chart': LineChart,
  'bar-chart': BarChart3,
  'pie-chart': PieChart,
  'data-table': Table2,
  'slicer': Filter,
  'gauge': Gauge,
  'funnel': GitBranch,
  'treemap': TreeDeciduous,
  'matrix': Grid3X3,
};

// Color mapping for visual types
const VISUAL_COLORS: Record<string, string> = {
  'kpi-card': 'bg-blue-100 text-blue-600',
  'line-chart': 'bg-green-100 text-green-600',
  'bar-chart': 'bg-purple-100 text-purple-600',
  'pie-chart': 'bg-orange-100 text-orange-600',
  'data-table': 'bg-gray-100 text-gray-600',
  'slicer': 'bg-cyan-100 text-cyan-600',
  'gauge': 'bg-yellow-100 text-yellow-600',
  'funnel': 'bg-pink-100 text-pink-600',
  'treemap': 'bg-emerald-100 text-emerald-600',
  'matrix': 'bg-indigo-100 text-indigo-600',
};

// Type badge colors
const TYPE_BADGES: Record<string, string> = {
  'metric': 'bg-blue-100 text-blue-700',
  'dimension': 'bg-purple-100 text-purple-700',
  'time': 'bg-green-100 text-green-700',
};

function VisualCard({ visual }: { visual: AIVisualSpec }) {
  const Icon = VISUAL_ICONS[visual.type] || LayoutGrid;
  const colorClass = VISUAL_COLORS[visual.type] || 'bg-gray-100 text-gray-600';

  return (
    <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
      <div className={`p-2 rounded-lg ${colorClass}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm text-gray-800 truncate">
          {visual.title}
        </div>
        <div className="text-xs text-gray-500">
          {visual.type} - {visual.position.width}x{visual.position.height}
        </div>
      </div>
    </div>
  );
}

function DataFieldBadge({ field }: { field: DataFieldSpec }) {
  const badgeClass = TYPE_BADGES[field.type] || 'bg-gray-100 text-gray-700';

  return (
    <div className="flex items-center gap-2 p-2 bg-white border border-gray-200 rounded-lg">
      <span className={`px-2 py-0.5 text-xs font-medium rounded ${badgeClass}`}>
        {field.type}
      </span>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm text-gray-800">{field.name}</div>
        <div className="text-xs text-gray-500 truncate">{field.description}</div>
      </div>
    </div>
  );
}

function MiniCanvas({ visuals }: { visuals: AIVisualSpec[] }) {
  const canvasWidth = 1920;
  const canvasHeight = 1080;
  const scale = 200 / canvasWidth; // Scale to fit in preview

  return (
    <div
      className="relative bg-gray-100 rounded-lg overflow-hidden border border-gray-200"
      style={{
        width: canvasWidth * scale,
        height: canvasHeight * scale
      }}
    >
      {visuals.map((visual, index) => {
        const colorClass = VISUAL_COLORS[visual.type]?.split(' ')[0] || 'bg-gray-200';

        return (
          <div
            key={visual.id || index}
            className={`absolute ${colorClass} rounded-sm border border-white/50`}
            style={{
              left: visual.position.x * scale,
              top: visual.position.y * scale,
              width: visual.position.width * scale,
              height: visual.position.height * scale,
            }}
            title={visual.title}
          />
        );
      })}
    </div>
  );
}

export function GeneratedPreview({
  dashboard,
  onApply,
  onCancel,
  isApplying = false
}: GeneratedPreviewProps) {
  // Group visuals by type for summary
  const visualsByType = dashboard.visuals.reduce((acc, visual) => {
    acc[visual.type] = (acc[visual.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-green-50 to-emerald-50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">{dashboard.projectName}</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {dashboard.visuals.length} visuals - {dashboard.requiredDataFields.length} data fields
            </p>
          </div>
          <MiniCanvas visuals={dashboard.visuals} />
        </div>
      </div>

      {/* Content */}
      <div className="p-4 max-h-[400px] overflow-y-auto">
        {/* Visual Summary */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <LayoutGrid className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Visuals</span>
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            {Object.entries(visualsByType).map(([type, count]) => {
              const Icon = VISUAL_ICONS[type] || LayoutGrid;
              const colorClass = VISUAL_COLORS[type] || 'bg-gray-100 text-gray-600';
              return (
                <div
                  key={type}
                  className={`flex items-center gap-1.5 px-2 py-1 rounded-full ${colorClass}`}
                >
                  <Icon className="w-3 h-3" />
                  <span className="text-xs font-medium">{count} {type}</span>
                </div>
              );
            })}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {dashboard.visuals.map((visual, index) => (
              <VisualCard key={visual.id || index} visual={visual} />
            ))}
          </div>
        </div>

        {/* Required Data Fields */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Database className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Required Data Fields</span>
          </div>
          <div className="space-y-2">
            {dashboard.requiredDataFields.map((field, index) => (
              <DataFieldBadge key={index} field={field} />
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
        <button
          onClick={onCancel}
          disabled={isApplying}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
        >
          <span className="flex items-center gap-1.5">
            <X className="w-4 h-4" />
            Cancel
          </span>
        </button>
        <button
          onClick={onApply}
          disabled={isApplying}
          className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center gap-1.5"
        >
          {isApplying ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Applying...</span>
            </>
          ) : (
            <>
              <Check className="w-4 h-4" />
              <span>Apply Dashboard</span>
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default GeneratedPreview;
