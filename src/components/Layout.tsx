import { useState } from 'react';
import { Outlet } from 'react-router';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import SafetyBanner from './SafetyBanner';

export default function Layout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#0d1117]">
      <SafetyBanner />
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop sidebar */}
        <div className="hidden md:flex">
          <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
        </div>

        {/* Mobile drawer */}
        {mobileOpen && (
          <>
            <div className="fixed inset-0 bg-black/60 z-30 md:hidden" onClick={() => setMobileOpen(false)} />
            <div className="fixed left-0 top-0 bottom-0 z-40 md:hidden">
              <Sidebar collapsed={false} onToggle={() => setMobileOpen(false)} />
            </div>
          </>
        )}

        {/* Main */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopBar onMenuClick={() => setMobileOpen(!mobileOpen)} />
          <main className="flex-1 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
