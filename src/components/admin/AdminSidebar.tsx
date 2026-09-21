import React from 'react';
import { AdminTab } from '../../types';
import { useStore } from '../../context/StoreContext';

interface AdminSidebarProps {
  currentTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  onLogout: () => void;
  onViewStore: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

interface NavGroup {
  groupTitle: string;
  items: {
    id: AdminTab;
    label: string;
    icon: string;
    badgeCount?: number;
  }[];
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentTab,
  onSelectTab,
  onLogout,
  onViewStore,
  isMobileOpen,
  onCloseMobile,
}) => {
  const { reports, files, users } = useStore();
  const pendingReportsCount = reports.filter((r) => r.status === 'pending').length;

  const NAV_GROUPS: NavGroup[] = [
    {
      groupTitle: 'Core Management',
      items: [
        { id: 'overview', label: 'Dashboard', icon: 'fa-solid fa-gauge-high' },
        { id: 'files', label: 'File Store', icon: 'fa-solid fa-folder-tree', badgeCount: files.length },
        { id: 'categories', label: 'Categories', icon: 'fa-solid fa-tags' },
        { id: 'users', label: 'User Directory', icon: 'fa-solid fa-users', badgeCount: users.length },
        { id: 'reports', label: 'Broken Links', icon: 'fa-solid fa-triangle-exclamation', badgeCount: pendingReportsCount },
      ],
    },
    {
      groupTitle: 'Growth & Content',
      items: [
        { id: 'banner', label: 'Banner & Broadcast', icon: 'fa-solid fa-bullhorn' },
        { id: 'social', label: 'Social Handles', icon: 'fa-solid fa-share-nodes' },
        { id: 'monetization', label: 'Monetization & Ads', icon: 'fa-solid fa-sack-dollar' },
      ],
    },
    {
      groupTitle: 'System & Security',
      items: [
        { id: 'settings', label: 'Site Settings', icon: 'fa-solid fa-sliders' },
        { id: 'branding', label: 'Logo & Identity', icon: 'fa-solid fa-image' },
        { id: 'appearance', label: 'Design & Colors', icon: 'fa-solid fa-palette' },
        { id: 'stats', label: 'Analytics & Traffic', icon: 'fa-solid fa-chart-line' },
        { id: 'logs', label: 'Activity Logs', icon: 'fa-solid fa-clock-rotate-left' },
        { id: 'backup', label: 'Backup & Restore', icon: 'fa-solid fa-database' },
        { id: 'account', label: 'Admin Security', icon: 'fa-solid fa-shield-halved' },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        id="admin-sidebar"
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-neutral-950 border-r border-neutral-800/80 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-400/20 border border-amber-400/50 flex items-center justify-center text-amber-400">
              <i className="fa-solid fa-crown text-sm"></i>
            </div>
            <div>
              <h2 className="text-sm font-black text-white tracking-wide uppercase">Admin Studio</h2>
              <p className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider">
                Store Manager
              </p>
            </div>
          </div>
          {/* Close button on mobile */}
          <button
            onClick={onCloseMobile}
            className="lg:hidden text-neutral-400 hover:text-white p-1"
          >
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        {/* Navigation Groups List */}
        <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-4 no-scrollbar">
          {NAV_GROUPS.map((group, gIdx) => (
            <div key={gIdx}>
              <div className="px-3 mb-1.5 text-[10px] uppercase font-extrabold tracking-wider text-neutral-500">
                {group.groupTitle}
              </div>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      id={`nav-${item.id}`}
                      onClick={() => {
                        onSelectTab(item.id);
                        onCloseMobile();
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer ${
                        isActive
                          ? 'bg-amber-400 text-black shadow-md shadow-amber-400/25'
                          : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <i
                          className={`${item.icon} text-xs w-4 text-center ${
                            isActive ? 'text-black' : 'text-amber-400/80'
                          }`}
                        ></i>
                        <span className="truncate">{item.label}</span>
                      </div>

                      {typeof item.badgeCount === 'number' && item.badgeCount > 0 && (
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                            isActive
                              ? 'bg-black/20 text-black'
                              : item.id === 'reports'
                              ? 'bg-rose-500 text-white'
                              : 'bg-neutral-800 text-neutral-300'
                          }`}
                        >
                          {item.badgeCount}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Quick Actions Footer */}
        <div className="p-3 border-t border-neutral-800/80 space-y-2">
          {/* View Live Store */}
          <button
            onClick={onViewStore}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-amber-400/50 text-neutral-200 hover:text-amber-300 text-xs font-bold transition-all"
          >
            <i className="fa-solid fa-arrow-up-right-from-square text-xs"></i>
            <span>View Public Store</span>
          </button>

          {/* Logout */}
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-900/40 text-red-300 hover:text-red-100 text-xs font-bold transition-all"
          >
            <i className="fa-solid fa-arrow-right-from-bracket text-xs"></i>
            <span>Log Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
