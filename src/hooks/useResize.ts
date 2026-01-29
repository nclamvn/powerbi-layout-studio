import { useState, useCallback, useEffect } from 'react';
import { useProjectStore } from '../stores/projectStore';
import { useUIStore } from '../stores/uiStore';

interface ResizeState {
  isResizing: boolean;
  direction: string | null;
  startX: number;
  startY: number;
  startWidth: number;
  startHeight: number;
}

export function useResize(visualId: string) {
  const [resizeState, setResizeState] = useState<ResizeState>({
    isResizing: false,
    direction: null,
    startX: 0,
    startY: 0,
    startWidth: 0,
    startHeight: 0,
  });

  const { visuals, resizeVisual } = useProjectStore();
  const { snapToGrid, gridSize } = useUIStore();

  const visual = visuals.find((v) => v.id === visualId);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, direction: string) => {
      if (!visual) return;

      e.preventDefault();
      e.stopPropagation();

      setResizeState({
        isResizing: true,
        direction,
        startX: e.clientX,
        startY: e.clientY,
        startWidth: visual.position.width,
        startHeight: visual.position.height,
      });
    },
    [visual]
  );

  useEffect(() => {
    if (!resizeState.isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      let deltaX = e.clientX - resizeState.startX;
      let deltaY = e.clientY - resizeState.startY;

      if (snapToGrid) {
        deltaX = Math.round(deltaX / gridSize) * gridSize;
        deltaY = Math.round(deltaY / gridSize) * gridSize;
      }

      let newWidth = resizeState.startWidth;
      let newHeight = resizeState.startHeight;

      if (resizeState.direction?.includes('e')) {
        newWidth = resizeState.startWidth + deltaX;
      }
      if (resizeState.direction?.includes('w')) {
        newWidth = resizeState.startWidth - deltaX;
      }
      if (resizeState.direction?.includes('s')) {
        newHeight = resizeState.startHeight + deltaY;
      }
      if (resizeState.direction?.includes('n')) {
        newHeight = resizeState.startHeight - deltaY;
      }

      resizeVisual(visualId, {
        width: Math.max(100, newWidth),
        height: Math.max(80, newHeight),
      });
    };

    const handleMouseUp = () => {
      setResizeState((prev) => ({
        ...prev,
        isResizing: false,
        direction: null,
      }));
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [resizeState, resizeVisual, visualId, snapToGrid, gridSize]);

  return {
    isResizing: resizeState.isResizing,
    handleMouseDown,
  };
}
