import { useEffect, useRef, useCallback } from 'react';
import { useProjectStore } from '../stores/projectStore';
import { useDataStore } from '../stores/dataStore';
import { compressToUTF16, decompressFromUTF16 } from 'lz-string';

const AUTO_SAVE_KEY = 'pbi-layout-studio-autosave';
const AUTO_SAVE_INTERVAL = 30000; // 30 seconds

export interface AutoSaveData {
  projectName: string;
  visuals: unknown[];
  canvasSize: { width: number; height: number };
  data: {
    rawData: unknown[];
    fields: unknown[];
    fileName: string | null;
  };
  savedAt: string;
}

export function useAutoSave() {
  const { projectName, visuals, canvasSize } = useProjectStore();
  const { rawData, fields, fileName } = useDataStore();
  const intervalRef = useRef<ReturnType<typeof setInterval>>();
  const lastSaveRef = useRef<string>('');

  const saveToLocalStorage = useCallback(() => {
    try {
      const saveData: AutoSaveData = {
        projectName,
        visuals,
        canvasSize,
        data: { rawData, fields, fileName },
        savedAt: new Date().toISOString(),
      };

      const dataString = JSON.stringify(saveData);

      // Only save if data changed
      if (dataString === lastSaveRef.current) {
        return false;
      }

      const compressed = compressToUTF16(dataString);
      localStorage.setItem(AUTO_SAVE_KEY, compressed);
      lastSaveRef.current = dataString;

      return true;
    } catch (error) {
      console.error('Auto-save failed:', error);
      return false;
    }
  }, [projectName, visuals, canvasSize, rawData, fields, fileName]);

  const loadFromLocalStorage = useCallback((): AutoSaveData | null => {
    try {
      const compressed = localStorage.getItem(AUTO_SAVE_KEY);
      if (!compressed) return null;

      const decompressed = decompressFromUTF16(compressed);
      if (!decompressed) return null;

      return JSON.parse(decompressed);
    } catch (error) {
      console.error('Load auto-save failed:', error);
      return null;
    }
  }, []);

  const clearAutoSave = useCallback(() => {
    localStorage.removeItem(AUTO_SAVE_KEY);
    lastSaveRef.current = '';
  }, []);

  const hasAutoSave = useCallback(() => {
    return !!localStorage.getItem(AUTO_SAVE_KEY);
  }, []);

  // Auto-save interval
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      if (visuals.length > 0) {
        saveToLocalStorage();
      }
    }, AUTO_SAVE_INTERVAL);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [visuals, saveToLocalStorage]);

  // Save on visibility change (tab switch / close)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && visuals.length > 0) {
        saveToLocalStorage();
      }
    };

    const handleBeforeUnload = () => {
      if (visuals.length > 0) {
        saveToLocalStorage();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [visuals, saveToLocalStorage]);

  return {
    saveNow: saveToLocalStorage,
    loadAutoSave: loadFromLocalStorage,
    clearAutoSave,
    hasAutoSave: hasAutoSave(),
  };
}
