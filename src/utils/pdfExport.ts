import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ExportSpecs } from '../types/project.types';
import { VISUAL_LABELS } from '../constants/visualDefaults';
import { VisualType } from '../types/visual.types';

export async function exportToPDF(
  specs: ExportSpecs,
  canvasElement: HTMLElement | null
): Promise<void> {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 15;
  let yPosition = margin;

  // Title
  pdf.setFontSize(24);
  pdf.setTextColor(82, 183, 136);
  pdf.text('POWER BI LAYOUT SPECS', margin, yPosition);
  yPosition += 12;

  // Project info
  pdf.setFontSize(12);
  pdf.setTextColor(100, 100, 100);
  pdf.text(`Project: ${specs.projectName}`, margin, yPosition);
  yPosition += 6;
  pdf.text(`Generated: ${new Date(specs.exportedAt).toLocaleString()}`, margin, yPosition);
  yPosition += 6;
  pdf.text(`Canvas: ${specs.canvasSize.width}x${specs.canvasSize.height} (${specs.canvasSize.aspectRatio})`, margin, yPosition);
  yPosition += 15;

  // Canvas screenshot
  if (canvasElement) {
    try {
      const canvas = await html2canvas(canvasElement, {
        backgroundColor: '#0D0D0D',
        scale: 1,
      });

      const imgWidth = pageWidth - margin * 2;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      if (yPosition + imgHeight > pageHeight - margin) {
        pdf.addPage();
        yPosition = margin;
      }

      pdf.addImage(
        canvas.toDataURL('image/png'),
        'PNG',
        margin,
        yPosition,
        imgWidth,
        Math.min(imgHeight, 100)
      );
      yPosition += Math.min(imgHeight, 100) + 10;
    } catch (error) {
      console.error('Failed to capture canvas:', error);
    }
  }

  // Theme section
  pdf.addPage();
  yPosition = margin;

  pdf.setFontSize(16);
  pdf.setTextColor(82, 183, 136);
  pdf.text('THEME SPECIFICATIONS', margin, yPosition);
  yPosition += 10;

  pdf.setFontSize(10);
  pdf.setTextColor(60, 60, 60);

  const themeInfo = [
    `Theme Name: ${specs.theme.name}`,
    `Primary Color: ${specs.theme.colors.primary}`,
    `Background: ${specs.theme.colors.background}`,
    `Surface: ${specs.theme.colors.surface}`,
    `Text: ${specs.theme.colors.text}`,
    `Fonts: ${specs.theme.fonts.heading} / ${specs.theme.fonts.body}`,
  ];

  themeInfo.forEach((line) => {
    pdf.text(line, margin, yPosition);
    yPosition += 6;
  });

  yPosition += 10;

  // Visuals section
  pdf.setFontSize(16);
  pdf.setTextColor(82, 183, 136);
  pdf.text('VISUAL SPECIFICATIONS', margin, yPosition);
  yPosition += 10;

  specs.visuals.forEach((visual, index) => {
    if (yPosition > pageHeight - 60) {
      pdf.addPage();
      yPosition = margin;
    }

    // Visual header
    pdf.setFontSize(12);
    pdf.setTextColor(30, 30, 30);
    const visualLabel = VISUAL_LABELS[visual.type as VisualType] || visual.type;
    pdf.text(`${index + 1}. ${visualLabel}`, margin, yPosition);
    yPosition += 7;

    pdf.setFontSize(9);
    pdf.setTextColor(80, 80, 80);

    // Position
    pdf.text(`Position: X ${visual.position.x}, Y ${visual.position.y}`, margin + 5, yPosition);
    yPosition += 5;
    pdf.text(`Size: W ${visual.position.width}, H ${visual.position.height}`, margin + 5, yPosition);
    yPosition += 7;

    // Power BI Instructions
    pdf.setFontSize(10);
    pdf.setTextColor(45, 106, 79);
    pdf.text(`Power BI Visual: ${visual.powerBIInstructions.visualType}`, margin + 5, yPosition);
    yPosition += 6;

    pdf.setFontSize(9);
    pdf.setTextColor(60, 60, 60);
    visual.powerBIInstructions.steps.forEach((step, stepIndex) => {
      if (yPosition > pageHeight - 20) {
        pdf.addPage();
        yPosition = margin;
      }
      pdf.text(`  ${stepIndex + 1}. ${step}`, margin + 5, yPosition);
      yPosition += 5;
    });

    yPosition += 8;
  });

  // Save
  pdf.save(`${specs.projectName.replace(/\s+/g, '_')}_specs.pdf`);
}
