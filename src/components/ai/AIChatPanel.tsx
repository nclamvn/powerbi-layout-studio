/**
 * AIChatPanel - Grid Background + Glass Composer
 * Modern design with grid pattern and glassmorphism
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Loader2,
  Check,
  RefreshCw,
  ArrowRight,
  AlertCircle,
  LayoutGrid,
  BarChart3,
  LineChart,
  PieChart,
  Table2,
  Gauge,
  Filter,
  TrendingUp,
  Users,
  DollarSign,
  ShoppingCart,
  Settings,
  Sparkles
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════════
// GRID BACKGROUND COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

function GridBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Grid Pattern */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
        }}
      />
      {/* Subtle radial gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 100%)',
        }}
      />
    </div>
  );
}
import {
  aiService,
  AIGeneratedDashboard,
  AIVisualSpec,
  convertAIVisualsToAppVisuals,
  generateSampleDataFromFields
} from '../../services/aiService';
import { useAPIKey } from './APIKeyModal';
import { Visual } from '../../types/visual.types';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  dashboard?: AIGeneratedDashboard;
  isLoading?: boolean;
  error?: string;
}

interface AIChatPanelProps {
  onApplyDashboard: (visuals: Visual[], projectName: string, sampleData?: Record<string, unknown>[]) => void;
  onSwitchToCanvas: () => void;
  onOpenAPIKeySettings: () => void;
}

// ═══════════════════════════════════════════════════════════════════════════
// EXAMPLE PROMPTS - Simple cards
// ═══════════════════════════════════════════════════════════════════════════

const EXAMPLE_PROMPTS = [
  {
    icon: TrendingUp,
    title: 'Sales',
    prompt: 'Tao dashboard ban hang voi 4 KPI, bieu do trend theo thang, va so sanh theo vung mien',
  },
  {
    icon: Users,
    title: 'HR',
    prompt: 'Tao dashboard nhan su voi headcount, turnover rate, bieu do phan bo theo phong ban',
  },
  {
    icon: DollarSign,
    title: 'Finance',
    prompt: 'Tao dashboard tai chinh voi revenue, expenses, profit margin, budget vs actual',
  },
  {
    icon: ShoppingCart,
    title: 'E-Commerce',
    prompt: 'Tao dashboard e-commerce voi conversion rate, orders, revenue, top products',
  },
];

// Visual icons
const VISUAL_ICONS: Record<string, React.ElementType> = {
  'kpi-card': LayoutGrid,
  'line-chart': LineChart,
  'bar-chart': BarChart3,
  'pie-chart': PieChart,
  'data-table': Table2,
  'slicer': Filter,
  'gauge': Gauge,
};

// ═══════════════════════════════════════════════════════════════════════════
// MINI CANVAS - Simple preview
// ═══════════════════════════════════════════════════════════════════════════

function MiniCanvas({ visuals }: { visuals: AIVisualSpec[] }) {
  const scale = 300 / 1920;

  return (
    <div
      className="relative rounded-lg"
      style={{
        width: 300,
        height: 300 * (1080 / 1920),
        background: 'rgba(0, 0, 0, 0.3)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      {visuals.map((visual, index) => (
        <div
          key={visual.id || index}
          className="absolute rounded-sm"
          style={{
            left: visual.position.x * scale,
            top: visual.position.y * scale,
            width: Math.max(visual.position.width * scale, 4),
            height: Math.max(visual.position.height * scale, 4),
            background: 'rgba(255, 255, 255, 0.15)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        />
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// DASHBOARD PREVIEW - Clean card
// ═══════════════════════════════════════════════════════════════════════════

interface DashboardPreviewProps {
  dashboard: AIGeneratedDashboard;
  onApply: () => void;
  onRegenerate: () => void;
  isApplying: boolean;
}

function DashboardPreview({ dashboard, onApply, onRegenerate, isApplying }: DashboardPreviewProps) {
  const visualsByType = dashboard.visuals.reduce((acc, v) => {
    acc[v.type] = (acc[v.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div
      className="mt-4 rounded-xl overflow-hidden"
      style={{
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-white">{dashboard.projectName}</h4>
            <p className="text-sm text-white/50">
              {dashboard.visuals.length} visuals
            </p>
          </div>
          <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-full border border-emerald-500/30">
            Ready
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex gap-4">
        <MiniCanvas visuals={dashboard.visuals} />

        <div className="flex-1 space-y-3">
          {/* Visuals */}
          <div>
            <p className="text-xs text-white/40 uppercase mb-2">Components</p>
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(visualsByType).map(([type, count]) => {
                const Icon = VISUAL_ICONS[type] || LayoutGrid;
                return (
                  <div
                    key={type}
                    className="flex items-center gap-1 px-2 py-1 rounded text-xs text-white/70"
                    style={{ background: 'rgba(255,255,255,0.08)' }}
                  >
                    <Icon className="w-3 h-3" />
                    <span>{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Data fields */}
          <div>
            <p className="text-xs text-white/40 uppercase mb-2">Data Fields</p>
            <div className="flex flex-wrap gap-1">
              {dashboard.requiredDataFields.slice(0, 6).map((field, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded text-xs text-white/50"
                  style={{ background: 'rgba(255,255,255,0.06)' }}
                >
                  {field.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 py-3 border-t border-white/10 flex justify-between">
        <button
          onClick={onRegenerate}
          disabled={isApplying}
          className="px-3 py-1.5 text-sm text-white/50 hover:text-white transition-colors flex items-center gap-1.5"
        >
          <RefreshCw className="w-4 h-4" />
          Regenerate
        </button>
        <button
          onClick={onApply}
          disabled={isApplying}
          className="px-4 py-1.5 bg-white text-black text-sm font-medium rounded-full hover:bg-white/90 transition-colors flex items-center gap-1.5 disabled:opacity-50"
        >
          {isApplying ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Check className="w-4 h-4" />
          )}
          Apply
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MESSAGE - Simple, no avatars
// ═══════════════════════════════════════════════════════════════════════════

interface MessageProps {
  message: Message;
  onApply: (dashboard: AIGeneratedDashboard) => void;
  onRegenerate: (prompt: string) => void;
  isApplying: boolean;
  lastUserPrompt: string;
}

function MessageItem({ message, onApply, onRegenerate, isApplying, lastUserPrompt }: MessageProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`${isUser ? 'flex justify-end' : ''}`}>
      <div
        className={`max-w-[85%] ${isUser ? 'rounded-2xl rounded-br-md px-4 py-2.5' : ''}`}
        style={isUser ? {
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        } : {}}
      >
        {message.isLoading ? (
          <div className="flex items-center gap-2 text-white/50 py-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Generating dashboard...</span>
          </div>
        ) : message.error ? (
          <div className="text-red-400">
            <p>{message.error}</p>
            <button
              onClick={() => onRegenerate(lastUserPrompt)}
              className="mt-1 text-sm underline hover:text-red-300"
            >
              Try again
            </button>
          </div>
        ) : (
          <>
            <p className={`whitespace-pre-wrap ${isUser ? 'text-white' : 'text-white/80'}`}>
              {message.content}
            </p>
            {message.dashboard && (
              <DashboardPreview
                dashboard={message.dashboard}
                onApply={() => onApply(message.dashboard!)}
                onRegenerate={() => onRegenerate(lastUserPrompt)}
                isApplying={isApplying}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// WELCOME - Minimal centered hero (composer handles quick actions)
// ═══════════════════════════════════════════════════════════════════════════

interface WelcomeProps {
  isConfigured: boolean;
  onOpenSettings: () => void;
}

function Welcome({ isConfigured, onOpenSettings }: WelcomeProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
      {/* Hero */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <Sparkles className="w-8 h-8 text-white/60" />
        </div>
        <h1 className="text-3xl font-light text-white mb-3">
          AI Dashboard Generator
        </h1>
        <p className="text-white/40 text-lg">
          Describe the Power BI dashboard you want to create
        </p>
      </div>

      {/* API Key Warning */}
      {!isConfigured && (
        <div
          className="mt-8 p-4 rounded-xl max-w-md w-full"
          style={{
            background: 'rgba(251, 191, 36, 0.1)',
            border: '1px solid rgba(251, 191, 36, 0.2)',
          }}
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 mt-0.5" />
            <div>
              <p className="text-amber-300 font-medium">API Key required</p>
              <p className="text-amber-300/60 text-sm mt-1">Configure your Claude API key to start generating dashboards</p>
              <button
                onClick={onOpenSettings}
                className="mt-2 text-sm text-amber-400 hover:text-amber-300 underline"
              >
                Configure API Key →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════════════

export function AIChatPanel({ onApplyDashboard, onSwitchToCanvas, onOpenAPIKeySettings }: AIChatPanelProps) {
  const { apiKey, isConfigured } = useAPIKey();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [lastUserPrompt, setLastUserPrompt] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (apiKey) aiService.configure({ apiKey });
  }, [apiKey]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  const handleSend = useCallback(async (promptText?: string) => {
    const prompt = promptText || input.trim();
    if (!prompt || isLoading) return;

    if (!isConfigured) {
      onOpenAPIKeySettings();
      return;
    }

    setInput('');
    setLastUserPrompt(prompt);

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: prompt,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);

    const loadingId = `assistant-${Date.now()}`;
    setMessages(prev => [...prev, {
      id: loadingId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isLoading: true,
    }]);
    setIsLoading(true);

    try {
      const dashboard = await aiService.generateDashboard(prompt);
      setMessages(prev => prev.map(m =>
        m.id === loadingId
          ? {
              ...m,
              isLoading: false,
              content: `Created "${dashboard.projectName}" with ${dashboard.visuals.length} components.`,
              dashboard,
            }
          : m
      ));
    } catch (error) {
      setMessages(prev => prev.map(m =>
        m.id === loadingId
          ? {
              ...m,
              isLoading: false,
              error: error instanceof Error ? error.message : 'Generation failed',
            }
          : m
      ));
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, isConfigured, onOpenAPIKeySettings]);

  const handleApply = useCallback((dashboard: AIGeneratedDashboard) => {
    setIsApplying(true);
    try {
      const visuals = convertAIVisualsToAppVisuals(dashboard.visuals);
      const sampleData = generateSampleDataFromFields(dashboard.requiredDataFields);
      onApplyDashboard(visuals, dashboard.projectName, sampleData);

      setMessages(prev => [...prev, {
        id: `success-${Date.now()}`,
        role: 'assistant',
        content: `Applied "${dashboard.projectName}" to canvas.`,
        timestamp: new Date(),
      }]);

      setTimeout(() => onSwitchToCanvas(), 800);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: `Error: ${error instanceof Error ? error.message : 'Unknown'}`,
        timestamp: new Date(),
      }]);
    } finally {
      setIsApplying(false);
    }
  }, [onApplyDashboard, onSwitchToCanvas]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="flex-1 flex flex-col bg-[#0a0a0a] h-full relative">
      {/* Grid Background */}
      <GridBackground />

      {/* Content - relative to appear above grid */}
      <div className="relative z-10 flex-1 flex flex-col">
        {!hasMessages ? (
          <Welcome
            isConfigured={isConfigured}
            onOpenSettings={onOpenAPIKeySettings}
          />
        ) : (
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {messages.map((message) => (
              <MessageItem
                key={message.id}
                message={message}
                onApply={handleApply}
                onRegenerate={handleSend}
                isApplying={isApplying}
                lastUserPrompt={lastUserPrompt}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Composer - Glass Pill Style */}
        <div className="flex-shrink-0 px-4 pb-6 pt-2">
          <div className="max-w-2xl mx-auto">
            {/* Glass Pill Input Container */}
            <div
              className="relative rounded-full overflow-hidden transition-all duration-300 focus-within:ring-1 focus-within:ring-white/20"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              {/* Input Row */}
              <div className="flex items-center">
                {/* Sparkle Icon */}
                <div className="pl-4 pr-2">
                  <Sparkles className="w-5 h-5 text-white/40" />
                </div>

                {/* Text Input */}
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Describe your dashboard..."
                  rows={1}
                  className="flex-1 py-3.5 bg-transparent text-white placeholder:text-white/40 focus:outline-none resize-none text-base"
                  style={{ minHeight: '24px', maxHeight: '80px' }}
                  disabled={isLoading}
                />

                {/* Right Controls */}
                <div className="flex items-center gap-2 pr-2">
                  {/* Settings Button */}
                  <button
                    onClick={onOpenAPIKeySettings}
                    className="p-2 text-white/40 hover:text-white/70 rounded-full hover:bg-white/5 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                  </button>

                  {/* Send Button */}
                  <button
                    onClick={() => handleSend()}
                    disabled={!input.trim() || isLoading || !isConfigured}
                    className="p-2.5 bg-white text-black rounded-full hover:bg-white/90 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <ArrowRight className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Action Pills - Glass Style */}
            <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
              {EXAMPLE_PROMPTS.map((example, index) => {
                const Icon = example.icon;
                return (
                  <button
                    key={index}
                    onClick={() => handleSend(example.prompt)}
                    disabled={!isConfigured || isLoading}
                    className="flex items-center gap-2 px-4 py-2 rounded-full text-sm text-white/60 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                    }}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{example.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AIChatPanel;
