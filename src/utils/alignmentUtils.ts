import { Visual } from '../types/visual.types';

// ═══════════════════════════════════════════════════════════════════════
// SELECTION BOUNDS
// ═══════════════════════════════════════════════════════════════════════

export interface SelectionBounds {
  left: number;
  top: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
  centerX: number;
  centerY: number;
}

export function getSelectionBounds(visuals: Visual[]): SelectionBounds {
  if (visuals.length === 0) {
    return { left: 0, top: 0, right: 0, bottom: 0, width: 0, height: 0, centerX: 0, centerY: 0 };
  }

  const left = Math.min(...visuals.map(v => v.position.x));
  const top = Math.min(...visuals.map(v => v.position.y));
  const right = Math.max(...visuals.map(v => v.position.x + v.position.width));
  const bottom = Math.max(...visuals.map(v => v.position.y + v.position.height));

  return {
    left,
    top,
    right,
    bottom,
    width: right - left,
    height: bottom - top,
    centerX: left + (right - left) / 2,
    centerY: top + (bottom - top) / 2,
  };
}

// ═══════════════════════════════════════════════════════════════════════
// ALIGNMENT FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════

export type HorizontalAlignment = 'left' | 'center' | 'right';
export type VerticalAlignment = 'top' | 'middle' | 'bottom';

export function alignVisualsHorizontal(
  visuals: Visual[],
  alignment: HorizontalAlignment
): Visual[] {
  if (visuals.length < 2) return visuals;

  const bounds = getSelectionBounds(visuals);

  return visuals.map(visual => {
    const newPosition = { ...visual.position };

    switch (alignment) {
      case 'left':
        newPosition.x = bounds.left;
        break;
      case 'center':
        newPosition.x = bounds.centerX - visual.position.width / 2;
        break;
      case 'right':
        newPosition.x = bounds.right - visual.position.width;
        break;
    }

    return { ...visual, position: newPosition };
  });
}

export function alignVisualsVertical(
  visuals: Visual[],
  alignment: VerticalAlignment
): Visual[] {
  if (visuals.length < 2) return visuals;

  const bounds = getSelectionBounds(visuals);

  return visuals.map(visual => {
    const newPosition = { ...visual.position };

    switch (alignment) {
      case 'top':
        newPosition.y = bounds.top;
        break;
      case 'middle':
        newPosition.y = bounds.centerY - visual.position.height / 2;
        break;
      case 'bottom':
        newPosition.y = bounds.bottom - visual.position.height;
        break;
    }

    return { ...visual, position: newPosition };
  });
}

// ═══════════════════════════════════════════════════════════════════════
// DISTRIBUTION FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════

export function distributeVisualsHorizontal(visuals: Visual[]): Visual[] {
  if (visuals.length < 3) return visuals;

  // Sort by x position
  const sorted = [...visuals].sort((a, b) => a.position.x - b.position.x);

  const first = sorted[0];
  const last = sorted[sorted.length - 1];

  // Calculate total space and visual widths
  const totalWidth = (last.position.x + last.position.width) - first.position.x;
  const totalVisualWidth = sorted.reduce((sum, v) => sum + v.position.width, 0);
  const totalGap = totalWidth - totalVisualWidth;
  const gapBetween = totalGap / (sorted.length - 1);

  let currentX = first.position.x;

  return sorted.map((visual, index) => {
    const newPosition = { ...visual.position };

    if (index === 0) {
      // First visual stays in place
      currentX += visual.position.width + gapBetween;
      return visual;
    }

    newPosition.x = currentX;
    currentX += visual.position.width + gapBetween;

    return { ...visual, position: newPosition };
  });
}

export function distributeVisualsVertical(visuals: Visual[]): Visual[] {
  if (visuals.length < 3) return visuals;

  // Sort by y position
  const sorted = [...visuals].sort((a, b) => a.position.y - b.position.y);

  const first = sorted[0];
  const last = sorted[sorted.length - 1];

  // Calculate total space and visual heights
  const totalHeight = (last.position.y + last.position.height) - first.position.y;
  const totalVisualHeight = sorted.reduce((sum, v) => sum + v.position.height, 0);
  const totalGap = totalHeight - totalVisualHeight;
  const gapBetween = totalGap / (sorted.length - 1);

  let currentY = first.position.y;

  return sorted.map((visual, index) => {
    const newPosition = { ...visual.position };

    if (index === 0) {
      // First visual stays in place
      currentY += visual.position.height + gapBetween;
      return visual;
    }

    newPosition.y = currentY;
    currentY += visual.position.height + gapBetween;

    return { ...visual, position: newPosition };
  });
}

// ═══════════════════════════════════════════════════════════════════════
// MATCHING SIZE FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════

export function matchWidth(visuals: Visual[], referenceWidth?: number): Visual[] {
  if (visuals.length < 2) return visuals;

  const targetWidth = referenceWidth ?? Math.max(...visuals.map(v => v.position.width));

  return visuals.map(visual => ({
    ...visual,
    position: { ...visual.position, width: targetWidth },
  }));
}

export function matchHeight(visuals: Visual[], referenceHeight?: number): Visual[] {
  if (visuals.length < 2) return visuals;

  const targetHeight = referenceHeight ?? Math.max(...visuals.map(v => v.position.height));

  return visuals.map(visual => ({
    ...visual,
    position: { ...visual.position, height: targetHeight },
  }));
}

export function matchSize(visuals: Visual[]): Visual[] {
  if (visuals.length < 2) return visuals;

  const targetWidth = Math.max(...visuals.map(v => v.position.width));
  const targetHeight = Math.max(...visuals.map(v => v.position.height));

  return visuals.map(visual => ({
    ...visual,
    position: { ...visual.position, width: targetWidth, height: targetHeight },
  }));
}

// ═══════════════════════════════════════════════════════════════════════
// SELECTION BOX COLLISION DETECTION
// ═══════════════════════════════════════════════════════════════════════

export interface SelectionRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function getVisualsInSelectionBox(
  visuals: Visual[],
  selectionBox: SelectionRect
): string[] {
  const selectedIds: string[] = [];

  // Normalize selection box (handle negative width/height from dragging)
  const box = {
    left: selectionBox.width >= 0 ? selectionBox.x : selectionBox.x + selectionBox.width,
    top: selectionBox.height >= 0 ? selectionBox.y : selectionBox.y + selectionBox.height,
    right: selectionBox.width >= 0 ? selectionBox.x + selectionBox.width : selectionBox.x,
    bottom: selectionBox.height >= 0 ? selectionBox.y + selectionBox.height : selectionBox.y,
  };

  for (const visual of visuals) {
    const visualBox = {
      left: visual.position.x,
      top: visual.position.y,
      right: visual.position.x + visual.position.width,
      bottom: visual.position.y + visual.position.height,
    };

    // Check if visual intersects with selection box
    const intersects = !(
      visualBox.right < box.left ||
      visualBox.left > box.right ||
      visualBox.bottom < box.top ||
      visualBox.top > box.bottom
    );

    if (intersects) {
      selectedIds.push(visual.id);
    }
  }

  return selectedIds;
}

// ═══════════════════════════════════════════════════════════════════════
// SNAP TO GRID
// ═══════════════════════════════════════════════════════════════════════

export function snapToGrid(value: number, gridSize: number = 20): number {
  return Math.round(value / gridSize) * gridSize;
}

export function snapPositionToGrid(
  position: { x: number; y: number },
  gridSize: number = 20
): { x: number; y: number } {
  return {
    x: snapToGrid(position.x, gridSize),
    y: snapToGrid(position.y, gridSize),
  };
}
