import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Search, Filter, ArrowRight } from 'lucide-react';
import { CASES, CaseStatus, CasePriority, type Case } from '../data/cases';
import { listFIRs } from '../services/api';

const STATUS_FILTERS = ['ALL', 'ACTIVE', 'UNDER_REVIEW', 'CLOSED', 'PENDING', 'HIGH'] as const;
type Filter = typeof STATUS_FILTERS[number];

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

export default function Cases() {
  const [filter, setFilter] = useState<Filter>('ALL');
  const [search, setSearch] = useState('');
  const [cases, setCases] = useState<Case[]>(CASES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCases = async () => {
      try {
        const firs = await listFIRs();

        const mappedCases: Case[] = firs.map((fir) => ({
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
          fir: fir.raw_text,
          evidenceCount: 0,
          suspectsCount: fir.suspect_details.length,
        }));

        setCases(mappedCases);
      } catch (error) {
        console.error('Failed to load cases:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCases();
  }, []);

  const filtered = cases.filter((c) => {
    const matchFilter =
      filter === 'ALL' ? true :
      filter === 'HIGH' ? c.priority === 'HIGH' :
      c.status === filter;
    const matchSearch =
      search === '' ||
      c.id.toLowerCase().includes(search.toLowerCase()) ||
      c.crimeType.toLowerCase().includes(search.toLowerCase()) ||
      c.location.toLowerCase().includes(search.toLowerCase()) ||
      c.victim.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="p-5 space-y-4">
      <div>
        <h1 className="text-lg font-semibold text-white">Case Registry</h1>
        <p className="text-[12px] text-[#475569] font-mono mt-0.5">{cases.length} total cases · MP Nagar Police Station</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#475569]" />
          <input
            type="text"
            placeholder="Search by case ID, type, location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2 bg-[#161b26] border border-[#1e293b] rounded text-[12px] text-[#94a3b8] placeholder-[#334155] focus:outline-none focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed] transition-colors"
          />
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <Filter size={12} className="text-[#475569]" />
          {STATUS_FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-2.5 py-1 rounded text-[10px] font-semibold uppercase tracking-wider border transition-colors ${
                filter === f
                  ? 'bg-[#7c3aed] text-white border-[#7c3aed]'
                  : 'bg-[#161b26] text-[#64748b] border-[#1e293b] hover:text-[#94a3b8] hover:border-[#2d3748]'
              }`}
            >
              {f.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Case count */}
      <div className="text-[11px] text-[#475569] font-mono">
        {loading ? 'Loading cases...' : `${filtered.length} case${filtered.length !== 1 ? 's' : ''} found`}
      </div>

      {/* Table */}
      <div className="bg-[#161b26] border border-[#1e293b] rounded overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#1e293b]">
                {['Case ID', 'Crime Type', 'Location', 'Date', 'Victim', 'IPC', 'Priority', 'Status', 'Officer', ''].map((h) => (
                  <th key={h} className="px-3 py-2.5 text-[10px] font-semibold text-[#475569] uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="border-b border-[#1e293b] last:border-0 hover:bg-[#1e293b] transition-colors">
                  <td className="px-3 py-3">
                    <span className="font-mono text-[11px] text-[#7c3aed]">{c.id}</span>
                  </td>
                  <td className="px-3 py-3 text-[12px] text-[#cbd5e1] whitespace-nowrap">{c.crimeType}</td>
                  <td className="px-3 py-3 text-[11px] text-[#64748b] max-w-[160px] truncate">{c.location}</td>
                  <td className="px-3 py-3 text-[11px] font-mono text-[#475569] whitespace-nowrap">{c.date}</td>
                  <td className="px-3 py-3 text-[11px] text-[#64748b] whitespace-nowrap max-w-[120px] truncate">{c.victim}</td>
                  <td className="px-3 py-3">
                    <div className="flex gap-1 flex-wrap">
                      {c.ipcSections.map((ipc) => (
                        <span key={ipc} className="text-[9px] font-mono text-[#94a3b8] bg-[#1e293b] border border-[#2d3748] px-1 py-0.5 rounded">{ipc}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded border uppercase ${PRIORITY_COLOR[c.priority]}`}>
                      {c.priority}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded border uppercase ${STATUS_COLOR[c.status]}`}>
                      {c.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-[11px] text-[#64748b] whitespace-nowrap">{c.officer}</td>
                  <td className="px-3 py-3">
                    <Link
                      to={`/cases/${c.id}`}
                      className="flex items-center gap-1 text-[11px] text-[#7c3aed] hover:text-[#a78bfa] transition-colors"
                    >
                      Open <ArrowRight size={11} />
                    </Link>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-3 py-8 text-center text-[12px] text-[#475569]">No cases match your filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
