/**
 * AI Module Exports - v3 (Panel-based)
 * Power BI Layout Studio - Prompt-to-Dashboard Feature
 */

// Main Component - v3 (Panel replaces Canvas)
export { AIChatPanel } from './AIChatPanel';

// Legacy Components
export { AIChatModal } from './AIChatModal';
export { AIButton } from './AIButton';
export { PromptInput } from './PromptInput';
export { GeneratedPreview } from './GeneratedPreview';
export { AIGenerator } from './AIGenerator';

// Shared
export { APIKeyModal, useAPIKey } from './APIKeyModal';

// Service
export {
  aiService,
  convertAIVisualsToAppVisuals,
  generateSampleDataFromFields,
  type AIGeneratedDashboard,
  type AIVisualSpec,
  type DataFieldSpec,
  type AIServiceConfig,
} from '../../services/aiService';
