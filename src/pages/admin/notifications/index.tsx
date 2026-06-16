import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Package,
  CreditCard,
  AlertCircle,
  Star,
  UserPlus,
  Activity,
  CheckCheck,
} from "lucide-react";

import { Button, Typography, Spinner } from "@/components";
import {
  useGetNotificationsQuery,
  useMarkAllNotificationsReadMutation,
  useMarkNotificationReadMutation,
  type INotification,
  type NotificationType,
} from "@/redux/api/notifications";

const ICON: Record<NotificationType, React.ReactNode> = {
  order: <Package size={16} className="text-B400" />,
  payment: <CreditCard size={16} className="text-G500" />,
  stock: <AlertCircle size={16} className="text-R400" />,
  review: <Star size={16} className="text-O500" />,
  customer: <UserPlus size={16} className="text-B400" />,
  system: <Activity size={16} className="text-N500" />,
};

const NotificationsPage = () => {
  const navigate = useNavigate();
  const [pageNumber, setPageNumber] = useState(1);

  const { data, isLoading } = useGetNotificationsQuery({
    pageNumber,
    pageSize: 20,
  });
  const [markRead] = useMarkNotificationReadMutation();
  const [markAll] = useMarkAllNotificationsReadMutation();

  const notifications = data?.data.data ?? [];
  const meta = data?.data.metadata;

  const openItem = async (n: INotification) => {
    if (!n.read) await markRead({ id: n._id });
    if (n.link) navigate(n.link);
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <Typography variant="h-m" fontWeight="bold">
            Notifications
          </Typography>
          <Typography variant="p-s" color="N500">
            Activity across your store
          </Typography>
        </div>
        <Button size="sm" variant="secondary" onClick={() => markAll()}>
          <div className="flex items-center gap-1.5">
            <CheckCheck size={14} /> Mark all read
          </div>
        </Button>
      </div>

      <section className="bg-white border border-N30 rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="py-16 grid place-items-center">
            <Spinner />
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-16 text-center">
            <Typography variant="p-s" color="N400">
              You have no notifications yet.
            </Typography>
          </div>
        ) : (
          <div className="divide-y divide-N20">
            {notifications.map((n) => (
              <button
                key={n._id}
                onClick={() => openItem(n)}
                className={`w-full text-left flex gap-4 px-5 py-4 hover:bg-N10 transition-colors ${
                  n.read ? "" : "bg-B50/40"
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-N10 border border-N30 flex items-center justify-center shrink-0">
                  {ICON[n.type] ?? ICON.system}
                </div>
                <div className="flex-1 min-w-0">
                  <Typography variant="p-s" fontWeight="bold">
                    {n.title}
                  </Typography>
                  <Typography variant="p-s" color="N500" className="block">
                    {n.message}
                  </Typography>
                  <Typography variant="c-s" color="N300">
                    {new Date(n.createdAt).toLocaleString()}
                  </Typography>
                </div>
                {!n.read && (
                  <span className="w-2 h-2 rounded-full bg-BR400 mt-2 shrink-0" />
                )}
              </button>
            ))}
          </div>
        )}

        {meta && meta.totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-N20">
            <Button
              size="sm"
              variant="secondary"
              disabled={!meta.hasPrevious}
              onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
            >
              Prev
            </Button>
            <Typography variant="c-s" color="N500">
              Page {meta.currentPage} of {meta.totalPages}
            </Typography>
            <Button
              size="sm"
              variant="secondary"
              disabled={!meta.hasNext}
              onClick={() => setPageNumber((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </section>
    </div>
  );
};

export default NotificationsPage;
