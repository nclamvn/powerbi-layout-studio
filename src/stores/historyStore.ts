import { create } from 'zustand';
import { Visual } from '../types/visual.types';

export interface ProjectSnapshot {
  visuals: Visual[];
  timestamp: number;
}

interface HistoryState {
  past: ProjectSnapshot[];
  future: ProjectSnapshot[];
  maxHistory: number;

  // Actions
  pushState: (visuals: Visual[]) => void;
  undo: () => Visual[] | null;
  redo: () => Visual[] | null;
  canUndo: () => boolean;
  canRedo: () => boolean;
  clearHistory: () => void;
  getCurrentSnapshot: () => ProjectSnapshot | null;
}

export const useHistoryStore = create<HistoryState>((set, get) => ({
  past: [],
  future: [],
  maxHistory: 50,

  pushState: (visuals: Visual[]) => {
    set((state) => {
      const snapshot: ProjectSnapshot = {
        visuals: JSON.parse(JSON.stringify(visuals)),
        timestamp: Date.now(),
      };

      const newPast = [...state.past, snapshot];

      // Limit history size
      if (newPast.length > state.maxHistory) {
        newPast.shift();
      }

      return {
        past: newPast,
        future: [], // Clear future on new action
      };
    });
  },

  undo: () => {
    const { past } = get();
    if (past.length <= 1) return null;

    const newPast = [...past];
    const current = newPast.pop();
    const previous = newPast[newPast.length - 1];

    if (!current || !previous) return null;

    set((state) => ({
      past: newPast,
      future: [current, ...state.future],
    }));

    return previous.visuals;
  },

  redo: () => {
    const { future } = get();
    if (future.length === 0) return null;

    const newFuture = [...future];
    const next = newFuture.shift();

    if (!next) return null;

    set((state) => ({
      past: [...state.past, next],
      future: newFuture,
    }));

    return next.visuals;
  },

  canUndo: () => get().past.length > 1,
  canRedo: () => get().future.length > 0,

  clearHistory: () => {
    set({ past: [], future: [] });
  },

  getCurrentSnapshot: () => {
    const { past } = get();
    return past.length > 0 ? past[past.length - 1] : null;
  },
}));
