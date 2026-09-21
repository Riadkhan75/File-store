import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { BrokenLinkReport } from '../../types';

export const AdminReports: React.FC = () => {
  const { reports, updateReportStatus, files } = useStore();
  const [filter, setFilter] = useState<'all' | 'pending' | 'resolved' | 'dismissed'>('all');

  const filteredReports = reports.filter((r) => {
    if (filter === 'all') return true;
    return r.status === filter;
  });

  const handleStatusChange = async (id: string, status: 'pending' | 'resolved' | 'dismissed') => {
    try {
      await updateReportStatus(id, status);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide">
            Broken Link Reports
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400">
            Reports submitted by community members experiencing dead or slow downloads.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="inline-flex rounded-xl bg-neutral-900 border border-neutral-800 p-1 text-xs font-bold">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition ${
              filter === 'all'
                ? 'bg-amber-400 text-black shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            All ({reports.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1.5 rounded-lg transition ${
              filter === 'pending'
                ? 'bg-amber-400 text-black shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Pending ({reports.filter((r) => r.status === 'pending').length})
          </button>
          <button
            onClick={() => setFilter('resolved')}
            className={`px-3 py-1.5 rounded-lg transition ${
              filter === 'resolved'
                ? 'bg-amber-400 text-black shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Resolved ({reports.filter((r) => r.status === 'resolved').length})
          </button>
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-3">
        {filteredReports.length > 0 ? (
          filteredReports.map((report) => {
            const relatedFile = files.find((f) => f.id === report.fileId);

            return (
              <div
                key={report.id}
                className="p-4 sm:p-5 rounded-2xl bg-neutral-950 border border-neutral-800 hover:border-neutral-700 transition space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold ${
                        report.status === 'pending'
                          ? 'bg-amber-400/20 text-amber-400 border border-amber-400/30'
                          : report.status === 'resolved'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-neutral-800 text-neutral-400'
                      }`}
                    >
                      <i
                        className={
                          report.status === 'resolved'
                            ? 'fa-solid fa-check'
                            : 'fa-solid fa-triangle-exclamation'
                        }
                      ></i>
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <span>{report.fileName}</span>
                        {relatedFile && (
                          <span className="text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded bg-amber-400/10 text-amber-300">
                            {relatedFile.categoryName || 'In Store'}
                          </span>
                        )}
                      </h4>
                      <p className="text-[11px] text-neutral-400">
                        Reported by <span className="text-neutral-200">{report.userEmail || 'Guest'}</span> •{' '}
                        {new Date(report.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Status buttons */}
                  <div className="flex items-center gap-1.5 self-end sm:self-center">
                    <button
                      onClick={() => handleStatusChange(report.id, 'resolved')}
                      disabled={report.status === 'resolved'}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                        report.status === 'resolved'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 opacity-70 cursor-default'
                          : 'bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-black border border-emerald-500/40'
                      }`}
                    >
                      <i className="fa-solid fa-check"></i>
                      <span>Mark Resolved</span>
                    </button>

                    <button
                      onClick={() => handleStatusChange(report.id, 'dismissed')}
                      disabled={report.status === 'dismissed'}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                        report.status === 'dismissed'
                          ? 'bg-neutral-800 text-neutral-500 cursor-default'
                          : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800'
                      }`}
                    >
                      <i className="fa-solid fa-xmark"></i>
                      <span>Dismiss</span>
                    </button>
                  </div>
                </div>

                {/* Report Reason & Details */}
                <div className="p-3 rounded-xl bg-neutral-900/70 border border-neutral-850 text-xs space-y-1">
                  <div className="flex items-center gap-2 text-amber-300 font-bold">
                    <i className="fa-solid fa-circle-exclamation text-[11px]"></i>
                    <span>Reason: {report.reason}</span>
                  </div>
                  {report.details && (
                    <p className="text-neutral-300 text-[11px] pl-4">
                      "{report.details}"
                    </p>
                  )}
                </div>

                {/* Direct Link Preview & Test */}
                {relatedFile && (
                  <div className="flex items-center justify-between text-xs text-neutral-400 pt-1">
                    <span className="truncate max-w-[280px] sm:max-w-md text-[11px]">
                      Target URL: <span className="text-neutral-300 font-mono">{relatedFile.url}</span>
                    </span>
                    <a
                      href={relatedFile.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-400 hover:underline flex items-center gap-1 shrink-0 font-semibold"
                    >
                      <span>Test Link</span>
                      <i className="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                    </a>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="p-12 text-center rounded-2xl bg-neutral-950 border border-neutral-800 text-neutral-500">
            <i className="fa-solid fa-circle-check text-4xl mb-2 block text-emerald-500/70"></i>
            <p className="text-sm font-bold text-neutral-300">All links healthy!</p>
            <p className="text-xs text-neutral-500">No unresolved broken link reports found.</p>
          </div>
        )}
      </div>
    </div>
  );
};
