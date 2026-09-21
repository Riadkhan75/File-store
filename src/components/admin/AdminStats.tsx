import React from 'react';
import { useStore } from '../../context/StoreContext';

export const AdminStats: React.FC = () => {
  const { files, categories, users } = useStore();

  const totalClicks = files.reduce((sum, f) => sum + (f.clicks || 0), 0);
  const totalViews = files.reduce((sum, f) => sum + (f.views || 0), 0);
  const activeFiles = files.filter((f) => f.status === 'active');
  const avgClicks = files.length ? Math.round(totalClicks / files.length) : 0;
  const conversionRate = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : '100';

  // Category clicks distribution
  const catStats = categories.map((cat) => {
    const catFiles = files.filter((f) => f.categoryId === cat.id);
    const clicks = catFiles.reduce((sum, f) => sum + (f.clicks || 0), 0);
    return {
      name: cat.name,
      filesCount: catFiles.length,
      clicks,
      pct: totalClicks > 0 ? Math.round((clicks / totalClicks) * 100) : 0,
    };
  });

  const exportCSV = () => {
    const headers = ['File Name', 'Category', 'Size', 'Clicks', 'Views', 'Status', 'URL', 'Created At'];
    const rows = files.map((f) => [
      `"${f.name.replace(/"/g, '""')}"`,
      `"${(f.categoryName || '').replace(/"/g, '""')}"`,
      `"${f.fileSize || 'N/A'}"`,
      f.clicks,
      f.views || 0,
      f.status,
      `"${f.url.replace(/"/g, '""')}"`,
      f.createdAt || '',
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `store_analytics_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="admin-stats-section" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white uppercase tracking-wider flex items-center gap-2">
            <i className="fa-solid fa-chart-line text-amber-400"></i>
            <span>Traffic & Download Analytics</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Real-time telemetry on user downloads, conversion rates, and category popularity.
          </p>
        </div>

        <button
          onClick={exportCSV}
          className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-bold transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <i className="fa-solid fa-file-arrow-down text-amber-400"></i>
          <span>Export Analytics CSV</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800">
          <span className="text-[11px] uppercase tracking-wider font-bold text-neutral-400">
            Total Downloads
          </span>
          <div className="text-2xl sm:text-3xl font-black text-amber-400 mt-1">
            {totalClicks.toLocaleString()}
          </div>
          <p className="text-[10px] text-neutral-500 mt-1">Across all public files</p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800">
          <span className="text-[11px] uppercase tracking-wider font-bold text-neutral-400">
            Total Page & Modal Views
          </span>
          <div className="text-2xl sm:text-3xl font-black text-white mt-1">
            {totalViews.toLocaleString()}
          </div>
          <p className="text-[10px] text-neutral-500 mt-1">File interest impressions</p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800">
          <span className="text-[11px] uppercase tracking-wider font-bold text-neutral-400">
            Conversion Rate
          </span>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1">
            {conversionRate}%
          </div>
          <p className="text-[10px] text-neutral-500 mt-1">Downloads per view</p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800">
          <span className="text-[11px] uppercase tracking-wider font-bold text-neutral-400">
            Avg Clicks Per File
          </span>
          <div className="text-2xl sm:text-3xl font-black text-white mt-1">
            {avgClicks.toLocaleString()}
          </div>
          <p className="text-[10px] text-neutral-500 mt-1">{activeFiles.length} active files</p>
        </div>
      </div>

      {/* Category Performance Bars */}
      <div className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-3">
        <h3 className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
          Downloads by Category
        </h3>
        <div className="space-y-3">
          {catStats.map((c) => (
            <div key={c.name} className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-neutral-300">
                  {c.name} ({c.filesCount} files)
                </span>
                <span className="text-amber-400 font-bold font-mono">
                  {c.clicks.toLocaleString()} clicks ({c.pct}%)
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-neutral-950 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(c.pct, 4)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Click Table */}
      <div className="rounded-2xl bg-neutral-900/80 border border-neutral-800 overflow-hidden">
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
          <h3 className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
            All Files Performance Ledger
          </h3>
          <span className="text-xs text-neutral-500">{files.length} items logged</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-neutral-800/80 bg-neutral-950 text-neutral-400 uppercase tracking-wider text-[10px]">
                <th className="p-3 pl-4">File Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">Size</th>
                <th className="p-3">Status</th>
                <th className="p-3">Views</th>
                <th className="p-3 pr-4 text-right">Downloads</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              {[...files]
                .sort((a, b) => (b.clicks || 0) - (a.clicks || 0))
                .map((file) => (
                  <tr key={file.id} className="hover:bg-neutral-850/40 transition-colors">
                    <td className="p-3 pl-4">
                      <div className="flex items-center gap-2.5">
                        <i className={`${file.icon || 'fa-solid fa-download'} text-amber-400 text-xs`}></i>
                        <span className="font-bold text-white break-words max-w-sm" title={file.name}>{file.name}</span>
                      </div>
                    </td>
                    <td className="p-3 text-neutral-300">
                      {file.categoryName ? (
                        <span className="px-2 py-0.5 rounded bg-neutral-800 text-[10px] font-semibold">
                          {file.categoryName}
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="p-3 text-neutral-400 text-[11px]">
                      {file.fileSize || '—'}
                    </td>
                    <td className="p-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          file.status === 'active'
                            ? 'bg-emerald-950 text-emerald-400'
                            : 'bg-neutral-800 text-neutral-400'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            file.status === 'active' ? 'bg-emerald-400' : 'bg-neutral-500'
                          }`}
                        ></span>
                        {file.status}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-neutral-400 text-xs">
                      {(file.views || 0).toLocaleString()}
                    </td>
                    <td className="p-3 pr-4 text-right font-bold text-amber-400 font-mono text-xs">
                      {file.clicks.toLocaleString()}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
