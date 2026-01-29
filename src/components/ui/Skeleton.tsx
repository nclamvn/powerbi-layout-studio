import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

export function Skeleton({
  className = '',
  variant = 'rectangular',
  width,
  height,
}: SkeletonProps) {
  const baseClasses = 'bg-white/5 overflow-hidden relative';

  const variantClasses = {
    text: 'rounded h-4',
    circular: 'rounded-full',
    rectangular: 'rounded-xl',
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={{ width, height }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        animate={{
          x: ['-100%', '100%'],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </div>
  );
}

// Pre-built skeleton patterns
export function VisualSkeleton() {
  return (
    <div className="glass-panel p-4 space-y-3">
      <Skeleton variant="text" width="60%" />
      <Skeleton variant="rectangular" height={200} />
    </div>
  );
}

export function SidebarSkeleton() {
  return (
    <div className="space-y-2 p-4">
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} variant="rectangular" height={44} />
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      <Skeleton variant="rectangular" height={40} />
      {[...Array(rows)].map((_, i) => (
        <Skeleton key={i} variant="rectangular" height={36} />
      ))}
    </div>
  );
}
