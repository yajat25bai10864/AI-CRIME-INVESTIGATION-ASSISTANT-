import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, CheckCircle2, AlertCircle, Edit2, X } from 'lucide-react';

const SCAN_STEPS = [
  'Reading document...',
  'Extracting entities...',
  'Identifying events...',
  'Structuring case information...',
  'Verification complete.',
];

const SAMPLE_FIRS = [
  {
    id: 'sample-1',
    label: 'Load Sample FIR: MP Nagar Robbery',
    result: {
      crimeType: 'Armed Robbery',
      victim: 'Suresh Kumar Gupta',
      location: 'Central Market, MP Nagar, Bhopal',
      date: '08 September 2026',
      time: '20:45 hrs',
      ipcSections: ['392', '394', '34'],
      suspectStatus: 'Unknown — investigation ongoing',
      keywords: ['motorcycle', 'helmet', 'cash', 'gold chain', 'two suspects', 'kolar road', 'MP04'],
      confidence: 92,
      summary: 'Victim Suresh Kumar Gupta was robbed of ₹24,500 and gold chain at Central Market. Two suspects on motorcycle. FIR registered under IPC 392, 394, 34.',
    },
  },
  {
    id: 'sample-2',
    label: 'Load Sample FIR: Habibganj Theft',
    result: {
      crimeType: 'Theft',
      victim: 'Ramesh Tiwari',
      location: 'Habibganj Railway Station, Platform 3',
      date: '02 September 2026',
      time: '09:15 hrs',
      ipcSections: ['379'],
      suspectStatus: 'Partially identified from CCTV',
      keywords: ['wallet', 'mobile phone', 'platform 3', 'unknown suspect', 'cctv', 'station'],
      confidence: 87,
      summary: 'Victim Ramesh Tiwari had wallet and mobile phone stolen at Habibganj Station Platform 3. Suspect partially identified from station CCTV.',
    },
  },
];

export default function FIRAnalyzer() {
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [result, setResult] = useState<typeof SAMPLE_FIRS[0]['result'] | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const runScan = () => {
    setScanning(true);
    setScanStep(0);
    setResult(null);
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setScanStep(step);
      if (step >= SCAN_STEPS.length - 1) {
        clearInterval(interval);
        setTimeout(() => {
          setScanning(false);
          setResult(SAMPLE_FIRS[0].result);
        }, 500);
      }
    }, 800);
  };

  const loadSample = (sample: typeof SAMPLE_FIRS[0]) => {
    setFile(new File([], sample.label + '.pdf'));
    setScanning(true);
    setScanStep(0);
    setResult(null);
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setScanStep(step);
      if (step >= SCAN_STEPS.length - 1) {
        clearInterval(interval);
        setTimeout(() => {
          setScanning(false);
          setResult(sample.result);
        }, 400);
      }
    }, 700);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) { setFile(f); runScan(); }
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) { setFile(f); runScan(); }
  };

  return (
    <div className="p-5 space-y-5">
      <div>
        <h1 className="text-lg font-semibold text-white">FIR Analyzer</h1>
        <p className="text-[12px] text-[#475569] font-mono mt-0.5">AI-assisted entity extraction from FIR documents. Verification required.</p>
      </div>

      {/* Sample buttons */}
      <div className="flex gap-2 flex-wrap">
        {SAMPLE_FIRS.map((s) => (
          <button
            key={s.id}
            onClick={() => loadSample(s)}
            disabled={scanning}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#161b26] border border-[#1e293b] rounded text-[11px] text-[#7c3aed] hover:border-[#7c3aed] hover:bg-[#1a1033] transition-colors disabled:opacity-40"
          >
            <FileText size={11} /> {s.label}
          </button>
        ))}
      </div>

      {/* Drop zone */}
      {!result && !scanning && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
            dragging ? 'border-[#7c3aed] bg-[#1a1033]' : 'border-[#1e293b] bg-[#161b26] hover:border-[#2d3748]'
          }`}
        >
          <Upload size={32} className="mx-auto text-[#334155] mb-3" />
          <div className="text-[13px] text-[#475569]">Drag & drop FIR document here</div>
          <div className="text-[11px] text-[#334155] mt-1">Supports PDF, JPG, PNG</div>
          <input ref={inputRef} type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={handleFile} />
          <div className="mt-4">
            <span className="text-[11px] text-[#475569] border border-[#1e293b] px-3 py-1.5 rounded">Browse Files</span>
          </div>
        </div>
      )}

      {/* Scanning animation */}
      <AnimatePresence>
        {scanning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-[#161b26] border border-[#1e293b] rounded-lg p-8"
          >
            <div className="text-center mb-6">
              <div className="inline-block w-10 h-10 rounded-full border-2 border-[#7c3aed] border-t-transparent animate-spin mb-4" />
              <div className="text-[13px] text-[#a78bfa] font-semibold">{SCAN_STEPS[scanStep] ?? SCAN_STEPS[SCAN_STEPS.length - 1]}</div>
            </div>
            <div className="space-y-2 max-w-sm mx-auto">
              {SCAN_STEPS.map((step, i) => (
                <div key={i} className={`flex items-center gap-2.5 text-[12px] transition-colors ${i <= scanStep ? 'text-[#94a3b8]' : 'text-[#334155]'}`}>
                  {i < scanStep
                    ? <CheckCircle2 size={13} className="text-[#22c55e] shrink-0" />
                    : i === scanStep
                    ? <div className="w-3 h-3 rounded-full border border-[#7c3aed] animate-pulse shrink-0" />
                    : <div className="w-3 h-3 rounded-full border border-[#1e293b] shrink-0" />
                  }
                  {step}
                </div>
              ))}
            </div>
            {file && (
              <div className="text-center mt-4 text-[11px] text-[#334155] font-mono">{file.name}</div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Result */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Confidence header */}
            <div className="flex flex-wrap items-center gap-3 bg-[#161b26] border border-[#1e293b] rounded p-4">
              <CheckCircle2 size={18} className="text-[#22c55e]" />
              <div className="flex-1">
                <div className="text-[13px] font-semibold text-white">FIR Analysis Complete</div>
                <div className="text-[11px] text-[#475569] mt-0.5 font-mono">{file?.name}</div>
              </div>
              <div className="text-center">
                <div className="text-[20px] font-bold text-[#7c3aed] font-mono">{result.confidence}%</div>
                <div className="text-[10px] text-[#475569]">AI Confidence</div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPreviewOpen(!previewOpen)}
                  className="px-3 py-1.5 text-[11px] border border-[#1e293b] rounded text-[#64748b] hover:text-[#94a3b8] hover:border-[#2d3748] transition-colors"
                >
                  Preview Doc
                </button>
                <button
                  onClick={() => setEditOpen(true)}
                  className="flex items-center gap-1 px-3 py-1.5 text-[11px] bg-[#7c3aed] text-white rounded hover:bg-[#6d28d9] transition-colors"
                >
                  <Edit2 size={11} /> Review & Edit
                </button>
              </div>
            </div>

            {/* Document preview placeholder */}
            {previewOpen && (
              <div className="bg-[#161b26] border border-[#1e293b] rounded p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-[11px] text-[#475569] uppercase tracking-wider">Document Preview</div>
                  <button onClick={() => setPreviewOpen(false)}><X size={14} className="text-[#475569]" /></button>
                </div>
                <div className="bg-[#0d1117] border border-[#1e293b] rounded p-6 text-[11px] text-[#475569] font-mono leading-relaxed min-h-[120px]">
                  <div className="text-[#64748b] mb-2">MP Nagar Police Station — First Information Report</div>
                  <div>FIR No.: FIR-2026-1042 | Date: 08/09/2026 | Section: IPC 392, 394, 34</div>
                  <div className="mt-2">Complainant: {result.victim} | Crime: {result.crimeType}</div>
                  <div className="mt-2">Location: {result.location}</div>
                  <div className="mt-2 text-[#334155]">[Document content displayed in secure viewer — full text extraction complete]</div>
                </div>
              </div>
            )}

            {/* Extracted data */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#161b26] border border-[#1e293b] rounded p-4 space-y-3">
                <div className="text-[11px] text-[#475569] uppercase tracking-wider">Extracted Case Data</div>
                {[
                  { label: 'Crime Type', value: result.crimeType },
                  { label: 'Victim', value: result.victim },
                  { label: 'Location', value: result.location },
                  { label: 'Date & Time', value: `${result.date} · ${result.time}` },
                  { label: 'Suspect Status', value: result.suspectStatus },
                  { label: 'IPC Sections', value: result.ipcSections.join(', ') },
                ].map(({ label, value }) => (
                  <div key={label} className="flex gap-3">
                    <div className="text-[11px] text-[#475569] w-28 shrink-0">{label}</div>
                    <div className="text-[12px] text-[#cbd5e1] font-mono">{value}</div>
                  </div>
                ))}
              </div>
              <div className="bg-[#161b26] border border-[#1e293b] rounded p-4 space-y-3">
                <div className="text-[11px] text-[#475569] uppercase tracking-wider">AI Summary</div>
                <p className="text-[12px] text-[#94a3b8] leading-relaxed">{result.summary}</p>
                <div className="text-[11px] text-[#475569] uppercase tracking-wider mt-3">Extracted Keywords</div>
                <div className="flex flex-wrap gap-1.5">
                  {result.keywords.map((kw) => (
                    <span key={kw} className="text-[10px] font-mono text-[#a78bfa] bg-[#1a1033] border border-[#2d1f5e] px-1.5 py-0.5 rounded">{kw}</span>
                  ))}
                </div>
                <div className="mt-3 text-[10px] text-[#475569] bg-[#0d1117] border border-[#1e293b] rounded p-2.5">
                  ⚠️ Verify all extracted data against the original FIR document before creating case records.
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit modal */}
      {editOpen && result && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-[#161b26] border border-[#1e293b] rounded-lg w-full max-w-lg p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="text-[13px] font-semibold text-white">Review & Edit Extracted Data</div>
              <button onClick={() => setEditOpen(false)}><X size={16} className="text-[#475569]" /></button>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Crime Type', value: result.crimeType },
                { label: 'Victim Name', value: result.victim },
                { label: 'Location', value: result.location },
                { label: 'IPC Sections', value: result.ipcSections.join(', ') },
              ].map(({ label, value }) => (
                <div key={label}>
                  <label className="text-[10px] text-[#475569] uppercase tracking-wider">{label}</label>
                  <input
                    type="text"
                    defaultValue={value}
                    className="w-full mt-1 px-3 py-2 bg-[#0d1117] border border-[#1e293b] rounded text-[12px] text-[#cbd5e1] focus:outline-none focus:border-[#7c3aed] font-mono"
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-5">
              <button
                onClick={() => setEditOpen(false)}
                className="flex-1 py-2 border border-[#1e293b] text-[#64748b] text-[12px] rounded hover:text-[#94a3b8] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setEditOpen(false)}
                className="flex-1 py-2 bg-[#7c3aed] text-white text-[12px] rounded hover:bg-[#6d28d9] transition-colors"
              >
                Save & Create Case Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
