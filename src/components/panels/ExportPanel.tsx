import { useRef } from 'react';
import { Download, FileJson, FileText, Save, Copy, Check } from 'lucide-react';
import { useProjectStore } from '../../stores/projectStore';
import { useExport } from '../../hooks/useExport';
import { generateSpecs, exportToJSON } from '../../utils/specGenerator';
import { Button } from '../ui/Button';
import { useState } from 'react';

export function ExportPanel() {
  const { projectName, visuals, canvasSize } = useProjectStore();
  const { handleExportJSON, handleExportPDF, handleSaveProject } = useExport();
  const [copied, setCopied] = useState(false);

  const handleCopyJSON = () => {
    const specs = generateSpecs(projectName, visuals, canvasSize);
    const jsonString = exportToJSON(specs);
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportPDFClick = () => {
    const canvasElement = document.getElementById('canvas-area');
    handleExportPDF(canvasElement);
  };

  return (
    <div className="space-y-6">
      {/* Project Summary */}
      <div className="p-4 bg-dark-surface/50 rounded-xl border border-white/5">
        <h3 className="text-sm font-medium text-white mb-3">Project Summary</h3>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-white/50">Name</span>
            <span className="text-white/80">{projectName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/50">Visuals</span>
            <span className="text-white/80">{visuals.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/50">Canvas</span>
            <span className="text-white/80">{canvasSize.width} x {canvasSize.height}</span>
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div>
        <h3 className="text-sm font-medium text-white/80 mb-3">Export Specs</h3>
        <div className="space-y-2">
          <Button
            variant="primary"
            className="w-full justify-start"
            onClick={handleExportJSON}
            disabled={visuals.length === 0}
          >
            <FileJson className="w-4 h-4" />
            Export JSON Specs
          </Button>

          <Button
            variant="secondary"
            className="w-full justify-start"
            onClick={handleExportPDFClick}
            disabled={visuals.length === 0}
          >
            <FileText className="w-4 h-4" />
            Export PDF Guide
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={handleCopyJSON}
            disabled={visuals.length === 0}
          >
            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy JSON to Clipboard'}
          </Button>
        </div>
      </div>

      {/* Save Project */}
      <div>
        <h3 className="text-sm font-medium text-white/80 mb-3">Project File</h3>
        <Button
          variant="secondary"
          className="w-full justify-start"
          onClick={handleSaveProject}
        >
          <Save className="w-4 h-4" />
          Save Project (.json)
        </Button>
        <p className="text-xs text-white/40 mt-2">
          Save your project to continue editing later
        </p>
      </div>

      {/* Export Info */}
      <div className="p-4 bg-primary-500/5 rounded-xl border border-primary-500/20">
        <h4 className="text-xs font-medium text-primary-400 mb-2">What's included?</h4>
        <ul className="text-xs text-white/60 space-y-1.5">
          <li className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-primary-400" />
            Visual positions & sizes (%)
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-primary-400" />
            Data field bindings
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-primary-400" />
            Style configurations
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-primary-400" />
            Power BI step-by-step guide
          </li>
        </ul>
      </div>
    </div>
  );
}
