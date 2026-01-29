import { motion, AnimatePresence } from 'framer-motion';
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignStartVertical,
  AlignCenterVertical,
  AlignEndVertical,
  AlignHorizontalSpaceAround,
  AlignVerticalSpaceAround,
  Copy,
  Trash2,
  RectangleHorizontal,
  RectangleVertical,
  Square,
} from 'lucide-react';
import { useProjectStore } from '../../stores/projectStore';
import { Tooltip } from '../ui/Tooltip';
import {
  alignVisualsHorizontal,
  alignVisualsVertical,
  distributeVisualsHorizontal,
  distributeVisualsVertical,
  matchWidth,
  matchHeight,
  matchSize,
} from '../../utils/alignmentUtils';

export function AlignmentToolbar() {
  const {
    selectedVisualIds,
    visuals,
    updateVisuals,
    duplicateVisuals,
    removeVisuals,
  } = useProjectStore();

  const selectedVisuals = visuals.filter((v) => selectedVisualIds.includes(v.id));
  const showToolbar = selectedVisualIds.length >= 2;
  const showDistribute = selectedVisualIds.length >= 3;

  // Alignment handlers
  const handleAlignLeft = () => {
    const aligned = alignVisualsHorizontal(selectedVisuals, 'left');
    updateVisuals(aligned);
  };

  const handleAlignCenter = () => {
    const aligned = alignVisualsHorizontal(selectedVisuals, 'center');
    updateVisuals(aligned);
  };

  const handleAlignRight = () => {
    const aligned = alignVisualsHorizontal(selectedVisuals, 'right');
    updateVisuals(aligned);
  };

  const handleAlignTop = () => {
    const aligned = alignVisualsVertical(selectedVisuals, 'top');
    updateVisuals(aligned);
  };

  const handleAlignMiddle = () => {
    const aligned = alignVisualsVertical(selectedVisuals, 'middle');
    updateVisuals(aligned);
  };

  const handleAlignBottom = () => {
    const aligned = alignVisualsVertical(selectedVisuals, 'bottom');
    updateVisuals(aligned);
  };

  // Distribution handlers
  const handleDistributeHorizontal = () => {
    const distributed = distributeVisualsHorizontal(selectedVisuals);
    updateVisuals(distributed);
  };

  const handleDistributeVertical = () => {
    const distributed = distributeVisualsVertical(selectedVisuals);
    updateVisuals(distributed);
  };

  // Size matching handlers
  const handleMatchWidth = () => {
    const matched = matchWidth(selectedVisuals);
    updateVisuals(matched);
  };

  const handleMatchHeight = () => {
    const matched = matchHeight(selectedVisuals);
    updateVisuals(matched);
  };

  const handleMatchSize = () => {
    const matched = matchSize(selectedVisuals);
    updateVisuals(matched);
  };

  // Action handlers
  const handleDuplicate = () => {
    duplicateVisuals(selectedVisualIds);
  };

  const handleDelete = () => {
    removeVisuals(selectedVisualIds);
  };

  return (
    <AnimatePresence>
      {showToolbar && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute top-4 left-1/2 -translate-x-1/2 z-50"
        >
          <div
            className="flex items-center gap-1 px-3 py-2 rounded-xl border border-white/10"
            style={{
              background: 'linear-gradient(180deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
              backdropFilter: 'blur(12px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
            }}
          >
            {/* Horizontal Alignment */}
            <div className="flex items-center gap-0.5 pr-2 border-r border-white/10">
              <Tooltip content="Align left">
                <button
                  onClick={handleAlignLeft}
                  className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <AlignLeft className="w-4 h-4" />
                </button>
              </Tooltip>

              <Tooltip content="Align center">
                <button
                  onClick={handleAlignCenter}
                  className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <AlignCenter className="w-4 h-4" />
                </button>
              </Tooltip>

              <Tooltip content="Align right">
                <button
                  onClick={handleAlignRight}
                  className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <AlignRight className="w-4 h-4" />
                </button>
              </Tooltip>
            </div>

            {/* Vertical Alignment */}
            <div className="flex items-center gap-0.5 px-2 border-r border-white/10">
              <Tooltip content="Align top">
                <button
                  onClick={handleAlignTop}
                  className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <AlignStartVertical className="w-4 h-4" />
                </button>
              </Tooltip>

              <Tooltip content="Align middle">
                <button
                  onClick={handleAlignMiddle}
                  className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <AlignCenterVertical className="w-4 h-4" />
                </button>
              </Tooltip>

              <Tooltip content="Align bottom">
                <button
                  onClick={handleAlignBottom}
                  className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <AlignEndVertical className="w-4 h-4" />
                </button>
              </Tooltip>
            </div>

            {/* Distribution (only when 3+ selected) */}
            {showDistribute && (
              <div className="flex items-center gap-0.5 px-2 border-r border-white/10">
                <Tooltip content="Distribute horizontally">
                  <button
                    onClick={handleDistributeHorizontal}
                    className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <AlignHorizontalSpaceAround className="w-4 h-4" />
                  </button>
                </Tooltip>

                <Tooltip content="Distribute vertically">
                  <button
                    onClick={handleDistributeVertical}
                    className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <AlignVerticalSpaceAround className="w-4 h-4" />
                  </button>
                </Tooltip>
              </div>
            )}

            {/* Size Matching */}
            <div className="flex items-center gap-0.5 px-2 border-r border-white/10">
              <Tooltip content="Match width">
                <button
                  onClick={handleMatchWidth}
                  className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <RectangleHorizontal className="w-4 h-4" />
                </button>
              </Tooltip>

              <Tooltip content="Match height">
                <button
                  onClick={handleMatchHeight}
                  className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <RectangleVertical className="w-4 h-4" />
                </button>
              </Tooltip>

              <Tooltip content="Match size">
                <button
                  onClick={handleMatchSize}
                  className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <Square className="w-4 h-4" />
                </button>
              </Tooltip>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-0.5 px-2 border-r border-white/10">
              <Tooltip content="Duplicate (Ctrl+D)">
                <button
                  onClick={handleDuplicate}
                  className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </Tooltip>

              <Tooltip content="Delete (Del)">
                <button
                  onClick={handleDelete}
                  className="p-2 rounded-lg text-white/60 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </Tooltip>
            </div>

            {/* Selection count */}
            <div className="pl-2 text-sm text-white/50">
              {selectedVisualIds.length} selected
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
