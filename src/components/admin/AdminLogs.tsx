import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { AdminLog } from '../../types';

export const AdminLogs: React.FC = () => {
  const { logs } = useStore();
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  const filteredLogs = logs.filter((log: AdminLog) => {
    if (categoryFilter !== 'all' && log.category !== categoryFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      return (
        log.action.toLowerCase().includes(q) ||
        (log.details || '').toLowerCase().includes(q) ||
        log.adminEmail.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'file':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'user':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'settings':
        return 'bg-amber-400/20 text-amber-300 border-amber-400/30';
      case 'security':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      case 'ad':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      default:
        return 'bg-neutral-800 text-neutral-300 border-neutral-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide">
            Admin Activity Audit Log
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400">
            Chronological audit trail of all management, security, and content updates.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 text-xs font-bold">
            Total Records: <span className="text-amber-400">{logs.length}</span>
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800/80 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 text-xs"></i>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search action or details..."
            className="w-full pl-9 pr-4 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-500 focus:border-amber-400 outline-none"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="w-full sm:w-auto px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-neutral-300 focus:border-amber-400 outline-none font-semibold"
        >
          <option value="all">All Categories</option>
          <option value="file">File Store</option>
          <option value="user">User Management</option>
          <option value="settings">Site Settings</option>
          <option value="security">Security</option>
          <option value="ad">Ads & Monetization</option>
        </select>
      </div>

      {/* Logs Timeline */}
      <div className="rounded-2xl bg-neutral-950 border border-neutral-800 divide-y divide-neutral-850 overflow-hidden shadow-xl">
        {filteredLogs.length > 0 ? (
          filteredLogs.map((log: AdminLog) => (
            <div key={log.id} className="p-4 flex items-start justify-between gap-3 hover:bg-neutral-900/40 transition">
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 text-amber-400 flex items-center justify-center text-xs shrink-0 mt-0.5">
                  <i className="fa-solid fa-bolt-lightning"></i>
                </div>
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-[10px] uppercase font-extrabold px-2 py-0.5 rounded border ${getCategoryBadge(
                        log.category
                      )}`}
                    >
                      {log.category}
                    </span>
                    <h4 className="text-xs font-bold text-white">{log.action}</h4>
                  </div>
                  {log.details && (
                    <p className="text-[11px] text-neutral-400 break-words leading-relaxed">
                      {log.details}
                    </p>
                  )}
                  <p className="text-[10px] text-neutral-500">
                    By <span className="text-neutral-300 font-medium">{log.adminEmail}</span>
                  </p>
                </div>
              </div>

              <span className="text-[10px] text-neutral-500 shrink-0 whitespace-nowrap pl-2">
                {new Date(log.timestamp).toLocaleString()}
              </span>
            </div>
          ))
        ) : (
          <div className="p-12 text-center text-neutral-500">
            <i className="fa-solid fa-clock-rotate-left text-3xl mb-2 block text-neutral-600"></i>
            <p className="text-xs">No activity logs match your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};
