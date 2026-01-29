import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  X,
  ChevronRight,
  ChevronLeft,
  Zap,
  LayoutGrid,
  Presentation,
  TableProperties,
  Check,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { GlassPanel } from '../ui/GlassPanel';
import { Button } from '../ui/Button';
import { useAutoLayoutStore } from '../../stores/autoLayoutStore';
import { useDataStore } from '../../stores/dataStore';

interface AutoLayoutWizardProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AutoLayoutWizard({ isOpen, onClose }: AutoLayoutWizardProps) {
  const [step, setStep] = useState<'analysis' | 'select' | 'preview'>('analysis');

  const { rawData } = useDataStore();
  const {
    analysisResult,
    isAnalyzing,
    layoutSuggestions,
    selectedLayoutId,
    isGenerating,
    analyzeData,
    selectLayout,
    applyLayout,
    reset,
  } = useAutoLayoutStore();

  const handleStart = async () => {
    if (rawData.length === 0) return;
    await analyzeData(rawData);
    setStep('select');
  };

  const handleApply = () => {
    applyLayout();
    onClose();
    reset();
    setStep('analysis');
  };

  const handleClose = () => {
    onClose();
    reset();
    setStep('analysis');
  };

  const selectedLayout = layoutSuggestions.find(l => l.id === selectedLayoutId);

  const layoutIcons: Record<string, React.ElementType> = {
    executive: Zap,
    detailed: TableProperties,
    compact: LayoutGrid,
    presentation: Presentation,
  };

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-4xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <GlassPanel variant="elevated" padding="none" className="flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-primary-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">Smart Auto-Layout</h2>
                    <p className="text-sm text-white/60">AI-powered dashboard generation</p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 text-white/40 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Progress Steps */}
              <div className="flex items-center gap-2 px-6 py-4 border-b border-white/5">
                {['analysis', 'select', 'preview'].map((s, index) => (
                  <div key={s} className="flex items-center gap-2">
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                      ${step === s
                        ? 'bg-primary-500 text-white'
                        : index < ['analysis', 'select', 'preview'].indexOf(step)
                          ? 'bg-primary-500/20 text-primary-400'
                          : 'bg-white/5 text-white/40'
                      }
                    `}>
                      {index < ['analysis', 'select', 'preview'].indexOf(step)
                        ? <Check className="w-4 h-4" />
                        : index + 1
                      }
                    </div>
                    <span className={`text-sm ${step === s ? 'text-white' : 'text-white/40'}`}>
                      {s === 'analysis' ? 'Analyze' : s === 'select' ? 'Choose Layout' : 'Apply'}
                    </span>
                    {index < 2 && <ChevronRight className="w-4 h-4 text-white/20" />}
                  </div>
                ))}
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <AnimatePresence mode="wait">
                  {/* Step 1: Analysis */}
                  {step === 'analysis' && (
                    <motion.div
                      key="analysis"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="text-center py-8"
                    >
                      {rawData.length === 0 ? (
                        <div className="space-y-4">
                          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center mx-auto">
                            <AlertCircle className="w-8 h-8 text-amber-400" />
                          </div>
                          <h3 className="text-xl font-semibold text-white">No Data Loaded</h3>
                          <p className="text-white/60 max-w-md mx-auto">
                            Please import a CSV, Excel, or JSON file first. The AI will analyze your data structure and suggest optimal layouts.
                          </p>
                          <Button variant="secondary" onClick={handleClose}>
                            Go to Data Panel
                          </Button>
                        </div>
                      ) : isAnalyzing ? (
                        <div className="space-y-4">
                          <div className="w-16 h-16 rounded-2xl bg-primary-500/10 flex items-center justify-center mx-auto">
                            <Loader2 className="w-8 h-8 text-primary-400 animate-spin" />
                          </div>
                          <h3 className="text-xl font-semibold text-white">Analyzing Your Data...</h3>
                          <p className="text-white/60">
                            Detecting columns, metrics, and optimal visualizations
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          <div className="w-16 h-16 rounded-2xl bg-primary-500/10 flex items-center justify-center mx-auto">
                            <Sparkles className="w-8 h-8 text-primary-400" />
                          </div>
                          <h3 className="text-xl font-semibold text-white">Ready to Analyze</h3>
                          <p className="text-white/60 max-w-md mx-auto">
                            Found <span className="text-primary-400 font-semibold">{rawData.length}</span> rows of data.
                            Click below to let AI analyze and suggest dashboard layouts.
                          </p>
                          <Button onClick={handleStart}>
                            <Sparkles className="w-4 h-4 mr-2" />
                            Analyze & Generate Layouts
                          </Button>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* Step 2: Select Layout */}
                  {step === 'select' && analysisResult && (
                    <motion.div
                      key="select"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      {/* Analysis Summary */}
                      <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                        <h4 className="text-sm font-medium text-white/60 mb-3">DATA ANALYSIS</h4>
                        <div className="grid grid-cols-4 gap-4">
                          <div>
                            <div className="text-2xl font-bold text-white">{analysisResult.totalRows}</div>
                            <div className="text-xs text-white/40">Rows</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-primary-400">{analysisResult.metrics.length}</div>
                            <div className="text-xs text-white/40">Metrics</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-blue-400">{analysisResult.dimensions.length}</div>
                            <div className="text-xs text-white/40">Dimensions</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-amber-400">{analysisResult.timeColumns.length}</div>
                            <div className="text-xs text-white/40">Time Fields</div>
                          </div>
                        </div>

                        {analysisResult.warnings.length > 0 && (
                          <div className="mt-4 pt-4 border-t border-white/10">
                            {analysisResult.warnings.map((warning, i) => (
                              <div key={i} className="flex items-start gap-2 text-sm text-amber-400/80">
                                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                {warning}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Layout Options */}
                      <div>
                        <h4 className="text-sm font-medium text-white/60 mb-3">CHOOSE A LAYOUT STYLE</h4>
                        <div className="grid grid-cols-2 gap-4">
                          {layoutSuggestions.map((layout) => {
                            const Icon = layoutIcons[layout.style] || LayoutGrid;
                            const isSelected = selectedLayoutId === layout.id;

                            return (
                              <motion.button
                                key={layout.id}
                                onClick={() => selectLayout(layout.id)}
                                className={`
                                  p-4 rounded-xl border text-left transition-all
                                  ${isSelected
                                    ? 'border-primary-500 bg-primary-500/10'
                                    : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/[0.07]'
                                  }
                                `}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <div className="flex items-start gap-3">
                                  <div className={`
                                    w-10 h-10 rounded-lg flex items-center justify-center
                                    ${isSelected ? 'bg-primary-500/20' : 'bg-white/5'}
                                  `}>
                                    <Icon className={`w-5 h-5 ${isSelected ? 'text-primary-400' : 'text-white/60'}`} />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                      <h5 className="font-medium text-white">{layout.name}</h5>
                                      {isSelected && <Check className="w-4 h-4 text-primary-400" />}
                                    </div>
                                    <p className="text-sm text-white/50 mt-1">{layout.description}</p>
                                    <div className="flex items-center gap-3 mt-2 text-xs text-white/40">
                                      <span>{layout.visuals.length} visuals</span>
                                      <span>-</span>
                                      <span>{layout.estimatedBuildTime}</span>
                                    </div>
                                  </div>
                                </div>
                              </motion.button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Selected Layout Preview */}
                      {selectedLayout && (
                        <div>
                          <h4 className="text-sm font-medium text-white/60 mb-3">INCLUDED VISUALS</h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedLayout.visuals.map((visual) => (
                              <div
                                key={visual.id}
                                className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm"
                              >
                                <span className="text-white/80">{visual.title}</span>
                                <span className="text-white/40 ml-2">({visual.type})</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* Step 3: Preview (optional, can skip) */}
                  {step === 'preview' && selectedLayout && (
                    <motion.div
                      key="preview"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="text-center py-8"
                    >
                      {isGenerating ? (
                        <div className="space-y-4">
                          <div className="w-16 h-16 rounded-2xl bg-primary-500/10 flex items-center justify-center mx-auto">
                            <Loader2 className="w-8 h-8 text-primary-400 animate-spin" />
                          </div>
                          <h3 className="text-xl font-semibold text-white">Generating Dashboard...</h3>
                          <p className="text-white/60">
                            Creating {selectedLayout.visuals.length} visuals
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="w-16 h-16 rounded-2xl bg-green-500/10 flex items-center justify-center mx-auto">
                            <Check className="w-8 h-8 text-green-400" />
                          </div>
                          <h3 className="text-xl font-semibold text-white">Ready to Apply</h3>
                          <p className="text-white/60 max-w-md mx-auto">
                            Your <span className="text-primary-400">{selectedLayout.name}</span> dashboard
                            with {selectedLayout.visuals.length} visuals is ready to be created.
                          </p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between p-6 border-t border-white/10">
                <Button
                  variant="ghost"
                  onClick={step === 'analysis' ? handleClose : () => setStep(step === 'preview' ? 'select' : 'analysis')}
                  disabled={isAnalyzing || isGenerating}
                >
                  {step === 'analysis' ? 'Cancel' : (
                    <>
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      Back
                    </>
                  )}
                </Button>

                <div className="flex gap-3">
                  {step === 'select' && (
                    <>
                      <Button
                        variant="secondary"
                        onClick={() => setStep('preview')}
                        disabled={!selectedLayoutId}
                      >
                        Preview
                      </Button>
                      <Button
                        onClick={handleApply}
                        disabled={!selectedLayoutId || isGenerating}
                      >
                        <Sparkles className="w-4 h-4 mr-2" />
                        Apply Layout
                      </Button>
                    </>
                  )}

                  {step === 'preview' && (
                    <Button
                      onClick={handleApply}
                      disabled={isGenerating}
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Apply & Close
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </GlassPanel>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
