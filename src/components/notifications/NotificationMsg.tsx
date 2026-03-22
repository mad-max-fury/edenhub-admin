import clsx from "clsx";

export type NotificationType = "success" | "error" | "warning" | "info";

export interface NotificationMsgProps {
  message?: string;
  subtitle?: string;
  type?: NotificationType;
}

const typeTextColors: Record<NotificationType, string> = {
  success: "text-[var(--color-G400)]",
  error: "text-[var(--color-R400)]",
  warning: "text-[var(--color-Y500)]",
  info: "text-[var(--color-B400)]",
};

export default function NotificationMsg({
  message,
  subtitle,
  type = "success",
}: NotificationMsgProps) {
  return (
    <div className="flex flex-col gap-1">
      {message && (
        <h2
          className={clsx(
            "text-sm font-bold tracking-[0.2px] first-letter:capitalize leading-tight",
            typeTextColors[type],
          )}
        >
          {message}
        </h2>
      )}

      {subtitle && (
        <p className="text-xs text-[var(--color-N200)] first-letter:capitalize leading-normal">
          {subtitle}
        </p>
      )}
    </div>
  );
}
