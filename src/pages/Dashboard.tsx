import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import {
  FolderOpen, Archive, Users, Clock, ArrowRight,
  AlertTriangle, CheckCircle2, Activity, Zap
} from 'lucide-react';
import {
  CASES, CASE_STATS, WEEKLY_ACTIVITY, CASES_BY_STATUS, EVIDENCE_BREAKDOWN
} from '../data/cases';
import { listFIRs } from '../services/api';

const PRIORITY_COLOR: Record<string, string> = {
  HIGH: 'text-[#ef4444] bg-[#ef444420] border-[#ef444440]',
  MEDIUM: 'text-[#f59e0b] bg-[#f59e0b20] border-[#f59e0b40]',
  LOW: 'text-[#22c55e] bg-[#22c55e20] border-[#22c55e40]',
};

const STATUS_COLOR: Record<string, string> = {
  ACTIVE: 'text-[#7c3aed] bg-[#7c3aed20] border-[#7c3aed40]',
  UNDER_REVIEW: 'text-[#f59e0b] bg-[#f59e0b20] border-[#f59e0b40]',
  CLOSED: 'text-[#22c55e] bg-[#22c55e20] border-[#22c55e40]',
  PENDING: 'text-[#64748b] bg-[#64748b20] border-[#64748b40]',
};

const FEED = [
  { time: '10:14', text: 'CDR analysis completed for Arun Chauhan', type: 'evidence', evidenceId: 'EV-1031', caseId: 'CR-2026-0142' },
  { time: '09:45', text: 'CFSL facial enhancement submitted', type: 'action', evidenceId: 'EV-1025', caseId: 'CR-2026-0142' },
  { time: '09:10', text: 'Vehicle owner summoned for questioning', type: 'action', caseId: 'CR-2026-0142' },
  { time: 'Yesterday', text: 'Audio transcript reviewed — Rajesh Kumar', type: 'evidence', evidenceId: 'EV-1026', caseId: 'CR-2026-0142' },
  { time: 'Yesterday', text: 'FIR-2026-1031 escalated to senior officer', type: 'alert', caseId: 'CR-2026-0131' },
];

export default function Dashboard() {
  const [recentCases, setRecentCases] = useState(CASES.slice(0, 5));

  useEffect(() => {
    const loadRecentCases = async () => {
      try {
        const firs = await listFIRs();

        const mapped = firs.slice(0, 5).map((fir) => ({
          id: fir.case_id,
          crimeType: fir.crime_type,
          location: fir.location.address ?? 'Unknown',
          date: fir.incident_date ?? '',
          time: '',
          priority: 'MEDIUM' as const,
          status: 'ACTIVE' as const,
          officer: 'AI Investigation System',
          ipcSections: fir.ipc_sections,
          summary: fir.raw_text,
          victim: fir.victim_details[0]?.name ?? 'Unknown',
          fir: fir.case_id,
          evidenceCount: 0,
          suspectsCount: fir.suspect_details.length,
        }));

        setRecentCases(mapped);
      } catch (error) {
        console.error('Failed to load recent cases:', error);
      }
    };

    loadRecentCases();
  }, []);
  return (
    <div className="p-5 space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-lg font-semibold text-white">Investigation Dashboard</h1>
        <p className="text-[12px] text-[#475569] mt-0.5 font-mono">MP Nagar Police Station · 13 Sep 2026 · Officer R. Deshmukh</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Active Cases', value: CASE_STATS.active, icon: FolderOpen, color: '#7c3aed', delta: '+2' },
          { label: 'Evidence Items', value: CASE_STATS.evidenceItems, icon: Archive, color: '#06b6d4', delta: '+14' },
          { label: 'Persons of Interest', value: CASE_STATS.personsOfInterest, icon: Users, color: '#f59e0b', delta: '+3' },
          { label: 'Pending Analysis', value: CASE_STATS.pendingAnalysis, icon: Clock, color: '#ef4444', delta: '-2' },
        ].map(({ label, value, icon: Icon, color, delta }) => (
          <div key={label} className="bg-[#161b26] border border-[#1e293b] rounded p-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[11px] text-[#475569] uppercase tracking-wider">{label}</div>
                <div className="text-2xl font-bold text-white mt-1">{value}</div>
              </div>
              <div className="w-8 h-8 rounded flex items-center justify-center" style={{ background: `${color}20` }}>
                <Icon size={15} style={{ color }} />
              </div>
            </div>
            <div className="mt-2 text-[10px] font-mono" style={{ color }}>
              {delta} this week
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Weekly activity */}
        <div className="md:col-span-2 bg-[#161b26] border border-[#1e293b] rounded p-4">
          <div className="text-[11px] text-[#475569] uppercase tracking-wider mb-3">Weekly Investigation Activity</div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={WEEKLY_ACTIVITY} barGap={2}>
              <XAxis dataKey="day" tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#0d1117', border: '1px solid #1e293b', borderRadius: 4, fontSize: 11 }}
                labelStyle={{ color: '#94a3b8' }}
              />
              <Bar dataKey="cases" name="Cases" fill="#7c3aed" radius={[2, 2, 0, 0]} />
              <Bar dataKey="evidence" name="Evidence" fill="#06b6d4" radius={[2, 2, 0, 0]} />
              <Bar dataKey="interviews" name="Interviews" fill="#f59e0b" radius={[2, 2, 0, 0]} />
              <Legend wrapperStyle={{ fontSize: 10, color: '#64748b' }} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Cases by status */}
        <div className="bg-[#161b26] border border-[#1e293b] rounded p-4">
          <div className="text-[11px] text-[#475569] uppercase tracking-wider mb-3">Cases by Status</div>
          <ResponsiveContainer width="100%" height={120}>
            <PieChart>
              <Pie data={CASES_BY_STATUS} dataKey="value" cx="50%" cy="50%" innerRadius={30} outerRadius={52}>
                {CASES_BY_STATUS.map((entry) => <Cell key={entry.name} fill={entry.fill} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#0d1117', border: '1px solid #1e293b', borderRadius: 4, fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-1 mt-2">
            {CASES_BY_STATUS.map((s) => (
              <div key={s.name} className="flex items-center gap-1.5 text-[10px] text-[#64748b]">
                <div className="w-2 h-2 rounded-full" style={{ background: s.fill }} />
                {s.name}: <span className="text-[#94a3b8] font-mono">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Evidence breakdown */}
      <div className="bg-[#161b26] border border-[#1e293b] rounded p-4">
        <div className="text-[11px] text-[#475569] uppercase tracking-wider mb-3">Evidence Breakdown by Type</div>
        <ResponsiveContainer width="100%" height={60}>
          <BarChart data={EVIDENCE_BREAKDOWN} layout="vertical" margin={{ left: 0 }}>
            <XAxis type="number" tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis dataKey="type" type="category" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} width={60} />
            <Tooltip contentStyle={{ background: '#0d1117', border: '1px solid #1e293b', borderRadius: 4, fontSize: 11 }} />
            <Bar dataKey="count" radius={[0, 2, 2, 0]}>
              {EVIDENCE_BREAKDOWN.map((e) => <Cell key={e.type} fill={e.fill} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Cases + Feed */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Active cases */}
        <div className="md:col-span-2 bg-[#161b26] border border-[#1e293b] rounded p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-[11px] text-[#475569] uppercase tracking-wider">Recent Cases</div>
            <Link to="/cases" className="text-[11px] text-[#7c3aed] hover:text-[#a78bfa] flex items-center gap-1">
              View All <ArrowRight size={11} />
            </Link>
          </div>
          <div className="space-y-2">
            {recentCases.map((c) => (
              <Link
                key={c.id}
                to={`/cases/${c.id}`}
                className="flex items-center gap-3 px-3 py-2.5 rounded border border-[#1e293b] hover:border-[#2d3748] hover:bg-[#1e293b] transition-colors"
              >
                <div className="font-mono text-[11px] text-[#7c3aed] shrink-0">{c.id}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] text-[#cbd5e1] truncate">{c.crimeType}</div>
                  <div className="text-[10px] text-[#475569] truncate">{c.location}</div>
                </div>
                <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded border uppercase tracking-wider ${PRIORITY_COLOR[c.priority]}`}>
                  {c.priority}
                </span>
                <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded border uppercase tracking-wider ${STATUS_COLOR[c.status]}`}>
                  {c.status.replace('_', ' ')}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Live feed */}
        <div className="bg-[#161b26] border border-[#1e293b] rounded p-4">
          <div className="flex items-center gap-2 mb-3">
            <Activity size={12} className="text-[#7c3aed]" />
            <div className="text-[11px] text-[#475569] uppercase tracking-wider">Investigation Feed</div>
          </div>
          <div className="space-y-3">
            {FEED.map((item, i) => (
              <div key={i} className="flex gap-2.5">
                <div className="shrink-0 w-0.5 bg-[#1e293b] ml-1.5 relative">
                  <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full border ${
                    item.type === 'alert' ? 'border-[#f59e0b] bg-[#f59e0b20]' : 'border-[#7c3aed] bg-[#7c3aed20]'
                  }`} />
                </div>
                <div className="pb-3">
                  <div className="text-[11px] text-[#94a3b8] leading-snug">{item.text}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-[#334155] font-mono">{item.time}</span>
                    {item.evidenceId && (
                      <span className="text-[9px] font-mono text-[#7c3aed] bg-[#7c3aed15] border border-[#7c3aed30] px-1 rounded">
                        [{item.evidenceId}]
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
