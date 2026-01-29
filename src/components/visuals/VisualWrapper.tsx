import { ReactNode } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { motion } from 'framer-motion';
import { GripVertical, X, Copy, Settings } from 'lucide-react';
import { GlassPanel } from '../ui/GlassPanel';
import { useProjectStore } from '../../stores/projectStore';
import { useUIStore } from '../../stores/uiStore';
import { useResize } from '../../hooks/useResize';

interface VisualWrapperProps {
  id: string;
  children: ReactNode;
  position: { x: number; y: number; width: number; height: number };
  title?: string;
}

export function VisualWrapper({ id, children, position, title }: VisualWrapperProps) {
  const { selectedVisualId, selectVisual, removeVisual, duplicateVisual } = useProjectStore();
  const { setPropertiesPanelOpen } = useUIStore();
  const { isResizing, handleMouseDown } = useResize(id);

  const isSelected = selectedVisualId === id;

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
  });

  const style = {
    position: 'absolute' as const,
    left: position.x,
    top: position.y,
    width: position.width,
    height: position.height,
    transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
    zIndex: isDragging ? 1000 : isSelected ? 100 : 1,
  };

  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectVisual(id);
    setPropertiesPanelOpen(true);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeVisual(id);
  };

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    duplicateVisual(id);
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      className={`group ${isDragging ? 'opacity-80' : ''}`}
      onClick={handleSelect}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <GlassPanel
        className={`w-full h-full overflow-hidden relative ${
          isSelected ? 'ring-2 ring-primary-500 ring-offset-2 ring-offset-dark-base' : ''
        }`}
        padding="none"
      >
        {/* Toolbar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: isSelected ? 1 : 0, y: isSelected ? 0 : -10 }}
          className="absolute top-2 right-2 flex items-center gap-1 z-20"
        >
          <button
            {...attributes}
            {...listeners}
            className="p-1.5 rounded-lg bg-dark-surface/90 text-white/60 hover:text-white hover:bg-dark-hover cursor-grab active:cursor-grabbing backdrop-blur-sm"
          >
            <GripVertical className="w-4 h-4" />
          </button>
          <button
            onClick={handleDuplicate}
            className="p-1.5 rounded-lg bg-dark-surface/90 text-white/60 hover:text-white hover:bg-dark-hover backdrop-blur-sm"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={handleDelete}
            className="p-1.5 rounded-lg bg-dark-surface/90 text-white/60 hover:text-red-400 hover:bg-red-500/20 backdrop-blur-sm"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>

        {/* Title */}
        {title && (
          <div className="px-4 pt-4 pb-2">
            <h3 className="text-sm font-medium text-white/80">{title}</h3>
          </div>
        )}

        {/* Visual Content */}
        <div className="flex-1 h-full">{children}</div>

        {/* Resize Handles */}
        {isSelected && (
          <>
            {/* Corner handles */}
            <div
              className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize z-30"
              onMouseDown={(e) => handleMouseDown(e, 'se')}
            >
              <div className="absolute bottom-1 right-1 w-2 h-2 bg-primary-500 rounded-sm" />
            </div>
            <div
              className="absolute bottom-0 left-0 w-4 h-4 cursor-sw-resize z-30"
              onMouseDown={(e) => handleMouseDown(e, 'sw')}
            >
              <div className="absolute bottom-1 left-1 w-2 h-2 bg-primary-500 rounded-sm" />
            </div>
            <div
              className="absolute top-0 right-0 w-4 h-4 cursor-ne-resize z-30"
              onMouseDown={(e) => handleMouseDown(e, 'ne')}
            >
              <div className="absolute top-1 right-1 w-2 h-2 bg-primary-500 rounded-sm" />
            </div>
            <div
              className="absolute top-0 left-0 w-4 h-4 cursor-nw-resize z-30"
              onMouseDown={(e) => handleMouseDown(e, 'nw')}
            >
              <div className="absolute top-1 left-1 w-2 h-2 bg-primary-500 rounded-sm" />
            </div>

            {/* Edge handles */}
            <div
              className="absolute top-1/2 right-0 w-2 h-8 -translate-y-1/2 cursor-e-resize z-30"
              onMouseDown={(e) => handleMouseDown(e, 'e')}
            >
              <div className="absolute top-1/2 right-0.5 w-1 h-6 -translate-y-1/2 bg-primary-500/50 rounded-full" />
            </div>
            <div
              className="absolute top-1/2 left-0 w-2 h-8 -translate-y-1/2 cursor-w-resize z-30"
              onMouseDown={(e) => handleMouseDown(e, 'w')}
            >
              <div className="absolute top-1/2 left-0.5 w-1 h-6 -translate-y-1/2 bg-primary-500/50 rounded-full" />
            </div>
            <div
              className="absolute bottom-0 left-1/2 w-8 h-2 -translate-x-1/2 cursor-s-resize z-30"
              onMouseDown={(e) => handleMouseDown(e, 's')}
            >
              <div className="absolute bottom-0.5 left-1/2 w-6 h-1 -translate-x-1/2 bg-primary-500/50 rounded-full" />
            </div>
            <div
              className="absolute top-0 left-1/2 w-8 h-2 -translate-x-1/2 cursor-n-resize z-30"
              onMouseDown={(e) => handleMouseDown(e, 'n')}
            >
              <div className="absolute top-0.5 left-1/2 w-6 h-1 -translate-x-1/2 bg-primary-500/50 rounded-full" />
            </div>
          </>
        )}
      </GlassPanel>
    </motion.div>
  );
}
