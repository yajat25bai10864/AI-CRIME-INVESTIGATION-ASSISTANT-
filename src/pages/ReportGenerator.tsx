import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, FileOutput, Printer, Download, ShieldAlert } from 'lucide-react';
import { REPORT_TEMPLATE } from '../data/reports';

const GEN_STEPS = [
  'Loading case data...',
  'Compiling evidence log...',
  'Structuring persons involved...',
  'Assembling chronological findings...',
  'Applying officer sign-off...',
  'Generating dossier format...',
  'Report ready.',
];

export default function ReportGenerator() {
  const [generating, setGenerating] = useState(false);
  const [genStep, setGenStep] = useState(0);
  const [reportReady, setReportReady] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const generate = () => {
    setGenerating(true);
    setGenStep(0);
    setReportReady(false);
    let step = 0;
    const iv = setInterval(() => {
      step++;
      setGenStep(step);
      if (step >= GEN_STEPS.length - 1) {
        clearInterval(iv);
        setTimeout(() => { setGenerating(false); setReportReady(true); }, 400);
      }
    }, 600);
  };

  const handlePrint = () => window.print();

  return (
    <div className="p-5 space-y-5">
      <div>
        <h1 className="text-lg font-semibold text-white">Investigation Report Generator</h1>
        <p className="text-[12px] text-[#475569] font-mono mt-0.5">Compile official dossier for CR-2026-0142</p>
      </div>

      {!reportReady && (
        <div className="bg-[#161b26] border border-[#1e293b] rounded-lg p-6">
          <div className="flex flex-wrap gap-4 items-start justify-between mb-5">
            <div>
              <div className="text-[13px] font-semibold text-white">Generate Investigation Report</div>
              <div className="text-[11px] text-[#475569] mt-1">
                Assembles case summary, evidence log, persons involved, timeline, and AI analysis disclaimer.
              </div>
            </div>
            <button
              onClick={generate}
              disabled={generating}
              className="flex items-center gap-2 px-4 py-2 bg-[#7c3aed] text-white text-[12px] font-medium rounded hover:bg-[#6d28d9] transition-colors disabled:opacity-60"
            >
              <FileOutput size={14} />
              {generating ? 'Generating...' : 'Generate Report'}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 text-[11px]">
            {[
              ['Case ID', 'CR-2026-0142'],
              ['Report Type', 'Investigation Progress Report'],
              ['Officer', 'R. Deshmukh, Sub-Inspector'],
              ['Station', 'MP Nagar Police Station, Bhopal'],
              ['Evidence Items', '8 items'],
              ['Persons', '6 persons'],
            ].map(([l, v]) => (
              <div key={l}>
                <div className="text-[#475569] uppercase tracking-wide text-[10px]">{l}</div>
                <div className="text-[#94a3b8] font-mono mt-0.5">{v}</div>
              </div>
            ))}
          </div>

          {/* Generation progress */}
          <AnimatePresence>
            {generating && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-5 pt-5 border-t border-[#1e293b]">
                <div className="space-y-2">
                  {GEN_STEPS.map((step, i) => (
                    <div key={i} className={`flex items-center gap-2.5 text-[12px] transition-colors ${i <= genStep ? 'text-[#94a3b8]' : 'text-[#334155]'}`}>
                      {i < genStep
                        ? <CheckCircle2 size={13} className="text-[#22c55e] shrink-0" />
                        : i === genStep
                        ? <div className="w-3 h-3 rounded-full border border-[#7c3aed] animate-pulse shrink-0" />
                        : <div className="w-3 h-3 rounded-full border border-[#1e293b] shrink-0" />}
                      {step}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      <AnimatePresence>
        {reportReady && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            {/* Report controls */}
            <div className="flex items-center justify-between bg-[#161b26] border border-[#1e293b] rounded p-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#22c55e]" />
                <span className="text-[13px] font-semibold text-white">Report Generated</span>
                <span className="font-mono text-[11px] text-[#475569]">{REPORT_TEMPLATE.reportId}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-[#1e293b] text-[#64748b] text-[11px] rounded hover:text-[#94a3b8] hover:border-[#2d3748] transition-colors"
                >
                  <Printer size={12} /> Print
                </button>
                <button
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#7c3aed] text-white text-[11px] rounded hover:bg-[#6d28d9] transition-colors"
                >
                  <Download size={12} /> Download PDF
                </button>
              </div>
            </div>

            {/* Printable report */}
            <div ref={printRef} className="bg-white text-black rounded-lg overflow-hidden print:shadow-none">
              {/* Header */}
              <div className="bg-[#1a1a2e] text-white px-8 py-6 print:bg-[#1a1a2e]">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-[11px] tracking-widest uppercase text-[#a78bfa] font-mono">MADHYA PRADESH POLICE · BHOPAL</div>
                    <div className="text-xl font-bold mt-1">{REPORT_TEMPLATE.title}</div>
                    <div className="text-[12px] text-[#94a3b8] mt-0.5 font-mono">{REPORT_TEMPLATE.reportId} · {REPORT_TEMPLATE.generatedAt}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-[#64748b]">DRAFT</div>
                    <div className="text-[10px] text-[#64748b] mt-0.5">Pending Review</div>
                  </div>
                </div>
              </div>

              <div className="px-8 py-6 space-y-5 bg-[#f8fafc]">
                {/* AI disclaimer at top */}
                <div className="flex items-start gap-2 bg-[#fef3c7] border border-[#f59e0b] rounded p-3 text-[11px] text-[#92400e]">
                  <ShieldAlert size={14} className="shrink-0 mt-0.5 text-[#f59e0b]" />
                  <div>
                    <strong>AI Assistance Disclosure:</strong> This report was compiled with AI assistance. All AI-generated content has been reviewed by the investigating officer. Verify all findings against source evidence before use in legal proceedings.
                  </div>
                </div>

                {REPORT_TEMPLATE.sections.map((section, i) => (
                  <div key={i}>
                    <div className="text-[11px] font-bold uppercase tracking-widest text-[#475569] border-b border-[#e2e8f0] pb-1 mb-2">
                      {i + 1}. {section.title}
                    </div>
                    <div className="text-[12px] text-[#374151] leading-relaxed whitespace-pre-line">{section.content}</div>
                  </div>
                ))}

                <div className="border-t border-[#e2e8f0] pt-4 mt-4 flex justify-between text-[11px] text-[#64748b]">
                  <div>MP Nagar Police Station, Bhopal — CONFIDENTIAL INVESTIGATION DOCUMENT</div>
                  <div className="font-mono">{REPORT_TEMPLATE.generatedAt}</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
