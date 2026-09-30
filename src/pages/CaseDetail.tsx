import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import { ArrowLeft, Archive, Users, Clock, FileText, BarChart2, FileOutput } from 'lucide-react';
import { CASES, type Case } from '../data/cases';
import { getFIRById } from '../services/api';
import { EVIDENCE_LIST } from '../data/evidence';
import { PERSONS } from '../data/suspects';
import { TIMELINE_EVENTS } from '../data/timeline';

const TABS = ['Overview', 'Evidence', 'Suspects', 'Timeline', 'Analysis', 'Reports'] as const;
type Tab = typeof TABS[number];

const TAB_ICONS = {
  Overview: FileText,
  Evidence: Archive,
  Suspects: Users,
  Timeline: Clock,
  Analysis: BarChart2,
  Reports: FileOutput,
};

const PRIORITY_COLOR: Record<string, string> = {
  HIGH: 'text-[#ef4444] bg-[#ef444415] border-[#ef444430]',
  MEDIUM: 'text-[#f59e0b] bg-[#f59e0b15] border-[#f59e0b30]',
  LOW: 'text-[#22c55e] bg-[#22c55e15] border-[#22c55e30]',
};

const STATUS_COLOR: Record<string, string> = {
  ACTIVE: 'text-[#7c3aed] bg-[#7c3aed15] border-[#7c3aed30]',
  UNDER_REVIEW: 'text-[#f59e0b] bg-[#f59e0b15] border-[#f59e0b30]',
  CLOSED: 'text-[#22c55e] bg-[#22c55e15] border-[#22c55e30]',
  PENDING: 'text-[#64748b] bg-[#64748b15] border-[#64748b30]',
};

const EV_CATEGORY_COLOR: Record<string, string> = {
  CCTV: 'text-[#8b5cf6]', Audio: 'text-[#f59e0b]', Document: 'text-[#06b6d4]',
  Image: 'text-[#ec4899]', Digital: 'text-[#22c55e]',
};

const CUSTODY_COLOR: Record<string, string> = {
  VERIFIED: 'text-[#22c55e] border-[#22c55e30] bg-[#22c55e10]',
  PENDING: 'text-[#f59e0b] border-[#f59e0b30] bg-[#f59e0b10]',
  IN_ANALYSIS: 'text-[#06b6d4] border-[#06b6d430] bg-[#06b6d410]',
};

const ROLE_COLOR: Record<string, string> = {
  PERSON_OF_INTEREST: 'text-[#f59e0b] bg-[#f59e0b10] border-[#f59e0b30]',
  WITNESS: 'text-[#06b6d4] bg-[#06b6d410] border-[#06b6d430]',
  VICTIM: 'text-[#22c55e] bg-[#22c55e10] border-[#22c55e30]',
  ASSOCIATE: 'text-[#64748b] bg-[#64748b10] border-[#64748b30]',
};

const TYPE_COLOR: Record<string, string> = {
  INCIDENT: '#ef4444', FIR: '#f59e0b', CCTV: '#8b5cf6',
  WITNESS: '#06b6d4', EVIDENCE: '#22c55e', ACTION: '#64748b', ARREST: '#7c3aed',
};

const AI_INSIGHTS = [
  { label: 'Pattern Match', detail: 'Escape route (Kolar Road) aligns with 3 prior cases in 2025', confidence: 76, evidenceIds: ['EV-1024', 'EV-1029'] },
  { label: 'Vehicle Linkage', detail: 'MP04AB1234 cross-referenced — not in prior crime records', confidence: 94, evidenceIds: ['EV-1029'] },
  { label: 'Timing Cluster', detail: 'Incident time (20:45 hrs) falls in high-frequency robbery window for MP Nagar', confidence: 81, evidenceIds: [] },
  { label: 'Suspect Profile', detail: 'Two-person team, motorcycle, dark clothing — consistent with chain snatching cases 2025-2026', confidence: 68, evidenceIds: ['EV-1025', 'EV-1026'] },
];

export default function CaseDetail() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<Tab>('Overview');
  const [c, setCase] = useState<Case | undefined>(
    CASES.find((x) => x.id === id)
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const loadCase = async () => {
      try {
        const fir = await getFIRById(id);

        const mappedCase: Case = {
          id: fir.case_id,
          crimeType: fir.crime_type,
          location: fir.location.address ?? 'Unknown',
          date: fir.incident_date
            ? new Date(fir.incident_date).toLocaleDateString('en-GB')
            : 'Unknown',
          time: fir.incident_date
            ? new Date(fir.incident_date).toLocaleTimeString('en-GB', {
                hour: '2-digit',
                minute: '2-digit',
              })
            : 'Unknown',
          priority: 'MEDIUM',
          status: 'ACTIVE',
          officer: 'AI Investigation System',
          ipcSections: fir.ipc_sections,
          summary: fir.raw_text,
          victim: fir.victim_details[0]?.name ?? 'Unknown',
          fir: fir.case_id,
          evidenceCount: 0,
          suspectsCount: fir.suspect_details.length,
        };

        setCase(mappedCase);
      } catch (error) {
        console.error('Failed to load case:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCase();
  }, [id]);

  if (loading) {
    return (
      <div className="p-8 text-center text-[12px] text-[#475569]">
        Loading case...
      </div>
    );
  }

  if (!c) {
    return (
      <div className="p-8 text-center">
        <div className="text-[#ef4444] text-sm">Case not found: {id}</div>
        <Link to="/cases" className="text-[#7c3aed] text-sm mt-2 inline-block">← Back to Cases</Link>
      </div>
    );
  }

  const caseEvidence = EVIDENCE_LIST.filter((e) => e.caseId === id);
  const casePersons = PERSONS.filter((p) => p.caseIds.includes(id ?? ''));

  return (
    <div className="p-5 space-y-4">
      {/* Back + header */}
      <Link to="/cases" className="flex items-center gap-1.5 text-[11px] text-[#475569] hover:text-[#94a3b8] transition-colors w-fit">
        <ArrowLeft size={12} /> Back to Cases
      </Link>

      <div className="flex flex-wrap items-start gap-3 justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[13px] text-[#7c3aed]">{c.id}</span>
            <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded border uppercase ${PRIORITY_COLOR[c.priority]}`}>{c.priority}</span>
            <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded border uppercase ${STATUS_COLOR[c.status]}`}>{c.status.replace('_', ' ')}</span>
          </div>
          <h1 className="text-xl font-bold text-white mt-1">{c.crimeType}</h1>
          <div className="text-[12px] text-[#475569] mt-0.5">{c.location} · {c.date} at {c.time}</div>
        </div>
        <div className="flex gap-2">
          <Link to="/reports" className="px-3 py-1.5 bg-[#7c3aed] text-white text-[12px] font-medium rounded hover:bg-[#6d28d9] transition-colors">
            Generate Report
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-0.5 border-b border-[#1e293b] overflow-x-auto">
        {TABS.map((tab) => {
          const Icon = TAB_ICONS[tab];
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-1.5 px-3 py-2.5 text-[12px] font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-[#7c3aed] text-[#a78bfa]'
                  : 'border-transparent text-[#475569] hover:text-[#94a3b8]'
              }`}
            >
              <Icon size={13} />
              {tab}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      {activeTab === 'Overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 space-y-4">
            <div className="bg-[#161b26] border border-[#1e293b] rounded p-4">
              <div className="text-[11px] text-[#475569] uppercase tracking-wider mb-2">Summary</div>
              <p className="text-[13px] text-[#cbd5e1] leading-relaxed">{c.summary}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'FIR Number', value: c.fir },
                { label: 'Investigating Officer', value: c.officer },
                { label: 'Victim', value: c.victim },
                { label: 'IPC Sections', value: c.ipcSections.join(', ') },
              ].map(({ label, value }) => (
                <div key={label} className="bg-[#161b26] border border-[#1e293b] rounded p-3">
                  <div className="text-[10px] text-[#475569] uppercase tracking-wider">{label}</div>
                  <div className="text-[12px] text-[#cbd5e1] mt-1 font-mono">{value}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <div className="bg-[#161b26] border border-[#1e293b] rounded p-4">
              <div className="text-[11px] text-[#475569] uppercase tracking-wider mb-3">Quick Stats</div>
              {[
                { label: 'Evidence Items', value: caseEvidence.length, to: '#' },
                { label: 'Persons Linked', value: casePersons.length, to: '#' },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between py-2 border-b border-[#1e293b] last:border-0">
                  <span className="text-[12px] text-[#64748b]">{label}</span>
                  <span className="text-[12px] font-mono text-[#a78bfa]">{value}</span>
                </div>
              ))}
            </div>
            <div className="bg-[#161b26] border border-[#1e293b] rounded p-4">
              <div className="text-[11px] text-[#475569] uppercase tracking-wider mb-2">Quick Links</div>
              <div className="space-y-1.5">
                <Link to="/cctv" className="flex items-center gap-2 text-[12px] text-[#7c3aed] hover:text-[#a78bfa] transition-colors">
                  → View CCTV Intelligence
                </Link>
                <Link to="/network" className="flex items-center gap-2 text-[12px] text-[#7c3aed] hover:text-[#a78bfa] transition-colors">
                  → Suspect Network
                </Link>
                <Link to="/timeline" className="flex items-center gap-2 text-[12px] text-[#7c3aed] hover:text-[#a78bfa] transition-colors">
                  → Forensic Timeline
                </Link>
                <Link to="/chat" className="flex items-center gap-2 text-[12px] text-[#7c3aed] hover:text-[#a78bfa] transition-colors">
                  → Investigation Chat
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Evidence' && (
        <div className="space-y-2">
          {caseEvidence.map((ev) => (
            <div key={ev.id} className="bg-[#161b26] border border-[#1e293b] rounded p-3 flex items-start gap-3">
              <div className="font-mono text-[11px] text-[#7c3aed] shrink-0 pt-0.5">{ev.id}</div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[12px] text-[#cbd5e1] font-medium">{ev.title}</span>
                  <span className={`text-[10px] font-semibold ${EV_CATEGORY_COLOR[ev.category]}`}>{ev.category}</span>
                  <span className={`text-[9px] border rounded px-1 py-0.5 ${CUSTODY_COLOR[ev.custodyStatus]}`}>{ev.custodyStatus}</span>
                </div>
                <div className="text-[11px] text-[#64748b] mt-1 leading-snug">{ev.description}</div>
                <div className="flex gap-3 mt-1.5 text-[10px] text-[#334155] font-mono">
                  <span>{ev.date} {ev.time}</span>
                  <span>{ev.fileType} · {ev.size}</span>
                  <span>By: {ev.collectedBy}</span>
                </div>
              </div>
              {ev.aiAnalyzed && ev.confidence && (
                <div className="shrink-0 text-center">
                  <div className="text-[11px] font-bold text-[#7c3aed]">{ev.confidence}%</div>
                  <div className="text-[9px] text-[#475569]">AI conf.</div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === 'Suspects' && (
        <div className="space-y-2">
          {casePersons.map((p) => (
            <div key={p.id} className="bg-[#161b26] border border-[#1e293b] rounded p-3">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-[12px] text-[#cbd5e1] font-medium">{p.name}</span>
                <span className={`text-[9px] border rounded px-1.5 py-0.5 font-semibold uppercase ${ROLE_COLOR[p.role]}`}>
                  {p.role.replace(/_/g, ' ')}
                </span>
              </div>
              {p.description && <p className="text-[11px] text-[#64748b] leading-snug">{p.description}</p>}
              {p.notes && <p className="text-[11px] text-[#475569] mt-1 italic">{p.notes}</p>}
              {p.linkedEvidence.length > 0 && (
                <div className="flex gap-1 mt-2 flex-wrap">
                  {p.linkedEvidence.map((ev) => (
                    <span key={ev} className="text-[9px] font-mono text-[#7c3aed] bg-[#7c3aed10] border border-[#7c3aed25] px-1 rounded">[{ev}]</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === 'Timeline' && (
        <div className="space-y-0">
          {TIMELINE_EVENTS.map((ev, i) => (
            <div key={ev.id} className="flex gap-4">
              <div className="flex flex-col items-center shrink-0 w-16">
                <div className="text-[10px] font-mono text-[#475569] text-right w-full">{ev.time}</div>
                <div className="flex flex-col items-center mt-1">
                  <div className="w-2.5 h-2.5 rounded-full border-2" style={{ borderColor: TYPE_COLOR[ev.type], background: `${TYPE_COLOR[ev.type]}20` }} />
                  {i < TIMELINE_EVENTS.length - 1 && <div className="w-px flex-1 bg-[#1e293b] mt-1" style={{ minHeight: 32 }} />}
                </div>
              </div>
              <div className="pb-6 flex-1 min-w-0">
                <div className="text-[10px] text-[#475569] uppercase tracking-wider font-mono">{ev.type} · {ev.date}</div>
                <div className="text-[12px] font-semibold text-[#cbd5e1] mt-0.5">{ev.title}</div>
                <div className="text-[11px] text-[#64748b] mt-1 leading-snug">{ev.description}</div>
                {ev.evidenceIds && ev.evidenceIds.length > 0 && (
                  <div className="flex gap-1 mt-1.5 flex-wrap">
                    {ev.evidenceIds.map((e) => (
                      <span key={e} className="text-[9px] font-mono text-[#7c3aed] bg-[#7c3aed10] border border-[#7c3aed25] px-1 rounded">[{e}]</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'Analysis' && (
        <div className="space-y-4">
          <div className="bg-[#1a1033] border border-[#2d1f5e] rounded p-3 text-[12px] text-[#a78bfa]">
            ⚠️ AI-generated analysis is supplementary. All findings must be verified against source evidence by the investigating officer before use.
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {AI_INSIGHTS.map((ins, i) => (
              <div key={i} className="bg-[#161b26] border border-[#1e293b] rounded p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-[12px] font-semibold text-[#cbd5e1]">{ins.label}</div>
                  <div className="font-mono text-[12px] text-[#7c3aed]">{ins.confidence}% conf.</div>
                </div>
                <div className="text-[11px] text-[#64748b] leading-snug">{ins.detail}</div>
                {ins.evidenceIds.length > 0 && (
                  <div className="flex gap-1 mt-2">
                    {ins.evidenceIds.map((ev) => (
                      <span key={ev} className="text-[9px] font-mono text-[#7c3aed] bg-[#7c3aed10] border border-[#7c3aed25] px-1 rounded">[{ev}]</span>
                    ))}
                  </div>
                )}
                <div className="mt-2 h-1 bg-[#1e293b] rounded-full overflow-hidden">
                  <div className="h-full bg-[#7c3aed] rounded-full" style={{ width: `${ins.confidence}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'Reports' && (
        <div className="bg-[#161b26] border border-[#1e293b] rounded p-6 text-center">
          <FileOutput size={32} className="text-[#475569] mx-auto mb-3" />
          <div className="text-[13px] text-[#94a3b8] mb-4">Generate a comprehensive investigation report for {c.id}</div>
          <Link
            to="/reports"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#7c3aed] text-white text-[12px] font-medium rounded hover:bg-[#6d28d9] transition-colors"
          >
            <FileOutput size={13} /> Open Report Generator
          </Link>
        </div>
      )}
    </div>
  );
}
