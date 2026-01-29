import Papa from 'papaparse';
import * as XLSX from 'xlsx';

export interface ParseResult {
  success: boolean;
  data: Record<string, unknown>[];
  error?: string;
}

export function parseCSV(file: File): Promise<ParseResult> {
  return new Promise((resolve) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          resolve({
            success: false,
            data: [],
            error: results.errors[0].message,
          });
        } else {
          resolve({
            success: true,
            data: results.data as Record<string, unknown>[],
          });
        }
      },
      error: (error) => {
        resolve({
          success: false,
          data: [],
          error: error.message,
        });
      },
    });
  });
}

export function parseExcel(file: File): Promise<ParseResult> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as Record<string, unknown>[];

        resolve({
          success: true,
          data: jsonData,
        });
      } catch (error) {
        resolve({
          success: false,
          data: [],
          error: error instanceof Error ? error.message : 'Failed to parse Excel file',
        });
      }
    };

    reader.onerror = () => {
      resolve({
        success: false,
        data: [],
        error: 'Failed to read file',
      });
    };

    reader.readAsBinaryString(file);
  });
}

export function parseJSON(file: File): Promise<ParseResult> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const data = JSON.parse(text);

        if (Array.isArray(data)) {
          resolve({
            success: true,
            data: data as Record<string, unknown>[],
          });
        } else if (typeof data === 'object' && data !== null) {
          // If it's an object with an array property, try to find it
          const arrayProp = Object.values(data).find(Array.isArray);
          if (arrayProp) {
            resolve({
              success: true,
              data: arrayProp as Record<string, unknown>[],
            });
          } else {
            resolve({
              success: true,
              data: [data],
            });
          }
        } else {
          resolve({
            success: false,
            data: [],
            error: 'Invalid JSON format. Expected an array of objects.',
          });
        }
      } catch (error) {
        resolve({
          success: false,
          data: [],
          error: error instanceof Error ? error.message : 'Failed to parse JSON',
        });
      }
    };

    reader.onerror = () => {
      resolve({
        success: false,
        data: [],
        error: 'Failed to read file',
      });
    };

    reader.readAsText(file);
  });
}

export async function parseFile(file: File): Promise<ParseResult> {
  const extension = file.name.split('.').pop()?.toLowerCase();

  switch (extension) {
    case 'csv':
      return parseCSV(file);
    case 'xlsx':
    case 'xls':
      return parseExcel(file);
    case 'json':
      return parseJSON(file);
    default:
      return {
        success: false,
        data: [],
        error: `Unsupported file type: ${extension}`,
      };
  }
}
