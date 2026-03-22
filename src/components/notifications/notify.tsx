import {
  toast,
  type Id,
  type ToastOptions,
  type UpdateOptions,
} from "react-toastify";
import { CheckCircle2, AlertCircle, AlertTriangle, Info } from "lucide-react";
import NotificationMsg, { type NotificationType } from "./NotificationMsg";

interface NotifProps extends ToastOptions {
  message?: string;
  subtitle?: string;
}

const Icons = {
  success: <CheckCircle2 className="text-[var(--color-G300)]" size={28} />,
  error: <AlertCircle className="text-[var(--color-R300)]" size={28} />,
  warning: <AlertTriangle className="text-[var(--color-Y300)]" size={28} />,
  info: <Info className="text-[var(--color-B300)]" size={28} />,
};

const success = ({ message, subtitle, ...options }: NotifProps) =>
  toast.success(
    <NotificationMsg message={message} subtitle={subtitle} type="success" />,
    {
      icon: Icons.success,
      ...options,
    },
  );

const error = ({ message, subtitle, ...options }: NotifProps) =>
  toast.error(
    <NotificationMsg message={message} subtitle={subtitle} type="error" />,
    {
      icon: Icons.error,
      ...options,
    },
  );

const warning = ({ message, subtitle, ...options }: NotifProps) =>
  toast.warn(
    <NotificationMsg message={message} subtitle={subtitle} type="warning" />,
    {
      icon: Icons.warning,
      ...options,
    },
  );

const info = ({ message, subtitle, ...options }: NotifProps) =>
  toast.info(
    <NotificationMsg message={message} subtitle={subtitle} type="info" />,
    {
      icon: Icons.info,
      ...options,
    },
  );

const update = (
  id: Id,
  {
    message,
    subtitle,
    type = "success",
    ...props
  }: UpdateOptions & NotifProps & { type?: NotificationType },
) =>
  toast.update(id, {
    render: (
      <NotificationMsg message={message} subtitle={subtitle} type={type} />
    ),
    icon: Icons[type],
    ...props,
  });

export const notify = {
  success,
  error,
  warning,
  info,
  update,
  dismissAll: toast.dismiss,
};
