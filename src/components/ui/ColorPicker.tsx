import { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import * as Popover from '@radix-ui/react-popover';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
}

export function ColorPicker({ value, onChange, label }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-medium text-white/60">{label}</label>
      )}
      <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
        <Popover.Trigger asChild>
          <button
            className="flex items-center gap-2 px-3 py-2 bg-dark-surface border border-white/10 rounded-lg hover:border-primary-500/30 transition-colors"
            type="button"
          >
            <div
              className="w-5 h-5 rounded border border-white/20"
              style={{ backgroundColor: value }}
            />
            <span className="text-sm text-white/70 font-mono">{value}</span>
          </button>
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Content
            className="z-50 p-3 bg-dark-surface/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-xl"
            sideOffset={5}
          >
            <HexColorPicker color={value} onChange={onChange} />
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full mt-3 px-3 py-2 bg-dark-base border border-white/10 rounded-lg text-sm text-white font-mono focus:outline-none focus:border-primary-500/50"
              placeholder="#000000"
            />
            <Popover.Arrow className="fill-dark-surface/95" />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
}
