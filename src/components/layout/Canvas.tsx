import { useRef, useEffect } from 'react';
import { DndContext, DragEndEvent, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { AnimatePresence } from 'framer-motion';
import { useProjectStore } from '../../stores/projectStore';
import { useUIStore } from '../../stores/uiStore';
import { useMultiSelect } from '../../hooks/useMultiSelect';
import { KPICard } from '../visuals/KPICard';
import { LineChartVisual } from '../visuals/LineChartVisual';
import { BarChartVisual } from '../visuals/BarChartVisual';
import { PieChartVisual } from '../visuals/PieChartVisual';
import { DataTableVisual } from '../visuals/DataTableVisual';
import { SlicerVisual } from '../visuals/SlicerVisual';
import { GaugeVisual } from '../visuals/GaugeVisual';
import { FunnelVisual } from '../visuals/FunnelVisual';
import { TreemapVisual } from '../visuals/TreemapVisual';
import { MatrixVisual } from '../visuals/MatrixVisual';
import { SelectionBox } from './SelectionBox';
import { AlignmentToolbar } from './AlignmentToolbar';
import { VisualType, Visual } from '../../types/visual.types';

export function Canvas() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const {
    visuals,
    canvasSize,
    moveVisual,
    moveVisuals,
    selectVisual,
    addVisual,
    selectedVisualIds,
    selectAllVisuals,
    clearSelection,
    duplicateVisuals,
    removeVisuals,
    copyVisuals,
    pasteVisuals,
  } = useProjectStore();
  const { canvasZoom, showGrid, gridSize, snapToGrid } = useUIStore();

  const {
    isSelecting,
    selectionBox,
    handleCanvasMouseDown,
    handleCanvasMouseMove,
    handleCanvasMouseUp,
    setCanvasRef,
  } = useMultiSelect();

  // Set canvas ref for multi-select
  useEffect(() => {
    if (innerRef.current) {
      setCanvasRef(innerRef.current);
    }
  }, [setCanvasRef]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event;
    if (active && delta) {
      let x = delta.x / canvasZoom;
      let y = delta.y / canvasZoom;

      if (snapToGrid) {
        x = Math.round(x / gridSize) * gridSize;
        y = Math.round(y / gridSize) * gridSize;
      }

      // If dragging a selected visual, move all selected visuals
      if (selectedVisualIds.includes(active.id as string) && selectedVisualIds.length > 1) {
        moveVisuals(selectedVisualIds, { x, y });
      } else {
        moveVisual(active.id as string, { x, y });
      }
    }
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === canvasRef.current || (e.target as HTMLElement).id === 'canvas-inner') {
      selectVisual(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const visualType = e.dataTransfer.getData('visualType') as VisualType;
    if (visualType) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        const x = (e.clientX - rect.left) / canvasZoom;
        const y = (e.clientY - rect.top) / canvasZoom;
        addVisual(visualType, { x, y });
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't handle shortcuts when typing in inputs
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Ctrl/Cmd + A: Select all
      if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
        e.preventDefault();
        selectAllVisuals();
      }

      // Escape: Clear selection
      if (e.key === 'Escape') {
        clearSelection();
      }

      // Delete/Backspace: Remove selected visuals
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedVisualIds.length > 0) {
        e.preventDefault();
        removeVisuals(selectedVisualIds);
      }

      // Ctrl/Cmd + D: Duplicate selected
      if ((e.ctrlKey || e.metaKey) && e.key === 'd' && selectedVisualIds.length > 0) {
        e.preventDefault();
        duplicateVisuals(selectedVisualIds);
      }

      // Ctrl/Cmd + C: Copy
      if ((e.ctrlKey || e.metaKey) && e.key === 'c' && selectedVisualIds.length > 0) {
        e.preventDefault();
        copyVisuals();
      }

      // Ctrl/Cmd + V: Paste
      if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
        e.preventDefault();
        pasteVisuals();
      }

      // Arrow keys: Move selected visuals
      if (selectedVisualIds.length > 0) {
        const moveAmount = e.shiftKey ? 10 : 1;

        if (e.key === 'ArrowUp') {
          e.preventDefault();
          moveVisuals(selectedVisualIds, { x: 0, y: -moveAmount });
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          moveVisuals(selectedVisualIds, { x: 0, y: moveAmount });
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          moveVisuals(selectedVisualIds, { x: -moveAmount, y: 0 });
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          moveVisuals(selectedVisualIds, { x: moveAmount, y: 0 });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    selectedVisualIds,
    selectAllVisuals,
    clearSelection,
    removeVisuals,
    duplicateVisuals,
    copyVisuals,
    pasteVisuals,
    moveVisuals,
  ]);

  const renderVisual = (visual: Visual) => {
    switch (visual.type) {
      case 'kpi-card':
        return <KPICard key={visual.id} visual={visual} />;
      case 'line-chart':
        return <LineChartVisual key={visual.id} visual={visual} />;
      case 'bar-chart':
        return <BarChartVisual key={visual.id} visual={visual} />;
      case 'pie-chart':
        return <PieChartVisual key={visual.id} visual={visual} />;
      case 'data-table':
        return <DataTableVisual key={visual.id} visual={visual} />;
      case 'slicer':
        return <SlicerVisual key={visual.id} visual={visual} />;
      case 'gauge':
        return <GaugeVisual key={visual.id} visual={visual} />;
      case 'funnel':
        return <FunnelVisual key={visual.id} visual={visual} />;
      case 'treemap':
        return <TreemapVisual key={visual.id} visual={visual} />;
      case 'matrix':
        return <MatrixVisual key={visual.id} visual={visual} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 overflow-auto bg-dark-deepest p-8 relative">
      {/* Alignment Toolbar */}
      <AlignmentToolbar />

      {/* Empty state - positioned relative to viewport */}
      {visuals.length === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white/30 pointer-events-none z-10">
          <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <p className="text-sm font-medium mb-1">No visuals yet</p>
          <p className="text-xs text-white/20">Click or drag visuals from the sidebar</p>
        </div>
      )}

      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div
          ref={canvasRef}
          id="canvas-area"
          className="relative mx-auto rounded-2xl overflow-hidden"
          style={{
            width: canvasSize.width * canvasZoom,
            height: canvasSize.height * canvasZoom,
            backgroundColor: '#0D0D0D',
            backgroundImage: showGrid
              ? `
                linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
              `
              : 'none',
            backgroundSize: `${gridSize * canvasZoom}px ${gridSize * canvasZoom}px`,
            boxShadow: '0 0 0 1px rgba(255,255,255,0.05), 0 20px 60px rgba(0,0,0,0.5)',
          }}
          onClick={handleCanvasClick}
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
          onMouseLeave={handleCanvasMouseUp}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          {/* Inner container for zoom transform */}
          <div
            ref={innerRef}
            id="canvas-inner"
            className="absolute inset-0 origin-top-left"
            style={{
              transform: `scale(${canvasZoom})`,
              width: canvasSize.width,
              height: canvasSize.height,
            }}
          >
            {visuals.map(renderVisual)}

            {/* Selection Box */}
            <AnimatePresence>
              {isSelecting && selectionBox && (
                <SelectionBox box={selectionBox} zoom={1} />
              )}
            </AnimatePresence>
          </div>

          {/* Canvas size indicator */}
          <div className="absolute bottom-2 right-2 text-xs text-white/20 bg-dark-surface/80 px-2 py-1 rounded backdrop-blur-sm">
            {canvasSize.width} x {canvasSize.height}
          </div>
        </div>
      </DndContext>
    </div>
  );
}
