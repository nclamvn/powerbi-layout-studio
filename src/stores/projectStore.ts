import { create } from 'zustand';
import { nanoid } from 'nanoid';
import { Visual, VisualType } from '../types/visual.types';
import { VISUAL_DEFAULTS } from '../constants/visualDefaults';

interface ProjectState {
  projectName: string;
  visuals: Visual[];
  selectedVisualIds: string[];
  canvasSize: { width: number; height: number };
  clipboard: Visual[];

  // Actions
  setProjectName: (name: string) => void;
  addVisual: (type: VisualType, position?: { x: number; y: number }) => void;
  updateVisual: (id: string, updates: Partial<Visual>) => void;
  updateVisuals: (visuals: Visual[]) => void;
  removeVisual: (id: string) => void;
  removeVisuals: (ids: string[]) => void;

  // Selection
  selectVisual: (id: string | null, addToSelection?: boolean) => void;
  selectVisuals: (ids: string[]) => void;
  selectAllVisuals: () => void;
  clearSelection: () => void;
  toggleVisualSelection: (id: string) => void;

  // Clipboard
  copyVisuals: () => void;
  pasteVisuals: () => void;
  duplicateVisual: (id: string) => void;
  duplicateVisuals: (ids: string[]) => void;

  // Movement
  moveVisual: (id: string, delta: { x: number; y: number }) => void;
  moveVisuals: (ids: string[], delta: { x: number; y: number }) => void;
  resizeVisual: (id: string, size: { width: number; height: number }) => void;

  // Canvas
  setCanvasSize: (size: { width: number; height: number }) => void;
  clearProject: () => void;
  loadProject: (data: { projectName: string; visuals: Visual[]; canvasSize: { width: number; height: number } }) => void;
  setVisuals: (visuals: Visual[]) => void;

  // Compatibility getter (for components still using selectedVisualId)
  getSelectedVisualId: () => string | null;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projectName: 'Untitled Dashboard',
  visuals: [],
  selectedVisualIds: [],
  canvasSize: { width: 1920, height: 1080 },
  clipboard: [],

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
      selectedVisualIds: [newVisual.id],
    }));
  },

  updateVisual: (id, updates) => {
    set((state) => ({
      visuals: state.visuals.map((v) =>
        v.id === id ? { ...v, ...updates } as Visual : v
      ),
    }));
  },

  updateVisuals: (updatedVisuals) => {
    set((state) => ({
      visuals: state.visuals.map((v) => {
        const updated = updatedVisuals.find((u) => u.id === v.id);
        return updated ? updated : v;
      }),
    }));
  },

  removeVisual: (id) => {
    set((state) => ({
      visuals: state.visuals.filter((v) => v.id !== id),
      selectedVisualIds: state.selectedVisualIds.filter((vid) => vid !== id),
    }));
  },

  removeVisuals: (ids) => {
    set((state) => ({
      visuals: state.visuals.filter((v) => !ids.includes(v.id)),
      selectedVisualIds: state.selectedVisualIds.filter((id) => !ids.includes(id)),
    }));
  },

  // Selection
  selectVisual: (id, addToSelection = false) => {
    if (id === null) {
      set({ selectedVisualIds: [] });
      return;
    }

    set((state) => {
      if (addToSelection) {
        if (state.selectedVisualIds.includes(id)) {
          return state;
        }
        return { selectedVisualIds: [...state.selectedVisualIds, id] };
      }
      return { selectedVisualIds: [id] };
    });
  },

  selectVisuals: (ids) => {
    set({ selectedVisualIds: ids });
  },

  selectAllVisuals: () => {
    set((state) => ({
      selectedVisualIds: state.visuals.map((v) => v.id),
    }));
  },

  clearSelection: () => {
    set({ selectedVisualIds: [] });
  },

  toggleVisualSelection: (id) => {
    set((state) => {
      if (state.selectedVisualIds.includes(id)) {
        return { selectedVisualIds: state.selectedVisualIds.filter((vid) => vid !== id) };
      }
      return { selectedVisualIds: [...state.selectedVisualIds, id] };
    });
  },

  // Clipboard
  copyVisuals: () => {
    const { visuals, selectedVisualIds } = get();
    const toCopy = visuals.filter((v) => selectedVisualIds.includes(v.id));
    set({ clipboard: toCopy });
  },

  pasteVisuals: () => {
    const { clipboard } = get();
    if (clipboard.length === 0) return;

    const pasted = clipboard.map((v) => ({
      ...JSON.parse(JSON.stringify(v)),
      id: nanoid(),
      position: {
        ...v.position,
        x: v.position.x + 20,
        y: v.position.y + 20,
      },
    }));

    set((state) => ({
      visuals: [...state.visuals, ...pasted],
      selectedVisualIds: pasted.map((v) => v.id),
    }));
  },

  duplicateVisual: (id) => {
    const visual = get().visuals.find((v) => v.id === id);
    if (!visual) return;

    const newVisual = {
      ...JSON.parse(JSON.stringify(visual)),
      id: nanoid(),
      position: {
        ...visual.position,
        x: visual.position.x + 20,
        y: visual.position.y + 20,
      },
    } as Visual;

    set((state) => ({
      visuals: [...state.visuals, newVisual],
      selectedVisualIds: [newVisual.id],
    }));
  },

  duplicateVisuals: (ids) => {
    const { visuals } = get();
    const toDuplicate = visuals.filter((v) => ids.includes(v.id));

    const duplicated = toDuplicate.map((v) => ({
      ...JSON.parse(JSON.stringify(v)),
      id: nanoid(),
      position: {
        ...v.position,
        x: v.position.x + 20,
        y: v.position.y + 20,
      },
    }));

    set((state) => ({
      visuals: [...state.visuals, ...duplicated],
      selectedVisualIds: duplicated.map((v) => v.id),
    }));
  },

  // Movement
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

  moveVisuals: (ids, delta) => {
    set((state) => ({
      visuals: state.visuals.map((v) =>
        ids.includes(v.id)
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
      selectedVisualIds: [],
      clipboard: [],
    }),

  loadProject: (data) =>
    set({
      projectName: data.projectName,
      visuals: data.visuals,
      canvasSize: data.canvasSize,
      selectedVisualIds: [],
    }),

  setVisuals: (visuals) => set({ visuals }),

  // Compatibility getter
  getSelectedVisualId: () => {
    const { selectedVisualIds } = get();
    return selectedVisualIds.length === 1 ? selectedVisualIds[0] : null;
  },
}));

// Selector for backward compatibility
export const useSelectedVisualId = () => {
  const selectedVisualIds = useProjectStore((state) => state.selectedVisualIds);
  return selectedVisualIds.length === 1 ? selectedVisualIds[0] : null;
};
