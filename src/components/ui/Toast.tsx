import * as React from 'react';
import * as ToastPrimitive from '@radix-ui/react-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

export interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const colors = {
  success: 'text-green-400 bg-green-500/10 border-green-500/20',
  error: 'text-red-400 bg-red-500/10 border-red-500/20',
  warning: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  info: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
};

interface ToastItemProps extends ToastProps {
  onClose: () => void;
}

function ToastItem({ type, title, message, duration = 3000, action, onClose }: ToastItemProps) {
  const Icon = icons[type];

  return (
    <ToastPrimitive.Root
      duration={duration}
      onOpenChange={(open) => !open && onClose()}
      asChild
    >
      <motion.div
        initial={{ opacity: 0, x: 100, scale: 0.95 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: 100, scale: 0.95 }}
        className={`
          flex items-start gap-3 p-4 rounded-xl border
          backdrop-blur-xl shadow-lg min-w-[320px] max-w-[420px]
          ${colors[type]}
        `}
      >
        <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />

        <div className="flex-1 min-w-0">
          <ToastPrimitive.Title className="font-medium text-white text-sm">
            {title}
          </ToastPrimitive.Title>

          {message && (
            <ToastPrimitive.Description className="text-white/60 text-sm mt-1">
              {message}
            </ToastPrimitive.Description>
          )}

          {action && (
            <ToastPrimitive.Action asChild altText={action.label}>
              <button
                onClick={action.onClick}
                className="mt-2 text-sm font-medium text-primary-400 hover:text-primary-300 transition-colors"
              >
                {action.label}
              </button>
            </ToastPrimitive.Action>
          )}
        </div>

        <ToastPrimitive.Close asChild>
          <button className="text-white/40 hover:text-white/80 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </ToastPrimitive.Close>
      </motion.div>
    </ToastPrimitive.Root>
  );
}

interface ToastProviderProps {
  children: React.ReactNode;
}

interface ToastContextValue {
  toast: (props: Omit<ToastProps, 'id'>) => void;
  dismiss: (id: string) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = React.useState<ToastProps[]>([]);

  const toast = React.useCallback((props: Omit<ToastProps, 'id'>) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { ...props, id }]);
  }, []);

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const success = React.useCallback((title: string, message?: string) => {
    toast({ type: 'success', title, message });
  }, [toast]);

  const error = React.useCallback((title: string, message?: string) => {
    toast({ type: 'error', title, message });
  }, [toast]);

  const warning = React.useCallback((title: string, message?: string) => {
    toast({ type: 'warning', title, message });
  }, [toast]);

  const info = React.useCallback((title: string, message?: string) => {
    toast({ type: 'info', title, message, duration: 2000 });
  }, [toast]);

  return (
    <ToastContext.Provider value={{ toast, dismiss, success, error, warning, info }}>
      <ToastPrimitive.Provider swipeDirection="right">
        {children}

        <ToastPrimitive.Viewport asChild>
          <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
            <AnimatePresence mode="popLayout">
              {toasts.map((t) => (
                <ToastItem key={t.id} {...t} onClose={() => dismiss(t.id)} />
              ))}
            </AnimatePresence>
          </div>
        </ToastPrimitive.Viewport>
      </ToastPrimitive.Provider>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}
