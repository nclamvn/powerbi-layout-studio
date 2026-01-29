import { Modal } from '../ui/Modal';
import { KEYBOARD_SHORTCUTS } from '../../constants/keyboardShortcuts';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function KeyboardShortcutsModal({ isOpen, onClose }: KeyboardShortcutsModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Keyboard Shortcuts" size="lg">
      <div className="grid grid-cols-2 gap-6 max-h-[60vh] overflow-y-auto pr-2">
        {KEYBOARD_SHORTCUTS.map((group) => (
          <div key={group.title}>
            <h3 className="text-sm font-semibold text-primary-400 mb-3">
              {group.title}
            </h3>
            <div className="space-y-2">
              {group.shortcuts.map((shortcut, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2 border-b border-white/5 last:border-0"
                >
                  <span className="text-sm text-white/70">
                    {shortcut.description}
                  </span>
                  <div className="flex items-center gap-1">
                    {shortcut.keys.map((key, keyIndex) => (
                      <span key={keyIndex}>
                        <kbd className="px-2 py-1 text-xs font-mono bg-dark-surface border border-white/10 rounded text-white/80">
                          {key}
                        </kbd>
                        {keyIndex < shortcut.keys.length - 1 && (
                          <span className="text-white/30 mx-1">+</span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-white/10 text-center">
        <p className="text-xs text-white/40">
          Press <kbd className="px-1.5 py-0.5 bg-dark-surface border border-white/10 rounded text-white/60">?</kbd> anytime to show this dialog
        </p>
      </div>
    </Modal>
  );
}
