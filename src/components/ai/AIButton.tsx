/**
 * AIButton - Floating button de mo AI Chat Modal
 * Co the dat o header, sidebar, hoac floating
 */

import { Sparkles } from 'lucide-react';

interface AIButtonProps {
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'floating' | 'sidebar';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function AIButton({
  onClick,
  variant = 'primary',
  size = 'md',
  showLabel = true
}: AIButtonProps) {

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-5 py-2.5 text-base gap-2',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  if (variant === 'floating') {
    return (
      <button
        onClick={onClick}
        className="fixed bottom-6 right-6 z-40 p-4 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all group"
        title="AI Dashboard Generator"
      >
        <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse" />
      </button>
    );
  }

  if (variant === 'sidebar') {
    return (
      <button
        onClick={onClick}
        className="w-full flex items-center gap-3 px-3 py-2.5 text-left text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors group"
      >
        <div className="p-1.5 bg-gradient-to-br from-primary-500 to-purple-600 rounded-lg group-hover:scale-105 transition-transform">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1">
          <div className="font-medium">AI Generator</div>
          <div className="text-xs text-gray-500">Tao dashboard tu prompt</div>
        </div>
      </button>
    );
  }

  const baseClasses = "inline-flex items-center font-medium rounded-lg transition-all";

  const variantClasses = {
    primary: 'bg-gradient-to-r from-primary-600 to-purple-600 text-white hover:from-primary-500 hover:to-purple-500 shadow-md hover:shadow-lg',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300',
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant as 'primary' | 'secondary']}`}
    >
      <Sparkles className={iconSizes[size]} />
      {showLabel && <span>AI Generator</span>}
    </button>
  );
}

export default AIButton;
