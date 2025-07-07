'use client';

import { useSession, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export function useSessionMonitor() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [warningShown, setWarningShown] = useState(false);

  useEffect(() => {
    if (status !== 'authenticated' || !session?.expiresAt) return;

    const checkSession = () => {
      const currentTime = Math.floor(Date.now() / 1000);
      const expiresAt = session.expiresAt;
      const timeLeft = expiresAt - currentTime;

      // Show warning 5 minutes (300 seconds) before expiry
      if (timeLeft <= 300 && timeLeft > 0 && !warningShown) {
        setWarningShown(true);
        const minutesLeft = Math.ceil(timeLeft / 60);
        
        toast((t) => (
          <div className="flex flex-col gap-2">
            <div className="font-medium">Session Warning</div>
            <div className="text-sm text-gray-600">
              Your session will expire in {minutesLeft} minute{minutesLeft !== 1 ? 's' : ''}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  // Refresh session by calling the API
                  window.location.reload();
                  toast.dismiss(t.id);
                }}
                className="px-3 py-1 bg-teal-500 text-white rounded text-sm hover:bg-teal-600"
              >
                Save & Refresh
              </button>
              <button
                onClick={() => toast.dismiss(t.id)}
                className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400"
              >
                Dismiss
              </button>
            </div>
          </div>
        ), {
          duration: 0, // Don't auto-dismiss
          icon: '⚠️',
        });
      }

      // Auto logout when session expires
      if (timeLeft <= 0) {
        signOut({ redirect: false }).then(() => {
          toast.error('Your session has expired. Please log in again.');
          router.push('/admin/login');
        });
      }
    };

    // Check immediately
    checkSession();

    // Check every 30 seconds
    const interval = setInterval(checkSession, 30000);

    return () => clearInterval(interval);
  }, [session, status, warningShown, router]);

  return { session, status };
}
