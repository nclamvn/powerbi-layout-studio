import { useMemo } from 'react';
import { useDataStore } from '../../stores/dataStore';
import { VisualWrapper } from './VisualWrapper';

interface GaugeVisualProps {
  visual: {
    id: string;
    type: 'gauge';
    position: { x: number; y: number; width: number; height: number };
    data: {
      field: string | null;
      minValue: number;
      maxValue: number;
      aggregation: 'SUM' | 'AVG' | 'COUNT' | 'MIN' | 'MAX';
    };
    style: {
      title: string;
      showValue: boolean;
      showPercent: boolean;
      colorRanges: Array<{ from: number; to: number; color: string }>;
    };
  };
}

export function GaugeVisual({ visual }: GaugeVisualProps) {
  const { aggregateData } = useDataStore();

  const { value, percent } = useMemo(() => {
    if (!visual.data.field) {
      return { value: 75, percent: 75 }; // Demo value
    }

    const aggregated = aggregateData(visual.data.field, visual.data.aggregation);
    const range = visual.data.maxValue - visual.data.minValue;
    const pct = ((aggregated - visual.data.minValue) / range) * 100;

    return {
      value: aggregated,
      percent: Math.min(Math.max(pct, 0), 100)
    };
  }, [visual.data, aggregateData]);

  // Calculate arc
  const radius = 70;
  const strokeWidth = 12;
  const circumference = Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  // Determine color
  const getColor = () => {
    if (visual.style.colorRanges && visual.style.colorRanges.length > 0) {
      for (const range of visual.style.colorRanges) {
        if (value >= range.from && value <= range.to) {
          return range.color;
        }
      }
    }
    // Default gradient based on percent
    if (percent >= 75) return '#52B788';
    if (percent >= 50) return '#F59E0B';
    return '#EF4444';
  };

  return (
    <VisualWrapper id={visual.id} position={visual.position}>
      <div className="flex flex-col h-full p-4">
        <h3 className="text-sm font-medium text-white/80 mb-2">{visual.style.title}</h3>

        <div className="flex-1 flex flex-col items-center justify-center">
          <svg viewBox="0 0 200 120" className="w-full max-w-[180px]">
            {/* Background arc */}
            <path
              d="M 20 100 A 70 70 0 0 1 180 100"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />

            {/* Value arc */}
            <path
              d="M 20 100 A 70 70 0 0 1 180 100"
              fill="none"
              stroke={getColor()}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="transition-all duration-700 ease-out"
            />

            {/* Center text */}
            {visual.style.showValue && (
              <text
                x="100"
                y="85"
                textAnchor="middle"
                className="fill-white text-2xl font-bold"
                style={{ fontSize: '24px' }}
              >
                {visual.data.field ? value.toLocaleString() : '75'}
              </text>
            )}

            {visual.style.showPercent && (
              <text
                x="100"
                y="105"
                textAnchor="middle"
                className="fill-white/60 text-sm"
                style={{ fontSize: '12px' }}
              >
                {percent.toFixed(0)}%
              </text>
            )}
          </svg>

          {/* Min/Max labels */}
          <div className="flex justify-between w-full max-w-[180px] mt-2 text-xs text-white/40">
            <span>{visual.data.minValue}</span>
            <span>{visual.data.maxValue}</span>
          </div>
        </div>

        {!visual.data.field && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-dark-surface/80 px-4 py-2 rounded-lg backdrop-blur-sm">
              <p className="text-xs text-white/50">Configure data field</p>
            </div>
          </div>
        )}
      </div>
    </VisualWrapper>
  );
}
