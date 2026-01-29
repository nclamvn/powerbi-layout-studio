import { useState, useCallback } from 'react';
import { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { useProjectStore } from '../stores/projectStore';
import { useUIStore } from '../stores/uiStore';

export function useDragAndDrop() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const { moveVisual, selectVisual } = useProjectStore();
  const { snapToGrid, gridSize } = useUIStore();

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
    selectVisual(event.active.id as string);
  }, [selectVisual]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, delta } = event;

    if (active && delta) {
      let x = delta.x;
      let y = delta.y;

      if (snapToGrid) {
        x = Math.round(x / gridSize) * gridSize;
        y = Math.round(y / gridSize) * gridSize;
      }

      moveVisual(active.id as string, { x, y });
    }

    setActiveId(null);
  }, [moveVisual, snapToGrid, gridSize]);

  return {
    activeId,
    handleDragStart,
    handleDragEnd,
  };
}
