import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PieChartVisual as PieChartVisualType } from '../../types/visual.types';
import { useDataStore } from '../../stores/dataStore';
import { VisualWrapper } from './VisualWrapper';
import { CHART_COLORS } from '../../constants/chartColors';

interface PieChartVisualProps {
  visual: PieChartVisualType;
}

// Sample data for preview
const sampleData = [
  { name: 'Category A', value: 400 },
  { name: 'Category B', value: 300 },
  { name: 'Category C', value: 200 },
  { name: 'Category D', value: 150 },
  { name: 'Category E', value: 100 },
];

export function PieChartVisual({ visual }: PieChartVisualProps) {
  const { getFilteredData } = useDataStore();
  const rawData = getFilteredData();

  const hasData = visual.data.category.field && visual.data.value.field;

  // Aggregate data by category
  let chartData = sampleData;
  if (hasData) {
    const aggregated: Record<string, number> = {};
    rawData.forEach((row) => {
      const category = String(row[visual.data.category.field!]);
      const value = Number(row[visual.data.value.field!]) || 0;
      aggregated[category] = (aggregated[category] || 0) + value;
    });
    chartData = Object.entries(aggregated).map(([name, value]) => ({ name, value }));
  }

  const colors = visual.style.colors.length > 0 ? visual.style.colors : CHART_COLORS;

  const renderCustomLabel = ({ name, percent }: { name: string; percent: number }) => {
    if (!visual.style.showLabels) return null;
    return `${name}${visual.style.showPercent ? ` (${(percent * 100).toFixed(0)}%)` : ''}`;
  };

  return (
    <VisualWrapper id={visual.id} position={visual.position}>
      <div className="flex flex-col h-full p-4">
        {/* Title */}
        <h3 className="text-sm font-medium text-white/80 mb-3">{visual.style.title}</h3>

        {/* Chart */}
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={visual.style.donut ? visual.style.innerRadius || 40 : 0}
                outerRadius="80%"
                paddingAngle={2}
                dataKey="value"
                label={visual.style.showLabels ? renderCustomLabel : undefined}
                labelLine={visual.style.showLabels}
              >
                {chartData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index % colors.length]}
                    stroke="rgba(0,0,0,0.2)"
                    strokeWidth={1}
                  />
                ))}
              </Pie>
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
                  layout="horizontal"
                  align="center"
                  verticalAlign="bottom"
                />
              )}
            </PieChart>
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
