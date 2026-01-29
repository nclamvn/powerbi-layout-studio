import { ReactNode } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface GlassPanelProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'subtle';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function GlassPanel({
  children,
  className = '',
  variant = 'default',
  padding = 'md',
  ...props
}: GlassPanelProps) {
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-6',
  };

  const variantStyles = {
    default: 'bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.10)] shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.06)]',
    elevated: 'bg-[rgba(255,255,255,0.08)] border-[rgba(255,255,255,0.12)] shadow-[0_12px_40px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.08)]',
    subtle: 'bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.06)] shadow-[0_4px_16px_rgba(0,0,0,0.2)]',
  };

  return (
    <motion.div
      className={`
        rounded-2xl
        backdrop-blur-[40px]
        border
        ${variantStyles[variant]}
        ${paddingClasses[padding]}
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  );
}
