"use client";

import {
  useNotification,
  type Notification,
  type NotificationType,
} from "@/context/NotificationContext";
import { PlusIcon } from "../icons/PlusIcon";
import { ErrorCircleIcon } from "../icons/ErrorCircleIcon";
import { CheckmarkBadge } from "../icons/CheckmarkBadge";

const typeStyles: Record<
  NotificationType,
  { bg: string; outline: string; icon: string }
> = {
  success: {
    bg: "bg-success-50",
    outline: "outline-success-400",
    icon: "text-success-600",
  },
  error: {
    bg: "bg-danger-400",
    outline: "outline-danger-600",
    icon: "text-danger-600",
  },
  warning: {
    bg: "bg-warning-50",
    outline: "outline-warning-400",
    icon: "text-warning-600",
  },
  info: {
    bg: "bg-primary-50",
    outline: "outline-primary-400",
    icon: "text-primary-600",
  },
};

function SuccessIcon({ className = "" }: { className?: string }) {
  return <CheckmarkBadge className={className} />;
}

function ErrorIcon({ className = "" }: { className?: string }) {
  return <ErrorCircleIcon className={className} />;
}

function CloseIcon({ className = "" }: { className?: string }) {
  return <PlusIcon className={`${className} rotate-45`} />;
}

const icons: Record<NotificationType, typeof SuccessIcon> = {
  success: SuccessIcon,
  error: ErrorIcon,
  warning: ErrorIcon,
  info: SuccessIcon,
};

function NotificationItem({ notification }: { notification: Notification }) {
  const { dismissNotification } = useNotification();
  const style = typeStyles[notification.type];
  const Icon = icons[notification.type];

  return (
    <div
      role="alert"
      className={`self-stretch p-4 ${style.bg} rounded-md outline -outline-offset-1 ${style.outline} flex justify-start items-start gap-4`}
    >
      <div className="size-7 relative shrink-0">
        <Icon
          className={`size-6 absolute left-[3.75px] top-[3.75px] ${style.icon}`}
        />
      </div>

      <div className="flex-1 flex flex-col justify-start items-start gap-2">
        <div className="justify-start text-neutral-900 text-xl font-medium leading-8">
          {notification.message}
        </div>
      </div>

      <button
        type="button"
        onClick={() => dismissNotification(notification.id)}
        aria-label="Zamknij powiadomienie"
        className="size-7 relative shrink-0 text-neutral-900 hover:opacity-70 transition-opacity"
      >
        <CloseIcon className="size-4 absolute left-[6.25px] top-[6.25px]" />
      </button>
    </div>
  );
}

export function NotificationStack() {
  const { notifications } = useNotification();

  if (notifications.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="w-full px-10 py-3 flex flex-col justify-start items-start gap-2.5"
    >
      {notifications.map((notification) => (
        <NotificationItem key={notification.id} notification={notification} />
      ))}
    </div>
  );
}
