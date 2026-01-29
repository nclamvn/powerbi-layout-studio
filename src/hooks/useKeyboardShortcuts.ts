import { useEffect } from 'react';
import hotkeys from 'hotkeys-js';
import { useUIStore } from '../stores/uiStore';
import { useHistory } from './useHistory';

export function useKeyboardShortcuts() {
  const { canvasZoom, setCanvasZoom } = useUIStore();
  const { handleUndo, handleRedo, canUndo, canRedo } = useHistory();

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

    return () => {
      hotkeys.unbind();
    };
  }, [
    canvasZoom,
    canUndo,
    canRedo,
    handleUndo,
    handleRedo,
    setCanvasZoom,
  ]);
}
