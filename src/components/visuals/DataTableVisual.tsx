import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DataTableVisual as DataTableVisualType } from '../../types/visual.types';
import { useDataStore } from '../../stores/dataStore';
import { VisualWrapper } from './VisualWrapper';

interface DataTableVisualProps {
  visual: DataTableVisualType;
}

// Sample data for preview
const sampleData = [
  { id: 1, name: 'Product A', category: 'Electronics', sales: 1234, profit: 234 },
  { id: 2, name: 'Product B', category: 'Clothing', sales: 2345, profit: 345 },
  { id: 3, name: 'Product C', category: 'Electronics', sales: 3456, profit: 456 },
  { id: 4, name: 'Product D', category: 'Food', sales: 4567, profit: 567 },
  { id: 5, name: 'Product E', category: 'Clothing', sales: 5678, profit: 678 },
];

export function DataTableVisual({ visual }: DataTableVisualProps) {
  const { getFilteredData } = useDataStore();
  const rawData = getFilteredData();
  const [currentPage, setCurrentPage] = useState(1);

  const hasData = visual.data.columns.length > 0 && rawData.length > 0;
  const displayData = hasData ? rawData : sampleData;
  const displayColumns = hasData
    ? visual.data.columns
    : [
        { field: 'name', label: 'Name', align: 'left' as const },
        { field: 'category', label: 'Category', align: 'left' as const },
        { field: 'sales', label: 'Sales', align: 'right' as const, format: 'number' as const },
        { field: 'profit', label: 'Profit', align: 'right' as const, format: 'number' as const },
      ];

  const pageSize = visual.style.pageSize || 10;
  const totalPages = Math.ceil(displayData.length / pageSize);
  const paginatedData = displayData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const formatCell = (value: unknown, format?: string) => {
    if (value === null || value === undefined) return '-';
    if (format === 'number' || format === 'currency') {
      return new Intl.NumberFormat('vi-VN').format(Number(value));
    }
    if (format === 'percent') {
      return `${Number(value).toFixed(1)}%`;
    }
    return String(value);
  };

  return (
    <VisualWrapper id={visual.id} position={visual.position}>
      <div className="flex flex-col h-full">
        {/* Title */}
        <div className="px-4 pt-4 pb-2">
          <h3 className="text-sm font-medium text-white/80">{visual.style.title}</h3>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto px-4">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                {displayColumns.map((col) => (
                  <th
                    key={col.field}
                    className={`
                      py-2 px-3 text-xs font-semibold uppercase tracking-wider text-white/50
                      text-${col.align || 'left'}
                    `}
                    style={{ width: col.width }}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={`
                    border-b border-white/5 hover:bg-primary-500/5 transition-colors
                    ${visual.style.striped && rowIndex % 2 === 1 ? 'bg-white/[0.02]' : ''}
                  `}
                >
                  {displayColumns.map((col) => (
                    <td
                      key={col.field}
                      className={`
                        ${visual.style.compact ? 'py-1.5' : 'py-2.5'} px-3
                        text-sm text-white/70
                        text-${col.align || 'left'}
                      `}
                    >
                      {formatCell(row[col.field as keyof typeof row], col.format)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {visual.style.showPagination && totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-2 border-t border-white/5">
            <span className="text-xs text-white/40">
              {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, displayData.length)} of {displayData.length}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1 rounded hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4 text-white/60" />
              </button>
              <span className="text-xs text-white/60 px-2">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1 rounded hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4 text-white/60" />
              </button>
            </div>
          </div>
        )}

        {/* No data overlay */}
        {!hasData && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-dark-surface/80 px-4 py-2 rounded-lg backdrop-blur-sm">
              <p className="text-xs text-white/50">Configure columns in properties</p>
            </div>
          </div>
        )}
      </div>
    </VisualWrapper>
  );
}
