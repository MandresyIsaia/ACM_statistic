import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {ExportTablePDFProps } from "../../../utils/Reflect";
import { getDefaultFileName } from "../../../utils/nomFichier";
import { Button } from "../../ui/button";
import { FileText } from "lucide-react";
export function ExportToExcel<T>({ filteredData, columns,title, NomFichier }: ExportTablePDFProps<T>) {
  const handleExportExcel = () => {
    const worksheetData = filteredData.map((row, rowIndex) => {
        const rowData: any = {};
        columns.forEach((col) => {
            if (col.dataKey === "rang") {
            rowData[col.header] = rowIndex + 1; // Rang
            } else {
            rowData[col.header] = row[col.dataKey]; // Valeur brute
            }
        });
        return rowData;
    });

    
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Feuille1");

    
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    if(NomFichier){
        saveAs(blob, NomFichier);
    }
    else{
        saveAs(blob, getDefaultFileName("xlsx"));
    }
    
    
    };
    return (
    <Button 
        onClick={handleExportExcel}
        variant="outline" size="sm">
        <FileText className="w-4 h-4 mr-2" />
        Exporter Excel
    </Button>
  );
}