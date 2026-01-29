import { motion } from 'framer-motion';
import { X, Move, Paintbrush, Database, Sparkles } from 'lucide-react';
import { useProjectStore } from '../../stores/projectStore';
import { useDataStore } from '../../stores/dataStore';
import { useUIStore } from '../../stores/uiStore';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Tabs } from '../ui/Tabs';
import { VISUAL_LABELS } from '../../constants/visualDefaults';
import { Visual, VisualType } from '../../types/visual.types';

export function PropertiesPanel() {
  const { visuals, selectedVisualId, updateVisual } = useProjectStore();
  const { fields } = useDataStore();
  const { propertiesTab, setPropertiesTab, setPropertiesPanelOpen } = useUIStore();

  const selectedVisual = visuals.find((v) => v.id === selectedVisualId);

  if (!selectedVisual) return null;

  const tabs = [
    { id: 'position', label: 'Position', icon: <Move className="w-4 h-4" /> },
    { id: 'style', label: 'Style', icon: <Paintbrush className="w-4 h-4" /> },
    { id: 'data', label: 'Data', icon: <Database className="w-4 h-4" /> },
    { id: 'formatting', label: 'Format', icon: <Sparkles className="w-4 h-4" /> },
  ];

  const fieldOptions = [
    { value: '', label: 'Select field...' },
    ...fields.map((f) => ({ value: f.name, label: f.name })),
  ];

  const handlePositionChange = (key: keyof typeof selectedVisual.position, value: number) => {
    updateVisual(selectedVisual.id, {
      position: { ...selectedVisual.position, [key]: value },
    });
  };

  const handleStyleChange = (key: string, value: unknown) => {
    updateVisual(selectedVisual.id, {
      style: { ...selectedVisual.style, [key]: value },
    } as Partial<Visual>);
  };

  const handleDataChange = (key: string, value: unknown) => {
    updateVisual(selectedVisual.id, {
      data: { ...selectedVisual.data, [key]: value },
    } as Partial<Visual>);
  };

  return (
    <motion.aside
      initial={{ x: 320, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 320, opacity: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="w-[320px] h-full flex flex-col bg-dark-elevated border-l border-white/5 flex-shrink-0"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/5">
        <div>
          <h2 className="text-sm font-semibold text-white">Properties</h2>
          <p className="text-xs text-white/40">{VISUAL_LABELS[selectedVisual.type as VisualType]}</p>
        </div>
        <button
          onClick={() => setPropertiesPanelOpen(false)}
          className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="p-4 border-b border-white/5">
        <Tabs
          tabs={tabs}
          activeTab={propertiesTab}
          onChange={(id) => setPropertiesTab(id as typeof propertiesTab)}
        />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Position Tab */}
        {propertiesTab === 'position' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="X Position"
                type="number"
                value={selectedVisual.position.x}
                onChange={(e) => handlePositionChange('x', Number(e.target.value))}
              />
              <Input
                label="Y Position"
                type="number"
                value={selectedVisual.position.y}
                onChange={(e) => handlePositionChange('y', Number(e.target.value))}
              />
              <Input
                label="Width"
                type="number"
                value={selectedVisual.position.width}
                onChange={(e) => handlePositionChange('width', Number(e.target.value))}
              />
              <Input
                label="Height"
                type="number"
                value={selectedVisual.position.height}
                onChange={(e) => handlePositionChange('height', Number(e.target.value))}
              />
            </div>

            <div className="pt-4 border-t border-white/5">
              <h4 className="text-xs font-medium text-white/50 mb-2">Position Preview</h4>
              <div className="aspect-video bg-dark-surface rounded-lg relative overflow-hidden">
                <div
                  className="absolute bg-primary-500/30 border border-primary-500 rounded"
                  style={{
                    left: `${(selectedVisual.position.x / 1920) * 100}%`,
                    top: `${(selectedVisual.position.y / 1080) * 100}%`,
                    width: `${(selectedVisual.position.width / 1920) * 100}%`,
                    height: `${(selectedVisual.position.height / 1080) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Style Tab */}
        {propertiesTab === 'style' && (
          <div className="space-y-4">
            <Input
              label="Title"
              value={selectedVisual.style.title || ''}
              onChange={(e) => handleStyleChange('title', e.target.value)}
            />

            {/* Chart-specific style options */}
            {(selectedVisual.type === 'line-chart' || selectedVisual.type === 'bar-chart') && (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/60">Show Grid</span>
                  <button
                    onClick={() => handleStyleChange('showGrid', !selectedVisual.style.showGrid)}
                    className={`w-10 h-6 rounded-full transition-colors ${
                      selectedVisual.style.showGrid ? 'bg-primary-500' : 'bg-dark-surface'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform ${
                        selectedVisual.style.showGrid ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/60">Show Legend</span>
                  <button
                    onClick={() => handleStyleChange('showLegend', !selectedVisual.style.showLegend)}
                    className={`w-10 h-6 rounded-full transition-colors ${
                      selectedVisual.style.showLegend ? 'bg-primary-500' : 'bg-dark-surface'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform ${
                        selectedVisual.style.showLegend ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </>
            )}

            {selectedVisual.type === 'pie-chart' && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/60">Donut Style</span>
                <button
                  onClick={() => handleStyleChange('donut', !selectedVisual.style.donut)}
                  className={`w-10 h-6 rounded-full transition-colors ${
                    selectedVisual.style.donut ? 'bg-primary-500' : 'bg-dark-surface'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      selectedVisual.style.donut ? 'translate-x-5' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            )}

            {selectedVisual.type === 'kpi-card' && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/60">Show Trend</span>
                <button
                  onClick={() => handleStyleChange('showTrend', !selectedVisual.style.showTrend)}
                  className={`w-10 h-6 rounded-full transition-colors ${
                    selectedVisual.style.showTrend ? 'bg-primary-500' : 'bg-dark-surface'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      selectedVisual.style.showTrend ? 'translate-x-5' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            )}

            {selectedVisual.type === 'gauge' && (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/60">Show Value</span>
                  <button
                    onClick={() => handleStyleChange('showValue', !selectedVisual.style.showValue)}
                    className={`w-10 h-6 rounded-full transition-colors ${
                      selectedVisual.style.showValue ? 'bg-primary-500' : 'bg-dark-surface'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform ${
                        selectedVisual.style.showValue ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/60">Show Percent</span>
                  <button
                    onClick={() => handleStyleChange('showPercent', !selectedVisual.style.showPercent)}
                    className={`w-10 h-6 rounded-full transition-colors ${
                      selectedVisual.style.showPercent ? 'bg-primary-500' : 'bg-dark-surface'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform ${
                        selectedVisual.style.showPercent ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </>
            )}

            {selectedVisual.type === 'funnel' && (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/60">Show Labels</span>
                  <button
                    onClick={() => handleStyleChange('showLabels', !selectedVisual.style.showLabels)}
                    className={`w-10 h-6 rounded-full transition-colors ${
                      selectedVisual.style.showLabels ? 'bg-primary-500' : 'bg-dark-surface'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform ${
                        selectedVisual.style.showLabels ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/60">Show Percent</span>
                  <button
                    onClick={() => handleStyleChange('showPercent', !selectedVisual.style.showPercent)}
                    className={`w-10 h-6 rounded-full transition-colors ${
                      selectedVisual.style.showPercent ? 'bg-primary-500' : 'bg-dark-surface'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform ${
                        selectedVisual.style.showPercent ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/60">Show Conversion</span>
                  <button
                    onClick={() => handleStyleChange('showConversion', !selectedVisual.style.showConversion)}
                    className={`w-10 h-6 rounded-full transition-colors ${
                      selectedVisual.style.showConversion ? 'bg-primary-500' : 'bg-dark-surface'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform ${
                        selectedVisual.style.showConversion ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </>
            )}

            {selectedVisual.type === 'treemap' && (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/60">Show Labels</span>
                  <button
                    onClick={() => handleStyleChange('showLabels', !selectedVisual.style.showLabels)}
                    className={`w-10 h-6 rounded-full transition-colors ${
                      selectedVisual.style.showLabels ? 'bg-primary-500' : 'bg-dark-surface'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform ${
                        selectedVisual.style.showLabels ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/60">Show Values</span>
                  <button
                    onClick={() => handleStyleChange('showValues', !selectedVisual.style.showValues)}
                    className={`w-10 h-6 rounded-full transition-colors ${
                      selectedVisual.style.showValues ? 'bg-primary-500' : 'bg-dark-surface'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform ${
                        selectedVisual.style.showValues ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                <Select
                  label="Label Position"
                  options={[
                    { value: 'center', label: 'Center' },
                    { value: 'top-left', label: 'Top Left' },
                  ]}
                  value={selectedVisual.style.labelPosition}
                  onChange={(e) => handleStyleChange('labelPosition', e.target.value)}
                />
                <Select
                  label="Value Format"
                  options={[
                    { value: 'number', label: 'Number' },
                    { value: 'currency', label: 'Currency' },
                    { value: 'percent', label: 'Percent' },
                  ]}
                  value={selectedVisual.style.valueFormat}
                  onChange={(e) => handleStyleChange('valueFormat', e.target.value)}
                />
              </>
            )}

            {selectedVisual.type === 'matrix' && (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/60">Show Row Totals</span>
                  <button
                    onClick={() => handleStyleChange('showRowTotals', !selectedVisual.style.showRowTotals)}
                    className={`w-10 h-6 rounded-full transition-colors ${
                      selectedVisual.style.showRowTotals ? 'bg-primary-500' : 'bg-dark-surface'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform ${
                        selectedVisual.style.showRowTotals ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/60">Show Column Totals</span>
                  <button
                    onClick={() => handleStyleChange('showColumnTotals', !selectedVisual.style.showColumnTotals)}
                    className={`w-10 h-6 rounded-full transition-colors ${
                      selectedVisual.style.showColumnTotals ? 'bg-primary-500' : 'bg-dark-surface'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform ${
                        selectedVisual.style.showColumnTotals ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/60">Show Grand Total</span>
                  <button
                    onClick={() => handleStyleChange('showGrandTotal', !selectedVisual.style.showGrandTotal)}
                    className={`w-10 h-6 rounded-full transition-colors ${
                      selectedVisual.style.showGrandTotal ? 'bg-primary-500' : 'bg-dark-surface'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform ${
                        selectedVisual.style.showGrandTotal ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/60">Enable Heatmap</span>
                  <button
                    onClick={() => handleStyleChange('heatmapEnabled', !selectedVisual.style.heatmapEnabled)}
                    className={`w-10 h-6 rounded-full transition-colors ${
                      selectedVisual.style.heatmapEnabled ? 'bg-primary-500' : 'bg-dark-surface'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform ${
                        selectedVisual.style.heatmapEnabled ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/60">Alternate Row Colors</span>
                  <button
                    onClick={() => handleStyleChange('alternateRowColors', !selectedVisual.style.alternateRowColors)}
                    className={`w-10 h-6 rounded-full transition-colors ${
                      selectedVisual.style.alternateRowColors ? 'bg-primary-500' : 'bg-dark-surface'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform ${
                        selectedVisual.style.alternateRowColors ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/60">Compact Mode</span>
                  <button
                    onClick={() => handleStyleChange('compact', !selectedVisual.style.compact)}
                    className={`w-10 h-6 rounded-full transition-colors ${
                      selectedVisual.style.compact ? 'bg-primary-500' : 'bg-dark-surface'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform ${
                        selectedVisual.style.compact ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Data Tab */}
        {propertiesTab === 'data' && (
          <div className="space-y-4">
            {selectedVisual.type === 'kpi-card' && (
              <>
                <Select
                  label="Value Field"
                  options={fieldOptions}
                  value={selectedVisual.data.field || ''}
                  onChange={(e) => handleDataChange('field', e.target.value || null)}
                />
                <Select
                  label="Aggregation"
                  options={[
                    { value: 'SUM', label: 'Sum' },
                    { value: 'AVG', label: 'Average' },
                    { value: 'COUNT', label: 'Count' },
                    { value: 'MIN', label: 'Minimum' },
                    { value: 'MAX', label: 'Maximum' },
                  ]}
                  value={selectedVisual.data.aggregation}
                  onChange={(e) => handleDataChange('aggregation', e.target.value)}
                />
                <Select
                  label="Format"
                  options={[
                    { value: 'number', label: 'Number' },
                    { value: 'currency', label: 'Currency' },
                    { value: 'percent', label: 'Percent' },
                  ]}
                  value={selectedVisual.data.format}
                  onChange={(e) => handleDataChange('format', e.target.value)}
                />
              </>
            )}

            {(selectedVisual.type === 'line-chart' || selectedVisual.type === 'bar-chart') && (
              <>
                <Select
                  label={selectedVisual.type === 'line-chart' ? 'X-Axis Field' : 'Category Field'}
                  options={fieldOptions}
                  value={
                    selectedVisual.type === 'line-chart'
                      ? selectedVisual.data.xAxis?.field || ''
                      : selectedVisual.data.category?.field || ''
                  }
                  onChange={(e) => {
                    if (selectedVisual.type === 'line-chart') {
                      handleDataChange('xAxis', { ...selectedVisual.data.xAxis, field: e.target.value || null });
                    } else {
                      handleDataChange('category', { field: e.target.value || null });
                    }
                  }}
                />
                <p className="text-xs text-white/40">
                  Configure series in the export specs for full control
                </p>
              </>
            )}

            {selectedVisual.type === 'slicer' && (
              <Select
                label="Filter Field"
                options={fieldOptions}
                value={selectedVisual.data.field || ''}
                onChange={(e) => handleDataChange('field', e.target.value || null)}
              />
            )}

            {selectedVisual.type === 'pie-chart' && (
              <>
                <Select
                  label="Category Field"
                  options={fieldOptions}
                  value={selectedVisual.data.category?.field || ''}
                  onChange={(e) => handleDataChange('category', { field: e.target.value || null })}
                />
                <Select
                  label="Value Field"
                  options={fieldOptions}
                  value={selectedVisual.data.value?.field || ''}
                  onChange={(e) => handleDataChange('value', { ...selectedVisual.data.value, field: e.target.value || null })}
                />
              </>
            )}

            {selectedVisual.type === 'gauge' && (
              <>
                <Select
                  label="Value Field"
                  options={fieldOptions}
                  value={selectedVisual.data.field || ''}
                  onChange={(e) => handleDataChange('field', e.target.value || null)}
                />
                <Select
                  label="Aggregation"
                  options={[
                    { value: 'SUM', label: 'Sum' },
                    { value: 'AVG', label: 'Average' },
                    { value: 'COUNT', label: 'Count' },
                    { value: 'MIN', label: 'Minimum' },
                    { value: 'MAX', label: 'Maximum' },
                  ]}
                  value={selectedVisual.data.aggregation}
                  onChange={(e) => handleDataChange('aggregation', e.target.value)}
                />
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Min Value"
                    type="number"
                    value={selectedVisual.data.minValue}
                    onChange={(e) => handleDataChange('minValue', Number(e.target.value))}
                  />
                  <Input
                    label="Max Value"
                    type="number"
                    value={selectedVisual.data.maxValue}
                    onChange={(e) => handleDataChange('maxValue', Number(e.target.value))}
                  />
                </div>
              </>
            )}

            {selectedVisual.type === 'funnel' && (
              <>
                <Select
                  label="Stage Field"
                  options={fieldOptions}
                  value={selectedVisual.data.stageField || ''}
                  onChange={(e) => handleDataChange('stageField', e.target.value || null)}
                />
                <Select
                  label="Value Field"
                  options={fieldOptions}
                  value={selectedVisual.data.valueField || ''}
                  onChange={(e) => handleDataChange('valueField', e.target.value || null)}
                />
              </>
            )}

            {selectedVisual.type === 'treemap' && (
              <>
                <Select
                  label="Category Field"
                  options={fieldOptions}
                  value={selectedVisual.data.categoryField || ''}
                  onChange={(e) => handleDataChange('categoryField', e.target.value || null)}
                />
                <Select
                  label="Value Field"
                  options={fieldOptions}
                  value={selectedVisual.data.valueField || ''}
                  onChange={(e) => handleDataChange('valueField', e.target.value || null)}
                />
              </>
            )}

            {selectedVisual.type === 'matrix' && (
              <>
                <Select
                  label="Row Field"
                  options={fieldOptions}
                  value={selectedVisual.data.rowFields[0] || ''}
                  onChange={(e) => handleDataChange('rowFields', e.target.value ? [e.target.value] : [])}
                />
                <Select
                  label="Column Field"
                  options={fieldOptions}
                  value={selectedVisual.data.columnFields[0] || ''}
                  onChange={(e) => handleDataChange('columnFields', e.target.value ? [e.target.value] : [])}
                />
                <Select
                  label="Value Field"
                  options={fieldOptions}
                  value={selectedVisual.data.valueField || ''}
                  onChange={(e) => handleDataChange('valueField', e.target.value || null)}
                />
                <Select
                  label="Aggregation"
                  options={[
                    { value: 'SUM', label: 'Sum' },
                    { value: 'AVG', label: 'Average' },
                    { value: 'COUNT', label: 'Count' },
                    { value: 'MIN', label: 'Minimum' },
                    { value: 'MAX', label: 'Maximum' },
                  ]}
                  value={selectedVisual.data.aggregation}
                  onChange={(e) => handleDataChange('aggregation', e.target.value)}
                />
              </>
            )}

            {fields.length === 0 && (
              <div className="p-4 bg-primary-500/10 rounded-xl border border-primary-500/20 text-center">
                <p className="text-xs text-white/60">Upload data first to bind fields</p>
              </div>
            )}
          </div>
        )}

        {/* Formatting Tab */}
        {propertiesTab === 'formatting' && (
          <div className="space-y-4">
            {selectedVisual.type === 'kpi-card' && (
              <>
                <h4 className="text-xs font-medium text-white/50">Conditional Formatting</h4>
                <p className="text-xs text-white/40">
                  Define rules to change the value color based on conditions.
                </p>
                <div className="space-y-2">
                  {(selectedVisual.conditionalFormatting || []).map((rule, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-dark-surface rounded-lg">
                      <span className="text-xs text-white/60">If value</span>
                      <span className="text-xs text-white">{rule.condition}</span>
                      <span className="text-xs text-white">{rule.value}</span>
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: rule.color }}
                      />
                    </div>
                  ))}
                </div>
                <p className="text-xs text-white/30">
                  Edit conditional formatting in the exported specs
                </p>
              </>
            )}

            {selectedVisual.type !== 'kpi-card' && (
              <div className="text-center py-8">
                <p className="text-xs text-white/40">
                  Formatting options available in export specs
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.aside>
  );
}
