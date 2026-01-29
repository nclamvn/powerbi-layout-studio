import { useCallback } from 'react';
import { Upload, FileSpreadsheet, Database, X, Hash, Type, Calendar, ToggleLeft } from 'lucide-react';
import { useDataStore } from '../../stores/dataStore';
import { parseFile } from '../../utils/dataParser';
import { Button } from '../ui/Button';
import { FieldType } from '../../types/data.types';

const fieldTypeIcons: Record<FieldType, typeof Hash> = {
  number: Hash,
  string: Type,
  date: Calendar,
  boolean: ToggleLeft,
};

export function DataPanel() {
  const { rawData, fields, fileName, importData, clearData } = useDataStore();

  const handleFileUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const result = await parseFile(file);
      if (result.success) {
        importData(result.data, file.name);
      } else {
        alert(`Error: ${result.error}`);
      }

      e.target.value = '';
    },
    [importData]
  );

  return (
    <div className="space-y-4">
      {/* Upload section */}
      {!fileName ? (
        <div className="space-y-3">
          <label className="block">
            <div className="border-2 border-dashed border-primary-500/30 rounded-xl p-6 text-center cursor-pointer hover:border-primary-500/50 hover:bg-primary-500/5 transition-all">
              <Upload className="w-8 h-8 mx-auto mb-3 text-primary-400" />
              <p className="text-sm text-white/80 mb-1">Drop file here or click to upload</p>
              <p className="text-xs text-white/40">CSV, Excel, JSON</p>
            </div>
            <input
              type="file"
              accept=".csv,.xlsx,.xls,.json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      ) : (
        <>
          {/* File info */}
          <div className="flex items-center justify-between p-3 bg-primary-500/10 rounded-xl border border-primary-500/20">
            <div className="flex items-center gap-3">
              <FileSpreadsheet className="w-5 h-5 text-primary-400" />
              <div>
                <p className="text-sm text-white font-medium">{fileName}</p>
                <p className="text-xs text-white/50">{rawData.length} rows</p>
              </div>
            </div>
            <button
              onClick={clearData}
              className="p-1.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Fields list */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Database className="w-4 h-4 text-primary-400" />
              <h3 className="text-sm font-medium text-white/80">Fields</h3>
              <span className="text-xs text-white/40">({fields.length})</span>
            </div>

            <div className="space-y-1.5 max-h-[400px] overflow-y-auto pr-1">
              {fields.map((field) => {
                const IconComponent = fieldTypeIcons[field.type];
                return (
                  <div
                    key={field.name}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('field', field.name);
                      e.dataTransfer.setData('fieldType', field.type);
                    }}
                    className="flex items-center gap-2.5 p-2.5 bg-dark-surface/50 rounded-lg border border-white/5 cursor-grab hover:bg-dark-surface hover:border-primary-500/20 transition-all group"
                  >
                    <IconComponent className="w-4 h-4 text-white/40 group-hover:text-primary-400" />
                    <span className="text-sm text-white/70 group-hover:text-white flex-1 truncate">
                      {field.name}
                    </span>
                    <span className="text-xs text-white/30 capitalize">{field.type}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Replace button */}
          <label>
            <Button variant="secondary" className="w-full" as="span">
              <Upload className="w-4 h-4" />
              Replace Data
            </Button>
            <input
              type="file"
              accept=".csv,.xlsx,.xls,.json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </>
      )}
    </div>
  );
}
