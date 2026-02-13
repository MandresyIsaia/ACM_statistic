import React from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { ExportTablePDFProps } from "../../../utils/Reflect";
import { getDefaultFileName } from "../../../utils/nomFichier";
import { Button } from '../../ui/button';
import { Download } from "lucide-react";
import logo from '../../../assets/LOGO.png';
import avion from '../../../assets/avion.png';
function drawHorizontalGradientLine(pdf: jsPDF, x: number, y: number, width: number, height: number) {
  for (let i = 0; i < width; i++) {
    const ratio = i / width;
    const r = Math.floor(51 + (255 - 51) * ratio);  // du bleu clair (51) au blanc (255)
    const g = Math.floor(153 + (255 - 153) * ratio);
    const b = Math.floor(255 + (255 - 255) * ratio);

    pdf.setFillColor(r, g, b);
    pdf.rect(x + i, y, 1, height, "F");
  }
}
function  getBase64Image(imgUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous"; // nécessaire si l'image est servie d'un autre domaine
    img.src = imgUrl;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0);
      const dataURL = canvas.toDataURL("image/png");
      resolve(dataURL);
    };
    img.onerror = (err) => reject(err);
  });
}


export function ExportTablePDF<T>({ filteredData, columns, title,NomFichier }: ExportTablePDFProps<T>) {
  const handleExportPDF = async () => {
    const pdf = new jsPDF("p", "pt", "a4");

    let startY = 20;

    const logoBase64 = await getBase64Image(logo);
  
  pdf.addImage(logoBase64, "PNG", 20, startY, 100, 100);
  pdf.setFontSize(16);
  pdf.setTextColor(10, 30, 70); 
  pdf.setFont("helvetica", "bold");
  pdf.text("A.C.M.", 70, startY + 120, { align: "center" }); 

  pdf.setTextColor(10, 30, 70); 
  pdf.setFontSize(18);
  pdf.setFont("helvetica", "bold");
  pdf.text(
    "AVIATION CIVILE DE MADAGASCAR",
    pdf.internal.pageSize.getWidth() / 2,
    startY + 50,
    { align: "center" }
  );

  const pageWidth = pdf.internal.pageSize.getWidth();

  const lineY = startY + 130;

  const gradientWidth = pageWidth - 100;
  const gradientHeight = 6;

  drawHorizontalGradientLine(pdf, 20, lineY, gradientWidth, gradientHeight)
  pdf.setFontSize(12);
  const avionBase64 = await getBase64Image(avion); // ton avion
  pdf.addImage(avionBase64, "PNG", pdf.internal.pageSize.getWidth() - 70, startY + 115, 50, 30);
    
    pdf.text("N°:___________", 475, startY + 200);
    pdf.text("DREC/DAF/ACM", 475, startY + 225);
    pdf.text(`Date: ${new Date().toLocaleDateString("fr-FR")}`, 475, startY + 250);

    if (title) {
      pdf.setFontSize(16);
      pdf.text(title, 20, startY + 200);
      startY += 270;
    } else {
      startY += 270;
    }

    const headers = columns.map((col) => col.header);
    const body = filteredData.map((row, rowIndex) =>
      columns.map((col) => {
        if (col.dataKey === "rang") return col.format ? col.format(null, rowIndex) : rowIndex + 1;
        const value = row[col.dataKey];
        
        return col.format ? col.format(value, rowIndex) : value ?? "";
      })
    );

    // --- Générer le tableau ---
    autoTable(pdf, {
      head: [headers],
      body,
      startY,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [22, 160, 133] },
      theme: "grid",
      margin: { top: 30, left: 20, right: 20 },
    });

    // --- Sauvegarder le PDF ---
    if (NomFichier) {
      pdf.save(NomFichier);
    } else {
      pdf.save(getDefaultFileName("pdf"));
    }
  };


  return (
    <Button 
    onClick={handleExportPDF}
    variant="outline" size="sm">
        <Download className="w-4 h-4 mr-2" />
        Exporter PDF
    </Button>
  );
}
