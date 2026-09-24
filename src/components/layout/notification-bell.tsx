'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, CheckCheck, Info, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useAuthStore } from '@/lib/store/auth-store';
import { useNotificationStore } from '@/lib/store/notification-store';
import { getMyNotifications, markAllNotificationsRead, markNotificationRead } from '@/lib/actions/notifications';
import { formatDate } from '@/lib/utils/format';

const typeIcons = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: XCircle,
};

const typeColors = {
  info: 'text-blue-500',
  success: 'text-cipresa-500',
  warning: 'text-amber-500',
  error: 'text-red-500',
};

export function NotificationBell() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => !s.isLoading && s.isAuthenticated);
  const { notifications, unreadCount, setNotifications, markAsRead, markAllAsRead } = useNotificationStore();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;
    getMyNotifications()
      .then(setNotifications)
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;

  const handleOpenNotification = async (id: string, link: string | undefined, read: boolean) => {
    setIsOpen(false);
    if (!read) {
      markAsRead(id);
      markNotificationRead(id).catch(() => {});
    }
    if (link) router.push(link);
  };

  const handleMarkAllRead = () => {
    markAllAsRead();
    markAllNotificationsRead().catch(() => {});
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen((v) => !v)}
        title="Notifications"
        className="p-2 rounded-lg text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative focus:outline-none focus:ring-2 focus:ring-cipresa-500"
      >
        <Bell className="w-[18px] h-[18px]" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-red-500" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.12 }}
              className="absolute right-0 top-full mt-2 w-80 max-h-[420px] overflow-y-auto bg-white dark:bg-gray-950 rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 z-50"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">Notifications</p>
                {unreadCount > 0 && (
                  <button onClick={handleMarkAllRead} className="flex items-center gap-1 text-xs text-cipresa-600 hover:underline">
                    <CheckCheck className="w-3.5 h-3.5" /> Tout marquer lu
                  </button>
                )}
              </div>
              {notifications.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-10">Aucune notification pour le moment.</p>
              ) : (
                <div>
                  {notifications.map((n) => {
                    const Icon = typeIcons[n.type];
                    return (
                      <button
                        key={n.id}
                        onClick={() => handleOpenNotification(n.id, n.link, n.read)}
                        className={cn(
                          'w-full flex items-start gap-3 px-4 py-3 text-left border-b border-gray-50 dark:border-gray-800/50 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors',
                          !n.read && 'bg-cipresa-50/50 dark:bg-cipresa-950/20'
                        )}
                      >
                        <Icon className={cn('w-4 h-4 mt-0.5 flex-shrink-0', typeColors[n.type])} />
                        <div className="flex-1 min-w-0">
                          <p className={cn('text-sm', n.read ? 'text-gray-600 dark:text-gray-300' : 'font-semibold text-gray-900 dark:text-white')}>
                            {n.title}
                          </p>
                          {n.message && <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.message}</p>}
                          <p className="text-[11px] text-gray-400 mt-1">{formatDate(n.createdAt, 'relative')}</p>
                        </div>
                        {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-cipresa-500 mt-1.5 flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              )}
              <div className="px-4 py-2.5 border-t border-gray-100 dark:border-gray-800 text-center">
                <Link href="/dashboard" onClick={() => setIsOpen(false)} className="text-xs text-cipresa-600 hover:underline">
                  Voir le tableau de bord
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
