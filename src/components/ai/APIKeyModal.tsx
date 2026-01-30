/**
 * APIKeyModal Component
 * Modal to enter and save Anthropic API key
 */

import { useState, useEffect } from 'react';
import { Key, Eye, EyeOff, ExternalLink, X, Check, AlertCircle } from 'lucide-react';

interface APIKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (apiKey: string) => void;
  currentKey?: string;
}

const STORAGE_KEY = 'powerbi-layout-studio-api-key';

export function APIKeyModal({ isOpen, onClose, onSave, currentKey }: APIKeyModalProps) {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Load from localStorage if exists
      const savedKey = localStorage.getItem(STORAGE_KEY);
      setApiKey(savedKey || currentKey || '');
      setError('');
      setIsValid(null);
    }
  }, [isOpen, currentKey]);

  const validateKey = (key: string): boolean => {
    // Basic validation: Anthropic keys start with 'sk-ant-'
    return key.startsWith('sk-ant-') && key.length > 20;
  };

  const testApiKey = async () => {
    if (!validateKey(apiKey)) {
      setError('Invalid API key format. Anthropic keys start with "sk-ant-"');
      setIsValid(false);
      return;
    }

    setIsTesting(true);
    setError('');

    try {
      // Test with a minimal request
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 10,
          messages: [{ role: 'user', content: 'Hi' }],
        }),
      });

      if (response.ok) {
        setIsValid(true);
        setError('');
      } else {
        const data = await response.json();
        setIsValid(false);
        setError(data.error?.message || `API Error: ${response.status}`);
      }
    } catch (err) {
      setIsValid(false);
      setError('Failed to connect to API. Please check your network.');
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = () => {
    if (!validateKey(apiKey)) {
      setError('Invalid API key format');
      return;
    }

    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, apiKey);
    onSave(apiKey);
    onClose();
  };

  const handleClear = () => {
    localStorage.removeItem(STORAGE_KEY);
    setApiKey('');
    setIsValid(null);
    setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-primary-50 to-purple-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-100 rounded-lg">
                <Key className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">API Key Settings</h2>
                <p className="text-xs text-gray-500">Configure your Anthropic API key</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Info */}
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700">
              Your API key is stored locally in your browser and never sent to our servers.
            </p>
          </div>

          {/* API Key Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Anthropic API Key
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value);
                  setIsValid(null);
                  setError('');
                }}
                placeholder="sk-ant-api03-..."
                className={`w-full px-4 py-2.5 pr-20 border rounded-lg text-sm transition-colors ${
                  isValid === true
                    ? 'border-green-300 focus:ring-green-500'
                    : isValid === false
                    ? 'border-red-300 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-primary-500'
                } focus:ring-2 focus:border-transparent`}
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 rounded"
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                {isValid === true && (
                  <Check className="w-4 h-4 text-green-500" />
                )}
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {isValid === true && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              <p className="text-sm text-green-700">API key is valid!</p>
            </div>
          )}

          {/* Get API Key Link */}
          <a
            href="https://console.anthropic.com/settings/keys"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 mb-4"
          >
            <span>Get your API key from Anthropic Console</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
          <button
            onClick={handleClear}
            className="px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
          >
            Clear Key
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={testApiKey}
              disabled={!apiKey || isTesting}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
            >
              {isTesting ? 'Testing...' : 'Test Key'}
            </button>
            <button
              onClick={handleSave}
              disabled={!apiKey || isValid === false}
              className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              Save & Use
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default APIKeyModal;

// Hook to manage API key
export function useAPIKey() {
  const [apiKey, setApiKey] = useState<string>('');
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    const savedKey = localStorage.getItem(STORAGE_KEY);
    if (savedKey) {
      setApiKey(savedKey);
      setIsConfigured(true);
    }
  }, []);

  const saveApiKey = (key: string) => {
    localStorage.setItem(STORAGE_KEY, key);
    setApiKey(key);
    setIsConfigured(true);
  };

  const clearApiKey = () => {
    localStorage.removeItem(STORAGE_KEY);
    setApiKey('');
    setIsConfigured(false);
  };

  return { apiKey, isConfigured, saveApiKey, clearApiKey };
}
