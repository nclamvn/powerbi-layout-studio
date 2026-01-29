import { useState } from 'react';
import { Check, Search, X } from 'lucide-react';
import { SlicerVisual as SlicerVisualType } from '../../types/visual.types';
import { useDataStore } from '../../stores/dataStore';
import { VisualWrapper } from './VisualWrapper';

interface SlicerVisualProps {
  visual: SlicerVisualType;
}

// Sample data for preview
const sampleOptions = ['Option A', 'Option B', 'Option C', 'Option D', 'Option E'];

export function SlicerVisual({ visual }: SlicerVisualProps) {
  const { getUniqueValues, activeFilters, setFilter, clearFilter } = useDataStore();
  const [searchTerm, setSearchTerm] = useState('');

  const hasData = !!visual.data.field;
  const options = hasData
    ? getUniqueValues(visual.data.field!).map(String)
    : sampleOptions;

  const selectedValues = hasData
    ? (activeFilters[visual.data.field!] || []).map(String)
    : [];

  const filteredOptions = options.filter((opt) =>
    opt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggle = (value: string) => {
    if (!hasData) return;

    if (visual.style.multiSelect) {
      const newValues = selectedValues.includes(value)
        ? selectedValues.filter((v) => v !== value)
        : [...selectedValues, value];
      setFilter(visual.data.field!, newValues);
    } else {
      setFilter(visual.data.field!, selectedValues.includes(value) ? [] : [value]);
    }
  };

  const handleSelectAll = () => {
    if (!hasData) return;
    setFilter(visual.data.field!, options);
  };

  const handleClearAll = () => {
    if (!hasData) return;
    clearFilter(visual.data.field!);
  };

  // Chips display mode
  if (visual.style.displayMode === 'chips') {
    return (
      <VisualWrapper id={visual.id} position={visual.position}>
        <div className="flex flex-col h-full p-4">
          <h3 className="text-sm font-medium text-white/80 mb-3">{visual.style.title}</h3>

          <div className="flex flex-wrap gap-2">
            {filteredOptions.map((option) => (
              <button
                key={option}
                onClick={() => handleToggle(option)}
                className={`
                  px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                  ${selectedValues.includes(option)
                    ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                    : 'bg-dark-surface text-white/60 border border-white/5 hover:bg-dark-hover hover:text-white'
                  }
                `}
              >
                {option}
              </button>
            ))}
          </div>

          {!hasData && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-dark-surface/80 px-4 py-2 rounded-lg backdrop-blur-sm">
                <p className="text-xs text-white/50">Configure field in properties</p>
              </div>
            </div>
          )}
        </div>
      </VisualWrapper>
    );
  }

  // Dropdown display mode
  if (visual.style.displayMode === 'dropdown') {
    return (
      <VisualWrapper id={visual.id} position={visual.position}>
        <div className="flex flex-col h-full p-4">
          <h3 className="text-sm font-medium text-white/80 mb-3">{visual.style.title}</h3>

          <select
            className="w-full px-3 py-2 bg-dark-surface border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-primary-500/50"
            value={selectedValues[0] || ''}
            onChange={(e) => handleToggle(e.target.value)}
          >
            <option value="">All</option>
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          {!hasData && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-dark-surface/80 px-4 py-2 rounded-lg backdrop-blur-sm">
                <p className="text-xs text-white/50">Configure field</p>
              </div>
            </div>
          )}
        </div>
      </VisualWrapper>
    );
  }

  // List display mode (default)
  return (
    <VisualWrapper id={visual.id} position={visual.position}>
      <div className="flex flex-col h-full">
        <div className="px-4 pt-4 pb-2">
          <h3 className="text-sm font-medium text-white/80">{visual.style.title}</h3>
        </div>

        {/* Search */}
        {visual.style.searchable && (
          <div className="px-4 pb-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search..."
                className="w-full pl-9 pr-3 py-1.5 bg-dark-surface border border-white/10 rounded-lg text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary-500/50"
              />
            </div>
          </div>
        )}

        {/* Select All / Clear */}
        {visual.style.showSelectAll && hasData && (
          <div className="px-4 pb-2 flex gap-2">
            <button
              onClick={handleSelectAll}
              className="text-xs text-primary-400 hover:text-primary-300"
            >
              Select All
            </button>
            <span className="text-white/20">|</span>
            <button
              onClick={handleClearAll}
              className="text-xs text-white/40 hover:text-white/60"
            >
              Clear
            </button>
          </div>
        )}

        {/* Options List */}
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <div className="space-y-1">
            {filteredOptions.map((option) => (
              <button
                key={option}
                onClick={() => handleToggle(option)}
                className={`
                  w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all
                  ${selectedValues.includes(option)
                    ? 'bg-primary-500/15 text-white'
                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                  }
                `}
              >
                <div
                  className={`
                    w-4 h-4 rounded border flex items-center justify-center
                    ${selectedValues.includes(option)
                      ? 'bg-primary-500 border-primary-500'
                      : 'border-white/20'
                    }
                  `}
                >
                  {selectedValues.includes(option) && (
                    <Check className="w-3 h-3 text-white" />
                  )}
                </div>
                <span className="flex-1 text-left truncate">{option}</span>
              </button>
            ))}
          </div>
        </div>

        {!hasData && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-dark-surface/80 px-4 py-2 rounded-lg backdrop-blur-sm">
              <p className="text-xs text-white/50">Configure field in properties</p>
            </div>
          </div>
        )}
      </div>
    </VisualWrapper>
  );
}
