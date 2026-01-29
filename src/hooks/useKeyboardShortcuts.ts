import { useEffect, useCallback } from 'react';
import hotkeys from 'hotkeys-js';
import { useProjectStore } from '../stores/projectStore';
import { useUIStore } from '../stores/uiStore';
import { useHistory } from './useHistory';

export function useKeyboardShortcuts() {
  const {
    selectedVisualId,
    visuals,
    removeVisual,
    duplicateVisual,
    selectVisual,
    moveVisual,
  } = useProjectStore();

  const { canvasZoom, setCanvasZoom } = useUIStore();
  const { handleUndo, handleRedo, canUndo, canRedo } = useHistory();

  // Clipboard state (simple in-memory)
  const copyToClipboard = useCallback(() => {
    if (selectedVisualId) {
      const visual = visuals.find((v) => v.id === selectedVisualId);
      if (visual) {
        sessionStorage.setItem('pbi-clipboard', JSON.stringify(visual));
      }
    }
  }, [selectedVisualId, visuals]);

  const pasteFromClipboard = useCallback(() => {
    const clipboardData = sessionStorage.getItem('pbi-clipboard');
    if (clipboardData) {
      // Will trigger duplicate logic
      duplicateVisual(selectedVisualId || '');
    }
  }, [duplicateVisual, selectedVisualId]);

  useEffect(() => {
    // Enable shortcuts in input fields only for specific keys
    hotkeys.filter = function (event) {
      const target = event.target as HTMLElement;
      const tagName = target.tagName;

      // Allow escape and some navigation keys in inputs
      if (event.key === 'Escape') return true;

      // Block shortcuts in input/textarea
      if (tagName === 'INPUT' || tagName === 'TEXTAREA' || tagName === 'SELECT') {
        return false;
      }

      return true;
    };

    // Undo/Redo
    hotkeys('ctrl+z,command+z', (e) => {
      e.preventDefault();
      if (canUndo) handleUndo();
    });

    hotkeys('ctrl+y,command+y,ctrl+shift+z,command+shift+z', (e) => {
      e.preventDefault();
      if (canRedo) handleRedo();
    });

    // Copy/Paste/Duplicate
    hotkeys('ctrl+c,command+c', (e) => {
      if (selectedVisualId) {
        e.preventDefault();
        copyToClipboard();
      }
    });

    hotkeys('ctrl+v,command+v', (e) => {
      e.preventDefault();
      pasteFromClipboard();
    });

    hotkeys('ctrl+d,command+d', (e) => {
      if (selectedVisualId) {
        e.preventDefault();
        duplicateVisual(selectedVisualId);
      }
    });

    // Delete
    hotkeys('delete,backspace', (e) => {
      if (selectedVisualId) {
        e.preventDefault();
        removeVisual(selectedVisualId);
      }
    });

    // Selection
    hotkeys('ctrl+a,command+a', (e) => {
      e.preventDefault();
      if (visuals.length > 0) {
        selectVisual(visuals[0].id);
      }
    });

    hotkeys('escape', () => {
      selectVisual(null);
    });

    // Zoom
    hotkeys('ctrl+0,command+0', (e) => {
      e.preventDefault();
      setCanvasZoom(1);
    });

    hotkeys('ctrl+=,command+=,ctrl+plus,command+plus', (e) => {
      e.preventDefault();
      setCanvasZoom(Math.min(canvasZoom + 0.1, 2));
    });

    hotkeys('ctrl+-,command+-,ctrl+minus,command+minus', (e) => {
      e.preventDefault();
      setCanvasZoom(Math.max(canvasZoom - 0.1, 0.25));
    });

    // Arrow keys for moving
    hotkeys('up', (e) => {
      if (selectedVisualId) {
        e.preventDefault();
        moveVisual(selectedVisualId, { x: 0, y: -1 });
      }
    });

    hotkeys('down', (e) => {
      if (selectedVisualId) {
        e.preventDefault();
        moveVisual(selectedVisualId, { x: 0, y: 1 });
      }
    });

    hotkeys('left', (e) => {
      if (selectedVisualId) {
        e.preventDefault();
        moveVisual(selectedVisualId, { x: -1, y: 0 });
      }
    });

    hotkeys('right', (e) => {
      if (selectedVisualId) {
        e.preventDefault();
        moveVisual(selectedVisualId, { x: 1, y: 0 });
      }
    });

    // Shift + Arrows for larger moves
    hotkeys('shift+up', (e) => {
      if (selectedVisualId) {
        e.preventDefault();
        moveVisual(selectedVisualId, { x: 0, y: -10 });
      }
    });

    hotkeys('shift+down', (e) => {
      if (selectedVisualId) {
        e.preventDefault();
        moveVisual(selectedVisualId, { x: 0, y: 10 });
      }
    });

    hotkeys('shift+left', (e) => {
      if (selectedVisualId) {
        e.preventDefault();
        moveVisual(selectedVisualId, { x: -10, y: 0 });
      }
    });

    hotkeys('shift+right', (e) => {
      if (selectedVisualId) {
        e.preventDefault();
        moveVisual(selectedVisualId, { x: 10, y: 0 });
      }
    });

    return () => {
      hotkeys.unbind();
    };
  }, [
    selectedVisualId,
    visuals,
    canvasZoom,
    canUndo,
    canRedo,
    handleUndo,
    handleRedo,
    copyToClipboard,
    pasteFromClipboard,
    duplicateVisual,
    removeVisual,
    selectVisual,
    setCanvasZoom,
    moveVisual,
  ]);
}
