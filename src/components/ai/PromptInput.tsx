/**
 * PromptInput Component
 * UI for user to input prompt to generate dashboard
 */

import { useState, useRef, useEffect } from 'react';
import { Sparkles, Loader2, Lightbulb, X, ChevronDown, ChevronUp } from 'lucide-react';

interface PromptInputProps {
  onGenerate: (prompt: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  onClearError: () => void;
}

// Example prompts to suggest
const EXAMPLE_PROMPTS = [
  {
    title: 'Sales Dashboard',
    titleVi: 'Dashboard Ban Hang',
    prompt: 'Tao dashboard ban hang voi 4 KPI (doanh thu, don hang, gia tri trung binh, ty le chuyen doi), bieu do trend theo thang, va so sanh theo vung mien',
  },
  {
    title: 'HR Dashboard',
    titleVi: 'Dashboard Nhan Su',
    prompt: 'Tao dashboard nhan su voi so nhan vien, ty le nghi viec, nhan vien moi thang nay, bieu do phan bo theo phong ban va trend theo thang',
  },
  {
    title: 'Financial Dashboard',
    titleVi: 'Dashboard Tai Chinh',
    prompt: 'Tao dashboard tai chinh voi KPI doanh thu, chi phi, loi nhuan, margin, so sanh thuc te vs ke hoach, va phan bo chi phi theo loai',
  },
  {
    title: 'E-Commerce Dashboard',
    titleVi: 'Dashboard E-Commerce',
    prompt: 'Tao dashboard e-commerce voi doanh thu, don hang, visitors, conversion rate, bieu do sales funnel, va top san pham ban chay',
  },
  {
    title: 'Marketing Dashboard',
    titleVi: 'Dashboard Marketing',
    prompt: 'Tao dashboard marketing voi leads, conversions, CAC, ROAS, trend theo tuan, va performance theo channel',
  },
  {
    title: 'Operations Dashboard',
    titleVi: 'Dashboard Van Hanh',
    prompt: 'Tao dashboard van hanh voi OEE, output, defects, downtime, gauge hien thi efficiency, va breakdown theo production line',
  },
];

export function PromptInput({ onGenerate, isLoading, error, onClearError }: PromptInputProps) {
  const [prompt, setPrompt] = useState('');
  const [showExamples, setShowExamples] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [prompt]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;
    await onGenerate(prompt.trim());
  };

  const handleExampleClick = (examplePrompt: string) => {
    setPrompt(examplePrompt);
    setShowExamples(false);
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Submit on Ctrl+Enter or Cmd+Enter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-primary-50 to-purple-50">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-primary-100 rounded-lg">
            <Sparkles className="w-4 h-4 text-primary-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">AI Dashboard Generator</h3>
            <p className="text-xs text-gray-500">Mo ta dashboard ban muon tao (Tieng Viet/English)</p>
          </div>
        </div>
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-4">
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Vi du: Tao dashboard ban hang voi 4 KPI, bieu do trend doanh thu theo thang, so sanh theo vung, va bang chi tiet san pham..."
            className="w-full min-h-[100px] max-h-[200px] p-3 pr-10 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none transition-all placeholder:text-gray-400"
            disabled={isLoading}
          />
          {prompt && !isLoading && (
            <button
              type="button"
              onClick={() => setPrompt('')}
              className="absolute right-3 top-3 p-1 text-gray-400 hover:text-gray-600 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
            <span className="text-red-500 text-sm flex-1">{error}</span>
            <button
              type="button"
              onClick={onClearError}
              className="text-red-400 hover:text-red-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Actions */}
        <div className="mt-3 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setShowExamples(!showExamples)}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary-600 transition-colors"
          >
            <Lightbulb className="w-4 h-4" />
            <span>Vi du goi y</span>
            {showExamples ? (
              <ChevronUp className="w-3 h-3" />
            ) : (
              <ChevronDown className="w-3 h-3" />
            )}
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">Ctrl+Enter</span>
            <button
              type="submit"
              disabled={!prompt.trim() || isLoading}
              className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Dang tao...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Tao Dashboard</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Example Prompts */}
      {showExamples && (
        <div className="px-4 pb-4 border-t border-gray-100 pt-3">
          <div className="grid grid-cols-2 gap-2">
            {EXAMPLE_PROMPTS.map((example, index) => (
              <button
                key={index}
                onClick={() => handleExampleClick(example.prompt)}
                className="text-left p-3 bg-gray-50 hover:bg-primary-50 border border-gray-200 hover:border-primary-300 rounded-lg transition-all group"
              >
                <div className="font-medium text-sm text-gray-800 group-hover:text-primary-700">
                  {example.titleVi}
                </div>
                <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                  {example.prompt}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default PromptInput;
