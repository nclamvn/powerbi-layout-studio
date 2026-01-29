import { create } from 'zustand';
import { DataField, FieldType } from '../types/data.types';

interface DataState {
  rawData: Record<string, unknown>[];
  fields: DataField[];
  fileName: string | null;
  activeFilters: Record<string, unknown[]>;

  // Actions
  importData: (data: Record<string, unknown>[], fileName: string) => void;
  clearData: () => void;
  setFilter: (field: string, values: unknown[]) => void;
  clearFilter: (field: string) => void;
  clearAllFilters: () => void;
  getFilteredData: () => Record<string, unknown>[];
  getUniqueValues: (field: string) => unknown[];
  aggregateData: (
    field: string,
    aggregation: 'SUM' | 'AVG' | 'COUNT' | 'MIN' | 'MAX'
  ) => number;
}

function detectFieldType(values: unknown[]): FieldType {
  const nonNullValues = values.filter((v) => v !== null && v !== undefined && v !== '');
  if (nonNullValues.length === 0) return 'string';

  const sample = nonNullValues[0];

  if (typeof sample === 'boolean') return 'boolean';
  if (typeof sample === 'number') return 'number';
  if (!isNaN(Number(sample)) && sample !== '') return 'number';

  // Check for date
  const dateRegex = /^\d{4}-\d{2}-\d{2}|^\d{2}\/\d{2}\/\d{4}/;
  if (typeof sample === 'string' && dateRegex.test(sample)) return 'date';

  return 'string';
}

function parseFields(data: Record<string, unknown>[]): DataField[] {
  if (data.length === 0) return [];

  const keys = Object.keys(data[0]);
  return keys.map((key) => {
    const values = data.map((row) => row[key]);
    return {
      name: key,
      type: detectFieldType(values),
      sample: values.slice(0, 5),
    };
  });
}

export const useDataStore = create<DataState>((set, get) => ({
  rawData: [],
  fields: [],
  fileName: null,
  activeFilters: {},

  importData: (data, fileName) => {
    const fields = parseFields(data);
    set({
      rawData: data,
      fields,
      fileName,
      activeFilters: {},
    });
  },

  clearData: () =>
    set({
      rawData: [],
      fields: [],
      fileName: null,
      activeFilters: {},
    }),

  setFilter: (field, values) => {
    set((state) => ({
      activeFilters: {
        ...state.activeFilters,
        [field]: values,
      },
    }));
  },

  clearFilter: (field) => {
    set((state) => {
      const newFilters = { ...state.activeFilters };
      delete newFilters[field];
      return { activeFilters: newFilters };
    });
  },

  clearAllFilters: () => set({ activeFilters: {} }),

  getFilteredData: () => {
    const { rawData, activeFilters } = get();
    if (Object.keys(activeFilters).length === 0) return rawData;

    return rawData.filter((row) => {
      return Object.entries(activeFilters).every(([field, values]) => {
        if (values.length === 0) return true;
        return values.includes(row[field]);
      });
    });
  },

  getUniqueValues: (field) => {
    const { rawData } = get();
    const values = rawData.map((row) => row[field]);
    return [...new Set(values)].filter((v) => v !== null && v !== undefined);
  },

  aggregateData: (field, aggregation) => {
    const data = get().getFilteredData();
    const values = data
      .map((row) => Number(row[field]))
      .filter((v) => !isNaN(v));

    if (values.length === 0) return 0;

    switch (aggregation) {
      case 'SUM':
        return values.reduce((a, b) => a + b, 0);
      case 'AVG':
        return values.reduce((a, b) => a + b, 0) / values.length;
      case 'COUNT':
        return values.length;
      case 'MIN':
        return Math.min(...values);
      case 'MAX':
        return Math.max(...values);
      default:
        return 0;
    }
  },
}));
