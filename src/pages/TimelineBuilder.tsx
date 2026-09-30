import { useEffect, useState } from 'react';
import { TIMELINE_EVENTS, TimelineEvent } from '../data/timeline';
import { Download } from 'lucide-react';
import { listFIRs } from '../services/api';

const TYPE_META: Record<string, { color: string; label: string }> = {
  INCIDENT: { color: '#ef4444', label: 'Incident' },
  FIR: { color: '#f59e0b', label: 'FIR' },
  CCTV: { color: '#8b5cf6', label: 'CCTV' },
  WITNESS: { color: '#06b6d4', label: 'Witness' },
  EVIDENCE: { color: '#22c55e', label: 'Evidence' },
  ACTION: { color: '#64748b', label: 'Action' },
  ARREST: { color: '#7c3aed', label: 'Arrest' },
};

const FILTERS = ['ALL', 'INCIDENT', 'FIR', 'CCTV', 'WITNESS', 'EVIDENCE', 'ACTION'] as const;
type Filter = typeof FILTERS[number];

export default function TimelineBuilder() {
  const [filter, setFilter] = useState<Filter>('ALL');
  const [selected, setSelected] = useState<TimelineEvent | null>(null);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>(TIMELINE_EVENTS);

  useEffect(() => {
    const loadTimeline = async () => {
      try {
        const firs = await listFIRs();

        const firEvents: TimelineEvent[] = firs
          .filter((fir) => fir.incident_date)
          .map((fir) => {
            const date = new Date(fir.incident_date!);

            return {
              id: `FIR-${fir.case_id}`,
              time: date.toLocaleTimeString('en-GB', {
                hour: '2-digit',
                minute: '2-digit',
              }),
              date: date.toISOString().slice(0, 10),
              title: `${fir.crime_type.toUpperCase()} — ${fir.location.address ?? 'Unknown location'}`,
              description: fir.raw_text,
              type: 'INCIDENT',
              officer: 'AI Investigation System',
            };
          });

        setTimelineEvents([...firEvents, ...TIMELINE_EVENTS]);
      } catch (error) {
        console.error('Failed to load timeline:', error);
      }
    };

    loadTimeline();
  }, []);

  const filtered = timelineEvents.filter((ev) => filter === 'ALL' || ev.type === filter);

  // Group by date
  const byDate: Record<string, TimelineEvent[]> = {};
  filtered.forEach((ev) => {
    if (!byDate[ev.date]) byDate[ev.date] = [];
    byDate[ev.date].push(ev);
  });

  return (
    <div className="p-5 space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-lg font-semibold text-white">Forensic Timeline</h1>
          <p className="text-[12px] text-[#475569] font-mono mt-0.5">Live Case Timeline · {timelineEvents.length} events</p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] border border-[#1e293b] text-[#64748b] rounded hover:text-[#94a3b8] hover:border-[#2d3748] transition-colors">
          <Download size={12} /> Export Timeline
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-1.5 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-2.5 py-1 rounded text-[10px] font-semibold uppercase tracking-wider border transition-colors ${
              filter === f
                ? 'bg-[#7c3aed] text-white border-[#7c3aed]'
                : 'bg-[#161b26] text-[#64748b] border-[#1e293b] hover:text-[#94a3b8]'
            }`}
          >
            {f.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Type legend */}
      <div className="flex flex-wrap gap-3">
        {Object.entries(TYPE_META).map(([type, meta]) => (
          <div key={type} className="flex items-center gap-1.5 text-[10px]" style={{ color: meta.color }}>
            <div className="w-2 h-2 rounded-full" style={{ background: meta.color }} />
            {meta.label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Timeline */}
        <div className="lg:col-span-2">
          {Object.entries(byDate).map(([date, events]) => (
            <div key={date} className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px flex-1 bg-[#1e293b]" />
                <div className="text-[10px] font-mono text-[#475569] uppercase tracking-wider px-2">{date}</div>
                <div className="h-px flex-1 bg-[#1e293b]" />
              </div>
              <div className="space-y-0">
                {events.map((ev, i) => {
                  const meta = TYPE_META[ev.type];
                  return (
                    <div key={ev.id} className="flex gap-4">
                      <div className="flex flex-col items-center shrink-0">
                        <div className="font-mono text-[10px] text-[#475569] w-14 text-right">{ev.time}</div>
                        <div className="flex flex-col items-center mt-1">
                          <button
                            onClick={() => setSelected(selected?.id === ev.id ? null : ev)}
                            className="w-3 h-3 rounded-full border-2 transition-transform hover:scale-125"
                            style={{
                              borderColor: meta.color,
                              background: selected?.id === ev.id ? meta.color : `${meta.color}20`,
                            }}
                          />
                          {i < events.length - 1 && (
                            <div className="w-px flex-1 mt-1" style={{ background: `${meta.color}30`, minHeight: 32 }} />
                          )}
                        </div>
                      </div>
                      <div
                        className={`flex-1 pb-6 cursor-pointer rounded px-3 py-2 -mx-3 transition-colors ${selected?.id === ev.id ? 'bg-[#161b26]' : 'hover:bg-[#161b26]'}`}
                        onClick={() => setSelected(selected?.id === ev.id ? null : ev)}
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[9px] font-semibold uppercase" style={{ color: meta.color }}>{meta.label}</span>
                          {ev.officer && <span className="text-[9px] text-[#334155] font-mono">· {ev.officer}</span>}
                        </div>
                        <div className="text-[13px] font-medium text-[#cbd5e1] mt-0.5">{ev.title}</div>
                        <div className="text-[11px] text-[#64748b] mt-1 leading-snug">{ev.description}</div>
                        {ev.evidenceIds && ev.evidenceIds.length > 0 && (
                          <div className="flex gap-1 mt-1.5">
                            {ev.evidenceIds.map((e) => (
                              <span key={e} className="text-[9px] font-mono text-[#7c3aed] bg-[#7c3aed10] border border-[#7c3aed25] px-1 rounded">[{e}]</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Detail panel */}
        <div className="bg-[#161b26] border border-[#1e293b] rounded p-4 h-fit">
          {!selected ? (
            <div className="text-[12px] text-[#334155] text-center py-8">Click a timeline event to inspect details</div>
          ) : (
            <div className="space-y-3">
              <div>
                <div className="text-[10px] font-mono text-[#475569] uppercase">{selected.type} · {selected.date} {selected.time}</div>
                <div className="text-[14px] font-semibold text-white mt-1">{selected.title}</div>
              </div>
              <p className="text-[12px] text-[#94a3b8] leading-relaxed">{selected.description}</p>
              {selected.officer && (
                <div className="text-[11px]">
                  <span className="text-[#475569]">Officer:</span>
                  <span className="text-[#94a3b8] font-mono ml-2">{selected.officer}</span>
                </div>
              )}
              {selected.evidenceIds && selected.evidenceIds.length > 0 && (
                <div>
                  <div className="text-[10px] text-[#475569] uppercase tracking-wider mb-1">Linked Evidence</div>
                  <div className="flex flex-wrap gap-1">
                    {selected.evidenceIds.map((ev) => (
                      <span key={ev} className="text-[10px] font-mono text-[#7c3aed] bg-[#7c3aed10] border border-[#7c3aed25] px-1.5 py-0.5 rounded">[{ev}]</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
