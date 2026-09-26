import { NavLink } from 'react-router';
import {
  LayoutDashboard, FolderOpen, FileText, Archive,
  Video, Mic, Network, Map, Clock, MessageSquare,
  FileOutput, Settings, ChevronLeft, ChevronRight,
  Shield, Circle
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const NAV_ITEMS = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { path: '/cases', label: 'Cases', icon: FolderOpen },
  { path: '/fir-analyzer', label: 'FIR Analyzer', icon: FileText },
  { path: '/evidence', label: 'Evidence', icon: Archive },
  { path: '/cctv', label: 'CCTV Intelligence', icon: Video },
  { path: '/audio', label: 'Audio Analyzer', icon: Mic },
  { path: '/network', label: 'Suspect Network', icon: Network },
  { path: '/heatmap', label: 'Crime Heatmap', icon: Map },
  { path: '/timeline', label: 'Timeline', icon: Clock },
  { path: '/chat', label: 'Investigation Chat', icon: MessageSquare },
  { path: '/reports', label: 'Reports', icon: FileOutput },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  return (
    <aside
      className="relative flex flex-col bg-[#0d1117] border-r border-[#1e293b] transition-all duration-300 shrink-0"
      style={{ width: collapsed ? 56 : 220 }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-3.5 py-4 border-b border-[#1e293b]">
        <div className="shrink-0 w-7 h-7 rounded bg-[#7c3aed] flex items-center justify-center">
          <Shield size={15} className="text-white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <div className="text-[11px] font-semibold text-white tracking-wider uppercase whitespace-nowrap">CRIME INTEL</div>
            <div className="text-[9px] text-[#475569] tracking-widest uppercase whitespace-nowrap">MP Police · Bhopal</div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 overflow-y-auto overflow-x-hidden">
        {NAV_ITEMS.map(({ path, label, icon: Icon, end }) => (
          <NavLink
            key={path}
            to={path}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2 mx-1.5 mb-0.5 rounded text-[12px] font-medium transition-colors ${
                isActive
                  ? 'bg-[#1a1033] text-[#a78bfa] border border-[#2d1f5e]'
                  : 'text-[#64748b] hover:text-[#94a3b8] hover:bg-[#161b26]'
              }`
            }
          >
            <Icon size={15} className="shrink-0" />
            {!collapsed && <span className="whitespace-nowrap">{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Officer status */}
      {!collapsed && (
        <div className="px-3.5 py-3 border-t border-[#1e293b]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#1e293b] flex items-center justify-center text-[10px] font-bold text-[#7c3aed]">RD</div>
            <div>
              <div className="text-[10px] font-semibold text-[#cbd5e1]">R. Deshmukh</div>
              <div className="text-[9px] text-[#475569]">Investigation Officer</div>
            </div>
            <Circle size={7} className="ml-auto fill-[#22c55e] text-[#22c55e]" />
          </div>
        </div>
      )}

      {/* Collapse toggle */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-16 w-6 h-6 rounded-full bg-[#1e293b] border border-[#2d3748] flex items-center justify-center text-[#64748b] hover:text-[#94a3b8] hover:bg-[#263244] transition-colors z-10"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </aside>
  );
}
