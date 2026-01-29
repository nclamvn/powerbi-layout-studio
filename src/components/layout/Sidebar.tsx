import { motion } from 'framer-motion';
import { Database, LayoutGrid, Palette, Download, ChevronRight } from 'lucide-react';
import { DataPanel } from '../panels/DataPanel';
import { VisualsLibrary } from '../panels/VisualsLibrary';
import { ThemePanel } from '../panels/ThemePanel';
import { ExportPanel } from '../panels/ExportPanel';
import { useUIStore } from '../../stores/uiStore';

const tabs = [
  { id: 'data', icon: Database, label: 'Data' },
  { id: 'visuals', icon: LayoutGrid, label: 'Visuals' },
  { id: 'theme', icon: Palette, label: 'Theme' },
  { id: 'export', icon: Download, label: 'Export' },
] as const;

export function Sidebar() {
  const { sidebarTab, setSidebarTab } = useUIStore();

  return (
    <aside
      className="w-[280px] h-full flex flex-col flex-shrink-0"
      style={{
        background: 'linear-gradient(180deg, #1B4332 0%, #0D1F17 100%)',
        borderRight: '1px solid rgba(82, 183, 136, 0.15)',
        boxShadow: '4px 0 24px rgba(0, 0, 0, 0.3)',
      }}
    >
      {/* Logo */}
      <div className="p-5 border-b border-primary-700/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center">
            <LayoutGrid className="w-5 h-5 text-primary-400" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-white">Layout Studio</h1>
            <p className="text-xs text-primary-400/70">Power BI Prototyper</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <nav className="p-3 space-y-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSidebarTab(tab.id)}
            className={`
              w-full flex items-center gap-3 px-4 py-3 rounded-xl
              transition-all duration-200 group
              ${
                sidebarTab === tab.id
                  ? 'bg-primary-500/15 text-primary-400 border-l-[3px] border-primary-500'
                  : 'text-white/60 hover:bg-white/5 hover:text-white/80 border-l-[3px] border-transparent'
              }
            `}
          >
            <tab.icon className="w-5 h-5" />
            <span className="flex-1 text-left text-sm font-medium">{tab.label}</span>
            <ChevronRight
              className={`w-4 h-4 transition-transform ${
                sidebarTab === tab.id ? 'rotate-90' : ''
              }`}
            />
          </button>
        ))}
      </nav>

      {/* Panel Content */}
      <div className="flex-1 overflow-hidden border-t border-primary-700/20">
        <motion.div
          key={sidebarTab}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
          className="h-full overflow-y-auto p-4"
        >
          {sidebarTab === 'data' && <DataPanel />}
          {sidebarTab === 'visuals' && <VisualsLibrary />}
          {sidebarTab === 'theme' && <ThemePanel />}
          {sidebarTab === 'export' && <ExportPanel />}
        </motion.div>
      </div>
    </aside>
  );
}
