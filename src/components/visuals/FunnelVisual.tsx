import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useDataStore } from '../../stores/dataStore';
import { VisualWrapper } from './VisualWrapper';
import { CHART_COLORS } from '../../constants/chartColors';

interface FunnelVisualProps {
  visual: {
    id: string;
    type: 'funnel';
    position: { x: number; y: number; width: number; height: number };
    data: {
      stageField: string | null;
      valueField: string | null;
    };
    style: {
      title: string;
      showLabels: boolean;
      showPercent: boolean;
      showConversion: boolean;
    };
  };
}

// Sample data for preview
const sampleStages = [
  { name: 'Visitors', value: 10000, percent: 100, conversion: '100' },
  { name: 'Leads', value: 5000, percent: 50, conversion: '50.0' },
  { name: 'Qualified', value: 2500, percent: 25, conversion: '50.0' },
  { name: 'Proposals', value: 1000, percent: 10, conversion: '40.0' },
  { name: 'Closed', value: 400, percent: 4, conversion: '40.0' },
];

export function FunnelVisual({ visual }: FunnelVisualProps) {
  const { getFilteredData } = useDataStore();
  const data = getFilteredData();

  const stages = useMemo(() => {
    if (!visual.data.stageField || !visual.data.valueField || data.length === 0) {
      return sampleStages;
    }

    // Group by stage and sum values
    const grouped: Record<string, number> = {};
    data.forEach((row) => {
      const stage = String(row[visual.data.stageField!]);
      const value = Number(row[visual.data.valueField!]) || 0;
      grouped[stage] = (grouped[stage] || 0) + value;
    });

    // Convert to array and sort by value descending
    const stagesArray = Object.entries(grouped)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    // Calculate percentages and conversion rates
    const maxValue = stagesArray[0]?.value || 1;
    return stagesArray.map((stage, index) => ({
      ...stage,
      percent: (stage.value / maxValue) * 100,
      conversion:
        index > 0
          ? ((stage.value / stagesArray[index - 1].value) * 100).toFixed(1)
          : '100',
    }));
  }, [data, visual.data]);

  const hasData = visual.data.stageField && visual.data.valueField && data.length > 0;

  return (
    <VisualWrapper id={visual.id} position={visual.position}>
      <div className="flex flex-col h-full p-4">
        <h3 className="text-sm font-medium text-white/80 mb-3">{visual.style.title}</h3>

        <div className="flex-1 flex flex-col justify-center gap-1">
          {stages.map((stage, index) => (
            <motion.div
              key={stage.name}
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              className="relative flex items-center"
              style={{ originX: 0 }}
            >
              {/* Funnel bar */}
              <div
                className="h-8 rounded-r-lg flex items-center transition-all duration-300"
                style={{
                  width: `${Math.max(stage.percent, 15)}%`,
                  backgroundColor: CHART_COLORS[index % CHART_COLORS.length],
                }}
              >
                {visual.style.showLabels && (
                  <span className="px-3 text-xs font-medium text-white truncate">
                    {stage.name}
                  </span>
                )}
              </div>

              {/* Value and conversion */}
              <div className="ml-3 flex items-center gap-2">
                <span className="text-sm font-semibold text-white">
                  {stage.value.toLocaleString()}
                </span>
                {visual.style.showPercent && (
                  <span className="text-xs text-white/50">
                    ({stage.percent.toFixed(0)}%)
                  </span>
                )}
                {visual.style.showConversion && index > 0 && (
                  <span className="text-xs text-primary-400">
                    {stage.conversion}% conv.
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {!hasData && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-dark-surface/80 px-4 py-2 rounded-lg backdrop-blur-sm">
              <p className="text-xs text-white/50">Configure data fields</p>
            </div>
          </div>
        )}
      </div>
    </VisualWrapper>
  );
}
