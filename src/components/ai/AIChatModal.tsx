/**
 * AIChatModal - Full-screen Chat Interface
 * UI giong Claude chatbot - rong rai, thoai mai viet prompt
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  X,
  Sparkles,
  Send,
  Settings,
  Loader2,
  Check,
  RefreshCw,
  Lightbulb,
  Bot,
  User,
  LayoutGrid,
  Trash2,
  BarChart3,
  LineChart,
  PieChart,
  Table2,
  Gauge,
  Filter
} from 'lucide-react';
import {
  aiService,
  AIGeneratedDashboard,
  AIVisualSpec,
  convertAIVisualsToAppVisuals,
  generateSampleDataFromFields
} from '../../services/aiService';
import { APIKeyModal, useAPIKey } from './APIKeyModal';
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

interface AIChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyDashboard: (visuals: Visual[], projectName: string, sampleData?: Record<string, unknown>[]) => void;
}

// ═══════════════════════════════════════════════════════════════════════════
// EXAMPLE PROMPTS
// ═══════════════════════════════════════════════════════════════════════════

const EXAMPLE_PROMPTS = [
  {
    icon: '📊',
    title: 'Sales Dashboard',
    prompt: 'Tao dashboard ban hang voi 4 KPI (doanh thu, don hang, gia tri trung binh, ty le chuyen doi), bieu do trend theo thang, va so sanh theo vung mien',
  },
  {
    icon: '👥',
    title: 'HR Dashboard',
    prompt: 'Tao dashboard nhan su voi so nhan vien, ty le nghi viec, nhan vien moi, bieu do phan bo theo phong ban',
  },
  {
    icon: '💰',
    title: 'Financial Dashboard',
    prompt: 'Tao dashboard tai chinh voi KPI doanh thu, chi phi, loi nhuan, margin, so sanh thuc te vs ke hoach',
  },
  {
    icon: '🛒',
    title: 'E-Commerce Dashboard',
    prompt: 'Tao dashboard e-commerce voi doanh thu, don hang, visitors, conversion rate, va top san pham ban chay',
  },
];

// Visual icon mapping
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
// MINI CANVAS PREVIEW
// ═══════════════════════════════════════════════════════════════════════════

function MiniCanvasPreview({ visuals }: { visuals: AIVisualSpec[] }) {
  const scale = 280 / 1920;

  const getVisualColor = (type: string) => {
    const colors: Record<string, string> = {
      'kpi-card': 'bg-blue-400',
      'line-chart': 'bg-green-400',
      'bar-chart': 'bg-purple-400',
      'pie-chart': 'bg-orange-400',
      'data-table': 'bg-gray-400',
      'slicer': 'bg-cyan-400',
      'gauge': 'bg-yellow-400',
      'funnel': 'bg-pink-400',
      'treemap': 'bg-emerald-400',
      'matrix': 'bg-indigo-400',
    };
    return colors[type] || 'bg-gray-400';
  };

  return (
    <div
      className="relative bg-gray-800 rounded-lg overflow-hidden border border-gray-600"
      style={{ width: 280, height: 280 * (1080 / 1920) }}
    >
      {visuals.map((visual, index) => (
        <div
          key={visual.id || index}
          className={`absolute ${getVisualColor(visual.type)} rounded-sm opacity-80`}
          style={{
            left: visual.position.x * scale,
            top: visual.position.y * scale,
            width: Math.max(visual.position.width * scale, 4),
            height: Math.max(visual.position.height * scale, 4),
          }}
          title={visual.title}
        />
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// DASHBOARD PREVIEW CARD
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
    <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden mt-3">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-700 bg-gradient-to-r from-primary-900/50 to-purple-900/50">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-white">{dashboard.projectName}</h4>
            <p className="text-xs text-gray-400 mt-0.5">
              {dashboard.visuals.length} visuals - {dashboard.requiredDataFields.length} data fields
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex gap-4">
          {/* Mini Canvas */}
          <MiniCanvasPreview visuals={dashboard.visuals} />

          {/* Visual Summary */}
          <div className="flex-1">
            <p className="text-xs text-gray-400 mb-2">Visuals included:</p>
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(visualsByType).map(([type, count]) => {
                const Icon = VISUAL_ICONS[type] || LayoutGrid;
                return (
                  <div
                    key={type}
                    className="flex items-center gap-1 px-2 py-1 bg-gray-700/50 rounded text-xs text-gray-300"
                  >
                    <Icon className="w-3 h-3" />
                    <span>{count}</span>
                  </div>
                );
              })}
            </div>

            {/* Data Fields */}
            <p className="text-xs text-gray-400 mt-3 mb-1.5">Required data:</p>
            <div className="flex flex-wrap gap-1">
              {dashboard.requiredDataFields.slice(0, 5).map((field, i) => (
                <span
                  key={i}
                  className={`px-2 py-0.5 rounded text-xs ${
                    field.type === 'metric' ? 'bg-blue-900/50 text-blue-300' :
                    field.type === 'time' ? 'bg-green-900/50 text-green-300' :
                    'bg-purple-900/50 text-purple-300'
                  }`}
                >
                  {field.name}
                </span>
              ))}
              {dashboard.requiredDataFields.length > 5 && (
                <span className="text-xs text-gray-500">
                  +{dashboard.requiredDataFields.length - 5} more
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 py-3 border-t border-gray-700 bg-gray-900/30 flex items-center justify-end gap-2">
        <button
          onClick={onRegenerate}
          disabled={isApplying}
          className="px-3 py-1.5 text-sm text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Regenerate
        </button>
        <button
          onClick={onApply}
          disabled={isApplying}
          className="px-4 py-1.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-500 transition-colors flex items-center gap-1.5 disabled:opacity-50"
        >
          {isApplying ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Applying...
            </>
          ) : (
            <>
              <Check className="w-3.5 h-3.5" />
              Apply to Canvas
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MESSAGE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

interface MessageBubbleProps {
  message: Message;
  onApply: (dashboard: AIGeneratedDashboard) => void;
  onRegenerate: (prompt: string) => void;
  isApplying: boolean;
  lastUserPrompt: string;
}

function MessageBubble({ message, onApply, onRegenerate, isApplying, lastUserPrompt }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
        isUser ? 'bg-primary-600' : 'bg-gradient-to-br from-orange-500 to-amber-600'
      }`}>
        {isUser ? (
          <User className="w-4 h-4 text-white" />
        ) : (
          <Bot className="w-4 h-4 text-white" />
        )}
      </div>

      {/* Content */}
      <div className={`flex-1 max-w-[85%] ${isUser ? 'text-right' : ''}`}>
        <div className={`inline-block text-left ${
          isUser
            ? 'bg-primary-600 text-white rounded-2xl rounded-tr-md px-4 py-2.5'
            : 'text-gray-100'
        }`}>
          {message.isLoading ? (
            <div className="flex items-center gap-2 text-gray-400">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Dang tao dashboard...</span>
            </div>
          ) : message.error ? (
            <div className="text-red-400">
              <p>{message.error}</p>
            </div>
          ) : (
            <>
              <p className="whitespace-pre-wrap">{message.content}</p>

              {/* Dashboard Preview */}
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

        {/* Timestamp */}
        <p className={`text-xs text-gray-500 mt-1 ${isUser ? 'text-right' : ''}`}>
          {message.timestamp.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export function AIChatModal({ isOpen, onClose, onApplyDashboard }: AIChatModalProps) {
  const { apiKey, isConfigured, saveApiKey } = useAPIKey();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [showExamples, setShowExamples] = useState(true);
  const [lastUserPrompt, setLastUserPrompt] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Configure AI service
  useEffect(() => {
    if (apiKey) {
      aiService.configure({ apiKey });
    }
  }, [apiKey]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Add welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        id: 'welcome',
        role: 'assistant',
        content: 'Xin chao! 👋 Toi co the giup ban tao dashboard Power BI tu mo ta bang tieng Viet hoac English.\n\nHay mo ta dashboard ban muon tao, vi du: "Tao dashboard ban hang voi 4 KPI, bieu do trend theo thang, va so sanh theo vung"',
        timestamp: new Date(),
      }]);
    }
  }, [isOpen, messages.length]);

  const handleSend = useCallback(async (promptText?: string) => {
    const prompt = promptText || input.trim();
    if (!prompt || isLoading) return;

    if (!isConfigured) {
      setShowApiKeyModal(true);
      return;
    }

    setInput('');
    setShowExamples(false);
    setLastUserPrompt(prompt);

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: prompt,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);

    // Add loading message
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

      // Update with response
      setMessages(prev => prev.map(m =>
        m.id === loadingId
          ? {
              ...m,
              isLoading: false,
              content: `Da tao xong **${dashboard.projectName}** voi ${dashboard.visuals.length} visuals! 🎉\n\nXem preview ben duoi va nhan "Apply to Canvas" de su dung:`,
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
              error: error instanceof Error ? error.message : 'Failed to generate dashboard',
            }
          : m
      ));
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, isConfigured]);

  const handleApply = useCallback((dashboard: AIGeneratedDashboard) => {
    setIsApplying(true);

    try {
      const visuals = convertAIVisualsToAppVisuals(dashboard.visuals);
      const sampleData = generateSampleDataFromFields(dashboard.requiredDataFields);

      onApplyDashboard(visuals, dashboard.projectName, sampleData);

      // Add success message
      setMessages(prev => [...prev, {
        id: `success-${Date.now()}`,
        role: 'assistant',
        content: `Dashboard "${dashboard.projectName}" da duoc apply thanh cong!\n\nBan co the:\n- Keo tha de dieu chinh vi tri\n- Click vao visual de chinh sua\n- Quay lai day de tao them`,
        timestamp: new Date(),
      }]);

      // Close modal after delay
      setTimeout(() => onClose(), 1500);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: `Loi khi apply dashboard: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date(),
      }]);
    } finally {
      setIsApplying(false);
    }
  }, [onApplyDashboard, onClose]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClearChat = () => {
    setMessages([{
      id: 'welcome',
      role: 'assistant',
      content: 'Chat da duoc xoa. Hay mo ta dashboard ban muon tao!',
      timestamp: new Date(),
    }]);
    setShowExamples(true);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-4 md:inset-8 lg:inset-16 z-50 flex flex-col bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700 bg-gray-800/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-white">AI Dashboard Generator</h2>
              <p className="text-xs text-gray-400">Powered by Claude</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleClearChat}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
              title="Clear chat"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowApiKeyModal(true)}
              className={`p-2 rounded-lg transition-colors ${
                isConfigured
                  ? 'text-green-400 hover:bg-green-900/30'
                  : 'text-orange-400 hover:bg-orange-900/30'
              }`}
              title={isConfigured ? 'API Key configured' : 'Configure API Key'}
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              onApply={handleApply}
              onRegenerate={handleSend}
              isApplying={isApplying}
              lastUserPrompt={lastUserPrompt}
            />
          ))}

          {/* Example Prompts */}
          {showExamples && messages.length <= 1 && (
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-3 text-gray-400">
                <Lightbulb className="w-4 h-4" />
                <span className="text-sm">Goi y cho ban:</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {EXAMPLE_PROMPTS.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => handleSend(example.prompt)}
                    className="text-left p-4 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700 hover:border-primary-500/50 rounded-xl transition-all group"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{example.icon}</span>
                      <span className="font-medium text-white group-hover:text-primary-400 transition-colors">
                        {example.title}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 line-clamp-2">
                      {example.prompt}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-700 bg-gray-800/50">
          {!isConfigured && (
            <div className="mb-3 p-3 bg-orange-900/30 border border-orange-700/50 rounded-lg flex items-center justify-between">
              <span className="text-sm text-orange-300">
                Can configure API key de su dung
              </span>
              <button
                onClick={() => setShowApiKeyModal(true)}
                className="text-sm text-orange-400 hover:text-orange-300 underline"
              >
                Configure now
              </button>
            </div>
          )}

          <div className="flex gap-3">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Mo ta dashboard ban muon tao... (Enter de gui, Shift+Enter de xuong dong)"
                rows={1}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder:text-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none transition-all"
                style={{ minHeight: '48px', maxHeight: '120px' }}
                disabled={isLoading}
              />
            </div>
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading || !isConfigured}
              className="px-5 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* API Key Modal */}
      <APIKeyModal
        isOpen={showApiKeyModal}
        onClose={() => setShowApiKeyModal(false)}
        onSave={(key) => {
          saveApiKey(key);
          setShowApiKeyModal(false);
        }}
        currentKey={apiKey}
      />
    </>
  );
}

export default AIChatModal;
