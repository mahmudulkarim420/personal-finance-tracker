"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  ShieldOff,
  Trash2,
  AlertTriangle,
  ArrowUpDown,
  Hash,
  X,
  Loader2,
} from "lucide-react";
import { toggleUserRole, deleteUser, type AdminUser } from "@/actions/admin";

// ─── Confirmation Modal ───────────────────────────────────────────────────────
function ConfirmModal({
  title,
  description,
  confirmLabel,
  danger,
  onConfirm,
  onCancel,
  loading,
}: {
  title: string;
  description: string;
  confirmLabel: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={!loading ? onCancel : undefined}
      />
      {/* Panel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: -10 }}
        transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-sm overflow-hidden rounded-[20px] border border-white/10 bg-[#0D0D0D]/95 p-6 shadow-[0_32px_100px_rgba(0,0,0,0.6)] backdrop-blur-2xl"
      >
        <button
          onClick={onCancel}
          disabled={loading}
          className="absolute right-4 top-4 rounded-lg p-1 text-neutral-600 hover:bg-white/5 hover:text-neutral-300 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mb-5 flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-2xl border ${
              danger ? "border-red-500/25 bg-red-500/10" : "border-amber-500/25 bg-amber-500/10"
            }`}
          >
            <AlertTriangle
              className={`h-5 w-5 ${danger ? "text-red-400" : "text-amber-400"}`}
              strokeWidth={1.5}
            />
          </div>
          <h3 className="text-[15px] font-semibold text-white">{title}</h3>
        </div>
        <p className="mb-6 text-[13px] leading-relaxed text-neutral-500">{description}</p>

        <div className="flex gap-2">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 rounded-xl border border-white/10 bg-white/5 py-2.5 text-[13px] font-medium text-neutral-300 transition-colors hover:bg-white/8 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-[13px] font-semibold transition-all disabled:opacity-60 ${
              danger
                ? "bg-red-500/15 text-red-400 border border-red-500/25 hover:bg-red-500/25"
                : "bg-amber-500/15 text-amber-400 border border-amber-500/25 hover:bg-amber-500/25"
            }`}
          >
            {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Role Badge ───────────────────────────────────────────────────────────────
function RoleBadge({ role }: { role: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
        role === "admin"
          ? "bg-purple-500/10 text-purple-400 ring-1 ring-purple-500/25"
          : "bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/25"
      }`}
    >
      {role === "admin" ? (
        <Shield className="h-2.5 w-2.5" strokeWidth={2} />
      ) : (
        <Hash className="h-2.5 w-2.5" strokeWidth={2} />
      )}
      {role === "admin" ? "Admin" : "User"}
    </span>
  );
}

// ─── Main Table ───────────────────────────────────────────────────────────────
export default function UserTable({ initialUsers }: { initialUsers: AdminUser[] }) {
  const [users, setUsers] = useState<AdminUser[]>(initialUsers);
  const [query, setQuery] = useState("");
  const [pending, startTransition] = useTransition();

  // Modal state
  const [modal, setModal] = useState<{
    type: "toggle" | "delete";
    user: AdminUser;
  } | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  function showToast(msg: string, ok: boolean) {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  }

  const filtered = users.filter(
    (u) =>
      u.email.toLowerCase().includes(query.toLowerCase()) ||
      u.role.toLowerCase().includes(query.toLowerCase()),
  );

  async function confirmAction() {
    if (!modal) return;
    setModalLoading(true);

    if (modal.type === "toggle") {
      const res = await toggleUserRole(modal.user.id, modal.user.role);
      if (res.success) {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === modal.user.id ? { ...u, role: u.role === "admin" ? "user" : "admin" } : u,
          ),
        );
        showToast(`Role updated for ${modal.user.email}`, true);
      } else {
        showToast(res.error ?? "Failed", false);
      }
    } else {
      const res = await deleteUser(modal.user.id);
      if (res.success) {
        setUsers((prev) => prev.filter((u) => u.id !== modal.user.id));
        showToast(`${modal.user.email} deleted`, true);
      } else {
        showToast(res.error ?? "Failed", false);
      }
    }

    setModalLoading(false);
    setModal(null);
  }

  return (
    <>
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className={`fixed bottom-6 right-6 z-[9999] flex items-center gap-2 rounded-xl border px-4 py-3 text-[13px] font-medium shadow-xl backdrop-blur-xl ${
              toast.ok
                ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-400"
                : "border-red-500/25 bg-red-500/10 text-red-400"
            }`}
          >
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal */}
      <AnimatePresence>
        {modal && (
          <ConfirmModal
            key="confirm"
            title={
              modal.type === "delete"
                ? "Delete User"
                : modal.user.role === "admin"
                  ? "Demote to User"
                  : "Promote to Admin"
            }
            description={
              modal.type === "delete"
                ? `This will permanently delete ${modal.user.email} and all their data. This cannot be undone.`
                : modal.user.role === "admin"
                  ? `${modal.user.email} will lose all admin privileges.`
                  : `${modal.user.email} will gain full admin access to the platform.`
            }
            confirmLabel={
              modal.type === "delete"
                ? "Delete permanently"
                : modal.user.role === "admin"
                  ? "Demote to User"
                  : "Promote to Admin"
            }
            danger={modal.type === "delete"}
            onConfirm={confirmAction}
            onCancel={() => !modalLoading && setModal(null)}
            loading={modalLoading}
          />
        )}
      </AnimatePresence>

      {/* Search */}
      <div className="mb-6 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-xl">
        <ArrowUpDown className="h-4 w-4 shrink-0 text-neutral-500" strokeWidth={1.5} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter by email or role..."
          className="flex-1 bg-transparent text-sm text-neutral-300 placeholder:text-neutral-600 outline-none"
        />
        {query && (
          <button onClick={() => setQuery("")} className="text-neutral-500 hover:text-neutral-300">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead className="border-b border-white/5 bg-white/5">
              <tr>
                <th className="px-4 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-neutral-500 sm:px-5 lg:px-6">
                  User
                </th>
                <th className="px-4 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-neutral-500 sm:px-5 lg:px-6">
                  Role
                </th>
                <th className="hidden px-4 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-neutral-500 sm:table-cell sm:px-5 lg:px-6">
                  Joined
                </th>
                <th className="hidden px-4 py-4 text-center text-[11px] font-bold uppercase tracking-wider text-neutral-500 md:table-cell sm:px-5 lg:px-6">
                  Transactions
                </th>
                <th className="px-4 py-4 text-right text-[11px] font-bold uppercase tracking-wider text-neutral-500 sm:px-5 lg:px-6">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-sm text-neutral-600">
                    No users found
                  </td>
                </tr>
              )}
              {filtered.map((user) => {
                const initials = user.email.slice(0, 2).toUpperCase();
                const joinedDate = new Date(user.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });
                return (
                  <tr key={user.id} className="group transition-colors hover:bg-white/5">
                    {/* User */}
                    <td className="px-4 py-4 sm:px-5 lg:px-6">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-xs font-bold text-neutral-300">
                          {initials}
                        </div>
                        <span className="max-w-[120px] truncate text-sm text-neutral-300 sm:max-w-[160px] lg:max-w-[200px]">
                          {user.email}
                        </span>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="px-4 py-4 sm:px-5 lg:px-6">
                      <RoleBadge role={user.role} />
                    </td>

                    {/* Joined - Hidden on mobile */}
                    <td className="hidden px-4 py-4 text-sm text-neutral-500 tabular-nums sm:table-cell sm:px-5 lg:px-6">
                      {joinedDate}
                    </td>

                    {/* Txn count - Hidden on mobile/tablet */}
                    <td className="hidden px-4 py-4 text-center md:table-cell sm:px-5 lg:px-6">
                      <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/5 px-2.5 py-1 text-sm font-medium text-neutral-400 tabular-nums">
                        {user.transactionCount}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-4 sm:px-5 lg:px-6">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setModal({ type: "toggle", user })}
                          title={user.role === "admin" ? "Demote to User" : "Promote to Admin"}
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-neutral-400 transition-all hover:border-purple-500/30 hover:bg-purple-500/10 hover:text-purple-400 sm:h-auto sm:w-auto sm:gap-1.5 sm:px-3 sm:py-2 sm:text-xs"
                        >
                          {user.role === "admin" ? (
                            <ShieldOff className="h-4 w-4 sm:h-3.5 sm:w-3.5" strokeWidth={1.5} />
                          ) : (
                            <Shield className="h-4 w-4 sm:h-3.5 sm:w-3.5" strokeWidth={1.5} />
                          )}
                          <span className="hidden sm:inline">
                            {user.role === "admin" ? "Demote" : "Promote"}
                          </span>
                        </button>

                        <button
                          onClick={() => setModal({ type: "delete", user })}
                          title="Delete user"
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-neutral-400 transition-all hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400 sm:h-auto sm:w-auto sm:gap-1.5 sm:px-3 sm:py-2 sm:text-xs"
                        >
                          <Trash2 className="h-4 w-4 sm:h-3.5 sm:w-3.5" strokeWidth={1.5} />
                          <span className="hidden sm:inline">Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filtered.length > 0 && (
          <div className="border-t border-white/5 bg-white/5 px-4 py-3 text-xs text-neutral-500 sm:px-5">
            {filtered.length} user{filtered.length !== 1 ? "s" : ""}
            {query && ` matching "${query}"`}
          </div>
        )}
      </div>
    </>
  );
}
