import { useRef } from 'react';
import { DndContext, DragEndEvent, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { useProjectStore } from '../../stores/projectStore';
import { useUIStore } from '../../stores/uiStore';
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
import { VisualType, Visual } from '../../types/visual.types';

export function Canvas() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const { visuals, canvasSize, moveVisual, selectVisual, addVisual } = useProjectStore();
  const { canvasZoom, showGrid, gridSize, snapToGrid } = useUIStore();

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

      moveVisual(active.id as string, { x, y });
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
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          {/* Inner container for zoom transform */}
          <div
            id="canvas-inner"
            className="absolute inset-0 origin-top-left"
            style={{
              transform: `scale(${canvasZoom})`,
              width: canvasSize.width,
              height: canvasSize.height,
            }}
          >
            {visuals.map(renderVisual)}
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
