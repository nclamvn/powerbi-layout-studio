import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Treemap, ResponsiveContainer } from 'recharts';
import { useDataStore } from '../../stores/dataStore';
import { VisualWrapper } from './VisualWrapper';
import { CHART_COLORS } from '../../constants/chartColors';

interface TreemapVisualProps {
  visual: {
    id: string;
    type: 'treemap';
    position: { x: number; y: number; width: number; height: number };
    data: {
      categoryField: string | null;
      valueField: string | null;
    };
    style: {
      title: string;
      showLabels: boolean;
      showValues: boolean;
      labelPosition: 'center' | 'top-left';
      valueFormat: 'number' | 'currency' | 'percent';
      colorPalette: string[];
    };
  };
}

// Sample data for preview
const sampleData = [
  { name: 'Category A', value: 400 },
  { name: 'Category B', value: 300 },
  { name: 'Category C', value: 200 },
  { name: 'Category D', value: 150 },
  { name: 'Category E', value: 100 },
];

export function TreemapVisual({ visual }: TreemapVisualProps) {
  const { getFilteredData } = useDataStore();
  const data = getFilteredData();

  const treemapData = useMemo(() => {
    if (!visual.data.categoryField || !visual.data.valueField || data.length === 0) {
      return sampleData;
    }

    const grouped: Record<string, number> = {};
    data.forEach((row) => {
      const category = String(row[visual.data.categoryField!] || 'Unknown');
      const value = Number(row[visual.data.valueField!]) || 0;
      grouped[category] = (grouped[category] || 0) + value;
    });

    return Object.entries(grouped)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [data, visual.data]);

  const totalValue = useMemo(
    () => treemapData.reduce((sum, item) => sum + item.value, 0),
    [treemapData]
  );

  const formatValue = (value: number) => {
    switch (visual.style.valueFormat) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          notation: 'compact',
        }).format(value);
      case 'percent':
        return `${((value / totalValue) * 100).toFixed(1)}%`;
      default:
        return new Intl.NumberFormat('en-US', { notation: 'compact' }).format(value);
    }
  };

  const colors = visual.style.colorPalette.length > 0 ? visual.style.colorPalette : CHART_COLORS;

  const CustomContent = (props: any) => {
    const { x, y, width, height, name, value, index } = props;

    if (width < 30 || height < 30) return null;

    const color = colors[index % colors.length];
    const showLabel = visual.style.showLabels && width > 60 && height > 40;
    const showValue = visual.style.showValues && width > 50 && height > 55;

    return (
      <g>
        <motion.rect
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.05 }}
          x={x + 2}
          y={y + 2}
          width={Math.max(0, width - 4)}
          height={Math.max(0, height - 4)}
          rx={4}
          fill={color}
          stroke="rgba(0,0,0,0.2)"
          strokeWidth={1}
          className="cursor-pointer hover:brightness-110 transition-all"
        />
        {showLabel && (
          <text
            x={visual.style.labelPosition === 'center' ? x + width / 2 : x + 8}
            y={visual.style.labelPosition === 'center' ? y + height / 2 - (showValue ? 8 : 0) : y + 20}
            textAnchor={visual.style.labelPosition === 'center' ? 'middle' : 'start'}
            dominantBaseline="middle"
            fill="white"
            fontSize={Math.min(13, width / 7)}
            fontWeight={600}
            style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
          >
            {width < 90 ? name.slice(0, 10) + (name.length > 10 ? '..' : '') : name}
          </text>
        )}
        {showValue && (
          <text
            x={visual.style.labelPosition === 'center' ? x + width / 2 : x + 8}
            y={visual.style.labelPosition === 'center' ? y + height / 2 + 12 : y + 38}
            textAnchor={visual.style.labelPosition === 'center' ? 'middle' : 'start'}
            dominantBaseline="middle"
            fill="rgba(255,255,255,0.8)"
            fontSize={Math.min(11, width / 9)}
            fontWeight={500}
            style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
          >
            {formatValue(value)}
          </text>
        )}
      </g>
    );
  };

  const hasData = visual.data.categoryField && visual.data.valueField && data.length > 0;

  return (
    <VisualWrapper id={visual.id} position={visual.position}>
      <div className="flex flex-col h-full p-4">
        <h3 className="text-sm font-medium text-white/80 mb-2">{visual.style.title}</h3>

        <div className="flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <Treemap
              data={treemapData}
              dataKey="value"
              aspectRatio={4 / 3}
              stroke="transparent"
              content={<CustomContent />}
            />
          </ResponsiveContainer>
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
