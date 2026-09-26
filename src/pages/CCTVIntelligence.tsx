import { useState, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Eye, EyeOff } from 'lucide-react';
import { CCTV_STATS, CCTV_EVENTS, CCTV_DETECTIONS } from '../data/cctv';

const EVENT_TYPE_COLOR: Record<string, string> = {
  PERSON: 'text-[#ef4444]',
  VEHICLE: 'text-[#f59e0b]',
  PLATE: 'text-[#8b5cf6]',
  EVENT: 'text-[#06b6d4]',
};

export default function CCTVIntelligence() {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(35);
  const [showBboxes, setShowBboxes] = useState(true);
  const [activeEvent, setActiveEvent] = useState<number | null>(null);

  const scrub = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = ((e.clientX - rect.left) / rect.width) * 100;
    setProgress(Math.min(100, Math.max(0, pct)));
  };

  return (
    <div className="p-5 space-y-4">
      <div>
        <h1 className="text-lg font-semibold text-white">CCTV Intelligence</h1>
        <p className="text-[12px] text-[#475569] font-mono mt-0.5">EV-1024 · MP Nagar Chowk Camera #7 · 08 Sep 2026</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Video player */}
        <div className="lg:col-span-2 space-y-3">
          <div className="relative bg-[#0a0f1a] border border-[#1e293b] rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
            {/* Simulated video frame */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-full relative">
                {/* Background scene */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1a] via-[#0d1520] to-[#080d14]" />
                {/* Road/street simulation */}
                <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-[#0d1117]" />
                <div className="absolute bottom-1/3 left-1/4 right-1/4 h-px bg-[#1e293b] opacity-60" />
                {/* Buildings */}
                <div className="absolute bottom-1/3 left-8 w-16 h-20 bg-[#111827] border border-[#1e293b] opacity-80" />
                <div className="absolute bottom-1/3 right-12 w-20 h-28 bg-[#111827] border border-[#1e293b] opacity-80" />
                {/* Timestamp overlay */}
                <div className="absolute top-3 left-3 font-mono text-[10px] text-[#22c55e] bg-black/60 px-2 py-1 rounded">
                  20:43:{Math.floor(progress / 100 * 59).toString().padStart(2, '0')} · CAM-07 · MP NAGAR CHOWK
                </div>
                {/* REC indicator */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5 font-mono text-[10px] text-[#ef4444] bg-black/60 px-2 py-1 rounded">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444] animate-pulse" />
                  PLAYBACK
                </div>

                {/* Detection boxes */}
                {showBboxes && (
                  <>
                    <div className="absolute border border-[#f59e0b] text-[#f59e0b]" style={{ left: '38%', top: '35%', width: '22%', height: '40%' }}>
                      <span className="absolute -top-4 left-0 text-[8px] font-mono bg-[#f59e0b] text-black px-1">VEHICLE MP04AB12**</span>
                    </div>
                    <div className="absolute border border-[#ef4444] text-[#ef4444]" style={{ left: '44%', top: '28%', width: '8%', height: '22%' }}>
                      <span className="absolute -top-4 left-0 text-[8px] font-mono bg-[#ef4444] text-white px-1">SUSPECT A</span>
                    </div>
                    <div className="absolute border border-[#ef4444] text-[#ef4444]" style={{ left: '51%', top: '30%', width: '7%', height: '20%' }}>
                      <span className="absolute -top-4 left-0 text-[8px] font-mono bg-[#ef4444] text-white px-1">SUSPECT B</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="bg-[#161b26] border border-[#1e293b] rounded p-3 space-y-2">
            <div
              className="relative h-1.5 bg-[#1e293b] rounded-full cursor-pointer"
              onClick={scrub}
            >
              <div className="h-full bg-[#7c3aed] rounded-full" style={{ width: `${progress}%` }} />
              <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow" style={{ left: `${progress}%`, transform: 'translateX(-50%) translateY(-50%)' }} />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button onClick={() => setProgress(Math.max(0, progress - 10))} className="text-[#64748b] hover:text-[#94a3b8]"><SkipBack size={15} /></button>
                <button
                  onClick={() => setPlaying(!playing)}
                  className="w-8 h-8 rounded-full bg-[#7c3aed] flex items-center justify-center text-white hover:bg-[#6d28d9]"
                >
                  {playing ? <Pause size={13} /> : <Play size={13} />}
                </button>
                <button onClick={() => setProgress(Math.min(100, progress + 10))} className="text-[#64748b] hover:text-[#94a3b8]"><SkipForward size={15} /></button>
              </div>
              <div className="font-mono text-[11px] text-[#475569]">
                20:43:{Math.floor(progress / 100 * 59).toString().padStart(2, '0')} / 20:47:15
              </div>
              <button
                onClick={() => setShowBboxes(!showBboxes)}
                className="flex items-center gap-1.5 text-[11px] text-[#64748b] hover:text-[#94a3b8] transition-colors"
              >
                {showBboxes ? <Eye size={13} /> : <EyeOff size={13} />}
                Detections {showBboxes ? 'On' : 'Off'}
              </button>
            </div>
          </div>

          {/* Detection stats */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: 'People', value: CCTV_STATS.people, color: '#ef4444' },
              { label: 'Vehicles', value: CCTV_STATS.vehicles, color: '#f59e0b' },
              { label: 'Plates', value: CCTV_STATS.plates, color: '#8b5cf6' },
              { label: 'Events', value: CCTV_STATS.events, color: '#06b6d4' },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-[#161b26] border border-[#1e293b] rounded p-3 text-center">
                <div className="text-xl font-bold font-mono" style={{ color }}>{value}</div>
                <div className="text-[10px] text-[#475569] mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Event timeline */}
        <div className="bg-[#161b26] border border-[#1e293b] rounded p-4">
          <div className="text-[11px] text-[#475569] uppercase tracking-wider mb-3">Detection Events</div>
          <div className="space-y-2">
            {CCTV_EVENTS.map((ev, i) => (
              <button
                key={i}
                onClick={() => setActiveEvent(activeEvent === i ? null : i)}
                className={`w-full text-left px-3 py-2.5 rounded border transition-colors ${
                  activeEvent === i
                    ? 'border-[#7c3aed] bg-[#1a1033]'
                    : 'border-[#1e293b] hover:border-[#2d3748] hover:bg-[#1e293b]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-[#475569] shrink-0">{ev.timestamp}</span>
                  <span className={`text-[9px] font-semibold uppercase ${EVENT_TYPE_COLOR[ev.type]}`}>{ev.type}</span>
                  <span className="ml-auto font-mono text-[10px] text-[#334155]">{ev.confidence}%</span>
                </div>
                <div className="text-[11px] text-[#64748b] mt-0.5 leading-snug">{ev.description}</div>
              </button>
            ))}
          </div>

          {/* Detections */}
          <div className="mt-4 pt-4 border-t border-[#1e293b]">
            <div className="text-[11px] text-[#475569] uppercase tracking-wider mb-3">Active Detections</div>
            <div className="space-y-2">
              {CCTV_DETECTIONS.map((d, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-sm shrink-0" style={{ background: d.color }} />
                  <span className="text-[11px] text-[#94a3b8] flex-1 truncate">{d.label}</span>
                  <span className="font-mono text-[10px]" style={{ color: d.color }}>{d.confidence}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
