import { useEffect, useState } from 'react';
import { Search, X } from 'lucide-react';
import { EVIDENCE_LIST, Evidence, EvidenceCategory } from '../data/evidence';
import { getCaseEvidence } from '../services/api';

const CATEGORIES: (EvidenceCategory | 'ALL')[] = ['ALL', 'CCTV', 'Audio', 'Document', 'Image', 'Digital'];

const CAT_COLOR: Record<string, string> = {
  CCTV: 'text-[#8b5cf6] bg-[#8b5cf615] border-[#8b5cf630]',
  Audio: 'text-[#f59e0b] bg-[#f59e0b15] border-[#f59e0b30]',
  Document: 'text-[#06b6d4] bg-[#06b6d415] border-[#06b6d430]',
  Image: 'text-[#ec4899] bg-[#ec489915] border-[#ec489930]',
  Digital: 'text-[#22c55e] bg-[#22c55e15] border-[#22c55e30]',
};

const CUSTODY_COLOR: Record<string, string> = {
  VERIFIED: 'text-[#22c55e] bg-[#22c55e10] border-[#22c55e30]',
  PENDING: 'text-[#f59e0b] bg-[#f59e0b10] border-[#f59e0b30]',
  IN_ANALYSIS: 'text-[#06b6d4] bg-[#06b6d410] border-[#06b6d430]',
};

export default function EvidenceManagement() {
  const [category, setCategory] = useState<EvidenceCategory | 'ALL'>('ALL');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Evidence | null>(null);
  const [evidence, setEvidence] = useState<Evidence[]>(EVIDENCE_LIST);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvidence = async () => {
      try {
        const data = await getCaseEvidence('FIR-2026-DD590181');
        setEvidence(data);
      } catch (error) {
        console.error('Failed to load evidence:', error);
      } finally {
        setLoading(false);
      }
    };

    loadEvidence();
  }, []);

  const filtered = evidence.filter((e) => {
    const matchCat = category === 'ALL' || e.category === category;
    const matchSearch = search === '' ||
      e.id.toLowerCase().includes(search.toLowerCase()) ||
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="p-5 space-y-4">
      <div>
        <h1 className="text-lg font-semibold text-white">Evidence Management</h1>
        <p className="text-[12px] text-[#475569] font-mono mt-0.5">{evidence.length} items in repository · CR-2026-0142</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#475569]" />
          <input
            type="text"
            placeholder="Search evidence..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2 bg-[#161b26] border border-[#1e293b] rounded text-[12px] text-[#94a3b8] placeholder-[#334155] focus:outline-none focus:border-[#7c3aed] transition-colors"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-2.5 py-1 rounded text-[10px] font-semibold uppercase tracking-wider border transition-colors ${
                category === cat
                  ? 'bg-[#7c3aed] text-white border-[#7c3aed]'
                  : 'bg-[#161b26] text-[#64748b] border-[#1e293b] hover:text-[#94a3b8]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.map((ev) => (
          <div
            key={ev.id}
            onClick={() => setSelected(ev)}
            className="bg-[#161b26] border border-[#1e293b] rounded p-3.5 cursor-pointer hover:border-[#7c3aed] transition-colors"
          >
            <div className="flex items-start gap-2.5">
              <div className="font-mono text-[11px] text-[#7c3aed] shrink-0 pt-0.5">{ev.id}</div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-1.5 mb-1">
                  <span className="text-[12px] font-medium text-[#cbd5e1]">{ev.title}</span>
                  <span className={`text-[9px] border rounded px-1.5 py-0.5 font-semibold ${CAT_COLOR[ev.category]}`}>{ev.category}</span>
                  <span className={`text-[9px] border rounded px-1.5 py-0.5 ${CUSTODY_COLOR[ev.custodyStatus]}`}>{ev.custodyStatus.replace('_', ' ')}</span>
                </div>
                <div className="text-[11px] text-[#64748b] leading-snug truncate">{ev.description}</div>
                <div className="flex gap-3 mt-1.5 text-[10px] font-mono text-[#334155]">
                  <span>{ev.date}</span>
                  <span>{ev.fileType} · {ev.size}</span>
                  {ev.aiAnalyzed && ev.confidence && (
                    <span className="text-[#7c3aed]">AI: {ev.confidence}%</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-2 text-center py-8 text-[12px] text-[#475569]">No evidence items found.</div>
        )}
      </div>

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-[#161b26] border border-[#1e293b] rounded-lg w-full max-w-lg">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#1e293b]">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[12px] text-[#7c3aed]">{selected.id}</span>
                <span className={`text-[9px] border rounded px-1.5 py-0.5 font-semibold ${CAT_COLOR[selected.category]}`}>{selected.category}</span>
              </div>
              <button onClick={() => setSelected(null)}><X size={15} className="text-[#475569]" /></button>
            </div>
            <div className="p-4 space-y-3">
              <div className="text-[14px] font-semibold text-white">{selected.title}</div>
              <p className="text-[12px] text-[#94a3b8] leading-relaxed">{selected.description}</p>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                {[
                  ['Date & Time', `${selected.date} ${selected.time}`],
                  ['Location', selected.location],
                  ['Collected By', selected.collectedBy],
                  ['File', `${selected.fileType} · ${selected.size}`],
                  ['Case', selected.caseId],
                  ['Chain of Custody', selected.custodyStatus.replace('_', ' ')],
                ].map(([l, v]) => (
                  <div key={l}>
                    <div className="text-[#475569] uppercase tracking-wide text-[9px]">{l}</div>
                    <div className="text-[#cbd5e1] font-mono mt-0.5">{v}</div>
                  </div>
                ))}
              </div>
              {selected.aiAnalyzed && (
                <div className="bg-[#1a1033] border border-[#2d1f5e] rounded p-3">
                  <div className="text-[10px] text-[#475569] uppercase tracking-wider mb-1">AI Analysis</div>
                  <div className="text-[11px] text-[#a78bfa]">{selected.notes}</div>
                  {selected.confidence && (
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex-1 h-1 bg-[#1e293b] rounded-full overflow-hidden">
                        <div className="h-full bg-[#7c3aed] rounded-full" style={{ width: `${selected.confidence}%` }} />
                      </div>
                      <span className="text-[10px] font-mono text-[#7c3aed]">{selected.confidence}%</span>
                    </div>
                  )}
                  <div className="text-[10px] text-[#475569] mt-2">⚠️ Verify against source before operational use.</div>
                </div>
              )}
              {selected.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {selected.tags.map((t) => (
                    <span key={t} className="text-[9px] font-mono text-[#64748b] bg-[#1e293b] border border-[#2d3748] px-1.5 py-0.5 rounded">{t}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
