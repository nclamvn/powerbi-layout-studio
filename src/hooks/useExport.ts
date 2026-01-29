import { useCallback } from 'react';
import { useProjectStore } from '../stores/projectStore';
import { generateSpecs, exportToJSON } from '../utils/specGenerator';
import { exportToPDF } from '../utils/pdfExport';

export function useExport() {
  const { projectName, visuals, canvasSize } = useProjectStore();

  const handleExportJSON = useCallback(() => {
    const specs = generateSpecs(projectName, visuals, canvasSize);
    const jsonString = exportToJSON(specs);

    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${projectName.replace(/\s+/g, '_')}_specs.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [projectName, visuals, canvasSize]);

  const handleExportPDF = useCallback(async (canvasElement: HTMLElement | null) => {
    const specs = generateSpecs(projectName, visuals, canvasSize);
    await exportToPDF(specs, canvasElement);
  }, [projectName, visuals, canvasSize]);

  const handleSaveProject = useCallback(() => {
    const projectData = {
      projectName,
      visuals,
      canvasSize,
      savedAt: new Date().toISOString(),
    };

    const jsonString = JSON.stringify(projectData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${projectName.replace(/\s+/g, '_')}_project.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [projectName, visuals, canvasSize]);

  return {
    handleExportJSON,
    handleExportPDF,
    handleSaveProject,
  };
}
