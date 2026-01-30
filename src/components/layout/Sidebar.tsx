import { motion, AnimatePresence } from 'framer-motion';
import { Database, LayoutGrid, Palette, Download, ChevronRight, ChevronLeft, PanelLeftClose, PanelLeft, LayoutTemplate } from 'lucide-react';
import { DataPanel } from '../panels/DataPanel';
import { VisualsLibrary } from '../panels/VisualsLibrary';
import { ThemePanel } from '../panels/ThemePanel';
import { ExportPanel } from '../panels/ExportPanel';
import { TemplateGallery } from '../templates/TemplateGallery';
import { TemplatePreviewModal } from '../templates/TemplatePreviewModal';
import { useUIStore } from '../../stores/uiStore';
import { useProjectStore } from '../../stores/projectStore';
import { useDataStore } from '../../stores/dataStore';
import { Tooltip } from '../ui/Tooltip';
import { DashboardTemplate } from '../../types/template.types';
import { Visual } from '../../types/visual.types';
import { nanoid } from 'nanoid';

// Landing page URL - configurable via environment variable
const LANDING_PAGE_URL = import.meta.env.VITE_LANDING_PAGE_URL || 'http://localhost:3002';

const tabs = [
  { id: 'data', icon: Database, label: 'Data' },
  { id: 'visuals', icon: LayoutGrid, label: 'Visuals' },
  { id: 'templates', icon: LayoutTemplate, label: 'Templates' },
  { id: 'theme', icon: Palette, label: 'Theme' },
  { id: 'export', icon: Download, label: 'Export' },
] as const;

export function Sidebar() {
  const { sidebarTab, setSidebarTab, sidebarCollapsed, toggleSidebarCollapsed } = useUIStore();
  const { setVisuals, setCanvasSize, setProjectName } = useProjectStore();
  const { importData } = useDataStore();

  const handleApplyTemplate = (template: DashboardTemplate) => {
    // Create new visuals with fresh IDs
    const newVisuals = template.visuals.map((visual) => ({
      ...visual,
      id: nanoid(),
    })) as Visual[];

    // Apply template
    setProjectName(template.name);
    setCanvasSize(template.canvasSize);
    setVisuals(newVisuals);

    // Load sample data if available
    if (template.sampleData && template.sampleData.length > 0) {
      importData(template.sampleData, `${template.name} Sample Data`);
    }

    // Switch to visuals tab after applying
    setSidebarTab('visuals');
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarCollapsed ? 72 : 280 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="h-full flex flex-col flex-shrink-0 overflow-hidden relative z-50"
      style={{
        background: 'linear-gradient(180deg, #1B4332 0%, #0D1F17 100%)',
        borderRight: '1px solid rgba(82, 183, 136, 0.15)',
        boxShadow: '4px 0 24px rgba(0, 0, 0, 0.3)',
      }}
    >
      {/* Mobile: Back & Collapse row */}
      <div className="sm:hidden p-2 border-b border-primary-700/30">
        <div className="flex items-center justify-between">
          {/* Back button - hidden when collapsed */}
          {!sidebarCollapsed && (
            <a
              href={LANDING_PAGE_URL}
              className="p-2 text-white/60 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </a>
          )}

          {/* Collapse/Expand button */}
          <button
            onClick={toggleSidebarCollapsed}
            className={`
              p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all
              ${sidebarCollapsed ? 'mx-auto' : 'ml-auto'}
            `}
          >
            {sidebarCollapsed ? (
              <PanelLeft className="w-5 h-5" />
            ) : (
              <PanelLeftClose className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Desktop: Logo & Collapse Toggle */}
      <div className="hidden sm:block p-4 border-b border-primary-700/30">
        <div className="flex items-center justify-between">
          <AnimatePresence mode="wait">
            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center">
                  <LayoutGrid className="w-5 h-5 text-primary-400" />
                </div>
                <div>
                  <h1 className="text-sm font-semibold text-white">Layout Studio</h1>
                  <p className="text-xs text-primary-400/70">Power BI Prototyper</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <Tooltip content={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'} side="right">
            <button
              onClick={toggleSidebarCollapsed}
              className={`
                p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all
                ${sidebarCollapsed ? 'mx-auto' : ''}
              `}
            >
              {sidebarCollapsed ? (
                <PanelLeft className="w-5 h-5" />
              ) : (
                <PanelLeftClose className="w-5 h-5" />
              )}
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Tab Navigation */}
      <nav className="py-2 space-y-0.5">
        {tabs.map((tab) => (
          <Tooltip
            key={tab.id}
            content={tab.label}
            side="right"
            disabled={!sidebarCollapsed}
          >
            <button
              onClick={() => setSidebarTab(tab.id)}
              className={`
                w-full flex items-center gap-3 px-4 py-3
                transition-all duration-300 group relative
                ${sidebarCollapsed ? 'justify-center' : ''}
                ${
                  sidebarTab === tab.id
                    ? 'text-white'
                    : 'text-white/50 hover:text-white/80'
                }
              `}
              style={{
                background: sidebarTab === tab.id
                  ? 'linear-gradient(90deg, rgba(82, 183, 136, 0.25) 0%, rgba(82, 183, 136, 0.08) 50%, transparent 100%)'
                  : 'transparent',
              }}
              onMouseEnter={(e) => {
                if (sidebarTab !== tab.id) {
                  e.currentTarget.style.background = 'linear-gradient(90deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 50%, transparent 100%)';
                }
              }}
              onMouseLeave={(e) => {
                if (sidebarTab !== tab.id) {
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              {/* Left accent bar */}
              <div
                className={`
                  absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 transition-all duration-300
                  ${sidebarTab === tab.id ? 'bg-primary-400 opacity-100' : 'bg-white/30 opacity-0 group-hover:opacity-50'}
                `}
              />
              <tab.icon className="w-5 h-5 flex-shrink-0" />
              <AnimatePresence mode="wait">
                {!sidebarCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex-1 text-left text-sm font-medium whitespace-nowrap overflow-hidden"
                  >
                    {tab.label}
                  </motion.span>
                )}
              </AnimatePresence>
              {!sidebarCollapsed && (
                <ChevronRight
                  className={`w-4 h-4 transition-transform duration-300 flex-shrink-0 ${
                    sidebarTab === tab.id ? 'rotate-90' : ''
                  }`}
                />
              )}
            </button>
          </Tooltip>
        ))}
      </nav>

      {/* Panel Content */}
      <AnimatePresence mode="wait">
        {!sidebarCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex-1 overflow-hidden border-t border-primary-700/20"
          >
            <motion.div
              key={sidebarTab}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className="h-full overflow-y-auto p-2 sm:p-4"
            >
              {sidebarTab === 'data' && <DataPanel />}
              {sidebarTab === 'visuals' && <VisualsLibrary />}
              {sidebarTab === 'templates' && <TemplateGallery onSelectTemplate={handleApplyTemplate} />}
              {sidebarTab === 'theme' && <ThemePanel />}
              {sidebarTab === 'export' && <ExportPanel />}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collapsed indicator */}
      {sidebarCollapsed && (
        <div className="flex-1 flex items-end justify-center pb-4">
          <div className="w-1 h-8 rounded-full bg-primary-500/20" />
        </div>
      )}

      {/* Template Preview Modal */}
      <TemplatePreviewModal onApply={handleApplyTemplate} />
    </motion.aside>
  );
}
