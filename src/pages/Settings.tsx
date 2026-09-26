import { useState } from 'react';

const AUDIT_LOG = [
  { time: '2026-09-13 10:14', action: 'CDR analysis report accessed', user: 'R. Deshmukh', ip: '192.168.1.12' },
  { time: '2026-09-13 09:45', action: 'CFSL submission logged for EV-1025', user: 'P. Sharma', ip: '192.168.1.14' },
  { time: '2026-09-13 09:10', action: 'Suspect profile updated — Arun Chauhan', user: 'R. Deshmukh', ip: '192.168.1.12' },
  { time: '2026-09-12 16:20', action: 'Evidence EV-1031 status updated to IN_ANALYSIS', user: 'D. Rao', ip: '192.168.1.18' },
  { time: '2026-09-12 15:30', action: 'Timeline event added — vehicle owner summoned', user: 'R. Deshmukh', ip: '192.168.1.12' },
  { time: '2026-09-11 09:00', action: 'FIR Analyzer used for FIR-2026-1042', user: 'A. Singh', ip: '192.168.1.21' },
];

const NOTIF_SETTINGS = [
  { label: 'Evidence analysis complete', key: 'evidence_complete', enabled: true },
  { label: 'New case assigned', key: 'case_assigned', enabled: true },
  { label: 'CDR results available', key: 'cdr_results', enabled: true },
  { label: 'Suspect network updates', key: 'network_update', enabled: false },
  { label: 'Report generated', key: 'report_gen', enabled: false },
];

const TABS = ['Profile', 'API Config', 'Notifications', 'Audit Log'] as const;
type Tab = typeof TABS[number];

export default function Settings() {
  const [tab, setTab] = useState<Tab>('Profile');
  const [notifs, setNotifs] = useState(NOTIF_SETTINGS);

  return (
    <div className="p-5 space-y-4">
      <div>
        <h1 className="text-lg font-semibold text-white">Settings & Preferences</h1>
        <p className="text-[12px] text-[#475569] font-mono mt-0.5">Officer account, integrations, and system audit</p>
      </div>

      <div className="flex gap-1 border-b border-[#1e293b]">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-2.5 text-[12px] font-medium border-b-2 transition-colors ${
              tab === t
                ? 'border-[#7c3aed] text-[#a78bfa]'
                : 'border-transparent text-[#475569] hover:text-[#94a3b8]'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'Profile' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-[#161b26] border border-[#1e293b] rounded p-5 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-[#1a1033] border-2 border-[#7c3aed] flex items-center justify-center text-xl font-bold text-[#7c3aed]">RD</div>
              <div>
                <div className="text-[14px] font-semibold text-white">R. Deshmukh</div>
                <div className="text-[11px] text-[#475569]">Sub-Inspector · Investigation Officer</div>
                <div className="text-[11px] text-[#22c55e] mt-0.5">● Online</div>
              </div>
            </div>
            <div className="space-y-3">
              {[
                ['Full Name', 'Rahul Deshmukh'],
                ['Badge No.', 'MP-SI-4821'],
                ['Station', 'MP Nagar Police Station'],
                ['Zone', 'Zone-1, Bhopal'],
                ['Rank', 'Sub-Inspector'],
                ['Email', 'r.deshmukh@mppolice.gov.in'],
              ].map(([l, v]) => (
                <div key={l}>
                  <label className="text-[10px] text-[#475569] uppercase tracking-wider">{l}</label>
                  <input
                    type="text"
                    defaultValue={v}
                    className="w-full mt-1 px-3 py-1.5 bg-[#0d1117] border border-[#1e293b] rounded text-[12px] text-[#94a3b8] focus:outline-none focus:border-[#7c3aed] font-mono"
                  />
                </div>
              ))}
            </div>
            <button className="w-full py-2 bg-[#7c3aed] text-white text-[12px] font-medium rounded hover:bg-[#6d28d9] transition-colors">
              Save Profile
            </button>
          </div>
          <div className="space-y-4">
            <div className="bg-[#161b26] border border-[#1e293b] rounded p-4">
              <div className="text-[11px] text-[#475569] uppercase tracking-wider mb-3">Security</div>
              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 border border-[#1e293b] rounded text-[12px] text-[#64748b] hover:text-[#94a3b8] hover:border-[#2d3748] transition-colors">
                  Change Password
                </button>
                <button className="w-full text-left px-3 py-2 border border-[#1e293b] rounded text-[12px] text-[#64748b] hover:text-[#94a3b8] hover:border-[#2d3748] transition-colors">
                  Enable Two-Factor Authentication
                </button>
                <button className="w-full text-left px-3 py-2 border border-[#1e293b] rounded text-[12px] text-[#64748b] hover:text-[#94a3b8] hover:border-[#2d3748] transition-colors">
                  View Active Sessions
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'API Config' && (
        <div className="bg-[#161b26] border border-[#1e293b] rounded p-5 space-y-4 max-w-lg">
          <div className="text-[11px] text-[#475569] uppercase tracking-wider">Backend API Configuration</div>
          <div className="text-[11px] text-[#334155] bg-[#0d1117] border border-[#1e293b] rounded p-2 font-mono">
            VITE_API_BASE_URL = {import.meta.env.VITE_API_BASE_URL ?? '/api (default)'}
          </div>
          {[
            ['API Base URL', 'https://api.mppolice-intel.gov.in/v1'],
            ['CFSL Endpoint', 'https://cfsl.gov.in/api/forensics'],
            ['CCTNS Base URL', 'https://cctns.gov.in/api/'],
            ['Timeout (ms)', '30000'],
          ].map(([l, v]) => (
            <div key={l}>
              <label className="text-[10px] text-[#475569] uppercase tracking-wider">{l}</label>
              <input
                type="text"
                defaultValue={v}
                className="w-full mt-1 px-3 py-1.5 bg-[#0d1117] border border-[#1e293b] rounded text-[12px] text-[#94a3b8] focus:outline-none focus:border-[#7c3aed] font-mono"
              />
            </div>
          ))}
          <button className="px-4 py-2 bg-[#7c3aed] text-white text-[12px] rounded hover:bg-[#6d28d9] transition-colors">
            Save API Config
          </button>
        </div>
      )}

      {tab === 'Notifications' && (
        <div className="bg-[#161b26] border border-[#1e293b] rounded p-5 max-w-md space-y-3">
          <div className="text-[11px] text-[#475569] uppercase tracking-wider mb-2">Alert Preferences</div>
          {notifs.map((n, i) => (
            <div key={n.key} className="flex items-center justify-between py-2 border-b border-[#1e293b] last:border-0">
              <span className="text-[12px] text-[#94a3b8]">{n.label}</span>
              <button
                onClick={() => setNotifs(notifs.map((x, j) => j === i ? { ...x, enabled: !x.enabled } : x))}
                className={`w-10 h-5 rounded-full transition-colors relative ${n.enabled ? 'bg-[#7c3aed]' : 'bg-[#1e293b]'}`}
              >
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${n.enabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </button>
            </div>
          ))}
        </div>
      )}

      {tab === 'Audit Log' && (
        <div className="bg-[#161b26] border border-[#1e293b] rounded overflow-hidden">
          <div className="px-4 py-3 border-b border-[#1e293b] text-[11px] text-[#475569] uppercase tracking-wider">
            System Audit Log — Last 24 hrs
          </div>
          <table className="w-full text-left text-[11px]">
            <thead>
              <tr className="border-b border-[#1e293b]">
                {['Timestamp', 'Action', 'Officer', 'IP'].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-[10px] font-semibold text-[#475569] uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {AUDIT_LOG.map((entry, i) => (
                <tr key={i} className="border-b border-[#1e293b] last:border-0 hover:bg-[#1e293b] transition-colors">
                  <td className="px-4 py-2.5 font-mono text-[#334155] whitespace-nowrap">{entry.time}</td>
                  <td className="px-4 py-2.5 text-[#94a3b8]">{entry.action}</td>
                  <td className="px-4 py-2.5 text-[#64748b] whitespace-nowrap">{entry.user}</td>
                  <td className="px-4 py-2.5 font-mono text-[#334155] whitespace-nowrap">{entry.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
