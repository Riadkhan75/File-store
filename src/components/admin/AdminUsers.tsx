import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { UserProfile } from '../../types';

export const AdminUsers: React.FC = () => {
  const { users, updateUserRole, updateUserStatus } = useStore();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'vip' | 'user'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'blocked'>('all');

  // Blocking modal state
  const [targetUserForBlock, setTargetUserForBlock] = useState<UserProfile | null>(null);
  const [blockReasonInput, setBlockReasonInput] = useState('');
  const [processingUid, setProcessingUid] = useState<string | null>(null);

  const filteredUsers = users.filter((u) => {
    if (roleFilter !== 'all' && u.role !== roleFilter) return false;
    if (statusFilter !== 'all' && u.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      const matchEmail = (u.email || '').toLowerCase().includes(q);
      const matchName = (u.displayName || '').toLowerCase().includes(q);
      return matchEmail || matchName;
    }
    return true;
  });

  const handleToggleBlockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUserForBlock) return;
    setProcessingUid(targetUserForBlock.uid);
    try {
      await updateUserStatus(
        targetUserForBlock.uid,
        targetUserForBlock.status === 'blocked' ? 'active' : 'blocked',
        blockReasonInput
      );
      setTargetUserForBlock(null);
      setBlockReasonInput('');
    } catch (err) {
      console.error(err);
    } finally {
      setProcessingUid(null);
    }
  };

  const handleRoleChange = async (uid: string, newRole: 'user' | 'vip' | 'admin') => {
    setProcessingUid(uid);
    try {
      await updateUserRole(uid, newRole);
    } catch (err) {
      console.error(err);
    } finally {
      setProcessingUid(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide">
            User Directory & Access Control
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400">
            Manage registered Google users, grant VIP memberships, or block fraudulent activity.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 text-xs font-bold">
            Total Users: <span className="text-amber-400">{users.length}</span>
          </span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800/80 flex flex-col md:flex-row items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 text-xs"></i>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email address..."
            className="w-full pl-9 pr-4 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-500 focus:border-amber-400 outline-none"
          />
        </div>

        {/* Role Filter */}
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as any)}
          className="w-full md:w-auto px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-neutral-300 focus:border-amber-400 outline-none font-semibold"
        >
          <option value="all">All Roles</option>
          <option value="admin">Admins</option>
          <option value="vip">VIP Members</option>
          <option value="user">Free Members</option>
        </select>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="w-full md:w-auto px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-neutral-300 focus:border-amber-400 outline-none font-semibold"
        >
          <option value="all">All Statuses</option>
          <option value="active">Active Only</option>
          <option value="blocked">Blocked Only</option>
        </select>
      </div>

      {/* Users Table / Grid */}
      <div className="rounded-2xl bg-neutral-950 border border-neutral-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="bg-neutral-900/80 text-neutral-400 uppercase tracking-wider text-[10px] font-bold border-b border-neutral-800">
              <tr>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Downloads</th>
                <th className="py-3 px-4">Last Login</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-850">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((u) => {
                  const isBusy = processingUid === u.uid;
                  return (
                    <tr key={u.uid} className="hover:bg-neutral-900/40 transition">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          {u.photoURL ? (
                            <img
                              src={u.photoURL}
                              alt=""
                              className="w-8 h-8 rounded-full object-cover border border-neutral-800"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-amber-400/20 text-amber-400 font-bold flex items-center justify-center text-xs">
                              {(u.displayName || u.email || 'U')[0].toUpperCase()}
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="font-bold text-white truncate max-w-[160px]">
                              {u.displayName || 'No Name'}
                            </p>
                            <p className="text-[11px] text-neutral-400 truncate max-w-[180px]">
                              {u.email || u.uid}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Role Dropdown */}
                      <td className="py-3 px-4">
                        {u.email?.toLowerCase() === 'banglag215@gmail.com' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-400 text-black text-[11px] font-black tracking-wide border border-amber-400 shadow-sm">
                            <i className="fa-solid fa-crown text-[10px]"></i>
                            Sole Admin
                          </span>
                        ) : (
                          <select
                            disabled={isBusy}
                            value={u.role === 'admin' ? 'vip' : (u.role || 'user')}
                            onChange={(e) =>
                              handleRoleChange(u.uid, e.target.value as 'user' | 'vip')
                            }
                            className={`px-2 py-1 rounded-lg text-[11px] font-bold border outline-none cursor-pointer ${
                              u.role === 'vip'
                                ? 'bg-amber-400 text-black border-amber-400 font-black'
                                : 'bg-neutral-900 border-neutral-800 text-neutral-400'
                            }`}
                          >
                            <option value="user">Free User</option>
                            <option value="vip">VIP Member</option>
                          </select>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        {u.status === 'blocked' ? (
                          <span
                            title={u.blockedReason || 'Blocked'}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold"
                          >
                            <i className="fa-solid fa-ban text-[9px]"></i>
                            Blocked
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                            <i className="fa-solid fa-check text-[9px]"></i>
                            Active
                          </span>
                        )}
                      </td>

                      {/* Downloads */}
                      <td className="py-3 px-4 font-semibold text-neutral-200">
                        {u.downloadCount || 0}
                      </td>

                      {/* Last Login */}
                      <td className="py-3 px-4 text-[11px] text-neutral-500">
                        {u.lastLoginAt
                          ? new Date(u.lastLoginAt).toLocaleDateString()
                          : 'Recent'}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <button
                          disabled={isBusy}
                          onClick={() => {
                            setTargetUserForBlock(u);
                            setBlockReasonInput(u.blockedReason || '');
                          }}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition border ${
                            u.status === 'blocked'
                              ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30'
                              : 'bg-rose-500/10 border-rose-500/30 text-rose-300 hover:bg-rose-500/20'
                          }`}
                        >
                          {u.status === 'blocked' ? 'Unblock' : 'Block'}
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-neutral-500">
                    <i className="fa-solid fa-users text-3xl mb-2 block text-neutral-600"></i>
                    No users match current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Block / Unblock Prompt Modal */}
      {targetUserForBlock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div
            className="w-full max-w-sm rounded-2xl bg-neutral-900 border border-neutral-800 p-5 shadow-2xl text-white space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2.5">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm ${
                  targetUserForBlock.status === 'blocked'
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-rose-500/20 text-rose-400'
                }`}
              >
                <i
                  className={
                    targetUserForBlock.status === 'blocked'
                      ? 'fa-solid fa-lock-open'
                      : 'fa-solid fa-ban'
                  }
                ></i>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">
                  {targetUserForBlock.status === 'blocked' ? 'Unblock User' : 'Block User'}
                </h3>
                <p className="text-xs text-neutral-400 truncate max-w-[200px]">
                  {targetUserForBlock.email || targetUserForBlock.displayName}
                </p>
              </div>
            </div>

            {targetUserForBlock.status !== 'blocked' && (
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Reason for restriction:
                </label>
                <input
                  type="text"
                  value={blockReasonInput}
                  onChange={(e) => setBlockReasonInput(e.target.value)}
                  placeholder="e.g. Excessive automated scraping, chargeback..."
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white focus:border-amber-400 outline-none"
                />
              </div>
            )}

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setTargetUserForBlock(null)}
                className="flex-1 py-2 rounded-xl bg-neutral-800 text-xs font-semibold text-neutral-300 hover:bg-neutral-700 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleToggleBlockSubmit}
                className={`flex-1 py-2 rounded-xl text-xs font-extrabold transition ${
                  targetUserForBlock.status === 'blocked'
                    ? 'bg-emerald-400 text-black shadow hover:bg-emerald-300'
                    : 'bg-rose-500 text-white shadow hover:bg-rose-600'
                }`}
              >
                {targetUserForBlock.status === 'blocked' ? 'Confirm Unblock' : 'Confirm Block'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
