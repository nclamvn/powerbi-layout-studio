import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Grid3X3,
  Magnet,
  Undo2,
  Redo2,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useUIStore } from '../../stores/uiStore';
import { useHistory } from '../../hooks/useHistory';
import { GlassPanel } from '../ui/GlassPanel';
import { Tooltip } from '../ui/Tooltip';

export function CanvasControls() {
  const {
    canvasZoom,
    setCanvasZoom,
    showGrid,
    toggleGrid,
    snapToGrid,
    toggleSnapToGrid,
  } = useUIStore();

  const { handleUndo, handleRedo, canUndo, canRedo } = useHistory();

  const zoomPercent = Math.round(canvasZoom * 100);

  const zoomIn = () => setCanvasZoom(Math.min(canvasZoom + 0.1, 2));
  const zoomOut = () => setCanvasZoom(Math.max(canvasZoom - 0.1, 0.25));
  const zoomTo100 = () => setCanvasZoom(1);
  const resetView = () => setCanvasZoom(1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <GlassPanel padding="sm" className="flex items-center gap-1 !rounded-full px-4">
        {/* Undo/Redo */}
        <Tooltip content="Undo (Ctrl+Z)">
          <button
            onClick={handleUndo}
            disabled={!canUndo}
            className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Undo2 className="w-4 h-4" />
          </button>
        </Tooltip>

        <Tooltip content="Redo (Ctrl+Y)">
          <button
            onClick={handleRedo}
            disabled={!canRedo}
            className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </Tooltip>

        <div className="w-px h-6 bg-white/10 mx-1" />

        {/* Zoom Controls */}
        <Tooltip content="Zoom out (Ctrl+-)">
          <button
            onClick={zoomOut}
            disabled={canvasZoom <= 0.25}
            className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-30"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </Tooltip>

        <button
          onClick={zoomTo100}
          className="px-3 py-1.5 text-sm font-medium text-white/80 hover:text-white hover:bg-white/5 rounded-lg transition-colors min-w-[60px]"
        >
          {zoomPercent}%
        </button>

        <Tooltip content="Zoom in (Ctrl++)">
          <button
            onClick={zoomIn}
            disabled={canvasZoom >= 2}
            className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-30"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </Tooltip>

        <div className="w-px h-6 bg-white/10 mx-1" />

        <Tooltip content="Fit to screen">
          <button
            onClick={resetView}
            className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </Tooltip>

        <div className="w-px h-6 bg-white/10 mx-1" />

        {/* Grid Controls */}
        <Tooltip content="Toggle grid">
          <button
            onClick={toggleGrid}
            className={`p-2 rounded-lg transition-colors ${
              showGrid
                ? 'text-primary-400 bg-primary-500/10'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Grid3X3 className="w-4 h-4" />
          </button>
        </Tooltip>

        <Tooltip content="Snap to grid">
          <button
            onClick={toggleSnapToGrid}
            className={`p-2 rounded-lg transition-colors ${
              snapToGrid
                ? 'text-primary-400 bg-primary-500/10'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Magnet className="w-4 h-4" />
          </button>
        </Tooltip>
      </GlassPanel>
    </motion.div>
  );
}
