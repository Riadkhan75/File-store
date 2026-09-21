import React from 'react';
import { useStore } from '../../context/StoreContext';
import { AdminTab } from '../../types';

interface AdminOverviewProps {
  onNavigateTab: (tab: AdminTab) => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({ onNavigateTab }) => {
  const { settings, files, categories, users, reports, updateSettings } = useStore();

  const totalFiles = files.length;
  const activeFiles = files.filter((f) => f.status === 'active').length;
  const totalCategories = categories.length;
  const totalClicks = files.reduce((acc, f) => acc + (f.clicks || 0), 0);
  const totalViews = files.reduce((acc, f) => acc + (f.views || 0), 0);
  const pendingReports = reports.filter((r) => r.status === 'pending').length;
  const totalUsers = users.length;
  const vipUsers = users.filter((u) => u.role === 'vip').length;

  // Top files by clicks
  const topFiles = [...files].sort((a, b) => (b.clicks || 0) - (a.clicks || 0)).slice(0, 5);

  const toggleStatus = async () => {
    const nextStatus = settings.websiteStatus === 'live' ? 'maintenance' : 'live';
    await updateSettings({ websiteStatus: nextStatus });
  };

  return (
    <div id="admin-overview" className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-neutral-900 via-neutral-900/90 to-amber-950/30 border border-amber-400/30 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-400/10 text-amber-400 text-xs font-semibold mb-2 border border-amber-400/20">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
            <span>Store Control Center</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wide">
            {settings.storeName || 'My File Store'}
          </h1>
          <p className="text-xs text-neutral-400 mt-1 max-w-xl">
            Real-time control for files, members, broken link reports, banners, and analytics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateTab('files')}
            className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs tracking-wide shadow-md shadow-amber-400/20 active:scale-95 transition-all flex items-center gap-2"
          >
            <i className="fa-solid fa-plus"></i>
            <span>Add New File</span>
          </button>
          <button
            onClick={toggleStatus}
            className={`px-3.5 py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-2 ${
              settings.websiteStatus === 'live'
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/50'
                : 'bg-amber-950/40 border-amber-500/40 text-amber-300 hover:bg-amber-900/50'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                settings.websiteStatus === 'live' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
              }`}
            ></span>
            <span>{settings.websiteStatus === 'live' ? 'Store is Live' : 'Maintenance Mode'}</span>
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {/* Total Files */}
        <div
          onClick={() => onNavigateTab('files')}
          className="p-4 sm:p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 hover:border-amber-400/40 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs uppercase tracking-wider font-bold">Total Files</span>
            <div className="w-8 h-8 rounded-lg bg-amber-400/10 text-amber-400 flex items-center justify-center text-sm">
              <i className="fa-solid fa-folder"></i>
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">{totalFiles}</div>
          <p className="text-[11px] text-neutral-500 mt-1 font-medium">
            <span className="text-emerald-400 font-bold">{activeFiles} active</span> files
          </p>
        </div>

        {/* Realtime Views */}
        <div className="p-4 sm:p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 hover:border-amber-400/40 transition-colors">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs uppercase tracking-wider font-bold flex items-center gap-1.5">
              <span>Realtime Views</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-400/10 text-emerald-400 flex items-center justify-center text-sm">
              <i className="fa-regular fa-eye"></i>
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400">
            {(totalViews || 0).toLocaleString()}
          </div>
          <p className="text-[11px] text-neutral-500 mt-1 font-medium">
            Synced from Firestore DB
          </p>
        </div>

        {/* Total Downloads / Clicks */}
        <div className="p-4 sm:p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 hover:border-amber-400/40 transition-colors">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs uppercase tracking-wider font-bold flex items-center gap-1.5">
              <span>Downloads</span>
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-400/10 text-amber-400 flex items-center justify-center text-sm">
              <i className="fa-solid fa-cloud-arrow-down"></i>
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-400">
            {totalClicks.toLocaleString()}
          </div>
          <p className="text-[11px] text-neutral-500 mt-1 font-medium">
            Live click tracking
          </p>
        </div>

        {/* Registered Users */}
        <div
          onClick={() => onNavigateTab('users')}
          className="p-4 sm:p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 hover:border-amber-400/40 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs uppercase tracking-wider font-bold">Members</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-400/10 text-cyan-400 flex items-center justify-center text-sm">
              <i className="fa-solid fa-users"></i>
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">{totalUsers}</div>
          <p className="text-[11px] text-neutral-500 mt-1 font-medium">
            <span className="text-amber-400 font-bold">{vipUsers} VIP</span> members
          </p>
        </div>

        {/* Broken Link Reports */}
        <div
          onClick={() => onNavigateTab('reports')}
          className="p-4 sm:p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 hover:border-amber-400/40 transition-colors cursor-pointer col-span-2 lg:col-span-1"
        >
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs uppercase tracking-wider font-bold">Link Reports</span>
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${
                pendingReports > 0
                  ? 'bg-rose-500/20 text-rose-400'
                  : 'bg-emerald-500/10 text-emerald-400'
              }`}
            >
              <i
                className={
                  pendingReports > 0
                    ? 'fa-solid fa-triangle-exclamation'
                    : 'fa-solid fa-circle-check'
                }
              ></i>
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">{pendingReports}</div>
          <p className="text-[11px] text-neutral-500 mt-1 font-medium">
            {pendingReports > 0 ? (
              <span className="text-rose-400 font-bold">Requires attention</span>
            ) : (
              <span className="text-emerald-400 font-medium">All links healthy</span>
            )}
          </p>
        </div>
      </div>

      {/* Two Column Section: Top Performers & Quick Navigation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Downloaded Files */}
        <div className="lg:col-span-2 p-5 sm:p-6 rounded-2xl bg-neutral-900/80 border border-neutral-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <i className="fa-solid fa-fire text-amber-400"></i>
              <span>Top Performing Files</span>
            </h3>
            <button
              onClick={() => onNavigateTab('stats')}
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold"
            >
              Full Analytics →
            </button>
          </div>

          {topFiles.length > 0 ? (
            <div className="space-y-2.5">
              {topFiles.map((file, idx) => (
                <div
                  key={file.id}
                  className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800/80 flex items-center justify-between gap-3 hover:border-neutral-700 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-6 h-6 rounded-lg bg-neutral-850 text-neutral-400 text-xs font-bold flex items-center justify-center shrink-0">
                      #{idx + 1}
                    </span>
                    <i className={`${file.icon || 'fa-solid fa-download'} text-amber-400 text-sm shrink-0`}></i>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white break-words leading-tight" title={file.name}>{file.name}</p>
                      <p className="text-[10px] text-neutral-500">{file.categoryName || 'General'}</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-extrabold text-amber-400">
                      {file.clicks.toLocaleString()} downloads
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-neutral-500 py-6 text-center">No files uploaded yet.</p>
          )}
        </div>

        {/* Quick Management Shortlinks */}
        <div className="p-5 sm:p-6 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-2.5">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">
            Quick Actions
          </h3>

          <button
            onClick={() => onNavigateTab('users')}
            className="w-full p-2.5 rounded-xl bg-neutral-950/80 hover:bg-neutral-850 border border-neutral-800 hover:border-amber-400/40 text-left flex items-center justify-between text-xs font-semibold text-neutral-200 transition-all"
          >
            <span className="flex items-center gap-2.5">
              <i className="fa-solid fa-users text-amber-400"></i>
              <span>User Directory & VIPs</span>
            </span>
            <i className="fa-solid fa-chevron-right text-neutral-600 text-[10px]"></i>
          </button>

          <button
            onClick={() => onNavigateTab('banner')}
            className="w-full p-2.5 rounded-xl bg-neutral-950/80 hover:bg-neutral-850 border border-neutral-800 hover:border-amber-400/40 text-left flex items-center justify-between text-xs font-semibold text-neutral-200 transition-all"
          >
            <span className="flex items-center gap-2.5">
              <i className="fa-solid fa-bullhorn text-amber-400"></i>
              <span>Banner & Announcements</span>
            </span>
            <i className="fa-solid fa-chevron-right text-neutral-600 text-[10px]"></i>
          </button>

          <button
            onClick={() => onNavigateTab('monetization')}
            className="w-full p-2.5 rounded-xl bg-neutral-950/80 hover:bg-neutral-850 border border-neutral-800 hover:border-amber-400/40 text-left flex items-center justify-between text-xs font-semibold text-neutral-200 transition-all"
          >
            <span className="flex items-center gap-2.5">
              <i className="fa-solid fa-sack-dollar text-amber-400"></i>
              <span>Monetization & Ads</span>
            </span>
            <i className="fa-solid fa-chevron-right text-neutral-600 text-[10px]"></i>
          </button>

          <button
            onClick={() => onNavigateTab('logs')}
            className="w-full p-2.5 rounded-xl bg-neutral-950/80 hover:bg-neutral-850 border border-neutral-800 hover:border-amber-400/40 text-left flex items-center justify-between text-xs font-semibold text-neutral-200 transition-all"
          >
            <span className="flex items-center gap-2.5">
              <i className="fa-solid fa-clock-rotate-left text-amber-400"></i>
              <span>Activity Audit Logs</span>
            </span>
            <i className="fa-solid fa-chevron-right text-neutral-600 text-[10px]"></i>
          </button>

          <button
            onClick={() => onNavigateTab('backup')}
            className="w-full p-2.5 rounded-xl bg-neutral-950/80 hover:bg-neutral-850 border border-neutral-800 hover:border-amber-400/40 text-left flex items-center justify-between text-xs font-semibold text-neutral-200 transition-all"
          >
            <span className="flex items-center gap-2.5">
              <i className="fa-solid fa-download text-amber-400"></i>
              <span>Export Store Backup</span>
            </span>
            <i className="fa-solid fa-chevron-right text-neutral-600 text-[10px]"></i>
          </button>
        </div>
      </div>
    </div>
  );
};
