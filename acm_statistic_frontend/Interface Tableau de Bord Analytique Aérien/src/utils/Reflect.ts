import { formatNumberFR } from "./formatter";

export type PDFColumn<T> = {
  header: string;
  dataKey: keyof T | "rang";
  format?: (value: any, index?: number) => string;
};

export interface ExportTablePDFProps<T> {
  filteredData: T[];
  columns: PDFColumn<T>[];
  title?: string;
  NomFichier?: string;
}

export function generateColumns<T extends Object>(
  sampleObj: T,
  options?: {
    includeRank?: boolean;
    ignoreKeys?: (keyof T)[];
    numberFormatKeys?: (keyof T)[];
    
  }
): PDFColumn<T>[] {
  const columns: PDFColumn<T>[] = [];
  const ignoreKeys = options?.ignoreKeys || [];
  const numberKeys = options?.numberFormatKeys || [];

  
  if (options?.includeRank) {
    columns.push({
      header: "Rang",
      dataKey: "rang",
      format: (_: any, index?: number) => (index !== undefined ? String(index + 1) : ""),
    });
  }

  Object.keys(sampleObj).forEach((key) => {
    if (ignoreKeys.includes(key as keyof T)) return;

    let formatFn: ((val: any) => string) | undefined;

    if (numberKeys.includes(key as keyof T)) {
      
      formatFn = (val: any) => {
            return formatNumberFR(val, key === "montant" ? 2 : 0);
        };
    }

    columns.push({
      header: key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
      dataKey: key as keyof T,
      format: formatFn,
    });
  });

  return columns;
}


export function generateExcelColumns<T extends Object>(
  sampleObj: T,
  options?: {
    includeRank?: boolean;
    ignoreKeys?: (keyof T)[];
  }
) {
  const { includeRank = true, ignoreKeys = [] } = options || {};
  const columns: { header: string; dataKey: keyof T }[] = [];

  if (includeRank) {
    columns.push({
      header: "Rang",
      dataKey: "rang" as keyof T,
    });
  }

  (Object.keys(sampleObj) as (keyof T)[]).forEach((key) => {
    if (ignoreKeys.includes(key)) return;

    columns.push({
      header: key.toString().replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
      dataKey: key,
    });
  });

  return columns;
}
