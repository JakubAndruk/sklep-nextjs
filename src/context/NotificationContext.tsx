"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  ReactNode,
} from "react";

export type NotificationType = "success" | "error" | "warning" | "info";

export type Notification = {
  id: string;
  type: NotificationType;
  message: string;
};

type NotificationContextValue = {
  notifications: Notification[];
  showNotification: (type: NotificationType, message: string) => void;
  dismissNotification: (id: string) => void;
};

const NotificationContext = createContext<NotificationContextValue | undefined>(
  undefined,
);

const AUTO_DISMISS_MS = 4000;

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const showNotification = useCallback(
    (type: NotificationType, message: string) => {
      const id = crypto.randomUUID();
      setNotifications((prev) => [...prev, { id, type, message }]);

      const timer = setTimeout(() => {
        dismissNotification(id);
      }, AUTO_DISMISS_MS);
      timers.current.set(id, timer);
    },
    [dismissNotification],
  );

  return (
    <NotificationContext.Provider
      value={{ notifications, showNotification, dismissNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider",
    );
  }
  return context;
}
