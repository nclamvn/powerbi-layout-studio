import { create } from 'zustand';

type SidebarTab = 'data' | 'visuals' | 'theme' | 'export';
type PropertiesTab = 'position' | 'style' | 'data' | 'formatting';

interface UIState {
  sidebarTab: SidebarTab;
  propertiesPanelOpen: boolean;
  propertiesTab: PropertiesTab;
  isExportModalOpen: boolean;
  isDataPreviewOpen: boolean;
  canvasZoom: number;
  showGrid: boolean;
  snapToGrid: boolean;
  gridSize: number;

  // Actions
  setSidebarTab: (tab: SidebarTab) => void;
  setPropertiesPanelOpen: (open: boolean) => void;
  setPropertiesTab: (tab: PropertiesTab) => void;
  setExportModalOpen: (open: boolean) => void;
  setDataPreviewOpen: (open: boolean) => void;
  setCanvasZoom: (zoom: number) => void;
  toggleGrid: () => void;
  toggleSnapToGrid: () => void;
  setGridSize: (size: number) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarTab: 'visuals',
  propertiesPanelOpen: true,
  propertiesTab: 'position',
  isExportModalOpen: false,
  isDataPreviewOpen: false,
  canvasZoom: 1,
  showGrid: true,
  snapToGrid: true,
  gridSize: 20,

  setSidebarTab: (tab) => set({ sidebarTab: tab }),
  setPropertiesPanelOpen: (open) => set({ propertiesPanelOpen: open }),
  setPropertiesTab: (tab) => set({ propertiesTab: tab }),
  setExportModalOpen: (open) => set({ isExportModalOpen: open }),
  setDataPreviewOpen: (open) => set({ isDataPreviewOpen: open }),
  setCanvasZoom: (zoom) => set({ canvasZoom: Math.max(0.25, Math.min(2, zoom)) }),
  toggleGrid: () => set((state) => ({ showGrid: !state.showGrid })),
  toggleSnapToGrid: () => set((state) => ({ snapToGrid: !state.snapToGrid })),
  setGridSize: (size) => set({ gridSize: size }),
}));
