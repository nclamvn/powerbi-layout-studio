import * as React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';

interface TooltipProps {
  children: React.ReactNode;
  content: string;
  side?: 'top' | 'right' | 'bottom' | 'left';
  sideOffset?: number;
  delayDuration?: number;
}

export function Tooltip({
  children,
  content,
  side = 'top',
  sideOffset = 5,
  delayDuration = 200,
}: TooltipProps) {
  return (
    <TooltipPrimitive.Provider delayDuration={delayDuration}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            side={side}
            sideOffset={sideOffset}
            className="z-50 px-3 py-1.5 text-xs font-medium text-white bg-dark-surface/95 backdrop-blur-xl border border-white/10 rounded-lg shadow-lg animate-in fade-in-0 zoom-in-95"
          >
            {content}
            <TooltipPrimitive.Arrow className="fill-dark-surface/95" />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}

export function TooltipProvider({ children }: { children: React.ReactNode }) {
  return (
    <TooltipPrimitive.Provider delayDuration={200}>
      {children}
    </TooltipPrimitive.Provider>
  );
}
