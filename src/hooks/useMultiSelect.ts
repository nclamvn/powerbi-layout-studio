import { useCallback, useState, useRef } from 'react';
import { useProjectStore } from '../stores/projectStore';
import { useUIStore } from '../stores/uiStore';
import { getVisualsInSelectionBox, SelectionRect } from '../utils/alignmentUtils';

export function useMultiSelect() {
  const {
    visuals,
    selectedVisualIds,
    selectVisual,
    selectVisuals,
    clearSelection,
    selectAllVisuals,
    toggleVisualSelection,
  } = useProjectStore();

  const { canvasZoom } = useUIStore();

  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionBox, setSelectionBox] = useState<SelectionRect | null>(null);
  const startPointRef = useRef<{ x: number; y: number } | null>(null);
  const canvasRef = useRef<HTMLElement | null>(null);

  // Convert screen coordinates to canvas coordinates
  const screenToCanvas = useCallback(
    (screenX: number, screenY: number) => {
      if (!canvasRef.current) return { x: screenX, y: screenY };

      const rect = canvasRef.current.getBoundingClientRect();
      return {
        x: (screenX - rect.left) / canvasZoom,
        y: (screenY - rect.top) / canvasZoom,
      };
    },
    [canvasZoom]
  );

  // Handle click on visual
  const handleVisualClick = useCallback(
    (visualId: string, event: React.MouseEvent) => {
      event.stopPropagation();

      if (event.shiftKey) {
        // Shift+click: Add to selection
        selectVisual(visualId, true);
      } else if (event.ctrlKey || event.metaKey) {
        // Ctrl+click: Toggle selection
        toggleVisualSelection(visualId);
      } else {
        // Normal click: Single select
        selectVisual(visualId, false);
      }
    },
    [selectVisual, toggleVisualSelection]
  );

  // Handle canvas mouse down (start selection box)
  const handleCanvasMouseDown = useCallback(
    (event: React.MouseEvent) => {
      // Only start selection on left click on canvas background
      if (event.button !== 0) return;
      if ((event.target as HTMLElement).closest('[data-visual]')) return;

      const canvasPoint = screenToCanvas(event.clientX, event.clientY);
      startPointRef.current = canvasPoint;

      setIsSelecting(true);
      setSelectionBox({
        x: canvasPoint.x,
        y: canvasPoint.y,
        width: 0,
        height: 0,
      });

      // Clear selection unless shift/ctrl held
      if (!event.shiftKey && !event.ctrlKey && !event.metaKey) {
        clearSelection();
      }
    },
    [screenToCanvas, clearSelection]
  );

  // Handle mouse move (update selection box)
  const handleCanvasMouseMove = useCallback(
    (event: React.MouseEvent) => {
      if (!isSelecting || !startPointRef.current) return;

      const canvasPoint = screenToCanvas(event.clientX, event.clientY);

      setSelectionBox({
        x: startPointRef.current.x,
        y: startPointRef.current.y,
        width: canvasPoint.x - startPointRef.current.x,
        height: canvasPoint.y - startPointRef.current.y,
      });
    },
    [isSelecting, screenToCanvas]
  );

  // Handle mouse up (finish selection)
  const handleCanvasMouseUp = useCallback(
    (event: React.MouseEvent) => {
      if (!isSelecting || !selectionBox) {
        setIsSelecting(false);
        setSelectionBox(null);
        startPointRef.current = null;
        return;
      }

      // Only apply selection if box is large enough (avoid accidental selections)
      const minSize = 5;
      if (Math.abs(selectionBox.width) > minSize || Math.abs(selectionBox.height) > minSize) {
        // Find visuals in selection box
        const newSelectedIds = getVisualsInSelectionBox(visuals, selectionBox);

        if (event.shiftKey || event.ctrlKey || event.metaKey) {
          // Add to existing selection
          const combined = [...new Set([...selectedVisualIds, ...newSelectedIds])];
          selectVisuals(combined);
        } else {
          selectVisuals(newSelectedIds);
        }
      }

      setIsSelecting(false);
      setSelectionBox(null);
      startPointRef.current = null;
    },
    [isSelecting, selectionBox, visuals, selectedVisualIds, selectVisuals]
  );

  // Set canvas ref
  const setCanvasRef = useCallback((element: HTMLElement | null) => {
    canvasRef.current = element;
  }, []);

  return {
    // State
    isSelecting,
    selectionBox,
    selectedCount: selectedVisualIds.length,

    // Handlers
    handleVisualClick,
    handleCanvasMouseDown,
    handleCanvasMouseMove,
    handleCanvasMouseUp,
    setCanvasRef,

    // Actions
    selectAll: selectAllVisuals,
    clearSelection,
  };
}
