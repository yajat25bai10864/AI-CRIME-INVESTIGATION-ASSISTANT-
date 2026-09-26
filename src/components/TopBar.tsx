import { useState } from 'react';
import { Link } from 'react-router';
import { Search, Bell, ChevronDown, Menu, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { CASES } from '../data/cases';

interface TopBarProps {
  onMenuClick: () => void;
}

const ALERTS = [
  { id: 1, text: 'EV-1031 CDR analysis complete', type: 'success', time: '5m ago' },
  { id: 2, text: 'CR-2026-0076 — Missing person update needed', type: 'warning', time: '1h ago' },
  { id: 3, text: 'CFSL response pending for EV-1025', type: 'info', time: '2h ago' },
];

export default function TopBar({ onMenuClick }: TopBarProps) {
  const [caseSwitcherOpen, setCaseSwitcherOpen] = useState(false);
  const [alertsOpen, setAlertsOpen] = useState(false);
  const [currentCase, setCurrentCase] = useState('CR-2026-0142');
  const [search, setSearch] = useState('');

  return (
    <div className="flex items-center gap-3 px-4 py-2.5 bg-[#0d1117] border-b border-[#1e293b] shrink-0">
      <button onClick={onMenuClick} className="md:hidden text-[#64748b] hover:text-[#94a3b8]">
        <Menu size={18} />
      </button>

      {/* Case switcher */}
      <div className="relative">
        <button
          onClick={() => { setCaseSwitcherOpen(!caseSwitcherOpen); setAlertsOpen(false); }}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-[#1e293b] bg-[#161b26] hover:border-[#2d3748] text-[11px] font-mono text-[#a78bfa] transition-colors"
        >
          <span>{currentCase}</span>
          <ChevronDown size={11} />
        </button>
        {caseSwitcherOpen && (
          <div className="absolute top-full mt-1.5 left-0 z-50 w-64 bg-[#161b26] border border-[#1e293b] rounded shadow-2xl">
            <div className="p-2 text-[10px] text-[#475569] uppercase tracking-wider border-b border-[#1e293b] px-3">Switch Case</div>
            {CASES.slice(0, 6).map((c) => (
              <button
                key={c.id}
                onClick={() => { setCurrentCase(c.id); setCaseSwitcherOpen(false); }}
                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-[#1e293b] text-left"
              >
                <span className="font-mono text-[11px] text-[#7c3aed]">{c.id}</span>
                <span className="text-[11px] text-[#94a3b8] truncate">{c.crimeType}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Search */}
      <div className="flex-1 max-w-sm relative">
        <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#475569]" />
        <input
          type="text"
          placeholder="Search cases, evidence, persons..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-8 pr-3 py-1.5 bg-[#161b26] border border-[#1e293b] rounded text-[12px] text-[#94a3b8] placeholder-[#334155] focus:outline-none focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed] transition-colors"
        />
      </div>

      <div className="ml-auto flex items-center gap-3">
        {/* Alerts */}
        <div className="relative">
          <button
            onClick={() => { setAlertsOpen(!alertsOpen); setCaseSwitcherOpen(false); }}
            className="relative flex items-center justify-center w-8 h-8 rounded hover:bg-[#161b26] text-[#64748b] hover:text-[#94a3b8] transition-colors"
          >
            <Bell size={15} />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#ef4444]" />
          </button>
          {alertsOpen && (
            <div className="absolute top-full mt-1.5 right-0 z-50 w-80 bg-[#161b26] border border-[#1e293b] rounded shadow-2xl">
              <div className="p-3 text-[10px] text-[#475569] uppercase tracking-wider border-b border-[#1e293b]">Notifications</div>
              {ALERTS.map((a) => (
                <div key={a.id} className="flex items-start gap-2.5 px-3 py-2.5 border-b border-[#1e293b] last:border-0">
                  {a.type === 'warning'
                    ? <AlertTriangle size={13} className="shrink-0 text-[#f59e0b] mt-0.5" />
                    : <CheckCircle2 size={13} className="shrink-0 text-[#22c55e] mt-0.5" />}
                  <div>
                    <div className="text-[11px] text-[#cbd5e1]">{a.text}</div>
                    <div className="text-[10px] text-[#475569] mt-0.5">{a.time}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Officer */}
        <div className="flex items-center gap-2 pl-3 border-l border-[#1e293b]">
          <div className="w-6 h-6 rounded-full bg-[#1e293b] flex items-center justify-center text-[10px] font-bold text-[#7c3aed]">RD</div>
          <span className="hidden sm:block text-[11px] text-[#64748b]">R. Deshmukh</span>
        </div>
      </div>

      {/* Click outside to close */}
      {(caseSwitcherOpen || alertsOpen) && (
        <div className="fixed inset-0 z-40" onClick={() => { setCaseSwitcherOpen(false); setAlertsOpen(false); }} />
      )}
    </div>
  );
}
