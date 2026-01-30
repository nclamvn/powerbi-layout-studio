import { AnimatePresence } from 'framer-motion';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Canvas } from './components/layout/Canvas';
import { PropertiesPanel } from './components/layout/PropertiesPanel';
import { CanvasControls } from './components/layout/CanvasControls';
import { Modal } from './components/ui/Modal';
import { ToastProvider } from './components/ui/Toast';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useProjectStore } from './stores/projectStore';
import { useUIStore } from './stores/uiStore';
import { useExport } from './hooks/useExport';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useAutoSave } from './hooks/useAutoSave';
import { FileJson, FileText } from 'lucide-react';

function AppContent() {
  const { selectedVisualIds, visuals } = useProjectStore();
  const { propertiesPanelOpen, isExportModalOpen, setExportModalOpen } = useUIStore();
  const selectedVisualId = selectedVisualIds.length === 1 ? selectedVisualIds[0] : null;
  const { handleExportJSON, handleExportPDF } = useExport();

  // Initialize keyboard shortcuts
  useKeyboardShortcuts();

  // Initialize auto-save
  useAutoSave();

  const handleExportPDFClick = () => {
    const canvasElement = document.getElementById('canvas-area');
    handleExportPDF(canvasElement);
    setExportModalOpen(false);
  };

  return (
    <div className="h-screen w-screen flex bg-dark-deepest overflow-hidden relative">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Header */}
        <Header />

        {/* Canvas Container */}
        <div className="flex-1 relative">
          <div className="absolute inset-0 overflow-hidden">
            <Canvas />
          </div>
        </div>

        {/* Controls - centered at bottom of canvas area */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-none z-40">
          <div className="pointer-events-auto">
            <CanvasControls />
          </div>
        </div>
      </div>

      {/* Properties Panel */}
      <AnimatePresence>
        {selectedVisualId && propertiesPanelOpen && <PropertiesPanel />}
      </AnimatePresence>

      {/* Export Modal */}
      <Modal
        isOpen={isExportModalOpen}
        onClose={() => setExportModalOpen(false)}
        title="Export Specs"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-sm text-white/60">
            Export your dashboard layout and configuration for Power BI implementation.
          </p>

          <div className="space-y-3">
            <button
              onClick={() => {
                handleExportJSON();
                setExportModalOpen(false);
              }}
              className="w-full flex items-center gap-4 p-4 bg-dark-surface rounded-xl border border-white/10 hover:border-primary-500/30 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center group-hover:bg-primary-500/20">
                <FileJson className="w-6 h-6 text-primary-400" />
              </div>
              <div className="text-left">
                <h4 className="text-sm font-medium text-white">JSON Specs</h4>
                <p className="text-xs text-white/40">
                  Complete specification file with all visual configs
                </p>
              </div>
            </button>

            <button
              onClick={handleExportPDFClick}
              className="w-full flex items-center gap-4 p-4 bg-dark-surface rounded-xl border border-white/10 hover:border-primary-500/30 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-chart-amber/10 flex items-center justify-center group-hover:bg-chart-amber/20">
                <FileText className="w-6 h-6 text-chart-amber" />
              </div>
              <div className="text-left">
                <h4 className="text-sm font-medium text-white">PDF Guide</h4>
                <p className="text-xs text-white/40">
                  Visual preview with step-by-step Power BI instructions
                </p>
              </div>
            </button>
          </div>

          <div className="pt-4 border-t border-white/5">
            <p className="text-xs text-white/30 text-center">
              {visuals.length} visual{visuals.length !== 1 ? 's' : ''} will be exported
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </ErrorBoundary>
  );
}
