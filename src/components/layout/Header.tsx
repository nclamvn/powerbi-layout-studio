import { useState } from 'react';
import { Save, Undo2, Redo2, Download, ZoomIn, ZoomOut, Maximize2, Settings, FolderOpen, Keyboard, Sparkles } from 'lucide-react';
import { useProjectStore } from '../../stores/projectStore';
import { useUIStore } from '../../stores/uiStore';
import { useDataStore } from '../../stores/dataStore';
import { useExport } from '../../hooks/useExport';
import { useHistory } from '../../hooks/useHistory';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { KeyboardShortcutsModal } from '../modals/KeyboardShortcutsModal';
import { AutoLayoutWizard } from '../auto-layout/AutoLayoutWizard';
import { Tooltip } from '../ui/Tooltip';

export function Header() {
  const { projectName, setProjectName, visuals, loadProject, clearProject } = useProjectStore();
  const { canvasZoom, setCanvasZoom, setExportModalOpen } = useUIStore();
  const { rawData } = useDataStore();
  const { handleSaveProject } = useExport();
  const { handleUndo, handleRedo, canUndo, canRedo } = useHistory();
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(projectName);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [showAutoLayout, setShowAutoLayout] = useState(false);

  const handleNameSubmit = () => {
    setProjectName(tempName);
    setIsEditing(false);
  };

  const handleLoadProject = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const text = await file.text();
        const data = JSON.parse(text);
        if (data.projectName && data.visuals) {
          loadProject(data);
        }
      } catch (error) {
        alert('Invalid project file');
      }
    };
    input.click();
  };

  return (
    <header className="h-16 flex items-center justify-between px-4 border-b border-white/5 bg-dark-base/80 backdrop-blur-xl">
      {/* Left: Project Name */}
      <div className="flex items-center gap-4">
        {isEditing ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleNameSubmit();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              className="px-3 py-1.5 bg-dark-surface border border-primary-500/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30"
              autoFocus
              onBlur={handleNameSubmit}
            />
          </form>
        ) : (
          <button
            onClick={() => {
              setTempName(projectName);
              setIsEditing(true);
            }}
            className="text-white font-medium hover:text-primary-400 transition-colors"
          >
            {projectName}
          </button>
        )}

        <span className="text-xs text-white/30 bg-white/5 px-2 py-1 rounded">
          {visuals.length} visuals
        </span>

        {/* Undo/Redo */}
        <div className="flex items-center gap-1 ml-2">
          <Tooltip content="Undo (Ctrl+Z)">
            <button
              onClick={handleUndo}
              disabled={!canUndo}
              className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Undo2 className="w-4 h-4" />
            </button>
          </Tooltip>
          <Tooltip content="Redo (Ctrl+Y)">
            <button
              onClick={handleRedo}
              disabled={!canRedo}
              className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Redo2 className="w-4 h-4" />
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Center: Zoom Controls */}
      <div className="flex items-center gap-2 bg-dark-surface/50 rounded-xl px-2 py-1">
        <button
          onClick={() => setCanvasZoom(canvasZoom - 0.1)}
          className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          disabled={canvasZoom <= 0.25}
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <span className="text-xs text-white/60 w-12 text-center">
          {Math.round(canvasZoom * 100)}%
        </span>
        <button
          onClick={() => setCanvasZoom(canvasZoom + 0.1)}
          className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          disabled={canvasZoom >= 2}
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <div className="w-px h-4 bg-white/10 mx-1" />
        <button
          onClick={() => setCanvasZoom(1)}
          className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={handleLoadProject}>
          <FolderOpen className="w-4 h-4" />
          Open
        </Button>

        <Button variant="ghost" size="sm" onClick={handleSaveProject}>
          <Save className="w-4 h-4" />
          Save
        </Button>

        {rawData.length > 0 && (
          <Tooltip content="Smart Auto-Layout">
            <button
              onClick={() => setShowAutoLayout(true)}
              className="p-2 rounded-lg text-primary-400 bg-primary-500/10 hover:bg-primary-500/20 transition-colors"
            >
              <Sparkles className="w-5 h-5" />
            </button>
          </Tooltip>
        )}

        <div className="w-px h-6 bg-white/10 mx-1" />

        <Button
          variant="primary"
          size="sm"
          onClick={() => setExportModalOpen(true)}
          disabled={visuals.length === 0}
        >
          <Download className="w-4 h-4" />
          Export Specs
        </Button>

        <Tooltip content="Keyboard Shortcuts (?)">
          <button
            onClick={() => setIsShortcutsOpen(true)}
            className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <Keyboard className="w-5 h-5" />
          </button>
        </Tooltip>

        <Tooltip content="Settings">
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
        </Tooltip>
      </div>

      {/* Settings Modal */}
      <Modal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        title="Settings"
      >
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-white/80 mb-2">Canvas Size</h4>
            <div className="grid grid-cols-2 gap-3">
              <button className="p-3 bg-dark-surface rounded-lg border border-white/10 hover:border-primary-500/30 transition-colors text-left">
                <p className="text-sm text-white">1920 x 1080</p>
                <p className="text-xs text-white/40">16:9 HD</p>
              </button>
              <button className="p-3 bg-dark-surface rounded-lg border border-white/10 hover:border-primary-500/30 transition-colors text-left">
                <p className="text-sm text-white">1280 x 720</p>
                <p className="text-xs text-white/40">16:9 Small</p>
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-white/5">
            <Button variant="danger" size="sm" onClick={() => { clearProject(); setIsSettingsOpen(false); }}>
              Clear Project
            </Button>
          </div>
        </div>
      </Modal>

      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      {/* Auto Layout Wizard */}
      <AutoLayoutWizard
        isOpen={showAutoLayout}
        onClose={() => setShowAutoLayout(false)}
      />
    </header>
  );
}
