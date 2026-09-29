/**
 * BLACK S.H.E.E.P. - Module 09: Classified Case Report Dossier
 * Redesigned with White Base + Black Typography + Scientific Red Accents
 * Features comprehensive PDF and CSV export for external research documentation
 */

import React, { useState } from 'react';
import {
  Printer,
  Download,
  FileSpreadsheet,
  FileText,
  CheckCircle2,
  Settings,
  ChevronDown,
  X,
  Shield,
  Layers,
  Sparkles,
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { ResearchCase, Subject, Experiment, Anomaly, Hypothesis } from '../../types';

interface ReportsModuleProps {
  cases: ResearchCase[];
  subjects: Subject[];
  experiments: Experiment[];
  anomalies: Anomaly[];
  hypotheses: Hypothesis[];
}

export const ReportsModule: React.FC<ReportsModuleProps> = ({
  cases,
  subjects,
  experiments,
  anomalies,
  hypotheses,
}) => {
  const [selectedCaseId, setSelectedCaseId] = useState<string>(cases[0]?.id || '');
  const activeCase = cases.find((c) => c.id === selectedCaseId) || cases[0];
  const caseSubjects = subjects.filter((s) => activeCase?.assignedSubjectIds?.includes(s.id));
  const caseExperiments = experiments.filter((e) => e.caseId === activeCase?.id);
  const caseAnomalies = anomalies.filter(
    (a) => caseSubjects.some((s) => s.id === a.subjectId)
  );

  // Export State & Notification
  const [exportMessage, setExportMessage] = useState<string | null>(null);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [isExportingCSV, setIsExportingCSV] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);

  // Export Section Options
  const [includeOverview, setIncludeOverview] = useState(true);
  const [includeSubjects, setIncludeSubjects] = useState(true);
  const [includeExperiments, setIncludeExperiments] = useState(true);
  const [includeAnomalies, setIncludeAnomalies] = useState(true);
  const [includeCitations, setIncludeCitations] = useState(true);
  const [includeSignOff, setIncludeSignOff] = useState(true);

  const showNotification = (msg: string) => {
    setExportMessage(msg);
    setTimeout(() => {
      setExportMessage(null);
    }, 4500);
  };

  /**
   * Helper: Escapes values for CSV compatibility
   */
  const escapeCSV = (value: any): string => {
    if (value === null || value === undefined) return '""';
    const str = String(value).replace(/"/g, '""');
    return `"${str}"`;
  };

  /**
   * Generates and downloads a structured CSV file containing full case telemetry
   */
  const handleExportCSV = () => {
    setIsExportingCSV(true);
    try {
      const rows: string[] = [];
      const timestamp = new Date().toISOString();
      const dateStr = timestamp.slice(0, 10);

      // Header Meta Block
      rows.push('PROJECT,BLACK S.H.E.E.P. - STRATEGIC HUMANOID EXPERIMENT AND EVALUATION PROTOCOL');
      rows.push('REPORT TYPE,CLASSIFIED RESEARCH FINDINGS DOSSIER');
      rows.push(`EXPORT DATE,${escapeCSV(timestamp)}`);
      rows.push(`CASE CODE,${escapeCSV(activeCase?.code || 'N/A')}`);
      rows.push(`CASE NAME,${escapeCSV(activeCase?.name || 'N/A')}`);
      rows.push(`TARGET ENVIRONMENT,${escapeCSV(activeCase?.environment || 'N/A')}`);
      rows.push(`STATUS,${escapeCSV(activeCase?.status || 'N/A')}`);
      rows.push(`CLEARANCE,LEVEL-5 SCIENTIFIC`);
      rows.push('');

      // Section 1: Executive Overview
      if (includeOverview) {
        rows.push('=== SECTION 1: EXECUTIVE OVERVIEW & HYPOTHESIS ===');
        rows.push(`OBJECTIVE,${escapeCSV(activeCase?.objective || '')}`);
        rows.push(`DESCRIPTION,${escapeCSV(activeCase?.description || '')}`);
        rows.push(`RESEARCH QUESTION,${escapeCSV(activeCase?.researchQuestion || '')}`);
        rows.push(`PRIMARY HYPOTHESIS,${escapeCSV(activeCase?.initialHypothesis || '')}`);
        rows.push('');
      }

      // Section 2: Monitored Cohort Subjects
      if (includeSubjects) {
        rows.push('=== SECTION 2: MONITORED SYNTHETIC COHORT ===');
        rows.push([
          'Subject ID',
          'Code',
          'Name',
          'Occupation',
          'Stress (%)',
          'Rebellion Probability (%)',
          'Conformity',
          'Empathy',
          'Dominance',
          'Impulse Control',
          'Personality Traits',
        ].map(escapeCSV).join(','));

        caseSubjects.forEach((sub) => {
          const dimMap = new Map(sub.behavioralDimensions.map((d) => [d.name, d.value]));
          rows.push([
            sub.id,
            sub.code,
            sub.name,
            sub.occupation,
            sub.emotionalState.stress,
            sub.riskIndicators.rebellionProbability,
            dimMap.get('Conformity') ?? 'N/A',
            dimMap.get('Empathy') ?? 'N/A',
            dimMap.get('Dominance Drive') ?? 'N/A',
            dimMap.get('Impulse Control') ?? 'N/A',
            sub.personalityTraits.join('; '),
          ].map(escapeCSV).join(','));
        });
        rows.push('');
      }

      // Section 3: Experimental Protocols & Findings
      if (includeExperiments) {
        rows.push('=== SECTION 3: EXPERIMENTAL PROTOCOLS & DEVIATION FINDINGS ===');
        rows.push([
          'Trial Code',
          'Title',
          'Target Environment',
          'Status',
          'Scenario Description',
          'Formulated Prediction',
          'Actual Observed Outcome',
          'Deviation Score',
          'Prediction Accuracy Error (%)',
        ].map(escapeCSV).join(','));

        caseExperiments.forEach((exp) => {
          rows.push([
            exp.code,
            exp.title,
            exp.environment,
            exp.status,
            exp.scenario,
            exp.prediction?.predictedOutcome || exp.expectedBehavior || 'N/A',
            exp.actualOutcome?.observedBehavior || 'Pending execution',
            exp.actualOutcome?.deviationScore || 'N/A',
            exp.actualOutcome?.predictionErrorPct !== undefined ? `${exp.actualOutcome.predictionErrorPct}%` : 'N/A',
          ].map(escapeCSV).join(','));
        });
        rows.push('');
      }

      // Section 4: Anomalies
      if (includeAnomalies && caseAnomalies.length > 0) {
        rows.push('=== SECTION 4: CORRELATED ANOMALIES & BEHAVIORAL FLAGS ===');
        rows.push([
          'Anomaly ID',
          'Category',
          'Severity Score',
          'Subject ID',
          'Status',
          'Description',
          'Grounded AI Explanation',
        ].map(escapeCSV).join(','));

        caseAnomalies.forEach((anom) => {
          rows.push([
            anom.code || anom.id,
            anom.category,
            anom.anomalyScore,
            anom.subjectCode || anom.subjectId,
            anom.status,
            anom.description,
            anom.aiExplanation || 'N/A',
          ].map(escapeCSV).join(','));
        });
        rows.push('');
      }

      // Section 5: Citations & Sign-off
      if (includeCitations) {
        rows.push('=== SECTION 5: GROUNDED LITERATURE CITATIONS ===');
        rows.push('CITATION 1,"Thinking, Fast and Slow (Daniel Kahneman): Dual-system processing & ego depletion under social stress."');
        rows.push('CITATION 2,"Dictionary of Body Language (Joe Navarro): Ventral denial & nonverbal pacifying indicators."');
        rows.push('CITATION 3,"In Sheep\'s Clothing (Dr. George Simon): Covert-aggressive manipulation & group scapegoating."');
        rows.push('CITATION 4,"The Prince (Niccolò Machiavelli): Tactical alliances & power asymmetries in closed cohorts."');
        rows.push('');
      }

      if (includeSignOff) {
        rows.push('=== SECTION 6: SCIENTIFIC VERIFICATION SIGN-OFF ===');
        rows.push('VERIFIED BY,Akash Sankar (System Architect) & Alfa (Psychological Advisor)');
        rows.push('STATUS,VALIDATED // OFFICIAL EXPORT');
      }

      // Create download trigger
      const csvContent = '\uFEFF' + rows.join('\r\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const filename = `${(activeCase?.code || 'CASE').replace(/[^a-zA-Z0-9_-]/g, '_')}_FINDINGS_${dateStr}.csv`;
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showNotification(`Successfully exported CSV dataset: ${filename}`);
      setShowExportModal(false);
      setExportMenuOpen(false);
    } catch (err: any) {
      alert(`CSV Export failed: ${err?.message || 'Unknown error'}`);
    } finally {
      setIsExportingCSV(false);
    }
  };

  /**
   * Generates and downloads a formatted PDF document using jsPDF
   */
  const handleExportPDF = () => {
    setIsExportingPDF(true);
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = 210;
      const pageHeight = 297;
      const margin = 15;
      const contentWidth = pageWidth - margin * 2;
      let currentY = margin;

      // Helper to check for page break
      const ensureSpace = (neededHeight: number) => {
        if (currentY + neededHeight > pageHeight - margin - 12) {
          doc.addPage();
          currentY = margin;
          renderHeaderRibbon();
        }
      };

      // Header Ribbon on each page
      const renderHeaderRibbon = () => {
        doc.setFillColor(15, 23, 42); // slate-900 / black
        doc.rect(margin, currentY, contentWidth, 7, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(255, 255, 255);
        doc.text('BLACK S.H.E.E.P. // CLASSIFIED BEHAVIORAL RESEARCH DOSSIER', margin + 3, currentY + 4.8);
        doc.setTextColor(239, 68, 68); // Red
        doc.text('LEVEL-5 CLEARANCE', pageWidth - margin - 35, currentY + 4.8);
        currentY += 10;
      };

      // PAGE 1: First header
      renderHeaderRibbon();

      // Title Block
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(22);
      doc.setTextColor(0, 0, 0);
      doc.text(activeCase?.name || 'RESEARCH CASE REPORT', margin, currentY);
      currentY += 7;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(220, 38, 38); // Red accent
      doc.text(`CASE CODE: ${activeCase?.code || 'BS-CASE'}  |  TARGET ENVIRONMENT: ${activeCase?.environment?.toUpperCase() || 'CONTROLLED'}`, margin, currentY);
      currentY += 5;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(100, 116, 139);
      doc.text(`EVALUATION CYCLE: #144  |  DATE: ${new Date().toLocaleDateString()}  |  WORKSTATION ID: BS-OBS-01`, margin, currentY);
      currentY += 4;

      // Red divider line
      doc.setDrawColor(220, 38, 38);
      doc.setLineWidth(0.8);
      doc.line(margin, currentY, pageWidth - margin, currentY);
      currentY += 6;

      // Section 1: Executive Overview
      if (includeOverview) {
        ensureSpace(28);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        doc.text('01. EXECUTIVE RESEARCH OVERVIEW & OBJECTIVES', margin, currentY);
        currentY += 5;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(30, 41, 59);

        const overviewText = activeCase?.description ||
          'This case evaluates behavioral conformity, stress-induced deviation thresholds, and social compliance within synthetic open-world humanoid cohorts.';
        const splitOverview = doc.splitTextToSize(overviewText, contentWidth);
        doc.text(splitOverview, margin, currentY);
        currentY += splitOverview.length * 4.2 + 4;

        // Hypotheses callout box
        ensureSpace(24);
        doc.setFillColor(248, 250, 252);
        doc.setDrawColor(203, 213, 225);
        doc.setLineWidth(0.3);
        doc.roundedRect(margin, currentY, contentWidth, 18, 1.5, 1.5, 'FD');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(220, 38, 38);
        doc.text('RESEARCH QUESTION:', margin + 3, currentY + 5);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(0, 0, 0);
        const qLines = doc.splitTextToSize(`"${activeCase?.researchQuestion || 'What triggers autonomous behavioral defiance?'}"`, contentWidth - 45);
        doc.text(qLines, margin + 40, currentY + 5);

        doc.setFont('helvetica', 'bold');
        doc.setTextColor(220, 38, 38);
        doc.text('PRIMARY HYPOTHESIS:', margin + 3, currentY + 12);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(0, 0, 0);
        const hLines = doc.splitTextToSize(`"${activeCase?.initialHypothesis || 'Peer conformity degrades when attachment bonds are threatened.'}"`, contentWidth - 45);
        doc.text(hLines, margin + 40, currentY + 12);

        currentY += 23;
      }

      // Section 2: Monitored Cohort Subjects
      if (includeSubjects && caseSubjects.length > 0) {
        ensureSpace(32);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        doc.text(`02. MONITORED SYNTHETIC COHORT (${caseSubjects.length} SUBJECTS)`, margin, currentY);
        currentY += 5;

        // Table Header
        doc.setFillColor(241, 245, 249);
        doc.rect(margin, currentY, contentWidth, 6, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(0, 0, 0);
        doc.text('CODE', margin + 2, currentY + 4.2);
        doc.text('NAME / OCCUPATION', margin + 24, currentY + 4.2);
        doc.text('STRESS', margin + 85, currentY + 4.2);
        doc.text('REBELLION RISK', margin + 110, currentY + 4.2);
        doc.text('KEY PERSONALITY TRAITS', margin + 145, currentY + 4.2);
        currentY += 7;

        // Subject Rows
        caseSubjects.forEach((sub, i) => {
          ensureSpace(7);
          if (i % 2 === 1) {
            doc.setFillColor(250, 250, 250);
            doc.rect(margin, currentY - 1, contentWidth, 6, 'F');
          }
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(8);
          doc.setTextColor(220, 38, 38);
          doc.text(sub.code, margin + 2, currentY + 3.2);

          doc.setFont('helvetica', 'normal');
          doc.setTextColor(0, 0, 0);
          doc.text(`${sub.name} (${sub.occupation})`, margin + 24, currentY + 3.2);

          doc.text(`${sub.emotionalState.stress}%`, margin + 85, currentY + 3.2);
          doc.text(`${sub.riskIndicators.rebellionProbability}%`, margin + 110, currentY + 3.2);

          doc.setFont('helvetica', 'italic');
          doc.setTextColor(100, 116, 139);
          const traitsText = sub.personalityTraits.slice(0, 3).join(', ');
          doc.text(traitsText, margin + 145, currentY + 3.2);

          currentY += 6;
        });

        currentY += 4;
      }

      // Section 3: Experimental Protocols & Findings
      if (includeExperiments && caseExperiments.length > 0) {
        ensureSpace(35);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        doc.text(`03. EXPERIMENTAL PROTOCOLS & DEVIATION FINDINGS (${caseExperiments.length} TRIALS)`, margin, currentY);
        currentY += 6;

        caseExperiments.forEach((exp) => {
          ensureSpace(32);
          // Trial Card
          doc.setFillColor(248, 250, 252);
          doc.setDrawColor(0, 0, 0);
          doc.setLineWidth(0.4);
          doc.roundedRect(margin, currentY, contentWidth, 26, 1, 1, 'FD');

          // Trial Header
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(8.5);
          doc.setTextColor(220, 38, 38);
          doc.text(`[${exp.code}]`, margin + 3, currentY + 5);

          doc.setFont('helvetica', 'bold');
          doc.setTextColor(0, 0, 0);
          doc.text(exp.title, margin + 22, currentY + 5);

          doc.setFont('helvetica', 'bold');
          doc.setFontSize(7.5);
          doc.setTextColor(100, 116, 139);
          doc.text(`STATUS: ${exp.status}`, pageWidth - margin - 35, currentY + 5);

          // Scenario
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(7.5);
          doc.setTextColor(71, 85, 105);
          const scLines = doc.splitTextToSize(exp.scenario, contentWidth - 6);
          doc.text(scLines.slice(0, 2), margin + 3, currentY + 10);

          // Prediction vs Actual
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(7.5);
          doc.setTextColor(71, 85, 105);
          doc.text('FORMULATED PREDICTION:', margin + 3, currentY + 18);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(0, 0, 0);
          const pred = doc.splitTextToSize(exp.prediction?.predictedOutcome || exp.expectedBehavior || 'N/A', 60);
          doc.text(pred[0] || '', margin + 42, currentY + 18);

          doc.setFont('helvetica', 'bold');
          doc.setTextColor(220, 38, 38);
          doc.text('ACTUAL OUTCOME:', margin + 105, currentY + 18);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(0, 0, 0);
          const act = doc.splitTextToSize(exp.actualOutcome?.observedBehavior || 'Pending execution', 55);
          doc.text(act[0] || '', margin + 135, currentY + 18);

          // Deviation Score badge
          if (exp.actualOutcome?.deviationScore) {
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(7);
            doc.setTextColor(220, 38, 38);
            doc.text(`DEVIATION: ${exp.actualOutcome.deviationScore}`, margin + 3, currentY + 23);
          }

          currentY += 29;
        });
      }

      // Section 4: Literature Citations
      if (includeCitations) {
        ensureSpace(30);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        doc.text('04. GROUNDED LITERATURE & CITATIONS', margin, currentY);
        currentY += 5;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(30, 41, 59);

        const citations = [
          '• Thinking, Fast and Slow (Daniel Kahneman): Dual-system processing & ego depletion under social stress.',
          '• Dictionary of Body Language (Joe Navarro): Ventral denial, gaze aversion & nonverbal pacifying gestures.',
          '• In Sheep\'s Clothing (Dr. George Simon): Covert-aggressive manipulation tactics & group scapegoating.',
          '• The Prince (Niccolò Machiavelli): Tactical alliances & power asymmetries in closed cohorts.',
        ];

        citations.forEach((c) => {
          doc.text(c, margin + 2, currentY);
          currentY += 4.5;
        });

        currentY += 3;
      }

      // Section 5: Verification Sign-off
      if (includeSignOff) {
        ensureSpace(24);
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.6);
        doc.line(margin, currentY, pageWidth - margin, currentY);
        currentY += 6;

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(0, 0, 0);
        doc.text('VERIFIED BY RESEARCH ARCHITECTS:', margin, currentY);
        currentY += 4.5;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(71, 85, 105);
        doc.text('Akash Sankar (System Architect)  ·  Alfa (Psychological Advisor)', margin, currentY);

        doc.setFont('helvetica', 'bold');
        doc.setTextColor(220, 38, 38);
        doc.text('SIGNATURE VALIDATED // SECURE SESSION SHA-256', pageWidth - margin - 75, currentY);
      }

      // Page numbers on all pages
      const totalPages = (doc as any).internal.getNumberOfPages();
      for (let p = 1; p <= totalPages; p++) {
        doc.setPage(p);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(148, 163, 184);
        doc.text(
          `Page ${p} of ${totalPages}  |  CONFIDENTIAL // S.H.E.E.P. PROTOCOL v0.1`,
          pageWidth / 2 - 25,
          pageHeight - 6
        );
      }

      // Save PDF trigger
      const dateStr = new Date().toISOString().slice(0, 10);
      const filename = `${(activeCase?.code || 'CASE').replace(/[^a-zA-Z0-9_-]/g, '_')}_DOSSIER_${dateStr}.pdf`;
      doc.save(filename);

      showNotification(`Successfully exported formatted PDF: ${filename}`);
      setShowExportModal(false);
      setExportMenuOpen(false);
    } catch (err: any) {
      alert(`PDF Export failed: ${err?.message || 'Unknown error'}`);
    } finally {
      setIsExportingPDF(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Module Title Banner & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b-2 border-black gap-4 no-print">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono-data text-red-600 font-bold mb-1">
            <span>MODULE 09</span>
            <span>·</span>
            <span>FORMAL SCIENTIFIC CASE REPORT GENERATOR</span>
          </div>
          <h1 className="font-display text-4xl text-black tracking-wider">
            CASE REPORTS & DOSSIERS
          </h1>
          <p className="text-xs text-zinc-600 font-mono-data mt-0.5">
            Compiled classified evaluation dossiers uniting observations, RAG literature grounding, and external documentation export.
          </p>
        </div>

        {/* Action Controls & Export Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Case Selector Dropdown */}
          <select
            value={selectedCaseId}
            onChange={(e) => setSelectedCaseId(e.target.value)}
            className="bg-white border-2 border-black rounded-lg px-3 py-2 text-xs font-mono-data text-black font-semibold focus:outline-none focus:border-red-600 shadow-xs cursor-pointer"
          >
            {cases.map((c) => (
              <option key={c.id} value={c.id}>
                {c.code} - {c.name}
              </option>
            ))}
          </select>

          {/* Quick Export PDF */}
          <button
            onClick={handleExportPDF}
            disabled={isExportingPDF}
            title="Download formatted PDF research dossier"
            className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-mono-data font-bold tracking-wide transition-all flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95 disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExportingPDF ? 'GENERATING PDF...' : 'EXPORT PDF'}</span>
          </button>

          {/* Quick Export CSV */}
          <button
            onClick={handleExportCSV}
            disabled={isExportingCSV}
            title="Download full CSV findings dataset for statistical analysis"
            className="px-3.5 py-2 bg-black hover:bg-zinc-800 text-white rounded-lg text-xs font-mono-data font-bold tracking-wide transition-all flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95 disabled:opacity-50"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-red-500" />
            <span>{isExportingCSV ? 'GENERATING CSV...' : 'EXPORT CSV'}</span>
          </button>

          {/* Export Settings Dropdown / Modal Trigger */}
          <div className="relative">
            <button
              onClick={() => setExportMenuOpen(!exportMenuOpen)}
              className="p-2 border-2 border-black rounded-lg hover:bg-zinc-100 text-black transition-colors cursor-pointer"
              title="Export Options"
            >
              <Settings className="w-4 h-4" />
            </button>

            {exportMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border-2 border-black rounded-xl shadow-xl z-30 p-2 text-xs font-mono-data space-y-1">
                <div className="px-2 py-1.5 border-b border-black/10 text-zinc-500 font-bold text-[10px] uppercase">
                  DOCUMENT EXPORT OPTIONS
                </div>
                <button
                  onClick={handleExportPDF}
                  className="w-full text-left px-2.5 py-1.5 hover:bg-zinc-100 rounded-md flex items-center gap-2 text-black font-semibold cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-red-600" />
                  <span>Download .PDF Dossier</span>
                </button>
                <button
                  onClick={handleExportCSV}
                  className="w-full text-left px-2.5 py-1.5 hover:bg-zinc-100 rounded-md flex items-center gap-2 text-black font-semibold cursor-pointer"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Download .CSV Dataset</span>
                </button>
                <button
                  onClick={handlePrint}
                  className="w-full text-left px-2.5 py-1.5 hover:bg-zinc-100 rounded-md flex items-center gap-2 text-black font-semibold cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-blue-600" />
                  <span>Browser Print / Save PDF</span>
                </button>
                <div className="border-t border-black/10 pt-1">
                  <button
                    onClick={() => {
                      setExportMenuOpen(false);
                      setShowExportModal(true);
                    }}
                    className="w-full text-left px-2.5 py-1.5 hover:bg-red-50 text-red-600 font-bold rounded-md flex items-center gap-2 cursor-pointer"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Customize Export Fields...</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Browser Print Button */}
          <button
            onClick={handlePrint}
            title="Print or Save via Browser System Dialog"
            className="px-3 py-2 border-2 border-black/30 hover:border-black rounded-lg text-xs font-mono-data text-zinc-700 hover:text-black font-bold flex items-center gap-1.5 cursor-pointer bg-white"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">PRINT</span>
          </button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {exportMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border-2 border-emerald-500 text-xs font-mono-data text-emerald-900 flex items-center justify-between shadow-xs animate-in fade-in duration-200 no-print">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">{exportMessage}</span>
          </div>
          <button
            onClick={() => setExportMessage(null)}
            className="text-emerald-700 hover:text-black font-bold cursor-pointer text-[11px]"
          >
            DISMISS
          </button>
        </div>
      )}

      {/* Formal Research Report Document */}
      <div className="bg-white border-2 border-black rounded-2xl p-8 max-w-5xl mx-auto space-y-8 shadow-md relative print:border-none print:shadow-none print:p-0">
        {/* Document Header Lockup */}
        <div className="border-b-2 border-red-600 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono-data text-red-600 font-bold mb-1">
              <span>PROJECT: BLACK S.H.E.E.P.</span>
              <span>·</span>
              <span>CLASSIFIED PROTOCOL DOSSIER</span>
            </div>
            <h2 className="font-display text-4xl text-black tracking-wider">
              {activeCase?.name || 'CASE REPORT'}
            </h2>
            <p className="text-xs font-mono-data text-zinc-600 mt-1">
              CASE REFERENCE: <span className="font-bold text-black">{activeCase?.code}</span> · TARGET ENVIRONMENT: <span className="font-bold text-black">{activeCase?.environment}</span>
            </p>
          </div>

          <div className="text-left sm:text-right text-xs font-mono-data text-zinc-600">
            <p className="font-bold text-black">EVALUATION CYCLE: #144</p>
            <p className="text-red-600 font-bold">CLEARANCE: LEVEL-5 SCIENTIFIC</p>
            <p>EXPORT DATE: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* Section 01: Executive Research Overview */}
        {includeOverview && (
          <div className="space-y-3 print-break-inside-avoid">
            <h3 className="font-display text-xl text-black tracking-wider border-b border-black/10 pb-1 flex items-center justify-between">
              <span>01. EXECUTIVE RESEARCH OVERVIEW & OBJECTIVE</span>
              <span className="text-[10px] font-mono-data text-zinc-400 font-normal">SEC-01</span>
            </h3>
            <p className="text-sm text-zinc-800 leading-relaxed font-normal">
              {activeCase?.description ||
                'This case evaluates behavioral conformity, stress-induced deviation thresholds, and social compliance within synthetic open-world humanoid cohorts.'}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-zinc-50 border border-black/20">
                <span className="text-[10px] font-mono-data text-red-600 font-bold uppercase tracking-wider block mb-1">
                  RESEARCH QUESTION
                </span>
                <p className="text-xs text-black italic font-medium leading-relaxed">
                  "{activeCase?.researchQuestion || 'What triggers autonomous behavioral defiance?'}"
                </p>
              </div>
              <div className="p-4 rounded-xl bg-zinc-50 border border-black/20">
                <span className="text-[10px] font-mono-data text-red-600 font-bold uppercase tracking-wider block mb-1">
                  PRIMARY SIMULATION HYPOTHESIS
                </span>
                <p className="text-xs text-black italic font-medium leading-relaxed">
                  "{activeCase?.initialHypothesis || 'Peer conformity degrades when attachment bonds are threatened.'}"
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Section 02: Monitored Subjects Dossier */}
        {includeSubjects && (
          <div className="space-y-3 print-break-inside-avoid">
            <h3 className="font-display text-xl text-black tracking-wider border-b border-black/10 pb-1 flex items-center justify-between">
              <span>02. MONITORED SYNTHETIC COHORT ({caseSubjects.length} SUBJECTS)</span>
              <span className="text-[10px] font-mono-data text-zinc-400 font-normal">SEC-02</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {caseSubjects.map((sub) => (
                <div key={sub.id} className="p-3.5 rounded-xl border-2 border-black/20 bg-zinc-50 space-y-1">
                  <div className="flex items-center justify-between text-xs font-mono-data">
                    <span className="text-red-600 font-bold">{sub.code}</span>
                    <span className="text-black font-semibold">Stress: {sub.emotionalState.stress}%</span>
                  </div>
                  <h4 className="font-display text-lg text-black">{sub.name}</h4>
                  <p className="text-[11px] text-zinc-600 font-mono-data">{sub.occupation}</p>
                  <p className="text-[10px] text-zinc-500 pt-1 border-t border-black/10 truncate font-medium">
                    Traits: {sub.personalityTraits.join(', ')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 03: Experimental Trials & Predictions vs Actual */}
        {includeExperiments && (
          <div className="space-y-3 print-break-inside-avoid">
            <h3 className="font-display text-xl text-black tracking-wider border-b border-black/10 pb-1 flex items-center justify-between">
              <span>03. EXPERIMENTAL PROTOCOLS & DEVIATION COMPARISONS ({caseExperiments.length} TRIALS)</span>
              <span className="text-[10px] font-mono-data text-zinc-400 font-normal">SEC-03</span>
            </h3>
            <div className="space-y-4">
              {caseExperiments.map((exp) => (
                <div key={exp.id} className="p-4 rounded-xl bg-zinc-50 border-2 border-black space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono-data px-2.5 py-0.5 rounded bg-red-600 text-white font-bold">
                        {exp.code}
                      </span>
                      <h4 className="font-display text-xl text-black">{exp.title}</h4>
                    </div>
                    <span className="text-xs font-mono-data text-red-600 font-bold">STATUS: {exp.status}</span>
                  </div>

                  <p className="text-xs text-zinc-700 font-normal leading-relaxed">{exp.scenario}</p>

                  {/* Prediction vs Actual */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono-data pt-2">
                    <div className="p-3 rounded-lg bg-white border border-black/20">
                      <span className="text-[10px] text-zinc-500 block mb-0.5 font-bold">FORMULATED PREDICTION</span>
                      <span className="text-black font-medium">
                        {exp.prediction?.predictedOutcome || exp.expectedBehavior}
                      </span>
                    </div>

                    <div className="p-3 rounded-lg bg-red-50 border-2 border-red-600">
                      <span className="text-[10px] text-red-700 block mb-0.5 font-bold">
                        ACTUAL OUTCOME
                      </span>
                      <span className="text-black font-bold">
                        {exp.actualOutcome?.observedBehavior || 'Trial pending execution.'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 04: Grounded RAG References */}
        {includeCitations && (
          <div className="space-y-3 print-break-inside-avoid">
            <h3 className="font-display text-xl text-black tracking-wider border-b border-black/10 pb-1 flex items-center justify-between">
              <span>04. GROUNDED LITERATURE & CITATIONS</span>
              <span className="text-[10px] font-mono-data text-zinc-400 font-normal">SEC-04</span>
            </h3>
            <ul className="space-y-2 text-xs font-mono-data text-zinc-800">
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">▸</span>
                <span>
                  <strong>Thinking, Fast and Slow (Daniel Kahneman):</strong> Heuristic compliance under ego
                  depletion and prospect loss aversion in peer cohorts.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">▸</span>
                <span>
                  <strong>Dictionary of Body Language (Joe Navarro):</strong> Ventral denial, gaze aversion, and
                  suprasternal notch pacifying during confrontation.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">▸</span>
                <span>
                  <strong>In Sheep's Clothing (Dr. George Simon):</strong> Covert aggression and social scapegoating
                  dynamics in simulated hierarchical groups.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">▸</span>
                <span>
                  <strong>The Prince (Niccolò Machiavelli):</strong> Realpolitik alliance maneuvering and pre-emptive defection.
                </span>
              </li>
            </ul>
          </div>
        )}

        {/* Section 05: Sign-Off */}
        {includeSignOff && (
          <div className="pt-6 border-t-2 border-black flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs font-mono-data text-zinc-600 gap-4 print-break-inside-avoid">
            <div>
              <p className="text-black font-bold">VERIFIED BY RESEARCH ARCHITECTS:</p>
              <p>Akash Sankar (System Architect) · Alfa (Psychological Advisor)</p>
            </div>
            <div className="p-3 rounded-lg border-2 border-red-600 bg-red-50 text-red-700 font-bold text-left sm:text-right">
              <span>SIGNATURE VALIDATED // SECURE SESSION</span>
            </div>
          </div>
        )}
      </div>

      {/* Modal: Customize Export Fields */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-black rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-black/10 pb-3">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-red-600" />
                <h3 className="font-display text-2xl text-black tracking-wider">
                  CUSTOMIZE REPORT EXPORT
                </h3>
              </div>
              <button
                onClick={() => setShowExportModal(false)}
                className="p-1 rounded text-zinc-500 hover:text-black cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-zinc-600 font-mono-data">
              Choose which research sections and telemetry vectors to include in the exported formatted PDF or CSV file for <span className="font-bold text-black">{activeCase?.code}</span>.
            </p>

            <div className="space-y-2.5 font-mono-data text-xs">
              <label className="flex items-center gap-3 p-2.5 rounded-lg border border-black/10 hover:bg-zinc-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeOverview}
                  onChange={(e) => setIncludeOverview(e.target.checked)}
                  className="rounded text-red-600 focus:ring-red-500"
                />
                <div>
                  <span className="font-bold text-black block">01. Executive Overview & Hypotheses</span>
                  <span className="text-[10px] text-zinc-500">Includes research question, objective, and initial hypothesis.</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-2.5 rounded-lg border border-black/10 hover:bg-zinc-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeSubjects}
                  onChange={(e) => setIncludeSubjects(e.target.checked)}
                  className="rounded text-red-600 focus:ring-red-500"
                />
                <div>
                  <span className="font-bold text-black block">02. Monitored Synthetic Cohort ({caseSubjects.length})</span>
                  <span className="text-[10px] text-zinc-500">Includes subject codes, stress metrics, rebellion risks, and traits.</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-2.5 rounded-lg border border-black/10 hover:bg-zinc-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeExperiments}
                  onChange={(e) => setIncludeExperiments(e.target.checked)}
                  className="rounded text-red-600 focus:ring-red-500"
                />
                <div>
                  <span className="font-bold text-black block">03. Experimental Protocols & Trials ({caseExperiments.length})</span>
                  <span className="text-[10px] text-zinc-500">Includes trial scenarios, predictions, observed outcomes & deviations.</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-2.5 rounded-lg border border-black/10 hover:bg-zinc-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeAnomalies}
                  onChange={(e) => setIncludeAnomalies(e.target.checked)}
                  className="rounded text-red-600 focus:ring-red-500"
                />
                <div>
                  <span className="font-bold text-black block">04. Correlated Behavioral Anomalies ({caseAnomalies.length})</span>
                  <span className="text-[10px] text-zinc-500">Includes flagged anomalies and AI explanations in CSV dataset.</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-2.5 rounded-lg border border-black/10 hover:bg-zinc-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeCitations}
                  onChange={(e) => setIncludeCitations(e.target.checked)}
                  className="rounded text-red-600 focus:ring-red-500"
                />
                <div>
                  <span className="font-bold text-black block">05. Grounded Literature Citations</span>
                  <span className="text-[10px] text-zinc-500">Includes Kahneman, Navarro, Simon, Machiavelli references.</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-2.5 rounded-lg border border-black/10 hover:bg-zinc-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeSignOff}
                  onChange={(e) => setIncludeSignOff(e.target.checked)}
                  className="rounded text-red-600 focus:ring-red-500"
                />
                <div>
                  <span className="font-bold text-black block">06. Scientific Verification Sign-off</span>
                  <span className="text-[10px] text-zinc-500">Level-5 signature block by Akash Sankar and Alfa.</span>
                </div>
              </label>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-black/10">
              <button
                type="button"
                onClick={() => setShowExportModal(false)}
                className="px-4 py-2 border border-black/20 rounded-lg text-xs font-mono-data text-zinc-700 hover:text-black cursor-pointer"
              >
                Close
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="px-3.5 py-2 bg-black hover:bg-zinc-800 text-white rounded-lg text-xs font-mono-data font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-red-500" />
                  <span>Export CSV</span>
                </button>
                <button
                  type="button"
                  onClick={handleExportPDF}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-mono-data font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export PDF</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
