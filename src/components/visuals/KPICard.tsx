import { TrendingUp, TrendingDown } from 'lucide-react';
import { KPICardVisual } from '../../types/visual.types';
import { useDataStore } from '../../stores/dataStore';
import { formatNumber } from '../../utils/colorUtils';
import { VisualWrapper } from './VisualWrapper';

interface KPICardProps {
  visual: KPICardVisual;
}

export function KPICard({ visual }: KPICardProps) {
  const { aggregateData, rawData } = useDataStore();

  const value = visual.data.field
    ? aggregateData(visual.data.field, visual.data.aggregation)
    : 12345;

  const formattedValue = formatNumber(
    value,
    visual.data.format,
    visual.data.decimals,
    visual.data.prefix,
    visual.data.suffix
  );

  // Calculate trend (mock for now)
  const trendPercent = 12.5;
  const isPositive = trendPercent > 0;

  // Apply conditional formatting
  let valueColor = '#FFFFFF';
  for (const rule of visual.conditionalFormatting) {
    if (rule.condition === 'greater' && value > rule.value) {
      valueColor = rule.color;
      break;
    } else if (rule.condition === 'less' && value < rule.value) {
      valueColor = rule.color;
      break;
    } else if (rule.condition === 'equal' && value === rule.value) {
      valueColor = rule.color;
      break;
    }
  }

  return (
    <VisualWrapper id={visual.id} position={visual.position}>
      <div className="flex flex-col h-full p-5">
        {/* Title */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-white/60">{visual.style.title}</span>
          {visual.data.field && (
            <span className="text-xs text-white/30 bg-white/5 px-2 py-0.5 rounded">
              {visual.data.aggregation}
            </span>
          )}
        </div>

        {/* Value */}
        <div className="flex-1 flex items-center">
          <span
            className="text-4xl font-bold"
            style={{ color: valueColor }}
          >
            {visual.data.field ? formattedValue : '---'}
          </span>
        </div>

        {/* Trend */}
        {visual.style.showTrend && (
          <div className={`flex items-center gap-1 text-sm ${isPositive ? 'text-chart-green' : 'text-chart-red'}`}>
            {isPositive ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span>{isPositive ? '+' : ''}{trendPercent}%</span>
            <span className="text-white/40 text-xs ml-1">vs last period</span>
          </div>
        )}

        {/* No data state */}
        {!visual.data.field && (
          <div className="absolute inset-0 flex items-center justify-center bg-dark-surface/50 rounded-2xl">
            <p className="text-sm text-white/40">Drag a field here</p>
          </div>
        )}
      </div>
    </VisualWrapper>
  );
}
