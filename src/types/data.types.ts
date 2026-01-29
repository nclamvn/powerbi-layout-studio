export type FieldType = 'string' | 'number' | 'date' | 'boolean';

export interface DataField {
  name: string;
  type: FieldType;
  sample: unknown[];
}

export interface ParsedData {
  data: Record<string, unknown>[];
  fields: DataField[];
  fileName: string;
}

export interface FilterState {
  field: string;
  values: unknown[];
}
