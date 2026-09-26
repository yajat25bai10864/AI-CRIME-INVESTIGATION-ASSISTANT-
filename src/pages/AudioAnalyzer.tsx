import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, Download, CheckCircle2 } from 'lucide-react';
import { AUDIO_STATEMENT, TRANSCRIPT_SEGMENTS, EXTRACTED_ENTITIES, KEY_POINTS } from '../data/audio';

const RELEVANCE_COLOR: Record<string, string> = {
  HIGH: 'text-[#ef4444] bg-[#ef444410] border-[#ef444430]',
  MEDIUM: 'text-[#f59e0b] bg-[#f59e0b10] border-[#f59e0b30]',
  LOW: 'text-[#64748b] bg-[#64748b10] border-[#64748b30]',
};

const ENTITY_TYPE_COLOR: Record<string, string> = {
  PERSON: '#ef4444', LOCATION: '#8b5cf6', TIME: '#06b6d4',
  VEHICLE: '#f59e0b', OBJECT: '#64748b',
};

export default function AudioAnalyzer() {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [transcribing, setTranscribing] = useState(false);
  const [transcribeStep, setTranscribeStep] = useState(0);
  const [transcribeDone, setTranscribeDone] = useState(false);
  const [activeTab, setActiveTab] = useState<'transcript' | 'entities' | 'keypoints'>('transcript');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (playing) {
      timerRef.current = setInterval(() => {
        setProgress((p) => {
          if (p >= 100) { setPlaying(false); return 100; }
          return p + 0.5;
        });
      }, 100);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [playing]);

  const runTranscribe = () => {
    setTranscribing(true);
    setTranscribeStep(0);
    let step = 0;
    const steps = ['Loading audio...', 'Noise reduction...', 'Speech recognition...', 'Speaker diarization...', 'Entity extraction...', 'Complete.'];
    const iv = setInterval(() => {
      step++;
      setTranscribeStep(step);
      if (step >= steps.length - 1) {
        clearInterval(iv);
        setTimeout(() => { setTranscribing(false); setTranscribeDone(true); }, 400);
      }
    }, 700);
  };

  const TRANSCRIBE_STEPS = ['Loading audio...', 'Noise reduction...', 'Speech recognition...', 'Speaker diarization...', 'Entity extraction...', 'Complete.'];

  // Waveform bars
  const waveformBars = Array.from({ length: 60 }, (_, i) => {
    const base = Math.sin(i * 0.4) * 0.5 + 0.5;
    const noise = Math.random() * 0.3;
    return Math.min(1, base + noise);
  });

  return (
    <div className="p-5 space-y-4">
      <div>
        <h1 className="text-lg font-semibold text-white">Audio Witness Analyzer</h1>
        <p className="text-[12px] text-[#475569] font-mono mt-0.5">EV-1026 · Witness Statement: {AUDIO_STATEMENT.witness} · {AUDIO_STATEMENT.recordedAt}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Player */}
        <div className="lg:col-span-2 space-y-3">
          <div className="bg-[#161b26] border border-[#1e293b] rounded-lg p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-[13px] font-semibold text-[#cbd5e1]">Witness Statement Recording</div>
                <div className="text-[11px] text-[#475569] font-mono">{AUDIO_STATEMENT.id} · {AUDIO_STATEMENT.duration} · {AUDIO_STATEMENT.language}</div>
              </div>
              <div className="text-right">
                <div className="text-[11px] text-[#475569]">Recorded by</div>
                <div className="text-[11px] text-[#94a3b8] font-mono">{AUDIO_STATEMENT.officer}</div>
              </div>
            </div>

            {/* Waveform */}
            <div className="relative h-16 bg-[#0d1117] rounded border border-[#1e293b] flex items-center px-3 gap-px overflow-hidden mb-4">
              {waveformBars.map((h, i) => {
                const pct = (i / waveformBars.length) * 100;
                const played = pct <= progress;
                return (
                  <div
                    key={i}
                    className="rounded-full transition-colors"
                    style={{
                      height: `${Math.max(8, h * 48)}px`,
                      width: '3px',
                      background: played ? '#7c3aed' : '#1e293b',
                      flex: '0 0 auto',
                    }}
                  />
                );
              })}
              {/* Playhead */}
              <div
                className="absolute top-0 bottom-0 w-px bg-[#a78bfa] opacity-80"
                style={{ left: `${progress}%` }}
              />
            </div>

            {/* Scrubber */}
            <div
              className="h-1.5 bg-[#1e293b] rounded-full cursor-pointer mb-3"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setProgress(((e.clientX - rect.left) / rect.width) * 100);
              }}
            >
              <div className="h-full bg-[#7c3aed] rounded-full relative" style={{ width: `${progress}%` }}>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button onClick={() => setProgress(0)} className="text-[#64748b] hover:text-[#94a3b8]"><SkipBack size={15} /></button>
                <button
                  onClick={() => setPlaying(!playing)}
                  className="w-9 h-9 rounded-full bg-[#7c3aed] flex items-center justify-center text-white hover:bg-[#6d28d9] transition-colors"
                >
                  {playing ? <Pause size={14} /> : <Play size={14} />}
                </button>
              </div>
              <div className="font-mono text-[11px] text-[#475569]">
                {Math.floor(progress / 100 * 272).toString().padStart(3, '0')}s / {AUDIO_STATEMENT.duration}
              </div>
              <button className="flex items-center gap-1 text-[11px] text-[#64748b] hover:text-[#94a3b8] transition-colors">
                <Download size={13} /> Export
              </button>
            </div>
          </div>

          {/* Transcription */}
          {!transcribeDone && (
            <button
              onClick={runTranscribe}
              disabled={transcribing}
              className="w-full py-2.5 bg-[#7c3aed] text-white text-[12px] font-medium rounded hover:bg-[#6d28d9] transition-colors disabled:opacity-60"
            >
              {transcribing ? 'Transcribing...' : 'Run AI Transcription'}
            </button>
          )}

          <AnimatePresence>
            {transcribing && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[#161b26] border border-[#1e293b] rounded p-4">
                <div className="space-y-2">
                  {TRANSCRIBE_STEPS.map((step, i) => (
                    <div key={i} className={`flex items-center gap-2 text-[12px] ${i <= transcribeStep ? 'text-[#94a3b8]' : 'text-[#334155]'}`}>
                      {i < transcribeStep
                        ? <CheckCircle2 size={13} className="text-[#22c55e]" />
                        : i === transcribeStep
                        ? <div className="w-3 h-3 rounded-full border border-[#7c3aed] animate-pulse" />
                        : <div className="w-3 h-3 rounded-full border border-[#1e293b]" />}
                      {step}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {transcribeDone && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex gap-2 mb-3">
                {(['transcript', 'entities', 'keypoints'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1.5 text-[11px] rounded border transition-colors capitalize ${
                      activeTab === tab
                        ? 'bg-[#7c3aed] text-white border-[#7c3aed]'
                        : 'bg-[#161b26] text-[#64748b] border-[#1e293b] hover:text-[#94a3b8]'
                    }`}
                  >
                    {tab === 'keypoints' ? 'Key Points' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {activeTab === 'transcript' && (
                <div className="bg-[#161b26] border border-[#1e293b] rounded p-4 space-y-3 max-h-72 overflow-y-auto">
                  {TRANSCRIPT_SEGMENTS.map((seg, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="shrink-0 w-20 text-right">
                        <div className="text-[10px] font-mono text-[#334155]">{seg.start}</div>
                        <div className={`text-[10px] font-semibold mt-0.5 ${seg.speaker === 'Officer' ? 'text-[#7c3aed]' : 'text-[#06b6d4]'}`}>{seg.speaker}</div>
                      </div>
                      <div className="text-[12px] text-[#94a3b8] leading-relaxed">{seg.text}</div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'keypoints' && (
                <div className="bg-[#161b26] border border-[#1e293b] rounded p-4 space-y-2">
                  {KEY_POINTS.map((kp, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <div className="w-1 h-1 rounded-full bg-[#7c3aed] mt-2 shrink-0" />
                      <div className="text-[12px] text-[#94a3b8]">{kp}</div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'entities' && (
                <div className="bg-[#161b26] border border-[#1e293b] rounded p-4 space-y-2">
                  {EXTRACTED_ENTITIES.map((en, i) => (
                    <div key={i} className="flex items-center gap-2.5 py-1.5 border-b border-[#1e293b] last:border-0">
                      <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded" style={{ color: ENTITY_TYPE_COLOR[en.type], background: `${ENTITY_TYPE_COLOR[en.type]}15`, border: `1px solid ${ENTITY_TYPE_COLOR[en.type]}30` }}>
                        {en.type}
                      </span>
                      <span className="text-[12px] text-[#cbd5e1] flex-1">{en.value}</span>
                      <span className={`text-[9px] border rounded px-1.5 py-0.5 ${RELEVANCE_COLOR[en.relevance]}`}>{en.relevance}</span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* Metadata panel */}
        <div className="space-y-3">
          <div className="bg-[#161b26] border border-[#1e293b] rounded p-4">
            <div className="text-[11px] text-[#475569] uppercase tracking-wider mb-3">Statement Details</div>
            {[
              ['Witness', AUDIO_STATEMENT.witness],
              ['Evidence ID', AUDIO_STATEMENT.evidenceId],
              ['Duration', AUDIO_STATEMENT.duration],
              ['Recorded', AUDIO_STATEMENT.recordedAt],
              ['Officer', AUDIO_STATEMENT.officer],
              ['Language', AUDIO_STATEMENT.language],
            ].map(([l, v]) => (
              <div key={l} className="flex justify-between py-1.5 border-b border-[#1e293b] last:border-0">
                <span className="text-[11px] text-[#475569]">{l}</span>
                <span className="text-[11px] text-[#94a3b8] font-mono">{v}</span>
              </div>
            ))}
          </div>
          {transcribeDone && (
            <div className="bg-[#1a1033] border border-[#2d1f5e] rounded p-3">
              <div className="text-[10px] text-[#a78bfa] font-semibold mb-1">AI Analysis Note</div>
              <div className="text-[11px] text-[#7c6fad]">Statement corroborated by CCTV evidence EV-1024. Plate prefix and direction of escape consistent.</div>
              <div className="text-[10px] text-[#475569] mt-2">⚠️ Verify all AI findings against source evidence.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
