import { create } from 'zustand';
import { nanoid } from 'nanoid';
import { Visual, VisualType } from '../types/visual.types';
import { VISUAL_DEFAULTS } from '../constants/visualDefaults';

interface ProjectState {
  projectName: string;
  visuals: Visual[];
  selectedVisualId: string | null;
  canvasSize: { width: number; height: number };

  // Actions
  setProjectName: (name: string) => void;
  addVisual: (type: VisualType, position?: { x: number; y: number }) => void;
  updateVisual: (id: string, updates: Partial<Visual>) => void;
  removeVisual: (id: string) => void;
  selectVisual: (id: string | null) => void;
  duplicateVisual: (id: string) => void;
  moveVisual: (id: string, delta: { x: number; y: number }) => void;
  resizeVisual: (id: string, size: { width: number; height: number }) => void;
  setCanvasSize: (size: { width: number; height: number }) => void;
  clearProject: () => void;
  loadProject: (data: { projectName: string; visuals: Visual[]; canvasSize: { width: number; height: number } }) => void;
  setVisuals: (visuals: Visual[]) => void;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projectName: 'Untitled Dashboard',
  visuals: [],
  selectedVisualId: null,
  canvasSize: { width: 1920, height: 1080 },

  setProjectName: (name) => set({ projectName: name }),

  addVisual: (type, position) => {
    const defaults = VISUAL_DEFAULTS[type];
    const newVisual = {
      ...defaults,
      id: nanoid(),
      position: position
        ? { ...defaults.position, x: position.x, y: position.y }
        : { ...defaults.position },
    } as Visual;

    set((state) => ({
      visuals: [...state.visuals, newVisual],
      selectedVisualId: newVisual.id,
    }));
  },

  updateVisual: (id, updates) => {
    set((state) => ({
      visuals: state.visuals.map((v) =>
        v.id === id ? { ...v, ...updates } as Visual : v
      ),
    }));
  },

  removeVisual: (id) => {
    set((state) => ({
      visuals: state.visuals.filter((v) => v.id !== id),
      selectedVisualId: state.selectedVisualId === id ? null : state.selectedVisualId,
    }));
  },

  selectVisual: (id) => set({ selectedVisualId: id }),

  duplicateVisual: (id) => {
    const visual = get().visuals.find((v) => v.id === id);
    if (!visual) return;

    const newVisual = {
      ...visual,
      id: nanoid(),
      position: {
        ...visual.position,
        x: visual.position.x + 20,
        y: visual.position.y + 20,
      },
    } as Visual;

    set((state) => ({
      visuals: [...state.visuals, newVisual],
      selectedVisualId: newVisual.id,
    }));
  },

  moveVisual: (id, delta) => {
    set((state) => ({
      visuals: state.visuals.map((v) =>
        v.id === id
          ? {
              ...v,
              position: {
                ...v.position,
                x: Math.max(0, v.position.x + delta.x),
                y: Math.max(0, v.position.y + delta.y),
              },
            } as Visual
          : v
      ),
    }));
  },

  resizeVisual: (id, size) => {
    set((state) => ({
      visuals: state.visuals.map((v) =>
        v.id === id
          ? {
              ...v,
              position: {
                ...v.position,
                width: Math.max(100, size.width),
                height: Math.max(80, size.height),
              },
            } as Visual
          : v
      ),
    }));
  },

  setCanvasSize: (size) => set({ canvasSize: size }),

  clearProject: () =>
    set({
      projectName: 'Untitled Dashboard',
      visuals: [],
      selectedVisualId: null,
    }),

  loadProject: (data) =>
    set({
      projectName: data.projectName,
      visuals: data.visuals,
      canvasSize: data.canvasSize,
      selectedVisualId: null,
    }),

  setVisuals: (visuals) => set({ visuals }),
}));
