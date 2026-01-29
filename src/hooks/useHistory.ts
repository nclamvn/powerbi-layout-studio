import { useCallback, useRef, useEffect } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { useHistoryStore } from '../stores/historyStore';
import { useProjectStore } from '../stores/projectStore';

export function useHistory() {
  const { pushState, undo, redo, canUndo, canRedo, clearHistory } = useHistoryStore();
  const visuals = useProjectStore((state) => state.visuals);
  const setVisualsDirectly = useProjectStore((state) => state.setVisuals);
  const isUndoRedoAction = useRef(false);
  const initialized = useRef(false);

  // Initialize history with current state
  useEffect(() => {
    if (!initialized.current && visuals.length >= 0) {
      pushState(visuals);
      initialized.current = true;
    }
  }, [visuals, pushState]);

  // Debounced push to avoid too many history entries
  const debouncedPush = useDebouncedCallback((newVisuals: typeof visuals) => {
    if (!isUndoRedoAction.current) {
      pushState(newVisuals);
    }
    isUndoRedoAction.current = false;
  }, 300);

  const recordState = useCallback(() => {
    debouncedPush(visuals);
  }, [visuals, debouncedPush]);

  const handleUndo = useCallback(() => {
    const previousVisuals = undo();
    if (previousVisuals) {
      isUndoRedoAction.current = true;
      setVisualsDirectly(previousVisuals);
    }
  }, [undo, setVisualsDirectly]);

  const handleRedo = useCallback(() => {
    const nextVisuals = redo();
    if (nextVisuals) {
      isUndoRedoAction.current = true;
      setVisualsDirectly(nextVisuals);
    }
  }, [redo, setVisualsDirectly]);

  return {
    recordState,
    handleUndo,
    handleRedo,
    canUndo: canUndo(),
    canRedo: canRedo(),
    clearHistory,
  };
}
