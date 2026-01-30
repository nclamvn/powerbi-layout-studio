/**
 * AIGenerator Component
 * Main container for Prompt-to-Dashboard feature
 */

import { useState, useCallback, useEffect } from 'react';
import { Sparkles, Settings, AlertCircle } from 'lucide-react';
import { PromptInput } from './PromptInput';
import { GeneratedPreview } from './GeneratedPreview';
import { APIKeyModal, useAPIKey } from './APIKeyModal';
import {
  aiService,
  AIGeneratedDashboard,
  convertAIVisualsToAppVisuals,
  generateSampleDataFromFields
} from '../../services/aiService';
import { Visual } from '../../types/visual.types';

interface AIGeneratorProps {
  onApplyDashboard: (visuals: Visual[], projectName: string, sampleData?: Record<string, unknown>[]) => void;
  isCollapsed?: boolean;
}

type GeneratorState = 'idle' | 'loading' | 'preview' | 'applying';

export function AIGenerator({ onApplyDashboard, isCollapsed = false }: AIGeneratorProps) {
  const { apiKey, isConfigured, saveApiKey } = useAPIKey();
  const [state, setState] = useState<GeneratorState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [generatedDashboard, setGeneratedDashboard] = useState<AIGeneratedDashboard | null>(null);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);

  // Configure AI service when API key changes
  useEffect(() => {
    if (apiKey) {
      aiService.configure({ apiKey });
    }
  }, [apiKey]);

  const handleGenerate = useCallback(async (prompt: string) => {
    if (!isConfigured) {
      setShowApiKeyModal(true);
      return;
    }

    setState('loading');
    setError(null);
    setGeneratedDashboard(null);

    try {
      const dashboard = await aiService.generateDashboard(prompt);
      setGeneratedDashboard(dashboard);
      setState('preview');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate dashboard');
      setState('idle');
    }
  }, [isConfigured]);

  const handleApply = useCallback(() => {
    if (!generatedDashboard) return;

    setState('applying');

    try {
      // Convert AI visuals to app format
      const visuals = convertAIVisualsToAppVisuals(generatedDashboard.visuals);

      // Generate sample data
      const sampleData = generateSampleDataFromFields(generatedDashboard.requiredDataFields);

      // Apply to canvas
      onApplyDashboard(visuals, generatedDashboard.projectName, sampleData);

      // Reset state
      setState('idle');
      setGeneratedDashboard(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to apply dashboard');
      setState('preview');
    }
  }, [generatedDashboard, onApplyDashboard]);

  const handleCancel = useCallback(() => {
    setState('idle');
    setGeneratedDashboard(null);
    setError(null);
  }, []);

  const handleClearError = useCallback(() => {
    setError(null);
  }, []);

  const handleSaveApiKey = useCallback((key: string) => {
    saveApiKey(key);
    setShowApiKeyModal(false);
  }, [saveApiKey]);

  if (isCollapsed) {
    return (
      <div className="p-2">
        <button
          onClick={() => !isConfigured && setShowApiKeyModal(true)}
          className="w-full p-3 bg-gradient-to-r from-primary-500 to-purple-500 text-white rounded-lg hover:from-primary-600 hover:to-purple-600 transition-all flex items-center justify-center gap-2"
          title="AI Dashboard Generator"
        >
          <Sparkles className="w-5 h-5" />
        </button>
        <APIKeyModal
          isOpen={showApiKeyModal}
          onClose={() => setShowApiKeyModal(false)}
          onSave={handleSaveApiKey}
          currentKey={apiKey}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-gradient-to-r from-primary-500 to-purple-500 rounded-lg">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-white">AI Generator</span>
        </div>
        <button
          onClick={() => setShowApiKeyModal(true)}
          className={`p-1.5 rounded-lg transition-colors ${
            isConfigured
              ? 'text-green-400 hover:bg-green-500/20'
              : 'text-orange-400 hover:bg-orange-500/20'
          }`}
          title={isConfigured ? 'API Key configured' : 'Configure API Key'}
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      {/* API Key Warning */}
      {!isConfigured && (
        <div className="p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-orange-300 font-medium">API Key Required</p>
              <p className="text-xs text-orange-400/80 mt-0.5">
                Configure your Anthropic API key to use AI features.
              </p>
              <button
                onClick={() => setShowApiKeyModal(true)}
                className="mt-2 text-xs font-medium text-orange-300 hover:text-orange-200 underline"
              >
                Configure now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      {state === 'idle' || state === 'loading' ? (
        <PromptInput
          onGenerate={handleGenerate}
          isLoading={state === 'loading'}
          error={error}
          onClearError={handleClearError}
        />
      ) : state === 'preview' || state === 'applying' ? (
        generatedDashboard && (
          <GeneratedPreview
            dashboard={generatedDashboard}
            onApply={handleApply}
            onCancel={handleCancel}
            isApplying={state === 'applying'}
          />
        )
      ) : null}

      {/* API Key Modal */}
      <APIKeyModal
        isOpen={showApiKeyModal}
        onClose={() => setShowApiKeyModal(false)}
        onSave={handleSaveApiKey}
        currentKey={apiKey}
      />
    </div>
  );
}

export default AIGenerator;
