import { Palette, Grid3X3, Eye, EyeOff, Magnet, Check } from 'lucide-react';
import { useUIStore } from '../../stores/uiStore';
import { useThemeStore } from '../../stores/themeStore';
import { THEME_PRESETS } from '../../constants/themePresets';
import { Input } from '../ui/Input';

export function ThemePanel() {
  const { showGrid, snapToGrid, gridSize, toggleGrid, toggleSnapToGrid, setGridSize } = useUIStore();
  const { currentThemeId, currentTheme, setTheme, getChartColors } = useThemeStore();

  const themeList = Object.values(THEME_PRESETS);
  const chartColors = getChartColors();

  return (
    <div className="space-y-6">
      {/* Theme Presets */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Palette className="w-4 h-4 text-primary-400" />
          <h3 className="text-sm font-medium text-white/80">Theme Presets</h3>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {themeList.map((theme) => (
            <button
              key={theme.id}
              onClick={() => setTheme(theme.id)}
              className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                currentThemeId === theme.id
                  ? 'bg-primary-500/10 border-primary-500/30'
                  : 'bg-dark-surface/50 border-white/5 hover:border-white/10'
              }`}
            >
              {/* Color preview */}
              <div className="flex gap-0.5">
                <div
                  className="w-4 h-8 rounded-l"
                  style={{ backgroundColor: theme.colors.primary }}
                />
                <div
                  className="w-4 h-8"
                  style={{ backgroundColor: theme.colors.background }}
                />
                <div
                  className="w-4 h-8 rounded-r"
                  style={{ backgroundColor: theme.colors.surface }}
                />
              </div>

              <div className="flex-1 text-left">
                <p className="text-sm text-white/90">{theme.name}</p>
                <p className="text-xs text-white/40 font-mono">{theme.colors.primary}</p>
              </div>

              {currentThemeId === theme.id && (
                <Check className="w-4 h-4 text-primary-400" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Current Theme Colors */}
      <div>
        <h3 className="text-sm font-medium text-white/80 mb-3">Current Theme</h3>

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg shadow-glow"
              style={{ backgroundColor: currentTheme.colors.primary }}
            />
            <div className="flex-1">
              <p className="text-xs text-white/80">Primary</p>
              <p className="text-xs text-white/40 font-mono">{currentTheme.colors.primary}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg border border-white/10"
              style={{ backgroundColor: currentTheme.colors.background }}
            />
            <div className="flex-1">
              <p className="text-xs text-white/80">Background</p>
              <p className="text-xs text-white/40 font-mono">{currentTheme.colors.background}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg border border-white/10"
              style={{ backgroundColor: currentTheme.colors.surface }}
            />
            <div className="flex-1">
              <p className="text-xs text-white/80">Surface</p>
              <p className="text-xs text-white/40 font-mono">{currentTheme.colors.surface}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Colors */}
      <div>
        <h3 className="text-sm font-medium text-white/80 mb-3">Chart Palette</h3>
        <div className="flex flex-wrap gap-2">
          {chartColors.map((color, index) => (
            <div
              key={index}
              className="w-8 h-8 rounded-lg cursor-pointer hover:scale-110 transition-transform shadow-md"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </div>

      {/* Grid Settings */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Grid3X3 className="w-4 h-4 text-primary-400" />
          <h3 className="text-sm font-medium text-white/80">Grid Settings</h3>
        </div>

        <div className="space-y-3">
          <button
            onClick={toggleGrid}
            className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${
              showGrid
                ? 'bg-primary-500/10 border-primary-500/30 text-white'
                : 'bg-dark-surface/50 border-white/5 text-white/60'
            }`}
          >
            <span className="flex items-center gap-2 text-sm">
              {showGrid ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              Show Grid
            </span>
            <span className="text-xs">{showGrid ? 'ON' : 'OFF'}</span>
          </button>

          <button
            onClick={toggleSnapToGrid}
            className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${
              snapToGrid
                ? 'bg-primary-500/10 border-primary-500/30 text-white'
                : 'bg-dark-surface/50 border-white/5 text-white/60'
            }`}
          >
            <span className="flex items-center gap-2 text-sm">
              <Magnet className="w-4 h-4" />
              Snap to Grid
            </span>
            <span className="text-xs">{snapToGrid ? 'ON' : 'OFF'}</span>
          </button>

          <Input
            label="Grid Size (px)"
            type="number"
            value={gridSize}
            onChange={(e) => setGridSize(Number(e.target.value))}
            min={5}
            max={50}
          />
        </div>
      </div>

      {/* Font Info */}
      <div>
        <h3 className="text-sm font-medium text-white/80 mb-3">Typography</h3>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-white/50">Headings</span>
            <span className="text-white/80 font-medium">Inter (600)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/50">Body</span>
            <span className="text-white/80">Inter (400)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/50">Mono</span>
            <span className="text-white/80 font-mono">JetBrains Mono</span>
          </div>
        </div>
      </div>
    </div>
  );
}
