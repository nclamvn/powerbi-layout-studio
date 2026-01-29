import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface Tab {
  id: string;
  label: string;
  icon?: ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
}

export function Tabs({ tabs, activeTab, onChange }: TabsProps) {
  return (
    <div className="flex gap-1 p-1 bg-dark-surface/50 rounded-xl">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`
            relative flex items-center gap-2 px-4 py-2
            text-sm font-medium rounded-lg
            transition-colors duration-200
            ${activeTab === tab.id ? 'text-white' : 'text-white/50 hover:text-white/70'}
          `}
        >
          {activeTab === tab.id && (
            <motion.div
              layoutId="activeTab"
              className="absolute inset-0 bg-primary-700/50 rounded-lg"
              transition={{ type: 'spring', duration: 0.3 }}
            />
          )}
          <span className="relative z-10 flex items-center gap-2">
            {tab.icon}
            {tab.label}
          </span>
        </button>
      ))}
    </div>
  );
}
