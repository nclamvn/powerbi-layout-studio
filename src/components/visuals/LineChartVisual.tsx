import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { LineChartVisual as LineChartVisualType } from '../../types/visual.types';
import { useDataStore } from '../../stores/dataStore';
import { VisualWrapper } from './VisualWrapper';
import { CHART_COLORS } from '../../constants/chartColors';

interface LineChartVisualProps {
  visual: LineChartVisualType;
}

// Sample data for preview
const sampleData = [
  { name: 'Jan', value1: 400, value2: 240 },
  { name: 'Feb', value1: 300, value2: 139 },
  { name: 'Mar', value1: 200, value2: 980 },
  { name: 'Apr', value1: 278, value2: 390 },
  { name: 'May', value1: 189, value2: 480 },
  { name: 'Jun', value1: 239, value2: 380 },
];

export function LineChartVisual({ visual }: LineChartVisualProps) {
  const { getFilteredData } = useDataStore();
  const rawData = getFilteredData();

  const hasData = visual.data.xAxis.field && visual.data.series.length > 0;
  const chartData = hasData ? rawData : sampleData;

  return (
    <VisualWrapper id={visual.id} position={visual.position}>
      <div className="flex flex-col h-full p-4">
        {/* Title */}
        <h3 className="text-sm font-medium text-white/80 mb-3">{visual.style.title}</h3>

        {/* Chart */}
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              {visual.style.showGrid && (
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              )}
              <XAxis
                dataKey={hasData ? visual.data.xAxis.field! : 'name'}
                stroke="rgba(255,255,255,0.4)"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              />
              <YAxis
                stroke="rgba(255,255,255,0.4)"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              />
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
                <Legend
                  wrapperStyle={{ fontSize: '11px', color: '#A3A3A3' }}
                />
              )}
              {hasData ? (
                visual.data.series.map((series, index) => (
                  <Line
                    key={series.field}
                    type={visual.style.curved ? 'monotone' : 'linear'}
                    dataKey={series.field}
                    stroke={series.color || CHART_COLORS[index]}
                    strokeWidth={2}
                    dot={{ fill: series.color || CHART_COLORS[index], strokeWidth: 0, r: 3 }}
                    activeDot={{ r: 5, strokeWidth: 0 }}
                    name={series.label || series.field}
                  />
                ))
              ) : (
                <>
                  <Line
                    type="monotone"
                    dataKey="value1"
                    stroke={CHART_COLORS[0]}
                    strokeWidth={2}
                    dot={{ fill: CHART_COLORS[0], strokeWidth: 0, r: 3 }}
                    name="Series 1"
                  />
                  <Line
                    type="monotone"
                    dataKey="value2"
                    stroke={CHART_COLORS[1]}
                    strokeWidth={2}
                    dot={{ fill: CHART_COLORS[1], strokeWidth: 0, r: 3 }}
                    name="Series 2"
                  />
                </>
              )}
            </LineChart>
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
