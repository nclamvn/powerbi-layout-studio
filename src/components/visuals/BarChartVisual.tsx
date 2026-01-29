import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { BarChartVisual as BarChartVisualType } from '../../types/visual.types';
import { useDataStore } from '../../stores/dataStore';
import { VisualWrapper } from './VisualWrapper';
import { CHART_COLORS } from '../../constants/chartColors';

interface BarChartVisualProps {
  visual: BarChartVisualType;
}

// Sample data for preview
const sampleData = [
  { name: 'A', value1: 400, value2: 240 },
  { name: 'B', value1: 300, value2: 139 },
  { name: 'C', value1: 200, value2: 980 },
  { name: 'D', value1: 278, value2: 390 },
  { name: 'E', value1: 189, value2: 480 },
];

export function BarChartVisual({ visual }: BarChartVisualProps) {
  const { getFilteredData } = useDataStore();
  const rawData = getFilteredData();

  const hasData = visual.data.category.field && visual.data.values.length > 0;
  const chartData = hasData ? rawData : sampleData;

  const isHorizontal = visual.style.orientation === 'horizontal';

  return (
    <VisualWrapper id={visual.id} position={visual.position}>
      <div className="flex flex-col h-full p-4">
        {/* Title */}
        <h3 className="text-sm font-medium text-white/80 mb-3">{visual.style.title}</h3>

        {/* Chart */}
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout={isHorizontal ? 'vertical' : 'horizontal'}
              margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
            >
              {visual.style.showGrid && (
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              )}
              {isHorizontal ? (
                <>
                  <XAxis type="number" stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} />
                  <YAxis
                    type="category"
                    dataKey={hasData ? visual.data.category.field! : 'name'}
                    stroke="rgba(255,255,255,0.4)"
                    fontSize={11}
                    tickLine={false}
                    width={60}
                  />
                </>
              ) : (
                <>
                  <XAxis
                    dataKey={hasData ? visual.data.category.field! : 'name'}
                    stroke="rgba(255,255,255,0.4)"
                    fontSize={11}
                    tickLine={false}
                  />
                  <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} />
                </>
              )}
              <Tooltip
                contentStyle={{
                  backgroundColor: '#262626',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '10px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                }}
                labelStyle={{ color: '#FFFFFF' }}
                itemStyle={{ color: '#A3A3A3' }}
              />
              {visual.style.showLegend && (
                <Legend wrapperStyle={{ fontSize: '11px', color: '#A3A3A3' }} />
              )}
              {hasData ? (
                visual.data.values.map((val, index) => (
                  <Bar
                    key={val.field}
                    dataKey={val.field}
                    fill={val.color || CHART_COLORS[index]}
                    name={val.label || val.field}
                    radius={[4, 4, 0, 0]}
                    stackId={visual.style.stacked ? 'stack' : undefined}
                  />
                ))
              ) : (
                <>
                  <Bar dataKey="value1" fill={CHART_COLORS[0]} name="Series 1" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="value2" fill={CHART_COLORS[1]} name="Series 2" radius={[4, 4, 0, 0]} />
                </>
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* No data overlay */}
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
