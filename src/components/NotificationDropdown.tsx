"use client";

import {
  useEffect,
  useRef,
  useState,
  useTransition,
  useCallback,
} from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  CheckCheck,
  Info,
  AlertTriangle,
  CheckCircle2,
  BellOff,
} from "lucide-react";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  type NotificationRecord,
} from "@/actions/notifications";

function typeIcon(type: string) {
  switch (type) {
    case "SUCCESS":
      return <CheckCircle2 className="h-3.5 w-3.5 text-green-600" strokeWidth={1.5} />;
    case "WARNING":
      return <AlertTriangle className="h-3.5 w-3.5 text-orange-600" strokeWidth={1.5} />;
    default:
      return <Info className="h-3.5 w-3.5 text-primary" strokeWidth={1.5} />;
  }
}

function typeBadge(type: string) {
  switch (type) {
    case "SUCCESS":
      return "border-green-100 bg-green-50";
    case "WARNING":
      return "border-orange-100 bg-orange-50";
    default:
      return "border-slate-100 bg-slate-50";
  }
}

function timeAgo(date: Date) {
  const now = Date.now();
  const diff = now - new Date(date).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "Just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

interface NotificationDropdownProps {
  /** Ref to the bell button — used to position the dropdown below it */
  anchorRef: React.RefObject<HTMLButtonElement | null>;
  isOpen: boolean;
  onClose: () => void;
  onUnreadChange: (hasUnread: boolean) => void;
}

export default function NotificationDropdown({
  anchorRef,
  isOpen,
  onClose,
  onUnreadChange,
}: NotificationDropdownProps) {
  const [notifications, setNotifications] = useState<NotificationRecord[]>([]);
  const [hasFetched, setHasFetched] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [coords, setCoords] = useState({ top: 0, right: 0 });
  const panelRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  // Portal requires the DOM to be available
  useEffect(() => { setMounted(true); }, []);

  // Recalculate position every time the dropdown opens
  useEffect(() => {
    if (!isOpen || !anchorRef.current) return;
    const rect = anchorRef.current.getBoundingClientRect();
    setCoords({
      top: rect.bottom + window.scrollY + 8,
      right: window.innerWidth - rect.right - window.scrollX,
    });
  }, [isOpen, anchorRef]);

  // Fetch notifications when opened
  useEffect(() => {
    if (!isOpen) return;
    startTransition(async () => {
      const res = await getNotifications();
      if (res.success && res.data) {
        setNotifications(res.data);
        onUnreadChange(res.hasUnread ?? false);
      }
      setHasFetched(true);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        !anchorRef.current?.contains(e.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen, onClose, anchorRef]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (isOpen && e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  const handleMarkOne = useCallback(
    async (id: string) => {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      const res = await markAsRead(id);
      if (res.success) {
        const stillUnread = notifications.some((n) => n.id !== id && !n.isRead);
        onUnreadChange(stillUnread);
      }
    },
    [notifications, onUnreadChange]
  );

  const handleMarkAll = useCallback(async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    onUnreadChange(false);
    await markAllAsRead();
  }, [onUnreadChange]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (!mounted) return null;

  const panel = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={panelRef}
          key="notif-panel"
          initial={{ opacity: 0, scale: 0.97, y: -8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: -8 }}
          transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: "fixed",
            top: coords.top,
            right: coords.right,
            zIndex: 9999,
          }}
          className="w-[360px] overflow-hidden rounded-[18px] border border-base-300 bg-base-100 shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-accent/60" strokeWidth={1.5} />
              <span className="text-[13px] font-black text-neutral">Notifications</span>
              {unreadCount > 0 && (
                <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-primary/10 px-1.5 text-[10px] font-bold text-primary ring-1 ring-primary/20">
                  {unreadCount}
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAll}
                className="flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-black text-accent/60 transition-colors hover:bg-base-200 hover:text-primary"
              >
                <CheckCheck className="h-3 w-3" strokeWidth={1.5} />
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <ul className="max-h-[360px] overflow-y-auto overscroll-contain custom-scrollbar">
            {isPending && !hasFetched && (
              <li className="flex flex-col gap-2 px-4 py-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex animate-pulse items-start gap-3 rounded-xl bg-slate-50 p-3"
                  >
                    <div className="h-7 w-7 shrink-0 rounded-lg bg-slate-200" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3 w-3/4 rounded-full bg-slate-200" />
                      <div className="h-2 w-1/3 rounded-full bg-slate-200" />
                    </div>
                  </div>
                ))}
              </li>
            )}

            {hasFetched && notifications.length === 0 && (
              <li className="flex flex-col items-center justify-center gap-3 py-12">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-100 bg-slate-50">
                  <BellOff className="h-5 w-5 text-accent/40" strokeWidth={1.2} />
                </div>
                <p className="text-[13px] text-accent/60 font-black">No new alerts</p>
              </li>
            )}

            {notifications.map((n) => (
              <li key={n.id}>
                <button
                  onClick={() => !n.isRead && handleMarkOne(n.id)}
                  className={`group flex w-full items-start gap-3 px-4 py-3 text-left transition-all duration-150 hover:bg-slate-50 ${
                    !n.isRead ? "bg-slate-50/50" : ""
                  }`}
                >
                  {/* Icon badge */}
                  <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border ${typeBadge(n.type)}`}
                  >
                    {typeIcon(n.type)}
                  </div>

                  {/* Content */}
                  <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span
                      className={`text-[13px] leading-snug font-medium ${
                        n.isRead ? "text-accent/60" : "text-neutral"
                      }`}
                    >
                      {n.message}
                    </span>
                    <span className="text-[11px] text-accent/40 font-black">
                      {timeAgo(n.createdAt)}
                    </span>
                  </div>

                  {/* Unread dot */}
                  {!n.isRead && (
                    <div className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary ring-2 ring-white" />
                  )}
                </button>
              </li>
            ))}
          </ul>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="border-t border-slate-100 px-4 py-2.5 text-center">
              <p className="text-[11px] text-accent/60 font-black">
                {notifications.length} notification
                {notifications.length !== 1 ? "s" : ""}
              </p>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(panel, document.body);
}
