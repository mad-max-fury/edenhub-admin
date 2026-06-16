import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  Package,
  CreditCard,
  AlertCircle,
  Star,
  UserPlus,
  Activity,
} from "lucide-react";

import { Typography } from "@/components";
import {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkAllNotificationsReadMutation,
  useMarkNotificationReadMutation,
  type INotification,
  type NotificationType,
} from "@/redux/api/notifications";

const ICON: Record<NotificationType, React.ReactNode> = {
  order: <Package size={15} className="text-B400" />,
  payment: <CreditCard size={15} className="text-G500" />,
  stock: <AlertCircle size={15} className="text-R400" />,
  review: <Star size={15} className="text-O500" />,
  customer: <UserPlus size={15} className="text-B400" />,
  system: <Activity size={15} className="text-N500" />,
};

const timeAgo = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

export const NotificationBell = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const { data: countRes } = useGetUnreadCountQuery(undefined, {
    pollingInterval: 30000,
  });
  const { data: listRes } = useGetNotificationsQuery(
    { pageSize: 8 },
    { skip: !open },
  );
  const [markRead] = useMarkNotificationReadMutation();
  const [markAll] = useMarkAllNotificationsReadMutation();

  const count = countRes?.data.count ?? 0;
  const notifications = listRes?.data.data ?? [];

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const openItem = async (n: INotification) => {
    if (!n.read) await markRead({ id: n._id });
    setOpen(false);
    if (n.link) navigate(n.link);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative min-w-[40px] w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-lg bg-N10 border border-N30 hover:bg-N20 transition-colors"
        aria-label={count > 0 ? `${count} unread notifications` : "Notifications"}
      >
        <Bell className="w-5 h-5 text-N600" />
        {count > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 md:w-5 md:h-5 bg-R400 text-N0 text-[10px] md:text-[11px] font-bold rounded-full flex items-center justify-center">
            {count > 99 ? "99+" : count}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-[360px] max-w-[92vw] bg-white border border-N30 rounded-xl shadow-xl z-40 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-N20">
            <Typography variant="p-s" fontWeight="bold">
              Notifications
            </Typography>
            {count > 0 && (
              <button
                onClick={() => markAll()}
                className="text-xs text-BR500 font-medium hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-[380px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-10 text-center">
                <Typography variant="p-s" color="N400">
                  You're all caught up.
                </Typography>
              </div>
            ) : (
              notifications.map((n) => (
                <button
                  key={n._id}
                  onClick={() => openItem(n)}
                  className={`w-full text-left flex gap-3 px-4 py-3 border-b border-N10 hover:bg-N10 transition-colors ${
                    n.read ? "" : "bg-B50/40"
                  }`}
                >
                  <div className="mt-0.5 w-8 h-8 rounded-full bg-N10 border border-N30 flex items-center justify-center shrink-0">
                    {ICON[n.type] ?? ICON.system}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Typography variant="p-s" fontWeight="bold" className="truncate">
                      {n.title}
                    </Typography>
                    <Typography variant="c-s" color="N500" className="block truncate">
                      {n.message}
                    </Typography>
                    <Typography variant="c-s" color="N300">
                      {timeAgo(n.createdAt)}
                    </Typography>
                  </div>
                  {!n.read && (
                    <span className="w-2 h-2 rounded-full bg-BR400 mt-2 shrink-0" />
                  )}
                </button>
              ))
            )}
          </div>

          <button
            onClick={() => {
              setOpen(false);
              navigate("/admin/notifications");
            }}
            className="w-full py-3 text-center text-sm font-medium text-BR500 hover:bg-N10 border-t border-N20"
          >
            View all notifications
          </button>
        </div>
      )}
    </div>
  );
};
