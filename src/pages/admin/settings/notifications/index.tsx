import React, { useState } from "react";
import { Typography, Toggle, ConfirmationModal } from "@/components";
import {
  Package,
  CreditCard,
  Users,
  AlertCircle,
  TrendingUp,
  MessageSquare,
  ShieldCheck,
  Star,
} from "lucide-react";

type NotificationKey =
  | "new_orders"
  | "low_stock"
  | "payouts"
  | "customer_messages"
  | "new_reviews"
  | "system_health"
  | "sales_reports"
  | "dispute_alerts";

const NotificationSettings = () => {
  const [preferences, setPreferences] = useState<
    Record<NotificationKey, boolean>
  >({
    new_orders: true,
    low_stock: true,
    payouts: true,
    customer_messages: true,
    new_reviews: false,
    system_health: true,
    sales_reports: false,
    dispute_alerts: true,
  });

  const [modal, setModal] = useState<{
    target: NotificationKey | null;
    isLoading: boolean;
  }>({ target: null, isLoading: false });

  const getModalContent = (key: NotificationKey | null) => {
    if (!key) return { title: "", message: "" };
    const isEnabling = !preferences[key];
    const labels: Record<NotificationKey, string> = {
      new_orders: "New Order Alerts",
      low_stock: "Low Stock Warnings",
      payouts: "Payout Confirmations",
      customer_messages: "Customer Inquiries",
      new_reviews: "New Product Reviews",
      system_health: "System Status",
      sales_reports: "Daily Sales Summary",
      dispute_alerts: "Dispute & Refund Requests",
    };

    return {
      title: `${isEnabling ? "Enable" : "Disable"} ${labels[key]}`,
      message: `Are you sure you want to ${isEnabling ? "receive" : "stop receiving"} admin notifications for ${labels[key].toLowerCase()}?`,
    };
  };

  const handleConfirmToggle = async () => {
    if (!modal.target) return;
    setModal((prev) => ({ ...prev, isLoading: true }));
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setPreferences((prev) => ({
      ...prev,
      [modal.target!]: !prev[modal.target!],
    }));
    setModal({ target: null, isLoading: false });
  };

  return (
    <div className="flex flex-col gap-12 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <section className="space-y-4">
        <div className="flex flex-col gap-1 px-1">
          <Typography variant="h-m" fontWeight="bold">
            Store Operations
          </Typography>
          <Typography variant="p-s" color="N500">
            Stay on top of your store's performance and order fulfillment.
          </Typography>
        </div>

        <div className="border border-N30 rounded-2xl divide-y divide-N30 overflow-hidden bg-white ">
          <NotificationRow
            icon={<Package size={20} />}
            iconBg="bg-B50 text-B400"
            title="New Orders"
            description="Receive a notification as soon as a customer places an order."
            checked={preferences.new_orders}
            onChange={() =>
              setModal({ target: "new_orders", isLoading: false })
            }
          />
          <NotificationRow
            icon={<AlertCircle size={20} />}
            iconBg="bg-R50 text-R500"
            title="Low Stock Alerts"
            description="Get notified when product inventory falls below the threshold."
            checked={preferences.low_stock}
            onChange={() => setModal({ target: "low_stock", isLoading: false })}
          />
          <NotificationRow
            icon={<CreditCard size={20} />}
            iconBg="bg-G50 text-G400"
            title="Payouts & Revenue"
            description="Alerts for successful balance withdrawals and earnings."
            checked={preferences.payouts}
            onChange={() => setModal({ target: "payouts", isLoading: false })}
          />
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-1 px-1">
          <Typography variant="h-m" fontWeight="bold">
            Customer Engagement
          </Typography>
          <Typography variant="p-s" color="N500">
            Notifications regarding customer interactions and feedback.
          </Typography>
        </div>

        <div className="border border-N30 rounded-2xl divide-y divide-N30 overflow-hidden bg-white">
          <NotificationRow
            icon={<MessageSquare size={20} />}
            iconBg="bg-P50 text-P400"
            title="Customer Inquiries"
            description="Direct messages and questions from buyers."
            checked={preferences.customer_messages}
            onChange={() =>
              setModal({ target: "customer_messages", isLoading: false })
            }
          />
          <NotificationRow
            icon={<Star size={20} />}
            iconBg="bg-Y50 text-Y500"
            title="Store Reviews"
            description="Get alerted when a customer leaves a rating or review."
            checked={preferences.new_reviews}
            onChange={() =>
              setModal({ target: "new_reviews", isLoading: false })
            }
          />
          <NotificationRow
            icon={<Users size={20} />}
            iconBg="bg-B50 text-B500"
            title="Refund & Dispute Requests"
            description="Urgent alerts for refund claims or customer disputes."
            checked={preferences.dispute_alerts}
            onChange={() =>
              setModal({ target: "dispute_alerts", isLoading: false })
            }
          />
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-1 px-1">
          <Typography variant="h-m" fontWeight="bold">
            System & Analytics
          </Typography>
        </div>

        <div className="border border-N30 rounded-2xl divide-y divide-N30 overflow-hidden bg-white ">
          <NotificationRow
            icon={<TrendingUp size={20} />}
            iconBg="bg-G50 text-G500"
            title="Sales Reports"
            description="Daily and weekly summaries of your store's revenue."
            checked={preferences.sales_reports}
            onChange={() =>
              setModal({ target: "sales_reports", isLoading: false })
            }
          />
          <NotificationRow
            icon={<ShieldCheck size={20} />}
            iconBg="bg-N10 text-N500"
            title="Admin System Status"
            description="Security logs and platform maintenance updates."
            checked={preferences.system_health}
            onChange={() =>
              setModal({ target: "system_health", isLoading: false })
            }
          />
        </div>
      </section>

      <ConfirmationModal
        isOpen={modal.target !== null}
        closeModal={() => setModal({ target: null, isLoading: false })}
        formTitle={getModalContent(modal.target).title}
        message={getModalContent(modal.target).message}
        buttonLabel="Confirm Change"
        handleClick={handleConfirmToggle}
        type={modal.target && preferences[modal.target] ? "warning" : "confirm"}
        isLoading={modal.isLoading}
      />
    </div>
  );
};

interface RowProps {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  description: string;
  checked: boolean;
  onChange: () => void;
}

const NotificationRow = ({
  icon,
  iconBg,
  title,
  description,
  checked,
  onChange,
}: RowProps) => (
  <div className="flex items-center justify-between p-5 hover:bg-N10/30 transition-colors">
    <div className="flex items-start gap-4">
      <div className={`p-2 ${iconBg} rounded-lg shrink-0`}>{icon}</div>
      <div>
        <Typography variant="p-m" fontWeight="medium">
          {title}
        </Typography>
        <Typography variant="p-s" color="N500">
          {description}
        </Typography>
      </div>
    </div>
    <Toggle checked={checked} onChange={onChange} />
  </div>
);

export default NotificationSettings;
